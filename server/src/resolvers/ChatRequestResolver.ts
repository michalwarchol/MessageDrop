import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
  PubSub,
} from "type-graphql";
import { PubSubEngine } from "graphql-subscriptions";
import {
  ChatRequest,
  ChatRequestModel,
  ChatRequestStatus,
} from "../entities/ChatRequest";
import { ChatRoomModel } from "../entities/ChatRoom";
import { User, UserModel } from "../entities/User";
import { hasPermissions } from "../middleware/hasPermissions";
import { isAuth } from "../middleware/isAuth";
import { Context } from "../types";
import { getFile } from "../utils/getFile";
import { UserWithAvatar } from "./UserResolver";

@ObjectType()
class RequestWithUser {
  @Field(() => ChatRequest)
  request: ChatRequest;

  @Field(() => UserWithAvatar)
  userWithAvatar: UserWithAvatar;
}

@Resolver(ChatRequest)
export class ChatRequestResolver {
  @Query(() => [RequestWithUser])
  @UseMiddleware(isAuth, hasPermissions)
  async getChatRoomRequests(
    @Ctx() context: Context,
    @Arg("roomId", () => String) roomId: string
  ): Promise<RequestWithUser[]> {
    const requests = await ChatRequestModel.find({
      roomId,
      status: ChatRequestStatus.progress,
    });

    const requestsWithUsers: RequestWithUser[] = await Promise.all(
      requests.map(async (elem) => {
        const user = (await UserModel.findById(elem.userId)) as User;
        const avatar = await getFile(context.s3, user.avatarId);

        return {
          request: elem,
          userWithAvatar: {
            user,
            avatar,
          },
        };
      })
    );

    return requestsWithUsers;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createChatRequest(
    @Ctx() context: Context,
    @Arg("roomId", () => String) roomId: string
  ): Promise<boolean> {
    //user can send request only once
    const request = await ChatRequestModel.findOne({
      roomId,
      userId: context.req.session.userId,
    });
    if (request) {
      return false;
    }

    //if user is a member of this room, then a user can't send a request
    const room = await ChatRoomModel.findById(roomId);
    if (room && room.userIds.includes(context.req.session.userId)) {
      return false;
    }

    const newRequest = new ChatRequestModel({
      roomId,
      userId: context.req.session.userId,
      status: ChatRequestStatus.progress,
    });

    await newRequest.save();
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth, hasPermissions)
  async acceptChatRequest(
    @Ctx() _: Context,
    @PubSub() pubSub: PubSubEngine,
    @Arg("roomId", () => String) roomId: string,
    @Arg("requestId", () => String) requestId: string
  ): Promise<boolean> {
    const request = await ChatRequestModel.findOneAndUpdate(
      { _id: requestId }, //filter
      { status: ChatRequestStatus.accepted } //update
    );

    if (request.status == ChatRequestStatus.accepted) {
      return false;
    }

    await ChatRoomModel.findByIdAndUpdate(roomId, {
      $push: { userIds: request.userId },
    });

    await pubSub.publish("CHAT_USERS", { roomId, userId: request.userId });
    await pubSub.publish("USER_ROOMS", {
      roomId,
      userId: request.userId,
      shouldAdd: true,
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth, hasPermissions)
  async rejectChatRequest(
    @Ctx() _: Context,
    @Arg("roomId", () => String) __: string,
    @Arg("requestId", () => String) requestId: string
  ): Promise<boolean> {
    await ChatRequestModel.deleteOne({ _id: requestId });

    return true;
  }
}
