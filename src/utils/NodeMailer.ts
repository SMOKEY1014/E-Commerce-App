import * as nodeMailer from 'nodemailer'
import * as SendGrid from 'nodemailer-sendgrid-transport'
import { getEnvironmentVariables } from '../environments/environment'

export class NodeMailer {
    static initiateTransport() {
        return nodeMailer.createTransport(
// if you intend to use sendgrid
            SendGrid({
            auth: {
            api_key: getEnvironmentVariables().sendgrid.api_key
            }
            })

            // If you intend to use gmail
            //https://myaccount.google.com/lesssecureapps
            // {
            //     service: 'gmail',
            //     auth: {
            //         user: getEnvironmentVariables().gmail_auth.user,
            //         pass: getEnvironmentVariables().gmail_auth.pass
            //     }
            // }
        );
    }
    
    static sendMail(data: { to: [string], subject: string, html: string }): Promise<any> {
        return NodeMailer.initiateTransport().sendMail({
            // from: getEnvironmentVariables().sendgrid.email_from,
            from: getEnvironmentVariables().sendgrid.email_from,
            to: data.to,
            subject: data.subject,
            html: data.html
        })
    }
}