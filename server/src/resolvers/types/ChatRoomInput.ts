import { Field, InputType } from "type-graphql";
import { RoomAccess } from "../../entities/ChatRoom";

@InputType()
export class ChatRoomInput {
    @Field()
    name: string;

    @Field()
    description: string;

    @Field(()=>RoomAccess)
    access: RoomAccess;
}