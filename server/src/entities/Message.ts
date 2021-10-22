import {
  getModelForClass,
  mongoose,
  prop as Property,
} from "@typegoose/typegoose";
import { GraphQLID } from "graphql";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class MessageReactions {
  @Field()
  reaction: string;

  @Field(() => Int)
  value: number;
}

@ObjectType()
export class Message {
  @Field(() => GraphQLID)
  readonly _id: mongoose.Types.ObjectId;

  @Field({ nullable: true })
  @Property({ type: () => String })
  text: string;

  @Field()
  @Property({ type: () => String })
  roomId!: string;

  @Field()
  @Property({ type: () => String, required: true })
  creatorId!: string;

  @Field({ nullable: true })
  @Property({ type: () => String })
  mediaId: string;

  @Field({ nullable: true })
  @Property({ type: () => String })
  fileId: string;

  @Field(() => [MessageReactions])
  @Property({ type: () => [MessageReactions], default: [] })
  messageReactions: MessageReactions[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const MessageModel = getModelForClass(Message, {
  schemaOptions: {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  },
});
