import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../modules/users/users.service";
import {CreateUserDTO} from "../modules/users/dto";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService,
                private readonly usersService: UsersService
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
            const existingUserByEmail = await this.usersService.findUserByEmail(profile.email);
            const existingUserByUsername = await this.usersService.findUserByUsername(profile.displayName);

            if (existingUserByEmail || existingUserByUsername) {
                return done(null, existingUserByEmail || existingUserByUsername);
            } else {
                const newUser: CreateUserDTO = await this.usersService.createUser({
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    password: profile.emails[0].value,
                    phone: profile.phone || null,
                    confirmationCode: null,
                    isConfirmed: true,
                    isSocialRegistration: true
                });

                return done(null, newUser);
            }
        } catch (error) {
            console.error('GoogleStrategy Validation Error:', error);
            done(error, false);
        }
    }
}