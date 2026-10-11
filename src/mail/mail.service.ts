import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.getOrThrow<string>('SMTP_HOST');
    const port = Number(this.configService.getOrThrow<string>('SMTP_PORT'));

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
    });
  }

  async sendPasswordResetEmail(email: string, resetUrl: string) {
    const from = this.configService.getOrThrow<string>('MAIL_FROM');

    await this.transporter.sendMail({
      from,
      to: email,
      subject: "O'Feel - Réinitialisation du mot de passe",
      text: [
        'Bonjour,',
        '',
        'Pour réinitialiser votre mot de passe, ouvrez ce lien :',
        resetUrl,
        '',
        'Ce lien expire dans 15 minutes.',
        '',
        "Si vous n'avez pas demandé cette réinitialisation,",
        'vous pouvez ignorer cet e-mail.',
      ].join('\n'),
    });
  }
}
