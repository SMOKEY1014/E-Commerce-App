import { body, query } from "express-validator";
import User from "../models/User";

export class StoreValidators { 

    static addStore() {
        return [
            body('name', 'Owner Name is required').isString(),
            body('email', 'Email is required').isEmail()
                .custom((email, { req }) => {
                return User.findOne({
                    email: email
                }).then(user => {
                    if (user) {
                        throw('User Email already exists');
                    } else {
                        return true
                    }
                }).catch(err => {throw new Error(err)})
            }),
            body('phone', 'Phone number is required').isString()
            .custom((phone, { req }) => {
                return User.findOne({
                    phone: phone
                }).then(user => {
                    if (user) {
                        throw('User phone number already exists');
                    } else {
                        return true
                    }
                }).catch(err => {throw new Error(err)})
            }),
            body('password', 'Password is required').isAlphanumeric()
                .isLength({ min: 8, max: 25 })
                .withMessage('Password must be 8-25 characters'),
            body('StoreImages', 'Valid StoreImages required')
                .custom((cover, { req }) => {
                    if (req.file) {
                        return true;
                    } else {
                        throw('File not uploaded');
                    }
            }),
            body('store_name', 'Store Name is required').isString(),
            body('status', 'Status is required').isString(),
            body('address', 'Address is required').isString(),
            body('location', 'location is required').isString(),
            // body('categories', 'Categories is required').isString(),
            body('city_id', 'City ID is required').isString(),
            
        ];
    }

    // static getStores() {
    //     return [
    //         query('lat', 'Latitude is required').isNumeric(),
    //         query('lng', 'Longitude is required').isNumeric(),
    //         query('radius', 'Radius is required').isNumeric(),
    //     ]
    // }
    
    static searchStores() {
        return [
            // query('lat', 'Latitude is required').isNumeric(),
            // query('lng', 'Longitude is required').isNumeric(),
            // query('radius', 'Radius is required').isNumeric(),
            query('name', 'Store name is required').isString(),
        ]
    }
}