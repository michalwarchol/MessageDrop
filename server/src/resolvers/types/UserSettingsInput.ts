import { Field, InputType } from "type-graphql";

@InputType()
export class UserSettingsInput {

    @Field()
    phoneOrEmail: "phone" | "email";

    @Field()
    code: string;

}