import * as mongoose from 'mongoose';
import { model } from 'mongoose';

const sizeSchema = new mongoose.Schema({
    size: {type: String},
    sku: { type: String },
    price: { type: Number },
    stock_unit: { type: Number },
})

const metricsSchema = new mongoose.Schema({
    orders: { type: Number },
    ratings: { type: Number }
});

const variationsSchema = new mongoose.Schema({
    type: { type: String },
    images:[{ type: String }],
    sku: { type: String },
    price: { type: Number },
    stock_unit: { type: Number },
    size: [sizeSchema],
})

const itemSchema = new mongoose.Schema({
    store_id: { type: mongoose.Types.ObjectId, ref: 'stores', required: true },
    category_id: { type: mongoose.Types.ObjectId, ref: 'categories', required: false },
    sub_category_id: { type: mongoose.Types.ObjectId, ref: 'sub_categories', required: false },
    name: { type: String, required: true },
    description: { type: String },
    specifications: { type: Object },
    images: [{ type: String }],
    sku: { type: String },
    price: { type: Number },
    stock_unit: { type: Number },
    metrics: metricsSchema,
    variations: [variationsSchema],
    status: { type: String, required: true, default: true },
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: { type: Date, required: true, default: new Date() },

});

export default model('products', itemSchema)