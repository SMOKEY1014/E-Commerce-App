import { Router } from "express";
import { GlobaMiddleWare } from "../middlewares/GlobalMiddleWare";
import { ItemValidators } from "../Validator/ItemValidator"; 
import { ItemController } from "../controllers/ItemController"; 
import { Utils } from "../utils/Utils";

class ItemRouter {
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
        this.router.get('/getProductsByCategory',GlobaMiddleWare.auth, ItemValidators.getProductsByCategory(),GlobaMiddleWare.checkError, ItemController.getProductsByCategory)
     }
    
    postRoutes() {
        this.router.post('/create',GlobaMiddleWare.auth, GlobaMiddleWare.adminOrStoreRole,new Utils().multer.array("productImages") , ItemValidators.addItem(),GlobaMiddleWare.checkError, ItemController.addItem);
     }
    
    patchRoutes() {
       
     }
    
    putRoutes() { }

    deleteRoutes(){}
}

export default new ItemRouter().router