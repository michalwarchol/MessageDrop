import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import { FileUpload, GraphQLUpload } from "graphql-upload";
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
import { ChatRoom, ChatRoomModel, RoomAccess } from "../entities/ChatRoom";
import { Context } from "../types";
import { ChatRoomInput } from "./types/ChatRoomInput";
import { FieldError } from "./types/FieldError";
import { isAuth } from "../middleware/isAuth";
import { getFile } from "../utils/getFile";
import { createFileBuffer } from "../utils/createFileBuffer";
import { isRoomMember } from "../middleware/isRoomMember";
import { UserWithAvatar } from "./UserResolver";
import { User, UserModel } from "../entities/User";

@ObjectType()
class ChatRoomResponse {
  @Field(() => ChatRoom, { nullable: true })
  chatRoom?: ChatRoom;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
class ChatRoomWithImage {
  @Field(() => ChatRoom)
  chatRoom: ChatRoom;

  @Field(() => String, { nullable: true })
  image: string | null;
}

@ObjectType()
class ChatRoomUsers {
  @Field(() => UserWithAvatar)
  admin: UserWithAvatar;

  @Field(() => [UserWithAvatar])
  mods: UserWithAvatar[];

  @Field(() => [UserWithAvatar])
  others: UserWithAvatar[];
}

@Resolver(ChatRoom)
export class ChatRoomResolver {
  @Query(() => [ChatRoom])
  async getChatRooms(): Promise<ChatRoom[]> {
    return ChatRoomModel.find();
  }

  @Query(() => ChatRoomWithImage)
  async getChatRoomById(
    @Ctx() { s3 }: Context,
    @Arg("roomId", () => String) roomId: string
  ): Promise<ChatRoomWithImage | null> {
    const chatRoom = await ChatRoomModel.findById(roomId);
    if (!chatRoom) {
      return null;
    }

    const image = await getFile(s3, chatRoom.imageId);
    return {
      chatRoom,
      image,
    };
  }

  @Query(() => [ChatRoomWithImage])
  @UseMiddleware(isAuth)
  async getCreatorChatRooms(
    @Ctx() { s3, req }: Context
  ): Promise<ChatRoomWithImage[]> {
    const chatRooms = await ChatRoomModel.find({
      $or: [
        { adminId: req.session.userId },
        { modIds: { $in: [req.session.userId] } },
        { userIds: { $in: [req.session.userId] } },
      ],
    });

    let chatRoomsWithImages: ChatRoomWithImage[] = await Promise.all(
      chatRooms.map(async (elem) => {
        const image = await getFile(s3, elem.imageId);
        return {
          chatRoom: elem as ChatRoom,
          image,
        };
      })
    );

    return chatRoomsWithImages;
  }

  @Query(() => Boolean)
  async isChatMember(
    @Ctx() { req }: Context,
    @Arg("roomId", () => String) roomId: string
  ) {
    const chatRoom = await ChatRoomModel.findById(roomId);

    if (!chatRoom) {
      return false;
    }
    if (chatRoom.adminId == req.session.userId) {
      return true;
    }

    if (chatRoom.modIds.indexOf(req.session.userId) != -1) {
      return true;
    }

    if (chatRoom.userIds.indexOf(req.session.userId) != -1) {
      return true;
    }
    return false;
  }

  @Query(() => [ChatRoomWithImage])
  async getSuggestedChatRooms(
    @Ctx() { s3, req }: Context
  ): Promise<ChatRoomWithImage[]> {
    let userId = req.session.userId;
    const chatRooms = await ChatRoomModel.find({
      $and: [
        { adminId: { $ne: userId } },
        { userIds: { $ne: userId } },
        { modIds: { $ne: userId } },
        { access: { $ne: RoomAccess.private } },
      ],
    });

    let chatRoomsWithImages: ChatRoomWithImage[] = await Promise.all(
      chatRooms.map(async (elem) => {
        const image = await getFile(s3, elem.imageId);
        return {
          chatRoom: elem as ChatRoom,
          image,
        };
      })
    );

    return chatRoomsWithImages;
  }

  @Query(() => ChatRoomUsers)
  @UseMiddleware(isAuth, isRoomMember)
  async getChatRoomUsers(
    @Ctx() context: Context,
    @Arg("roomId", () => String) roomId: string
  ): Promise<ChatRoomUsers> {
    const room = (await ChatRoomModel.findById(roomId)) as ChatRoom;
    const admin = (await UserModel.findById(room.adminId)) as User;
    const mods = (await UserModel.find({
      _id: { $in: room.modIds },
    })) as User[];
    const others = (await UserModel.find({
      _id: { $in: room.userIds },
    })) as User[];

    const adminAvatar = await getFile(context.s3, admin.avatarId);

    const modsWithAvatars = await Promise.all(
      mods.map(async (elem) => {
        const avatar = await getFile(context.s3, elem.avatarId);
        return {
          user: elem,
          avatar,
        };
      })
    );

    const othersWithAvatars = await Promise.all(
      others.map(async (elem) => {
        const avatar = await getFile(context.s3, elem.avatarId);
        return {
          user: elem,
          avatar,
        };
      })
    );

    return {
      admin: {
        user: admin,
        avatar: adminAvatar,
      },
      mods: modsWithAvatars,
      others: othersWithAvatars,
    };
  }

  @Mutation(() => ChatRoomResponse)
  @UseMiddleware(isAuth)
  async createChatRoom(
    @Ctx() { req, s3 }: Context,
    @Arg("input", () => ChatRoomInput) input: ChatRoomInput,
    @Arg("image", () => GraphQLUpload, { nullable: true }) image?: FileUpload
  ): Promise<ChatRoomResponse> {
    let imageKey: string | null = null;
    if (image) {
      imageKey = v4();
    }

    let newChatRoom;
    try {
      newChatRoom = new ChatRoomModel({
        ...input,
        adminId: req.session.userId,
        imageId: imageKey,
      });

      await newChatRoom.save();

      if (image && imageKey) {
        const buffer: Buffer = await createFileBuffer(image);
        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageKey,
            Body: buffer,
          })
        );
      }
    } catch (err) {
      //checks if name, email and phone are unique
      if (err.message.includes("duplicate key error")) {
        let field = Object.keys(err.keyValue)[0];
        let message = "This " + field + " is already taken!";

        return {
          errors: [{ field, message }],
        };
      }

      //checks min length of name and password
      if (err.message.includes("is shorter than the minimum allowed length")) {
        let minLength = err.errors.name.properties.minlength;
        let field = err.errors.name.properties.path;
        let message =
          field + " should be at least " + minLength + " characters long!";
        return {
          errors: [{ field, message }],
        };
      }
    }

    return { chatRoom: newChatRoom };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async joinRoom(
    @Ctx() { req }: Context,
    @Arg("roomId", () => String) roomId: string,
    @Arg("userId", () => String, { nullable: true }) userId?: string
  ): Promise<boolean> {
    await ChatRoomModel.findByIdAndUpdate(roomId, {
      $push: { userIds: userId || req.session.userId },
    });

    return true;
  }
}
