var mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const Accounts = new mongoose.Schema({
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
        type: Boolean,
        required: true,
        default: true
        // true => male, false => female
    },
    password: {
        type: String,
        required: true
    },
    role_id: {
        type: Boolean,
        required: true,
        default: false,
        // true => admin, false => user
    },
    created_at: {
        type: Number,
        required: true,
        default: Date.now()
    },
    updated_at: {
        type: Number,
        required: true,
        default: Date.now()
    },
    activated: {
        type: Boolean,
        default: true
        // true => active, false => nonactive
    }
});

module.exports = mongoose.model('accounts', Accounts, 'accounts');