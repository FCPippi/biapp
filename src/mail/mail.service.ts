import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendConfirmationEmail(email: string, confirmationToken: string) {
    const confirmationLink = `http://seu-dominio.com/confirm-email?token=${confirmationToken}`;

    await this.transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: 'Confirmação de E-mail',
      html: `Por favor, clique no link a seguir para confirmar seu e-mail: <a href="${confirmationLink}">${confirmationLink}</a>`,
    });
  }
}
