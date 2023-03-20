import 'reflect-metadata'

import path from 'node:path'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server'
import { UsersResolver } from './resolvers/user/users-resolvers'
import { PostsResolver } from './resolvers/posts/posts-resolver'
import AuthenticationAssurence from './middlewares/AuthenticationAssurence'

async function bootstrap() {
    const schema = await buildSchema({
        resolvers: [
            UsersResolver,
            PostsResolver,
        ],
        emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
        authChecker: AuthenticationAssurence
    })

    const server = new ApolloServer({
        schema,
        context: ({ req, res }) => {
            const context = {
                token: req?.headers.authorization,
            }

            return context
        },
    })

    const { url } = await server.listen()

    console.log(`Server is running on ${url}`)
}

bootstrap()