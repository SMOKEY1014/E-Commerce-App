import * as mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId,ref : 'users' , required: true },
    title: { type: String, required: true, },
    address: { type: String, required: true, },
    landmark: { type: String, required: true, },
    house: { type: String, required: true, },
    lat: { type: Number, required: true, },
    lng: { type: Number, required: true, },
    status: { type: String, required: true, },
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()},
});

export default mongoose.model('addresses', addressSchema)