import {
  getModelForClass,
  mongoose,
  prop as Property,
} from "@typegoose/typegoose";
import { GraphQLID } from "graphql";
import { Field, ObjectType, registerEnumType } from "type-graphql";

export enum ChatRequestStatus {
  accepted = "ACCEPTED",
  progress = "PROGRESS" 
}

registerEnumType(ChatRequestStatus, {
  name: "ChatRequestStatus",
  description: "Provides information about request's process"
})

@ObjectType()
export class ChatRequest {
  @Field(() => GraphQLID)
  readonly _id: mongoose.Types.ObjectId;

  @Field()
  @Property({ type: () => String })
  userId: string;

  @Field()
  @Property({ type: () => String })
  roomId: string;

  @Field(()=>ChatRequestStatus)
  @Property({type: () => String, enum: ChatRequestStatus})
  status: ChatRequestStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const ChatRequestModel = getModelForClass(ChatRequest, {
  schemaOptions: {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  },
});
