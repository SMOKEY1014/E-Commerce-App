
import * as moment from 'moment';
import * as ExcelJS from 'exceljs';
import User from "../models/User";
import { Jwt } from "../utils/Jwt";
import { NodeMailer } from "../utils/NodeMailer";
import { Redis } from "../utils/Redis";
import { Utils } from "../utils/Utils";



export class UserController {

    static async registerUserViaPhone(req, res, next) { 
        
        const verification_token = Utils.generateVerificationToken();
        const phone = req.query.phone;
        let user = req.user;
        try {
            
            if (!user) {
                const data = {
                    phone,
                    type: 'user',
                    status: 'inactive',
                    verification_token,
                    verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                }

                user = await new User(data).save();
                if (!user) throw new Error('User not registered');
            } else {
                user = await User.findOneAndUpdate(
                    user._id,
                    {
                        verification_token: verification_token,
                        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                        updated_at: new Date()
                
                    },
                    {
                        new: true,
                        projection: {
                            verification_token: 0,
                            verification_token_time: 0,
                            password: 0,
                            reset_password_token: 0,
                            reset_password_token_time: 0,
                            __v: 0,
                            _id: 0
                        }
                    }
                );
            }
            // const user_data = {
            //     email: user.email || null,
            //     account_verified: user.account_verified,
            //     phone: user.phone,
            //     name: user.name || null,
            //     photo: user.photo || null,
            //     type: user.type,
            //     status: user.status,
            //     created_at: user.created_at,
            //     updated_at: user.updated_at
            // }
            res.json({
                success: true
            })
            //send otp to registerd user
            } catch (e) {
                next(e)
            }
    }
    static async otp_login(req, res, next) {
        const phone = req.query.phone;
        const otp = req.query.otp;
        try {
            const user = await User.findOneAndUpdate(
                {
                    phone,
                    verification_token: otp,
                    verification_token_time: { $gt: Date.now() },
                
                },
                {
                    account_verified: true,
                    updated_at: new Date()
                },
                {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v : 0,
                        // _id: 0
                     }
                }
            );
            if (!user) throw new Error('Wrong OTP or OTP has expired, Please try again...');
            const user_data = {
                email: user.email || null,
                account_verified: user.account_verified,
                phone: user.phone,
                name: user.name || null,
                photo: user.photo || null,
                type: user.type,
                status: user.status,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
             const payload = {
                // user_id: user._id,
                // aud: user._id,
                phone: user.phone,
                type: user.type
            }
            const access_token = Jwt.jwtSign(payload, user._id);
            const refresh_token = await Jwt.jwtSignRefreshToken(payload, user._id);
            res.json({
                token: access_token,
                refreshToken: refresh_token,
                user: user_data
            })
        } catch (e) {
            next(e)
        }
    }

    static async signup(req, res, next) {

        const email = req.body.email;
        const phone = req.body.phone;
        const name = req.body.name;
        const password = req.body.password;
        const type = req.body.type;
        const status = req.body.status;
        const verification_token = Utils.generateVerificationToken();

        // const hash = await UserController.encryptPassword(req, res, next);
        try {
            const hash = await Utils.encryptPassword(password);
            const data = {
                email,
                verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                password: hash,
                name,
                phone,
                type,
                status,
            };
            let user = await new User(data).save();
            const user_data = {
                email: user.email,
                account_verified: user.account_verified,
                phone: user.phone,
                name: user.name,
                photo: user.photo || null,
                type: user.type,
                status: user.status,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
            const payload = {
                // user_id: user._id,
                // aud: user._id,
                email: user.email,
                type: user.type
            }
            const access_token = Jwt.jwtSign(payload, user._id);
            const refresh_token = await Jwt.jwtSignRefreshToken(payload, user._id);
            res.json({
                token: access_token,
                refreshToken: refresh_token,
                user: user_data
            })
            // res.send(user);
            //SEND EMAIL TO USER FOR VERIFICATION
            await NodeMailer.sendMail({
                to: [user.email],
                subject: 'Email Verification',
                html: `<h1>Your OTP is ${verification_token}`
            });

            
        } catch (e) {
            next(e)
        }
       
    }
    static async verifyUserEmailToken(req, res, next) { 
        const verification_token = req.body.verification_token;
        const email = req.user.phone;

        try {
            const user = await User.findOneAndUpdate(
                {
                    email: email,
                    verification_token: verification_token,
                    verification_token_time: { $gt: Date.now() },
                
                },
                {
                    account_verified: true,
                    updated_at: new Date()

                },
                {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v : 0,
                        _id: 0
                     }
                }
            )
            if (user) {
                res.send(user);
            }
            else {
                throw new Error('Wrong OTP or Email verification expired, please try again')
            }
        } catch(e) {
            
        }
        
    }

