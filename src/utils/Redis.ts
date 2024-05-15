import { createClient } from 'redis';
import { getEnvironmentVariables } from '../environments/environment';

const client = createClient(
    {
        // url: 'redis://127.0.0.1:6379',
        // url: 'redis://127.0.0.1:8081',
        // url: getEnvironmentVariables().redis.url,
        
        // username: 'smokeydhlamini@gmail.com',
        // password: 'Pass@123',
        
        // username: getEnvironmentVariables().redis.username,
        // password: getEnvironmentVariables().redis.password,
        socket: {
            host: '127.0.0.1',
            port: 6379,
            // host: getEnvironmentVariables().redis.host,
            // port: getEnvironmentVariables().redis.port
        },
    }

);
export class Redis {



    static connectToRedis() {
        // this.client.on('error', (err) => {
        //     console.log("Redis Client Error", err);
        // })
        client.connect().then(() => {
            console.log('Connected to Redis')
        })
        .catch(e => {
            throw (e);
        });
        
    }
    static async setValue(key, value, expires_at) {
        try {
            let options: any;
            if (expires_at) {
                options = {
                    EX: expires_at
                };
                await client.set(key, value, options);
            }
        } catch (e) {
            console.log(e)
            throw ('Redis Server not connected, please ty again ');
        }
        

    }
    static async getValue(key: string){
        try {
            const value = await client.get(key);
            return value;
        } catch (e) {
            console.log(e)
            throw ('Your session is expired,please login again...');
        }
    }

    static async delKey(key : string){
        try {
            await client.del(key);
        } catch (e) {
            console.log(e);
            throw ('Redis Server not connected, please ty again ');
        } 
    }
}