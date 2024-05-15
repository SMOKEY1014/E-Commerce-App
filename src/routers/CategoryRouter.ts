import { Router } from "express";
import { GlobaMiddleWare } from "../middlewares/GlobalMiddleWare";
import { CategoryValidators } from "../Validator/CategoryValidator";
import { CategoryController } from "../controllers/CategoryController";
import { Utils } from "../utils/Utils";

class CategoryRouter {
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
        this.router.get('/getCategories', GlobaMiddleWare.auth, CategoryController.getCategories)
     }
    
    postRoutes() {
        this.router.post('/create', GlobaMiddleWare.auth, GlobaMiddleWare.adminRole,new Utils().multer.single("CategoryImages"), CategoryValidators.addCategory(), GlobaMiddleWare.checkError, CategoryController.addCategory);
     }
    
    patchRoutes() {
       
     }
    
    putRoutes() { }

    deleteRoutes(){}
}

export default new CategoryRouter().router