import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import { Strategy } from 'passport-facebook';
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../modules/users/users.service";
import {CreateUserDTO} from "../modules/users/dto";


@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService,
                private readonly usersService: UsersService
    ) {
        super({
            clientID: configService.get('facebook_app_id'),
            clientSecret: configService.get('facebook_app_secret'),
            callbackURL: 'http://localhost:4430/auth/facebook/callback',
            scope: ['email', 'id']
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        try {
            console.log('Facebook Profile:', profile);

            const email = profile.email || 'default@email.com'; // Используйте значение по умолчанию или null
            const existingUserByEmail = await this.usersService.findUserByEmail(email);

            if (existingUserByEmail) {
                return done(null, existingUserByEmail);
            } else {
                const newUser: CreateUserDTO = await this.usersService.createUser({
                    id: profile.id,
                    fullName: profile.displayName || 'DefaultName', // Используйте значение по умолчанию или null
                    email: email,
                    username: profile.username || 'DefaultUsername', // Используйте значение по умолчанию или null
                    password: email,
                    phone: profile.phone || null,
                    confirmationCode: null,
                    isConfirmed: true,
                    isSocialRegistration: true
                });

                return done(null, newUser);
            }
        } catch (error) {
            console.error('FacebookStrategy Validation Error:', error);
            done(error, false);
        }
    }
}