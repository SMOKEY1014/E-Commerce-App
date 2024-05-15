import { Environment } from "./environment";
import { Utils } from "../utils/Utils";

Utils.dotenvConfigs();


export const DevEnvironment: Environment = {
    // db_uri: 'mongodb+srv://smokeydhlamini:Pass%40123@swiggycloneapp.ag5cixi.mongodb.net/',
    db_uri: 'mongodb+srv://smokeyfx1014:Pass%401014@e-commerce.suav62e.mongodb.net/',
    // db_uri: process.env.DEV_DB_URL,
    jwt_secret_key: process.env.DEV_JWT_SECRET_KEY,
    jwt_refresh_secret_key: process.env.DEV_REFRESH_JWT_SECRET_KEY,
    // jwt_secret_key: 'dfc3cce9979f3d881e40857a4700ac074e18c1195b5a225cbd97e02e4c634c07',
    // jwt_refresh_secret_key: '745f6c08b57800af18978822ed0cea862878c64744c5da6bda1547122b7692a2',
    sendgrid: {
        api_key: process.env.DEV_SENDGRID_API_KEY,//API KEY
        email_from: process.env.DEV_SENDGRID_SENDER_EMAIL
    },
    // gmail_auth: {
    //     user: process.env.DEV_GMAIL_USER,
    //     pass: process.env.DEV_GMAIL_PASS
    // },
    redis: {
        url: process.env.LOCAL_REDIS_URL,
        username: process.env.LOCAL_REDIS_USERNAME,
        password: process.env.LOCAL_REDIS_PASSWORD,
        host: process.env.LOCAL_REDIS_HOST,
        port: parseInt(process.env.LOCAL_REDIS_PORT)
    },
    stripe: {
        // publishable_key: "",//PUBLISHABLE_API_KEY,
        // secret_key: ""//SECRET_KEY
        publishable_key: process.env.DEV_STRIPE_PUBLISHABLE_KEY,
        secret_key: process.env.DEV_STRIPE_SECRET_KEY//SECRET_KEY
    }

};
//https://myaccount.google.com/lesssecureapps