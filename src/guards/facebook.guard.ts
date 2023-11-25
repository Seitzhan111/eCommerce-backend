import {AuthGuard} from "@nestjs/passport";
import {ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class FacebookGuard extends AuthGuard('facebook') {
    async canActive(context: ExecutionContext) {
        const active = (await super.canActivate(context)) as boolean
        const request = context.switchToHttp().getRequest()
        await super.logIn(request)
        return active
    }
}