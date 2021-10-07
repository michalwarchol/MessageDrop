import {getModelForClass, mongoose, prop as Property, } from "@typegoose/typegoose";
import { GraphQLID } from "graphql";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {

    @Field(()=>GraphQLID)
    readonly _id: mongoose.Types.ObjectId

    @Field()
    @Property({type:() => String, unique: true})
    name: string;
}

export const UserModel = getModelForClass(User);

