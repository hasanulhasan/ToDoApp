const mongoose = require('mongoose');


const refreshTokenSchema = new mongoose.Schema({
token: String,
createdAt: { type: Date, default: Date.now }
});


const userSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
passwordHash: { type: String, required: true },
refreshTokens: [refreshTokenSchema]
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);