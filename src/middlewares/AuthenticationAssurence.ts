import { verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import AuthConfig from '../config/auth'

interface Context {
    token?: string
}

const AuthenticationAssurence: AuthChecker<Context> = ({ context, args, root, info }, roles): boolean => {
    const authHeader = context.token

    if(!authHeader) {
        return false
    }

    const [, token] = authHeader.split(' ')

    try {
        const decoded = verify(token, AuthConfig.jwt.secret)

        return !!decoded
    }catch {
        return false
    }
}

export default AuthenticationAssurence