import { Router } from "express";
import { GlobaMiddleWare } from "../middlewares/GlobalMiddleWare";
import { StoreController } from "../controllers/StoreController";
import { StoreValidators } from "../Validator/StoreValidator";
import { Utils } from "../utils/Utils";

class StoreRouter {
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
        this.router.get('/getStores',GlobaMiddleWare.auth,GlobaMiddleWare.adminRole, StoreController.getStores)
        this.router.get('/getAllStores',GlobaMiddleWare.auth,GlobaMiddleWare.adminRole, StoreController.getStores)
        this.router.get('/searchStores',GlobaMiddleWare.auth, GlobaMiddleWare.adminRole, StoreValidators.searchStores(), GlobaMiddleWare.checkError ,StoreController.searchStores)
     }
    
    postRoutes() {
        this.router.post('/create',GlobaMiddleWare.auth, GlobaMiddleWare.adminRole,new Utils().multer.single("StoreImages") , StoreValidators.addStore(),GlobaMiddleWare.checkError, StoreController.addStore);
     }
    
    patchRoutes() {
       
     }
    
    putRoutes() { }

    deleteRoutes(){}
}

export default new StoreRouter().router