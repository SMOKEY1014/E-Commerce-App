import { Router } from "express";
import { GlobaMiddleWare } from "../middlewares/GlobalMiddleWare";
import { OrderValidators } from "../Validator/OrderValidator"; 
import { OrderController } from "../controllers/OrderController"; 

class OrderRouter {
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
        this.router.get('/userOrders', GlobaMiddleWare.auth, OrderController.getUserOrders)
     }
    
    postRoutes() {
        this.router.post('/create', OrderValidators.placeOrder(),GlobaMiddleWare.checkError, OrderController.placeOrder);
        this.router.post('/stripeCheckout', OrderController.stripeCheckout);
     }
    
    patchRoutes() {
       
     }
    
    putRoutes() { }

    deleteRoutes(){}
}

export default new OrderRouter().router