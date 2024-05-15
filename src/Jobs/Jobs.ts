import { Database } from "./Database";
import { Email } from "./Email";

export class Jobs {
    static executeJobs() {
        Database.runDatabaseJobs();
        Email.runEmailJobs();
        console.log('Executing jobs...');
    }
}