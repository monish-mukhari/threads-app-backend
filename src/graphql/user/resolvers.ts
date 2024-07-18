import UserService, { CreateUserPayload, GetUserPayloadToken } from "../../services/user";


const queries = {
    getUserToken: async(_: any, payload: GetUserPayloadToken) => await UserService.getUserToken(payload),
    getCurrentLoggedInUser: async(_:any, parameters: any, context: any) => {
        if(context && context.user) {
            const id = context.user.id;
            const user = await UserService.getUserById(id);
            return user;
        }

        throw new Error("I don't know who are you");
    } 
};

const mutations = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        const response = await UserService.createUser(payload);
        return response.id;
    }
};



export const resolvers = { queries, mutations }