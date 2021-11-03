import { MiddlewareFn } from "type-graphql";
import { ChatRoom, ChatRoomModel } from "../entities/ChatRoom";
import { Context } from "../types";

export const hasPermissions: MiddlewareFn<Context> = async (
  { context, args },
  next
) => {
  const userId = context.req.session.userId;
  const room = (await ChatRoomModel.findById(args.roomId)) as ChatRoom;

  if (room.adminId != userId && !room.modIds.includes(userId)) {
    return false;
  }

  return next();
};
