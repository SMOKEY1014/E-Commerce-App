import { Router } from "express";
import { GlobaMiddleWare } from "../middlewares/GlobalMiddleWare";
import { CartValidators } from "../Validator/CartValidators"; 
import { CartController } from "../controllers/CartController"; 

class CartRouter {
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
        this.router.get('/getCart', GlobaMiddleWare.auth, CartController.getUserCart)
     }
    
    postRoutes() {
        this.router.post('/create', CartValidators.addToCart(),GlobaMiddleWare.checkError, CartController.addToCart);
     }
    
    patchRoutes() {
       
     }
    
    putRoutes() { }

    deleteRoutes(){}
}

export default new CartRouter().router