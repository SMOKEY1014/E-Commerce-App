import * as mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
    company: { type: String },
    tracking_no: { type: String },
    status: { type: String },
    estimated_delivery: { type: String },
});

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref : 'users', required: true },
    products: { type: Array, required: true },
    instruction: {type: String},
    address: {type: Object, required: true},
    status: { type: String, required: true },
    total: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    payment_status: { type: Boolean, required: true },
    payment_mode: { type: String, required: true },
    tracking: trackingSchema,
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()},
});

export default mongoose.model('orders', orderSchema)