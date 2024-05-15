import { body } from "express-validator";

export class BannerValidators { 

    static addBanner() {
        return [
            body('Banner', 'Banner must be valid')
                .custom((banner, { req }) => {
                    if (req.file) {
                        return true;
                    } else {
                        throw('File not uploaded');
                    }
            }),
        ];
    }
}