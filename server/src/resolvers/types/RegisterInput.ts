import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterInput {
    @Field()
    name: string;

    @Field()
    password: string;

    @Field()
    email: string;

    @Field()
    phone: string;
}