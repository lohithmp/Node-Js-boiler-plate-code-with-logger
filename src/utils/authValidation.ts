import jwt from "jsonwebtoken";
import { logger } from "./logger";

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

export const generateToken = (userId: string) => {
    return jwt.sign({id: userId}, SECRET_KEY, {expiresIn: '1h'})
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        logger.warn('Token verification failed:', error);
        return error;
    }
};