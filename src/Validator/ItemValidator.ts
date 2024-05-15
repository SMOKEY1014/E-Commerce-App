import { body, param, query } from "express-validator";
import Store from "../models/Store";
import Category from "../models/Category";

export class ItemValidators { 

    static addItem() {
        return [
            body('itemImages', 'Valid ResImages required')
                .custom((images, { req }) => {
                    if (req.files) {
                        return true;
                    } else {
                        throw('File not uploaded');
                    }
            }),
            body('name', 'Product Name is required').isString(),
            body('store_id', 'store_id is required').isString()
            .custom((store_id, {req}) => {
                return Store.findById(store_id).then(store => {
                    if (store) {
                        if(req.user.type == 'admin' || store.user_id == req.user.aud) return true
                        else throw new Error('You are not an authorized user for this store')
                    } else {
                        throw('store doestn\'t exists');
                    }
                }).catch(err => {throw new Error(err)})
            }),
            // body('category_id', 'category_id is required').isString()
            // .custom((category_id, {req}) => {
            //     return Category.findOne({_id : category_id, store_id: req.body.store_id }).then(category => {
            //         if (category) {
            //             return true
            //         } else {
            //             throw('Category doestn\'t exists');
            //         }
            //     }).catch(err => {throw new Error(err)})
            // }),
            body('price', 'Price is required').isString(),
            // body('status', 'Status is required').isString(),
            
        ];
    }
    static getProductsByCategory() {
        return [
            query('category_id', 'category_id is required').isString()
        ];
    }

}