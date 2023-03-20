import { Resolver } from "type-graphql";
import { Query, Mutation, Arg } from "type-graphql/dist/decorators";
import { CreateUserInput, LoginUserInput } from "../../dtos/inputs/create-user-input";
import { User } from "../../dtos/models/user-model";
import bcrypt from 'bcrypt'
import AuthConfig from '../../config/auth'

import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { Auth } from "../../dtos/models/auth-model";

const prisma = new PrismaClient()

@Resolver(() => User)
export class UsersResolver {

    @Query(() => [User])
    async users() {
        const users = await prisma.user.findMany({include: {posts: true}})
        return users
    }

    @Query(() => User)
    async user(@Arg('id') id: string) {

        const user = await prisma.user.findFirst({
          where: {
            id
          },
          include: {
            posts: true
          } 
        })
        
        return user
    }

    @Mutation(() => User)
    async createUser(@Arg('data') data: CreateUserInput) {
        try {
            const {name, email, password} = data

            const hash = bcrypt.hashSync(password, 10);
    
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hash,
                },
                include: {
                    posts: true
                }
            })
    
            return user
        } catch(error: any) {
            throw new Error(error)
        }

    }

    @Mutation(() => String)
    async deleteUser(@Arg('id') id: string) {
        try {

            const userExists = await prisma.user.findFirst({
                where: {
                    id
                }
            })

            if(userExists) {
                const deletedUser = await prisma.user.delete({
                    where: {
                        id
                    }
                })
                
                return `O usuário ${deletedUser.name} foi excluído!`
            }
            
            return `O usuário do id ${id} não foi encontrado!`

        } catch(error: any) {
            throw new Error(error)
        }
    } 

    @Mutation(() => Auth) 
    async login(@Arg('data') data: LoginUserInput) {
        const user = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        })

        if(!user) {
            console.log('email invalido')
            throw new Error('Senha ou email invalido')
        }

        if(!bcrypt.compareSync(data.password, user.password)) {
            console.log('senha invalida')
            throw new Error('Senha ou email invalido')
        }

        const { secret, expiresIn } = AuthConfig.jwt

        const token = sign({}, secret, {
            subject: `${user.id}`,
            expiresIn
        })
        
        return {
            token,
            user
        }
    }
}