import { IsArray } from 'class-validator'
import { Field, ObjectType } from 'type-graphql'
import { Post } from './post-model'

@ObjectType()
export class User {
    @Field()
    id: String

    @Field()
    name: String

    @Field()
    email: String

    @Field()
    password: String

    @IsArray()
    @Field(() => [Post])
    posts: Post[]
}