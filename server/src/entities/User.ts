import {
  getModelForClass,
  mongoose,
  prop as Property,
} from "@typegoose/typegoose";
import { GraphQLID } from "graphql";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field(() => GraphQLID)
  readonly _id: mongoose.Types.ObjectId;

  @Field()
  @Property({ type: () => String, unique: true, minlength: 6 })
  name: string;

  @Property({ type: () => String })
  password: string;

  @Field()
  @Property({ type: () => String, unique: true })
  email: string;

  @Field()
  @Property({ type: () => String, unique: true })
  phone: string;

  @Field({ nullable: true })
  @Property({ type: () => String, required: false, default: null })
  avatarId: string;

  @Field(() => Boolean)
  @Property({ type: () => Boolean, default: false })
  verified: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  },
});
