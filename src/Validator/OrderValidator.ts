import { body } from "express-validator";
import Store from "../models/Store";
import Item from "../models/Item";

export class OrderValidators { 

    static placeOrder() {
        return [
            body('products', 'Product Items is required').isString()
                .custom((products, { req }) => {
                    if (req.user.type != 'user') {
                    throw('You\'re not authorized to place any orders')
                    };
                    products = JSON.parse(products);
                    const product_ids = products.map(x => x._id);
                    req.product_ids = product_ids;
                    console.log(product_ids);
                    return Item.find({ _id: { $in: [...product_ids] } }).then(server_products => {
                        if (!server_products || server_products.length != products.length) {
                            throw('Products mismatched')
                        } else {
                            req.server_products = server_products;
                            return true;
                        }
                    }).catch(e => {
                        throw new Error(e)
                    })
            }),
            body('address', 'Address is required').isString(),
            body('status', 'Order Status is required').isString(),
            body('payment_status', 'Payment Status is required').isBoolean(),
            body('payment_mode', 'Payment Mode is required').isString(),
            body('grandTotal', 'Grandtotal is required').isNumeric(),
            body('deliveryCharge', 'Delivery Charge is required').isNumeric(),
            body('total', 'Order Total is required').isNumeric()
                .custom((total, { req }) => {
                    let tot = 0;
                    const server_products = req.server_products.map(server_product => {
                        console.log(server_product);
                        let products = JSON.parse(req.bosy.products);
                        let product = products.find(x => x._id == server_product._id);
                        if (!product.quantity || product.quantity == 0) {
                            throw ('Please provide a proper quantity for ' + product.name)
                        }
                        console.log(product);
                        if (server_product.variations?.length == 0) {
                            if (server_product.price != product.price) {
                                console.log("price mismatch");
                                throw ('Price mismatch, check latest price of ' + product.name);
                            } else if (product.quantity > server_product.stock_unit) {
                                throw ('Out of Stock ' + product.name + ' just went out of stock.')
                            }
                            tot += server_product.price * parseFloat(product.quantity);
                            return server_product;
                        } else {
                            let variation = server_product.variations.find(variation => variation.sku && variation.sku == product.sku);
                            if (variation) {
                                if (variation.price != product.price) {
                                    throw ('Price mismatch, check latest price of ' + product.name);
                                    
                                } else if (product.quantity > server_product.stock_unit) {
                                    throw ('Out of Stock ' + product.name + ' just went out of stock.')
                                }
                                tot += server_product.price * parseFloat(product.quantity);
                                return server_product;
                            } else {
                                if (variation?.size?.length > 0) {
                                    let data = variation.size.find(x => x.sku && x.sku == product.sku);
                                    if (data) {
                                        if (data.price != product.price) {
                                            throw ('Price mismatch, check latest price of ' + product.name);
                                        } else if (product.quantity > data.stock_unit) {
                                            throw ('Out of Stock ' + product.name + ' just went out of stock.')
                                        }
                                        tot += data.price * parseFloat(product.quantity);
                                        return server_product
                                    }
                                } else {
                                    throw ('Products mismatched !');
                                }
                            }
                        }
                    });
                    console.log('total : ', tot);
                    const grandTotal = tot + parseFloat(req.body.deliveryCharge);
                    console.log('Grand total :', grandTotal);
                    if (total != tot || req.body.grandTotal != grandTotal) {
                        console.log('throw error');
                        throw ('Amount to pay mismatch! Total amount should be ' + grandTotal);
                    } else {
                        return true;
                    }
                }),
        ];
    }
}