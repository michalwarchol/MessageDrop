import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User, UserModel } from "../entities/User";

@Resolver(() => User)
export class UserResolver {
    @Query(()=>[User])
    async getUsers(): Promise<User[]> {
        return await UserModel.find();
    }

    @Mutation(()=>User)
    async createUser(
        @Arg("name", ()=>String) name: string
    ): Promise<User>{
        const newUser = new UserModel({
            name
        } as User);

        await newUser.save();

        return newUser;
    }
}