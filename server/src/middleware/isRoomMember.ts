import { MiddlewareFn } from "type-graphql";
import { ChatRoomModel } from "../entities/ChatRoom";
import { Context } from "../types";

export const isRoomMember: MiddlewareFn<Context> = async (
  { context, args },
  next
) => {
  const chatRoom = await ChatRoomModel.findById(args.roomId);
  if (!chatRoom) {
    throw new Error("No room found!");
  }
  if (chatRoom.adminId == context.req.session.userId) {
    return next();
  }

  if (chatRoom.modIds.indexOf(context.req.session.userId) != -1) {
    return next();
  }

  if (chatRoom.userIds.indexOf(context.req.session.userId) != -1) {
    return next();
  }

  throw new Error("You have no access to this room!");
};
