import { body, query } from "express-validator";

export class AddressValidators { 

    static addUserAddress() {
        return [
            body('title', 'Title is required').isString(),
            body('title', 'Landmark is required').isString(),
            body('address', 'Address is required').isString(),
            body('house', 'House no. is required').isString(),
            body('lat', 'Latitude is required').isNumeric(),
            body('lng', 'Longitude is required').isNumeric()
            
        ];
    } editAddress

    static editUserAddress() {
        return [
            body('title', 'Title is required').isString(),
            body('landmark', 'Landmark is required').isString(),
            body('address', 'Address is required').isString(),
            body('house', 'House no. is required').isString(),
            body('lat', 'Latitude is required').isNumeric(),
            body('lng', 'Longitude is required').isNumeric()
            
        ];
    } 
    static checkUserAddress() {
        return [
            query('lat', 'Latitude is required').isNumeric(),
            query('lng', 'Longitude is required').isNumeric()
            
        ];
    }
    static getLimitedUserAddresses() {
        return [
            query('limit', 'Address limit is required').isNumeric(),            
        ];
    }

}