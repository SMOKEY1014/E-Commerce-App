import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: false},
    account_verified: { type: Boolean, required: true, default: false },
    verification_token: { type: String, required: true },
    verification_token_time: { type: Date, required: true },
    password: { type: String, required: false },
    reset_password_token: { type: String, required: false },
    reset_password_token_time: { type: Date, required: false },
    name: { type: String, required: false },
    type: { type: String, required: true },
    phone: { type: String, required: true },
    photo: { type: String, required: false },
    status: { type: String, required: true },
    created_at: {type: Date, required: true, default: new Date()},
    updated_at: {type: Date, required: true, default: new Date()},
});

// userSchema.virtual('short_name').get(function() {
//     return this.name.toLowerCase();
// })

export default mongoose.model('users', userSchema)