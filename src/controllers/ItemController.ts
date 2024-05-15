import Category from "../models/Category";
import Item from "../models/Item";

export class ItemController {

    static async addItem(req, res, next) {
        const itemData = req.body;
        const files = req.files;
        try {
            // Create product
             let item_data: any = {
                name: itemData.name,
                status: itemData.status,
                price: parseInt(itemData.price),
                category_id: itemData.category_id,
                store_id: itemData.store_id,
                // cover: path
            }
            if (itemData.description) {
                item_data = {
                    ...itemData, description: itemData.description
                }
            }
            if (files) {
                let images: any[] = [];
                images = files.map(x => x.path)
                item_data = {
                    ...itemData, images
                }
            }
            if (itemData.specifications) {
                item_data = {
                    ...itemData, specifications: itemData.specifications
                }
            }
            if (itemData.sub_category_id) {
                item_data = {
                    ...itemData, sub_category_id: itemData.sub_category_id
                }
            }
            if (itemData.sku) {
                item_data = {
                    ...itemData, sku: itemData.sku
                }
            }
            if (itemData.price) {
                item_data = {
                    ...itemData, price: itemData.price
                }
            }
            if (itemData.stock_unit) {
                item_data = {
                    ...itemData, stock_unit: itemData.stock_unit
                }
            }
            if (itemData.variations) {
                item_data = {
                    ...itemData, variations: itemData.variations
                }
            }
            const itemDoc = await new Item(item_data).save();
            res.send(itemDoc);
        } catch(e) {
            next(e);
        }
    }

    static async getProductsByCategory(req, res, next) {
        const store = req.store;
        try {
            const category_id = req.query.category_id
            const sub_category_id = req.query.sub_category_id
            const categories = await Category.find({ store_id: store._id }, { __v: 0 })
            let query: any = {
                status: true,
                category_id
            };
            if (sub_category_id) {
                query = {...query, sub_category_id}
            }
            const products = await Item.find(query);
            res.json({
                products
            })

        } catch (e) {
            next(e);
        }
    }
}