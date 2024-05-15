import Category from "../models/Category";

export class CategoryController {

    static async getCategories(req, res, next) {
        try {
            // const store_id = req.params.storeId;
            const categories = await Category.find({}, { __v: 0 })
            // .populate('store_id').exec();
            res.send(categories);
        } catch (e) {
            next(e);
        }
    }


    static async addCategory(req, res, next) {
        const name = req.body.name;
        const status = req.body.status;
        try {
            let data: any = {
                name,
                status
            }
            if (req.file) {
                data = {
                    ...data, photo: req.file.path
                }
            }
            const category = await new Category(data).save();
            res.send(category);

        } catch (e) {
            next(e);
        }
    }
}
