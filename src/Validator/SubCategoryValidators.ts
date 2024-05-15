import { body } from "express-validator";

export class SubCategoryValidators { 

    static addSubCategory() {
        return [
            body('category_id', 'Category ID is required').isString(),
            body('name', 'Category Name is required').isString(),
            body('status', 'Status is required').isString(),
            body('SubCategoryImages', 'Valid CategoryImages required')
                .custom((cover, { req }) => {
                    if (req.file) {
                        return true;
                    } else {
                        throw('File not uploaded');
                    }
            }),
        ];
    }

}