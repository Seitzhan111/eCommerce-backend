import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {Strategy, VerifyCallback, Profile, Params} from 'passport-vkontakte';
import { ConfigService } from '@nestjs/config';
import { UsersService } from "../modules/users/users.service";
import { CreateUserDTO } from "../modules/users/dto";

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, "vkontakte") {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService
    ) {
        super({
            clientID: configService.get('vkontakte_app_id'),
            clientSecret: configService.get('vkontakte_app_secret'),
            callbackURL: 'http://localhost:4430/auth/vk/callback',
            scope: ['email'],
            profileFields: ["email", "city", "bdate"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        params: Params,
        profile: Profile,
        done: VerifyCallback
    ): Promise<any> {
        try {
            const existingUserByEmail = await this.usersService.findUserByEmail(profile.emails[0].value);
            const existingUserByUsername = await this.usersService.findUserByUsername(profile.name.familyName);

            if (existingUserByEmail || existingUserByUsername) {
                return done(null, existingUserByEmail || existingUserByUsername);
            } else {
                const newUser: CreateUserDTO = await this.usersService.createUser({
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    password: profile.emails[0].value,
                    phone: null,
                    confirmationCode: null,
                    isConfirmed: true,
                    isSocialRegistration: true,
                });

                done(null, newUser);
            }

        } catch (error) {
            console.error('VkStrategy Validation Error:', error);
            done(error, false);
        }
    }
}