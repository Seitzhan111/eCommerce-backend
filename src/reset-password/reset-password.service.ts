import { Injectable } from '@nestjs/common';

@Injectable()
export class ResetPasswordService {
    private readonly resetTokens: Map<string, string> = new Map();

    saveResetToken(userId: string, resetToken: string): void {
        this.resetTokens.set(resetToken, userId);
    }

    getUserIdByResetToken(resetToken: string): string | undefined {
        return this.resetTokens.get(resetToken);
    }

    removeResetToken(resetToken: string): void {
        this.resetTokens.delete(resetToken);
    }
}