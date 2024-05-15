import { Router } from "express";
import { GlobaMiddleWare } from "../middlewares/GlobalMiddleWare";
import { CityValidators } from "../Validator/CityValidator"; 
import { CityController } from "../controllers/CityController"; 

class CityRouter {
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
        this.router.get('/cities', CityController.getCities)
     }
    
    postRoutes() {
        this.router.post('/create', CityValidators.addCity(),GlobaMiddleWare.checkError, CityController.addCity);
     }
    
    patchRoutes() {
       
     }
    
    putRoutes() { }

    deleteRoutes(){}
}

export default new CityRouter().router