import { PrismaClient } from "@prisma/client";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreatePostInput, UpdatePostInput } from "../../dtos/inputs/create-post-input";
import { Post } from "../../dtos/models/post-model";
import { CurrentUser } from "../../middlewares/CurrentUser";


const prisma = new PrismaClient()

@Resolver(() => Post) 
export class PostsResolver {

    @Authorized()
    @Query(() => [Post])
    async posts() {
        const posts = await prisma.post.findMany({
            include: {
                author: true
            }
        })

        return posts
    }

    @Authorized()
    @Query(() => Post)
    async post(@Arg('id') id: string, @CurrentUser() currentUser: string) {
        const post = await prisma.post.findFirst({
            where: {
                id
            },
            include: {
                author: true
            }
        })

        if(post?.authorId != currentUser) {
            throw new Error('Usúario não permitido')
        }

        return post
    }

    @Authorized()
    @Mutation(() => Post)
    async createPost(@Arg('data') data: CreatePostInput, @CurrentUser() currentUser: string) {
        const { title, content } = data

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: currentUser
            },
            include: {
                author: true
            }
        })

        return post
    }

    @Authorized()
    @Mutation(() => String)
    async deletePost(@Arg('id') id: string) {
        const postExists = await prisma.post.findFirst({
            where: {
                id
            }
        })

        if(!postExists) {
            return `A postagem do id ${id} não foi encontrada!`
        }

        const deletedPost = await prisma.post.delete({
            where: {
                id
            }
        })

        return `A postagem ${deletedPost.title} foi excluída com sucesso!`
    }

    @Authorized()
    @Mutation(() => Post)
    async updatePost(@Arg('data') data: UpdatePostInput) {

        const updatedPost = await prisma.post.update({
            where: {
                id: data.id
            },
            data
        })

        return updatedPost
    }
}