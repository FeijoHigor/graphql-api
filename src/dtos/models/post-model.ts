import { IsObject } from 'class-validator'
import { Field, ObjectType } from 'type-graphql'
import { User } from './user-model'

@ObjectType()
export class Post {
    @Field()
    id: String

    @Field()
    title: String

    @Field()
    content: String

    @Field()
    authorId: String

    @IsObject()
    @Field(() => User)
    author: User
}