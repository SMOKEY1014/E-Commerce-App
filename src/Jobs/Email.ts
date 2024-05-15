import * as JobScheduler from 'node-schedule'
import { NodeMailer } from '../utils/NodeMailer';
export class Email {
    static runEmailJobs() {
        this.newsletterJob();
    }

    private static newsletterJob() {
        const rule = new JobScheduler.RecurrenceRule();
        rule.second = new JobScheduler.Range(0, 59, 10)
        JobScheduler.scheduleJob('Newsletter', rule, () => {
            console.log('News letter schedule');
            // NodeMailer.sendMail({
            //     to: ['smokeydhlamini@gmail.com'],
            //     subject: "Test email from Job/Email",
            //     html: `<h1>Test email message</h1>`
            // });
        })


        // JobScheduler.scheduleJob('Newsletter', '*/5 * * * * *', () => {
        //     console.log('News letter schedule');
        // })
    }
}