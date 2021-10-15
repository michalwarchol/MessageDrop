import {
  getModelForClass,
  mongoose,
  prop as Property,
} from "@typegoose/typegoose";
import { GraphQLID } from "graphql";
import { ObjectType, Field, registerEnumType } from "type-graphql";

export enum RoomAccess {
  public = "PUBLIC", //room open, evaryone can join
  restricted = "RESTRICTED", //room closed but visible, user sends request to join
  private = "PRIVATE", //room hidden, admin sends invitations
}

registerEnumType(RoomAccess, {
  name: "RoomAccess",
  description: "Defines user access to a chat room",
});

@ObjectType()
export class ChatRoom {
  @Field(() => GraphQLID)
  readonly _id: mongoose.Types.ObjectId;

  @Field(() => RoomAccess)
  @Property({ type: () => String, enum: RoomAccess })
  access: RoomAccess;

  @Field()
  @Property({ type: () => String, unique: true, minlength: 3 })
  name: string;

  @Field()
  @Property({ type: () => String, default: "" })
  description: string;

  @Field({ nullable: true })
  @Property({ type: () => String, required: false, default: null })
  imageId: string;

  @Field()
  @Property({ type: () => String })
  adminId: string;

  @Field(() => [String])
  @Property({ type: () => [String], default: [] })
  modIds: string[];

  @Field(() => [String])
  @Property({ type: () => [String], default: [] })
  userIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const ChatRoomModel = getModelForClass(ChatRoom, {
  schemaOptions: {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  },
});
