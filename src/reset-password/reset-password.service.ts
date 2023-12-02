import { Injectable } from '@nestjs/common';
import { UsersService } from "../modules/users/users.service";
import { TokenService } from "../modules/token/token.service";

@Injectable()
export class ResetPasswordService {
    private readonly resetTokens: Map<string, string> = new Map();

    constructor(private readonly usersService: UsersService, private readonly tokenService: TokenService) {}

    async saveResetToken(userId: string): Promise<string> {
        const resetToken = await this.tokenService.generateJwtToken({ user: { userId } });
        this.resetTokens.set(resetToken, userId);
        return resetToken;
    }

    getUserIdByResetToken(resetToken: string): string | undefined {
        return this.resetTokens.get(resetToken);
    }

    removeResetToken(resetToken: string): void {
        this.resetTokens.delete(resetToken);
    }
}