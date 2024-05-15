import { Router } from "express";
import { GlobaMiddleWare } from "../middlewares/GlobalMiddleWare";
import { BannerValidators } from "../Validator/BannerValidator";
import { BannerController } from "../controllers/BannerController";
import { Utils } from "../utils/Utils";

class BannerRouter {
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
        this.router.get('/banners', GlobaMiddleWare.auth, BannerController.getBanners)
     }
    
    postRoutes() {
        this.router.post('/create', GlobaMiddleWare.auth ,GlobaMiddleWare.adminRole, new Utils().multer.single("Banner") ,BannerValidators.addBanner(),GlobaMiddleWare.checkError, BannerController.addBanner);
     }
    
    patchRoutes() {
       
     }
    
    putRoutes() { }

    deleteRoutes(){}
}

export default new BannerRouter().router