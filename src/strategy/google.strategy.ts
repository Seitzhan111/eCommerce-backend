import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../modules/users/users.service";
import {CreateUserDTO} from "../modules/users/dto";
import { AuthService } from "../modules/auth/auth.service";
import { AuthUserResponse } from "../modules/auth/response";
import { User } from "../modules/users/models/user.model";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService,
                private readonly usersService: UsersService,
                private readonly authService: AuthService

    ) {
        super({
            clientID: configService.get('google_client_id'),
            clientSecret: configService.get('google_secret'),
            callbackURL: 'http://localhost:4430/auth/google/callback',
            scope: ['profile', 'email']
        });
    }
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        try {
            let existUser: User | null;
            if (profile.emails[0].value || profile.displayName) existUser = await this.usersService.findUserByIdentifier(profile.emails[0].value || profile.displayName)

            if (existUser) {
                const userLogin: AuthUserResponse = await this.authService.loginUser({
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    password: profile.emails[0].value,
                });

                return done(null, userLogin);
            } else {
                const newUser: CreateUserDTO = await this.authService.registerUsers({
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    password: profile.emails[0].value,
                    phone: profile.phone || null,
                    confirmationCode: null,
                    isConfirmed: true,
                    isSocialRegistration: true,
                    role: null
                });

                return done(null, newUser);
            }
        } catch (error) {
            console.error('GoogleStrategy Validation Error:', error);
            done(error, false);
        }
    }
}