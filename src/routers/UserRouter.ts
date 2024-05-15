import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidators } from "../Validator/UserValidator";
import { GlobaMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";

class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.putRoutes();
        this.deleteRoutes();
    }

    getRoutes() {

        // this.router.get('/send/verification/email', UserValidators.verifyUserForResendEmail(), GlobaMiddleWare.checkError, UserController.resendVerificationEmail);
        this.router.get('/otp_login', UserValidators.otp_login(), GlobaMiddleWare.checkError , UserController.otp_login);
        this.router.get('/registerUserViaPhone', UserValidators.registerUserViaPhone(), GlobaMiddleWare.checkError , UserController.registerUserViaPhone);
        this.router.get('/send/verification/email',GlobaMiddleWare.auth, UserController.resendVerificationEmail);
        this.router.get('/login', UserValidators.login(), GlobaMiddleWare.checkError , UserController.login);
        this.router.get('/send/reset/password/token', UserValidators.checkResetPasswordEmail(), GlobaMiddleWare.checkError, UserController.sendResetPasswordOtp);
        this.router.get('/verify/resetPasswordToken', UserValidators.verifyResetPasswordToken(), GlobaMiddleWare.checkError, UserController.verifyResetPasswordToken)
        this.router.get('/profile', GlobaMiddleWare.auth, UserController.profile)
        this.router.get('/exportToExcel', GlobaMiddleWare.auth, GlobaMiddleWare.adminRole, UserController.exportUsersToExcel)

     }
    
    postRoutes() {
        this.router.post('/signup', UserValidators.signup(), GlobaMiddleWare.checkError , UserController.signup);           
        this.router.post('/refresh_token',GlobaMiddleWare.decodeRefreshToken, UserController.getNewTokens);           
        this.router.post('/logout', GlobaMiddleWare.auth, GlobaMiddleWare.decodeRefreshToken, UserController.logout);           

     }
    
    patchRoutes() {
        this.router.patch('/reset/password', UserValidators.resetPassword(), GlobaMiddleWare.checkError, UserController.resetPassword);
        this.router.patch('/verify/emailToken', GlobaMiddleWare.auth, UserValidators.verifyUserEmailToken(), GlobaMiddleWare.checkError, UserController.verifyUserEmailToken);
        this.router.patch('/update/phone', GlobaMiddleWare.auth, UserValidators.verifyPhoneNumber(), GlobaMiddleWare.checkError, UserController.updatePhoneNumber);
        this.router.patch('/update/profile', GlobaMiddleWare.auth,UserValidators.verifyUserProfile(), GlobaMiddleWare.checkError, UserController.updateUserProfile);
        this.router.patch('/update/customerProfile', GlobaMiddleWare.auth,UserValidators.verifyCustomerProfile(), GlobaMiddleWare.checkError, UserController.updateCustomerProfile);
        
    }
    
    putRoutes() {
        this.router.put('/update/profilePic', GlobaMiddleWare.auth, new Utils().multer.single("profileImages") , UserValidators.UserProfilePic(), GlobaMiddleWare.checkError, UserController.updateUserProfilePic);
        
     }

    deleteRoutes(){}
}

export default new UserRouter().router