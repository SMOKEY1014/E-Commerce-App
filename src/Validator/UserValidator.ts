import {body, query} from 'express-validator'
import User from '../models/User'


export class UserValidators {
    static registerUserViaPhone() {
        return [
            query('phone', 'Phone number is required').isString()
            .custom((phone, { req }) => {
                return User.findOne({
                    phone: phone,
                    type: 'user'
                }).then(user => {
                    if (user) {
                        req.user = user;
                        // throw ('User already exists');
                    } else {
                        return true
                    }
                }).catch(err => { throw new Error(err) })
            }),
    
        ]
    }
    static otp_login() {
        return [
            query('phone', 'Phone number is required').isString(),
            query('otp', 'OTP number is required').isNumeric()
           
    
        ]
    }
    static signup() {
        return [
            body('name', 'Name is required').isString(), 
            body('phone', 'Phone number is required').isString(),  
            body('email', 'Email must be valid').isEmail().custom((email, {req}) => {
                return User.findOne({
                    email: email
                }).then(user => {
                    if (user) {
                        throw('User already exists');
                    } else {
                        return true
                    }
                }).catch(err => {throw new Error(err)})
            }),
            body('password', 'Password is required')
                .isAlphanumeric()
                .isLength({ min: 8, max: 25 })
                .withMessage('Password must be 8-25 characters'),
            body('type', 'User role type is required').isString(),
            body('status', 'Status is required').isString()
    
        ]
    }

    static login() {
        return [
            query('email', 'Email must be valid').isEmail().custom((email, {req}) => {
                return User.findOne({
                    email: email
                }).then(user => {
                    if (user) {
                        if (user.type == 'user' || user.type == 'admin'  || user.type == 'store') {
                            req.user = user;
                            return true
                        } else {
                            throw('You are not an Authorised user ');
                        }
                    } else {
                        throw('User doesn\'t exists');
                    }
                }).catch(err => {throw new Error(err)})
            }),
            query('password', 'Password is required')
                .isAlphanumeric()
                .isLength({ min: 8, max: 25 })
        ]
    }

    static verifyUserEmailToken() {
        return [
            body('verification_token', 'Email Verification token is required').isNumeric(), 
           
        ]
    }

    static verifyUserForResendEmail() {
        return [query('email', 'Email is required').isEmail()]  

    }

    static checkResetPasswordEmail() {
        return [
            query('email', 'Email must be valid').isEmail().custom((email, {req}) => {
                return User.findOne({
                    email: email
                }).then(user => {
                    if (user) {
                        return true
                    } else {
                        throw('User doesn\'t exists');
                    }
                }).catch(err => {throw new Error(err)})
            })
        ]
    };
    
    static verifyResetPasswordToken() {
        return [
            query('email', 'Email must be valid').isEmail(),
            query('reset_password_token', 'Reset Password token is required please').isNumeric()
                .custom((reset_password_token, { req }) => {
                return User.findOne({
                    email: req.query.email,
                    reset_password_token: reset_password_token,
                    reset_password_token_time:{$gt : Date.now()}
                }).then(user => {
                    if (user) {
                        return true
                    } else {
                        throw('Reset Password token doesn\'t exists, please regenerate a new one');
                    }
                }).catch(err => {throw new Error(err)})
            })
        ]
    }

    static resetPassword() {
         return [
            body('email', 'Email must be valid').isEmail()
            .custom((email, { req }) => {
            return User.findOne({
                email: email
            }).then(user => {
                if (user) {
                    req.user = user;
                    return true
                } else {
                    throw('No User with that email exists');
                }
            }).catch(err => {throw new Error(err)})
        }),
        body('new_password', 'New Password is required please').isAlphanumeric(),
        body('otp', 'Reset Password token is required please').isNumeric()
                 .custom((reset_password_token, { req }) => {
                     if (req.user.reset_password_token == reset_password_token) {
                        return true
                     } else {
                         req.errorStatus = 422;
                        throw('Reset Password token doesn\'t match or expired, please regenerate a new one');

                    }
                 })
        ]
    }

    static verifyPhoneNumber() {
        return [
            body('phone', 'Phone must be valid').isString()
        ]
    };  
    static verifyCustomerProfile() {
        return [
            body('name', 'Name must be valid').isString(),
            body('email', 'Email must be valid').isEmail()
                .custom((email, { req }) => {
                // if(req.user.email == email) throw('Please provide a new email');
                return User.findOne({
                    email: email,
                    type: 'user'
                }).then(user => {
                if (user) {
                        throw('No User with that email already exists, please provide a new email');
                    } else {
                        return true
                    }
                }).catch(err => {throw new Error(err)})
            }),
        ]
    }
    static verifyUserProfile() {
        return [
            body('phone', 'Phone must be valid').isString(),
            body('email', 'Email must be valid').isEmail()
                .custom((email, { req }) => {
                // if(req.user.email == email) throw('Please provide a new email');
                return User.findOne({
                    email: email
                }).then(user => {
                if (user) {
                        throw('No User with that email already exists, please provide a new email');
                    } else {
                        return true
                    }
                }).catch(err => {throw new Error(err)})
            }),
            body('new_password', 'New Password is required please').isAlphanumeric()
        ]
    }

    // static checkRefreshToken() {
    //     return [
    //         body('refreshToken', 'Refresh Token required')
    //             .custom((refreshToken, { req }) => {
    //                 if(refreshToken) {
    //                     return true;
    //                 } else {
    //                     req.errorStatus = 403;
    //                     throw('Access is forbidden !')
    //                 }
    //             })
    //     ]
    // }

    static UserProfilePic() {
        return [body('ProfileImages', 'Valid ResImages required')
            .custom((profileImage, { req }) => {
                if (req.file) {
                    return true;
                } else {
                    throw ('File not uploaded');
                }
            })]
    };
}