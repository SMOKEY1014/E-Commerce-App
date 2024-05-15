import { Router } from "express";
import { GlobaMiddleWare } from "../middlewares/GlobalMiddleWare";
import { SubCategoryValidators } from "../Validator/SubCategoryValidators";
import { SubCategoryController } from "../controllers/SubCategoryController";
import { Utils } from "../utils/Utils";

class SubCategoryRouter {
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
        this.router.get('/getCategories', GlobaMiddleWare.auth, SubCategoryController.getSubCategories)
        this.router.get('/getCategories/:categoryId', GlobaMiddleWare.auth, SubCategoryController.getCategoriesByCategory)
     }
    
    postRoutes() {
        this.router.post('/create', GlobaMiddleWare.auth, GlobaMiddleWare.adminRole,new Utils().multer.single("SubCategoryImages"), SubCategoryValidators.addSubCategory(), GlobaMiddleWare.checkError, SubCategoryController.addSubCategory);
     }
    
    patchRoutes() {
       
     }
    
    putRoutes() { }

    deleteRoutes(){}
}

export default new SubCategoryRouter().router