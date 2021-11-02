import { Field, InputType } from "type-graphql";
import { RoomAccess } from "../../entities/ChatRoom";

@InputType()
export class SettingsInput {

  @Field()
  description: string;

  @Field(() => RoomAccess)
  access: RoomAccess;
}