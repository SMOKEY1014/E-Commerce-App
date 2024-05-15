import { body } from "express-validator";

export class CategoryValidators { 

    static addCategory() {
        return [
            body('name', 'Category Name is required').isString(),
            body('status', 'Status is required').isString(),
            body('CategoryImages', 'Valid CategoryImages required')
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