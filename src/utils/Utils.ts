import { getEnvironmentData } from "worker_threads";
import * as Bcrypt from 'bcrypt';
import * as Multer from 'multer'
import * as  Jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';
import { getEnvironmentVariables } from "../environments/environment";

const destinationUploads = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/' + file.fieldname)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1e9);
        cb(null, `${uniqueSuffix}${file.originalname}`)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb('Invalid image type', false);
    }
};

export class Utils {
    public MAX_TOKEN_TIME = 5 * 60 * 1000;
    public multer = Multer({ storage: destinationUploads, fileFilter: fileFilter });

    static generateVerificationToken(digit: number = 6) {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < digit; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        // return parseInt(otp);
        return otp;
    }
    static encryptPassword(password) {
    return new Promise((resolve, reject) => {
        Bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
    }
    
    static comparePassword(data: {password: string, bcrypt_password: string}) {
    return new Promise((resolve, reject) => {
        Bcrypt.compare(data.password, data.bcrypt_password, (err, same) => {
            if (err) {
                reject(err);
            } else if(!same) { 
                reject(new Error('User password doesn\'t match'))
            } else {
                resolve(true);
            }
        });
    });
    }

    static dotenvConfigs() {
        dotenv.config({ path: '/config.env' });
    }
    
}