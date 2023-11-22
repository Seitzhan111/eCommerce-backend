import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('mail_host'),
            port: parseInt(this.configService.get('mail_port')),
            auth: {
                user: this.configService.get('mailDev_incoming_user'),
                pass: this.configService.get('mailDev_incoming_pass'),
            },
        });
    }

    async sendConfirmationEmail(email: string, confirmationCode: string): Promise<void> {
        const mailOptions = {
            from: this.configService.get('mailDev_incoming_user'),
            to: email,
            subject: 'Подтверждение электронной почты',
            text: `Ваш код для подтверждения почты ${confirmationCode}`,
        };
        await this.transporter.sendMail(mailOptions);
    }

    async sendEmail(email: string, subject: string, content: string): Promise<void> {
        const mailOptions = {
            from: this.configService.get('mailDev_incoming_user'),
            to: email,
            subject: 'Восстановление электронной почты',
            text: content,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${email}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}