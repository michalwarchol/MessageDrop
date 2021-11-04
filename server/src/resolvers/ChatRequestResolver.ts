import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
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
  @Field(()=>ChatRequest)
  request: ChatRequest;

  @Field(()=>UserWithAvatar)
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
      requests.map(async (elem)=>{
        const user = await UserModel.findById(elem.userId) as User;
        const avatar = await getFile(context.s3, user.avatarId);

        return {
          request: elem,
          userWithAvatar: {
            user,
            avatar
          }
        }
      })
    )

    return requestsWithUsers;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createChatRequest(
    @Ctx() context: Context,
    @Arg("roomId", () => String) roomId: string
  ): Promise<boolean> {
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
    @Arg("roomId", () => String) roomId: string,
    @Arg("requestId", () => String) requestId: string
  ): Promise<boolean> {
    const request = await ChatRequestModel.findOneAndUpdate(
      { _id: requestId }, //filter
      { status: ChatRequestStatus.accepted } //update
    );
    await ChatRoomModel.findByIdAndUpdate(roomId, {
      $push: { userIds: request.userId },
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth, hasPermissions)
  async rejectChatRequest(
    @Ctx() _: Context,
    @Arg("roomId", ()=>String) __: string,
    @Arg("requestId", () => String) requestId: string
  ): Promise<boolean> {
    await ChatRequestModel.deleteOne({ _id: requestId });

    return true;
  }
}