import { createParamDecorator } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import AuthConfig from '../config/auth'

const prisma = new PrismaClient()

interface Context {
    token?: string
}

export function CurrentUser() {
    return createParamDecorator<Context>(({ context }) => {
        const authHeader = context.token

        if(!authHeader) {
            return false
        }
    
        const [, token] = authHeader.split(' ')
    
        try {
            const decoded = verify(token, AuthConfig.jwt.secret)
    
            return decoded.sub
        }catch {
            return false
        }
    })
}