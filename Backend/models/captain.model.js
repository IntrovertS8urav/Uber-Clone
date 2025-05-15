const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "Firstname must be at leasr 3 characters long"],

    },
        lastname: {
            type: String,
            minlength: [3, "Lastname must be at least 3 characters long"],
    }
},

    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],

    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    socketId: {
        type: String,
    },

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },

    vehicle: {
        color:{
        type: String,
        required: true,
        minlength: [3, "Vehicle name must be at least 3 characters long"],
    },

    capacity: {
        type: Number,
        required: true,
        min: [1, "Capacity must be at least 1"],
    },

    vehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'auto'],
        required: true,
    }
},

    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        },
    },

    })
        captainSchema.methods.generateAuthToken = function() {
            const token = jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
            return token;

        }

        captainSchema.methods.comparePassword = async function(password) {
            return await bcrypt.compare(password, this.password);
        }

        captainSchema.statics.hashPassword = async function(password) {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        }
    const captainModel = mongoose.model('Captain', captainSchema);

    module.exports = captainModel;


