import Banner from "../models/Banner";

export class BannerController {

    static async addBanner(req, res, next) {
        // res.send(req.file);
        const path = req.file.path;
        try {
            let data: any = {
                banner: path
            };
            // if (req.body.store_id) {
            //     data = {...data, store_id: req.body.store_id }
            // };
            const banner = await new Banner(data).save();
            res.send(banner);

        } catch(e) {
            next(e);
        }
    }

    static async getBanners(req, res, next) {
        try {
            const banners = await Banner.find({status: 0});
            res.send(banners);
        } catch (e) {
            next(e);
        }
    }
}