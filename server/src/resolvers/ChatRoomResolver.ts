import { PutObjectCommand } from "@aws-sdk/client-s3";
import {v4} from "uuid";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { ChatRoom, ChatRoomModel } from "../entities/ChatRoom";
import { Context } from "../types";
import { ChatRoomInput } from "./types/ChatRoomInput";
import { isAuth } from "../middleware/isAuth";

@Resolver(ChatRoom)
export class ChatRoomResolver {
    
    @Query(()=>[ChatRoom])
    async getChatRooms(): Promise<ChatRoom[]> {
        return ChatRoomModel.find();
    }

    @Mutation(()=>ChatRoom)
    @UseMiddleware(isAuth)
    async createChatRoom(
        @Ctx() {req, s3}: Context,
        @Arg("input", ()=>ChatRoomInput) input: ChatRoomInput,
        @Arg("image", () => GraphQLUpload, { nullable: true }) image?: FileUpload,
    ): Promise<ChatRoom> {

        let imageKey = null;
        if(image){
            imageKey = v4();
        }

        const newChatRoom = new ChatRoomModel({
            ...input,
            adminId: req.session.userId,
            imageid: imageKey
        });

        await newChatRoom.save();

        if(imageKey){
            await s3.send(new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageKey,
                Body: image!.createReadStream()
            }));
        }

        return newChatRoom;
    }
}