/*
import nodemailer from 'nodemailer';

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service:'gmail',
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    sendActivationMail = async (to) => {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "New invite",
            text: '',
            html:
                `
                    <div>
                        <h1>You have an invite!!!</h1>
                        <a href='http://localhost:3000'>http://localhost:3000</a>
                    </div>
            `
        })
    }

}

const mailService = new MailService();
export default mailService;*/
