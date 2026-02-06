const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    captain :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
        
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted',  "ongoing", 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    duration: {
        type: Number, // in minutes
    },
    distance: {
        type: Number, // in kilometers
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature:{
        type: String,
    },
    otp:{
        type: String,
        select: false,
        required: true,
    },
})

module.exports = mongoose.model('ride', rideSchema);