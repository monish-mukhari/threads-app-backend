import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "crypto";
import JWT from "jsonwebtoken";

const JWT_SECRET = "secret123";

export interface CreateUserPayload {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;

}

export interface GetUserPayloadToken {
    email: string;
    password: string
}

export default class UserService {

    private static generateHash(salt: string, password: string) {
        const hasedPassword = createHmac('sha256', salt).update(password).digest('hex');
        return hasedPassword;
    }

    public static async createUser(payload: CreateUserPayload) {
        const salt = randomBytes(32).toString('hex');
        const hashedPassword = UserService.generateHash(salt, payload.password);
        
        return await prismaClient.user.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                password: hashedPassword,
                salt: salt 
            }
        })
    }

    private static async getUserByEmail(email: string) {
        return await prismaClient.user.findUnique({
            where: {
                email: email
            }
        })
    }

    public static async getUserToken(payload: GetUserPayloadToken) {
        // get the user's email and password
        const user = await UserService.getUserByEmail(payload.email);

        // check whether it exists in db 
            // if no --> return error
            if(!user) {
                throw new Error('User not found');
            }
            // if yes --> generate token
            const userSalt = user.salt;
            const userHashPassword = UserService.generateHash(userSalt, payload.password);
            if(userHashPassword !== user.password) {
                throw new Error("Incorrect password");
            }
            const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
            return token;
    }

    public static decodeJWTToken(token: string) {
        return JWT.verify(token, JWT_SECRET);
    }

    public static async getUserById(id: string) {
        return await prismaClient.user.findUnique({
            where: {
                id
            }
        })
    }

}