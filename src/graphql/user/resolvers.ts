import UserService, { CreateUserPayload, GetUserPayloadToken } from "../../services/user";


const queries = {
    getUserToken: async(_: any, payload: GetUserPayloadToken) => await UserService.getUserToken(payload)
};

const mutations = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        const response = await UserService.createUser(payload);
        return response.id;
    }
};



export const resolvers = { queries, mutations }