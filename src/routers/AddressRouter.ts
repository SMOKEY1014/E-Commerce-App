import { Router } from "express";
import { GlobaMiddleWare } from "../middlewares/GlobalMiddleWare";
import { AddressValidators } from "../Validator/AddressValidators";
import { AddressController } from "../controllers/AddressController";
import { Utils } from "../utils/Utils";

class AddressRouter {
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
        this.router.get('/userAddresses', GlobaMiddleWare.auth, AddressController.getUserAddresses)
        this.router.get('/checkUserAddress', GlobaMiddleWare.auth,AddressValidators.checkUserAddress(),GlobaMiddleWare.checkError, AddressController.checkUserAddress)
        this.router.get('/getLimitedUserAddresses', GlobaMiddleWare.auth,AddressValidators.getLimitedUserAddresses(),GlobaMiddleWare.checkError, AddressController.getLimitedUserAddresses)
        this.router.get('/:id', GlobaMiddleWare.auth, AddressController.getUserAddressById)
     }
    
    postRoutes() {
        this.router.post('/create', GlobaMiddleWare.auth,AddressValidators.addUserAddress(),GlobaMiddleWare.checkError, AddressController.addUserAddress);
     }
    
    patchRoutes() {
    //    this.router.patch('/edit/:id', GlobaMiddleWare.auth,AddressValidators.editAddress(),GlobaMiddleWare.checkError, AddressController.editAddress);
     }
    
    putRoutes() {
        this.router.put('/edit/:id', GlobaMiddleWare.auth,AddressValidators.editUserAddress(),GlobaMiddleWare.checkError, AddressController.editUserAddress);
     }

    deleteRoutes() {
         this.router.get('/delete/:id', GlobaMiddleWare.auth, AddressController.deleteUserAddress)
    }
}

export default new AddressRouter().router