    static async resendVerificationEmail(req, res, next) { 
        
        const verification_token = Utils.generateVerificationToken();
        const email = req.query.email;
        // const email = req.body.email;

        try {
            const user = await User.findOneAndUpdate(
                {
                    email: email,
                },
                {
                    updated_at: new Date(),
                    verification_token: verification_token,
                    verification_token_time:  Date.now() + new Utils().MAX_TOKEN_TIME,
                
                },
            )
            if (user) {
                res.json({ success: true});
                await NodeMailer.sendMail({
                to: [user.email],
                subject: 'Resend  Email Verification',
                html: `<h1>Your OTP is ${verification_token}`
            });
                
            }
            else {
                throw new Error('User Email Doesn\'t exist')
            }

        } catch (e) {
            next(e)
        }
    }
    static async login(req, res, next) {
        const password = req.query.password;
        const user = req.user;
        const data = {
            password,
            bcrypt_password: user.password
        }
        try {
            await Utils.comparePassword(data);
            const payload = {
                // aud: user._id,
                email: user.email,
                type: user.type
            }
            const access_token = Jwt.jwtSign(payload, user._id);
            const refresh_token = await Jwt.jwtSignRefreshToken(payload, user._id);
            const user_data = {
                email: user.email,
                account_verified: user.account_verified,
                phone: user.phone,
                name: user.name,
                photo:user.photo || null,
                type: user.type,
                status: user.status,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
            res.json({
                token: access_token,
                refreshToken: refresh_token,
                user: user_data
            })

        } catch (e) {
            next(e);
        }
        // res.send(req.user)
    }

    static async sendResetPasswordOtp(req, res, next) {
        const reset_password_token = Utils.generateVerificationToken();
        const email = req.query.email;

        try {
            const user = await User.findOneAndUpdate(
                {
                    email: email,
                },
                {
                    updated_at: new Date(),
                    reset_password_token: reset_password_token,
                    reset_password_token_time:  Date.now() + new Utils().MAX_TOKEN_TIME,
                
                },
            )
            if (user) {
                res.json({ success: true});
                await NodeMailer.sendMail({
                to: [user.email],
                subject: 'Reset password  Email Verification',
                html: `<h1>Your OTP is ${reset_password_token}`
            });
                res.json({ success: true});
            }
            else {
                throw new Error('User Email Doesn\'t exist')
            }

        } catch (e) {
            next(e)
        };
    }

    static async verifyResetPasswordToken(req, res, next) {
        try {
            res.json({success : true})

        } catch (e) {
            
        };
    }

    static async resetPassword(req, res, next) {
        const user = req.user;
        const new_password = req.body.new_password

        try {
            const encryptedPassword = await Utils.encryptPassword(new_password);
            const updatedUser = await User.findOneAndUpdate(
                {_id: user._id,},
                {
                    updated_at: new Date(),
                    password: encryptedPassword              
                }, {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v : 0,
                        _id: 0
                     }
            }
            );
            
            if (updatedUser) {
                res.send(updatedUser);
            }
            else {
                throw new Error('User Doesn\'t exist')
            }

        } catch (e) {
            next(e)
        }
    }

    static async profile(req, res, next) { 
        const user = req.user;

        try {
            const profile = await User.findById(user.aud);
            
            if (profile) {
                const user_data = {
                email: profile.email,
                account_verified: profile.account_verified,
                phone: profile.phone,
                name: profile.name,
                photo: profile.photo || null,
                type: profile.type,
                status: profile.status,
                created_at: profile.created_at,
                updated_at: profile.updated_at
            }
                res.send(user_data);
            }
            else {
                throw new Error('User Doesn\'t exist')
            }

        } catch (e) {
            next(e)
        }
    };

