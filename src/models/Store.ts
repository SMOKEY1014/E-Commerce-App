import * as mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Types.ObjectId, ref : 'users', required: true },
    city_id: { type: mongoose.Types.ObjectId, ref : 'cities', required: true },
    name: { type: String, required: true },
    description: {type: String, required: true},
    cover: { type: String, required: false },
    location: { type: Object, required: true },
    // cuisines: { type: Array, required: true },
    openTime: { type: String, required: false },
    closeTime: { type: String, required: false },
    address: { type: String, required: true },
    delivery_time: { type: Number, required: false },
    // isClose: { type: Boolean, required: true, default: false },
    // status: { type: Boolean, required: true, default: false },
    status: { type: String, required: true, default: "active" },
    // rating: { type: Number, required: true, default: 0 },
    // totalRating: { type: Number, required: true, default: 0 },
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()},
});

// For the commented $nearSphere in the controller
// StoreSchema.index({location:  '2dsphere'}, {background: true});

export default mongoose.model('stores', storeSchema)