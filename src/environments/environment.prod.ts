import { Environment } from "./environment";
import { Utils } from "../utils/Utils";

Utils.dotenvConfigs();

export const ProdEnvironment: Environment = {
    db_uri: process.env.PROD_DB_URL,
    jwt_secret_key: process.env.PROD_JWT_SECRET_KEY,
    jwt_refresh_secret_key: process.env.PROD_REFRESH_JWT_SECRET_KEY,
    // jwt_secret_key: 'ad71d4d5e676da20770308dc8ff72ecad0ef6ab4d4a96a0861176df7d69a3c20',
    // jwt_refresh_secret_key: 'abaf495319b3a29b5e5e7aa06203dc89ac1ed317504fe0537c00baf4bcf37159',
    sendgrid: {
        api_key: process.env.PROD_SENDGRID_API_KEY,//API KEY
        email_from: process.env.PROD_SENDGRID_SENDER_EMAIL
    },
    // gmail_auth: {
    //     user: process.env.PROD_GMAIL_USER,
    //     pass: process.env.PROD_GMAIL_PASS
    // },
    redis: {
        url: process.env.SERVERS_REDIS_URL,
        username: process.env.SERVERS_REDIS_USERNAME,
        password: process.env.SERVERS_REDIS_PASSWORD,
        host: process.env.SERVERS_REDIS_HOST,
        port: parseInt(process.env.SERVERS_REDIS_PORT)
    },
    stripe: {
        // publishable_key: "",//PUBLISHABLE_API_KEY,
        // secret_key: ""//SECRET_KEY
        publishable_key: process.env.PROD_STRIPE_PUBLISHABLE_KEY,
        secret_key: process.env.PROD_STRIPE_SECRET_KEY//SECRET_KEY
    }





    // db_uri: 'mongodb+srv://smokeydhlamini:Pass%40123@swiggycloneapp.ag5cixi.mongodb.net/',
    // jwt_secret_key: 'secretkeyprod',
    // sendgrid: {
    //     api_key: '',//API KEY
    //     email_from: "smokeydhlamini@gmail.com"
    // },
    // gmail_auth: {
    //     user: 'smokeydhlamini@gmail.com',
    //     pass: ''
    // },
};