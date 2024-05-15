import { body } from "express-validator";

export class CartValidators { 

    static addToCart() {
        return [
            body('products', 'Product Items is required').isString(),
            body('status', 'Order Status is required').isString(),
            body('total', 'Order Total is required').isNumeric(),
            // body('grandTotal', 'Grandtotal is required').isNumeric(),
            // body('deliveryCharge', 'Delivery Charge is required').isNumeric(),
        ];
    }
}