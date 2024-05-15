import { validationResult } from "express-validator";
import { Jwt } from "../utils/Jwt";

export class GlobaMiddleWare {
    static checkError(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(new Error(errors.array()[0].msg));
        } else {
            next();
        }
    }

    static async auth(req, res, next) {
        const header_auth = req.headers.authorization;
        const token = header_auth ? header_auth.slice(7, header_auth.length) : null;
        // Alternative way to ket the token
        // const auth_header = header_auth.split(' '); // == ['Bearer', 'token']
        // const token1 = auth_header[1];
        try {
            if (!token) {
                req.errorStatus = 401; // Default status is UnAuthorized
                next(new Error("User does not exist"));
            }
            const decoded = await Jwt.jwtVerify(token);
            req.user = decoded;
            next()
        } catch (e) {
            // next(e);
            next(new Error("User does not exist"));
        }
    }

    static async decodeRefreshToken(req, res, next) {
        const refreshToken = req.body.refreshToken;

        try {
            if (!refreshToken) {
                req.errorStatus = 403;
                next(new Error('Access is forbidden !, user doesn\'t exist'))
            }
            const decoded = await Jwt.jwtVerifyRefreshToken(refreshToken);
            req.user = decoded;
            next()
        } catch (e) {
            // next(e)
            req.errorStatus = 403;
            next(new Error("Your session has expired,or you're an invalid user, Please login again..."));
        }
    }

    static adminRole(req, res, next) {
        const user = req.user;
        if (user.type !== 'admin') {
            // req.errorStatus = 401;
            next(new Error("You are not an Authorized User"));
        }
        next();
    }

    static adminOrStoreRole(req, res, next) {
        const user = req.user;
        if (user.type == 'admin' || user.type == 'store') {
            next();
        } else {
            // req.errorStatus = 401;
            next(new Error("You are not an Authorized User"));
        }
    }
}