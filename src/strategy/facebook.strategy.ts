import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import { Strategy, Profile } from 'passport-facebook';
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../modules/users/users.service";
import {CreateUserDTO} from "../modules/users/dto";
import { AuthUserResponse } from "../modules/auth/response";
import { AuthService } from "../modules/auth/auth.service";


@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService,
                private readonly usersService: UsersService,
                private readonly authService: AuthService
    ) {
        super({
            clientID: configService.get('facebook_app_id'),
            clientSecret: configService.get('facebook_app_secret'),
            callbackURL: 'http://localhost:4430/auth/facebook/callback',
            scope: "email",
            profileFields: ["emails", "name"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void
    ): Promise<any> {
        try {
            const existingUserByEmail = await this.usersService.findUserByEmail(profile.emails[0].value);
            const existingUserByUsername = await this.usersService.findUserByUsername(profile.name.familyName);

            if (existingUserByEmail || existingUserByUsername) {
                const userLogin: AuthUserResponse = await this.authService.loginUser({
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    password: profile.emails[0].value,
                });

                return done(null, userLogin);
            } else {
                const newUser: CreateUserDTO = await this.usersService.createUser({
                    fullName: profile.name.familyName + ' ' + profile.name.givenName,
                    email: profile.emails[0].value,
                    username: profile.name.familyName,
                    password: profile.emails[0].value,
                    phone: null,
                    confirmationCode: null,
                    isConfirmed: true,
                    isSocialRegistration: true,
                    role: null
                });

                done(null, newUser);
            }
        }catch (error) {
            console.error('GoogleStrategy Validation Error:', error);
            done(error, false);
        }
    }
}
