import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";


@InputType()
export class CreatePostInput {

    @IsString()
    @Field()
    title: string

    @IsString()
    @Field()
    content: string
}

@InputType()
export class UpdatePostInput {

    @IsString()
    @Field()
    title: string

    @IsString()
    @Field()
    content: string

    @IsString()
    @Field()
    id: string
}