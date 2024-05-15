import * as bodyParser from 'body-parser';
import * as mongoose from "mongoose";
import * as express from 'express';
import * as cors from 'cors'
import { getEnvironmentVariables } from './environments/environment';
import UserRouter from './routers/UserRouter';
import BannerRouter from './routers/BannerRouter';
import CityRouter from './routers/CityRouter';
import CategoryRouter from './routers/CategoryRouter';
import ItemRouter from './routers/ItemRouter';
import AddressRouter from './routers/AddressRouter';
import OrderRouter from './routers/OrderRouter';
import * as dotenv from 'dotenv';
import { Utils } from './utils/Utils';
import { Redis } from './utils/Redis';
import SubCategoryRouter from './routers/SubCategoryRouter';
import StoreRouter from './routers/StoreRouter';
import CartRouter from './routers/CartRouter';
import { Jobs } from './Jobs/Jobs';


export class Server {

    public app: express.Application = express();


    constructor() {
        this.setConfigs();
        this.setRoutes();
        this.error404Handler();
        this.handlerError();
    }

    setConfigs() {
        this.dotenvConfigs();
        this.connectMongoDB();
        this.connectRedis();
        this.allowcors();
        this.configureBodyParser();
        this.runJobs();
    }
    dotenvConfigs() {
        // dotenv.config({ path: '/.env' });
        Utils.dotenvConfigs();
    }

    connectMongoDB() {
        mongoose.connect(getEnvironmentVariables().db_uri).then(() => {
                console.log("Connected to mongodb...");
            });
    }
    
    async connectRedis() {
        Redis.connectToRedis();
    }

    configureBodyParser() {
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        //this.app.use(bodyParser.json());
    };

    allowcors() {
        this.app.use(cors())
    }

    runJobs() {
        // Jobs.executeJobs();
    }
    

    setRoutes() { 
        this.app.use('/src/uploads', express.static('src/uploads'));
        this.app.use('/api/user', UserRouter);
        this.app.use('/api/banner', BannerRouter);
        this.app.use('/api/city', CityRouter);
        this.app.use('/api/store', StoreRouter);
        this.app.use('/api/category', CategoryRouter);
        this.app.use('/api/sub_category', SubCategoryRouter);
        this.app.use('/api/product', ItemRouter);
        this.app.use('/api/address', AddressRouter);
        this.app.use('/api/order', OrderRouter);
        this.app.use('/api/cart', CartRouter);
    }
    error404Handler() {
        this.app.use((req, res) => {
            res.status(404).json({
                message: 'Not Found',
                status_code: 404
            });
        });
    }

    handlerError() {
        this.app.use((error, req, res, next) => {
            if (res.headersSent) {
                return next(error);
            }
            const errorStatus = req.errorStatus || 500;
            res.status(errorStatus).json({
                message: error.message || 'Something went wrong',
                status_code: errorStatus
            });
        });
    }
   
    
}