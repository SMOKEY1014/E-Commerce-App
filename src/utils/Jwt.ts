import { getEnvironmentData } from "worker_threads";
import * as Bcrypt from 'bcrypt';
import * as  jwt from 'jsonwebtoken'
import { getEnvironmentVariables } from "../environments/environment";
import * as Crypto from 'crypto'
import { Redis } from "./Redis";


export class Jwt {


    static jwtSign(payload, UserId, expires_In: string = '1h') {
        Jwt.gen_secret_key();
        return jwt.sign(
            payload,
            getEnvironmentVariables().jwt_secret_key,
            {
                expiresIn: expires_In,
                audience: UserId.toString(),
                issuer: 'phakamani.tec',
            }
        );
    }

    static jwtVerify(token): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, getEnvironmentVariables().jwt_secret_key, function (err, decoded) {
                if (err) reject(err);
                else if (!decoded) reject(new Error('User not authorized'));
                else resolve(decoded);
            });
        })
    }

    static async jwtSignRefreshToken(
        payload,
        UserId,
        expires_In: string = '1y',
        redis_ex: number = 31536000
    ) {
        try {
            const refreshToken = jwt.sign(
            payload,
            getEnvironmentVariables().jwt_refresh_secret_key,
            {
                expiresIn: expires_In,
                audience: UserId.toString(),
                issuer: 'phakamani.tec',
            }
            );
            // set resfresh toket to redis with key : UserId
            await Redis.setValue(UserId.toString(), refreshToken, redis_ex);
            return refreshToken;
        } catch (e) {
            // throw new Error(e)
            throw(e)
        }
    }

    static jwtVerifyRefreshToken(refreshToken): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, getEnvironmentVariables().jwt_refresh_secret_key, function (err, decoded) {
                if (err) reject(err);
                else if (!decoded) reject(new Error('User not authorized'));
                else {
                    // match refresh token from redis database
                    const user: any = decoded;
                    Redis.getValue(user.aud).then(value => {
                        if (value === refreshToken) {
                            resolve(decoded)
                        } else {
                            reject(new Error('Your session is expired,please login again...'))
                        }
                    }).catch(e => {
                        reject(e)
                    })
                    resolve(decoded);
                }
            });
        })
    }

    private static gen_secret_key() {
        const DEV_access_token_secret_key =Crypto.randomBytes(32).toString('hex')
        const DEV_refresh_access_token_secret_key = Crypto.randomBytes(32).toString('hex')
        
        const PROD_access_token_secret_key =Crypto.randomBytes(32).toString('hex')
        const PROD_refresh_access_token_secret_key = Crypto.randomBytes(32).toString('hex')
        
        // console.table(
        //     {
        //         DEV_access_token_secret_key,
        //         DEV_refresh_access_token_secret_key,
        //         PROD_access_token_secret_key,
        //         PROD_refresh_access_token_secret_key,
        //     }
        // )
    }
}