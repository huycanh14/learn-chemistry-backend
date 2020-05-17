var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const account = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    date_of_birth: {
        type: Number,
        required: true
    },
    gender:{
        type: Number,
        required: true,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    role_id: {
        type: Number,
        required: true
    },
    created_at: {
        type: Number,
        required: true
    },
    updated_at: {
        type: Number,
        required: true
    },
    activated: {
        type: Boolean,
        default: true
    }
// }, { collection: "accounts"});
});

module.exports = mongoose.model('account', account, 'account');