    static async updatePhoneNumber(req, res, next) { 
        const phone = req.body.phone;
        const user = req.user

        try {
            const userData = await User.findByIdAndUpdate(
                user.aud,
                { phone: phone, updated_at: new Date() },
                {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v : 0,
                        _id: 0
                     }
                 }
            );
            res.send(userData)
        } catch (e) {
            next(e);
        }
    };

        static async updateCustomerProfile(req, res, next) { 
        // const phone = req.body.phone;
        const user = req.user;
        const email = req.body.email;
        const name = req.body.name;
        // const verification_token = Utils.generateVerificationToken();


        try {
            const userData = await User.findById(user.aud);
            if(!userData) throw new Error('User does not exist')
            const updaterUser = await User.findByIdAndUpdate(
                user.aud,
                {
                    // phone: phone,
                    name: name,
                    email: email,
                    // account_verified: false,
                    // verification_token,
                    // verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                    updated_at: new Date()
                },
                {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v: 0,
                        _id: 0
                     }
                }
            );

            // const payload = {
            //     // aud: user.aud,
            //     email: updaterUser.email,
            //     type: updaterUser.type
            // }
            // const access_token = Jwt.jwtSign(payload, user.aud);load, user.aud);
            res.json({
                // token: access_token,
                // refreshToken: refresh_token,
                user: updaterUser
            });
            // res.send(user);
            
        } catch (e) {
            next(e);
        }
    };
    static async updateUserProfile(req, res, next) { 
        const phone = req.body.phone;
        const user = req.user;
        const plain_password = req.body.password;
        const new_email = req.body.email;
        const verification_token = Utils.generateVerificationToken();


        try {
            const userData = await User.findById(user.aud);
            if(!userData) throw new Error('User does not exist')
            await Utils.comparePassword({
                password: plain_password,
                bcrypt_password: userData.password,
            });
            const updaterUser = await User.findByIdAndUpdate(
                user.aud,
                {
                    phone: phone,
                    email: new_email,
                    account_verified: false,
                    verification_token,
                    verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                    updated_at: new Date()
                },
                {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v: 0,
                        _id: 0
                     }
                }
            );

            const payload = {
                // aud: user.aud,
                email: updaterUser.email,
                type: updaterUser.type
            }
            const access_token = Jwt.jwtSign(payload, user.aud);
            const refresh_token = await Jwt.jwtSignRefreshToken(payload, user.aud);
            res.json({
                token: access_token,
                refreshToken: refresh_token,
                user: updaterUser
            })
            // res.send(user);
            //SEND EMAIL TO USER FOR VERIFICATION
            await NodeMailer.sendMail({
                to: [updaterUser.email],
                subject: 'Email Verification',
                html: `<h1>Your OTP is ${verification_token}`
            });
        } catch (e) {
            next(e);
        }
    };
    static async getNewTokens(req, res, next) {
        // const refreshToken = req.body.refreshToken;
        const decoded_data = req.user;
        try {
            if (decoded_data) {
                const payload = {
                    // aud: user.aud,
                    email: decoded_data.email,
                    type: decoded_data.type
                }
                const access_token = Jwt.jwtSign(payload, decoded_data.aud);
                const refresh_token = await Jwt.jwtSignRefreshToken(payload, decoded_data.aud);
                res.json({
                    accessToken: access_token,
                    refreshToken: refresh_token,
            })
            } else {
                req.errorStatus = 403;
                throw('Access is forbidden');
            }

        } catch (e) {
            next(e)
        }
    }

    static async logout(req, res, next) {
        // const refreshToken = req.body.refreshToken;
        const decoded_data = req.user;
        try {
            if (decoded_data) {
                // delete refresh toked from Redis database
                await Redis.delKey(decoded_data.aud)
                res.json({
                    success: true,
            })
            } else {
                req.errorStatus = 403;
                throw('Access is forbidden');
            }

        } catch (e) {
            next(e)
        }
    }

    static async updateUserProfilePic(req, res, next) {
        const path = req.file.path;
        const user = req.user;
        try {
             
            const updated_user = await User.findByIdAndUpdate(
                user.aud,
                {
                    photo: path,
                    updated_at: new Date()
                },
                {
                    new: true,
                    projection: {
                        verification_token: 0,
                        verification_token_time: 0,
                        password: 0,
                        reset_password_token: 0,
                        reset_password_token_time: 0,
                        __v: 0,
                        _id: 0
                     }
                }

            );
            res.send(updated_user)
        } catch (e) {
            next(e);
        }
    }

    static async exportUsersToExcel(req, res, next) {
        const startDate = moment(new Date()).startOf('month').toDate();
        const endDate = moment(new Date()).endOf('month').toDate();
        try {
            const users = await User.find(
                {
                   created_at: {
                        // $gte: startDate,
                        // $lte: endDate
                   }
                });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('users');
            worksheet.columns = [
                { header: 'SL NO.', key: 's_no', width: 10 },
                { header: 'NAME', key: 'name', width: 10 },
                { header: 'EMAIL.', key: 'email', width: 10 },
                { header: 'EMAIL VERIFIED.', key: 'email_verified', width: 10 },
                { header: 'PHONE', key: 'phone', width: 10 },
            ];

            let counter = 1;
            users.forEach((user: any) => {
                user.s_no = counter;
                worksheet.addRow(user);
                counter++;
            });

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true }
            });

            const data = await workbook.xlsx.writeFile('src/uploads/users.xlsx');
            // console.log(data)
            res.send('Exported successfully');


        } catch (e) {
            next(e)
        }
    }

}