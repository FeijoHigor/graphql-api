import { InputType, Field } from 'type-graphql'
import { IsString } from 'class-validator'

@InputType()
export class CreateUserInput {

    @IsString()
    @Field()
    name: string

    @IsString()
    @Field()
    email: string

    @IsString()
    @Field()
    password: string
}

@InputType()
export class LoginUserInput {

    @IsString()
    @Field()
    email: string

    @IsString()
    @Field()
    password: string
}
