const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const mapService = require('./maps.service');
const crypto = require('crypto');
const { sendMessageToSocketId } = require('../socket');

 async function getFare(pickup, destination){
        if(!pickup || !destination) {
            throw new Error('Pickup and destination are required');
        }

        const distanceTime = await mapService.getDistanceAndTime(pickup, destination);
        const baseFares = {
            auto: 30,
            car: 50,
            moto: 20,
        };

        const perKmRates = {
            auto: 10,
            car: 15,
            moto: 8,
        };

        const perMinuteRates = {
            auto: 2,
            car: 3,
            moto: 1.5,
        };

        console.log(distanceTime)

        const fare = {
            auto: Math.round(baseFares.auto + ((distanceTime.distance.value/1000) * perKmRates.auto) + ((distanceTime.duration.value/60) * perMinuteRates.auto)),
            car: Math.round(baseFares.car + ((distanceTime.distance.value/1000) * perKmRates.car) + ((distanceTime.duration.value/60) * perMinuteRates.car)),
            moto: Math.round(baseFares.moto + ((distanceTime.distance.value/1000)* perKmRates.moto) + ((distanceTime.duration.value/60) * perMinuteRates.moto)),
        };

        return fare;
    }
    
    module.exports.getFare = getFare;

function getOtp(num){
    if (!num || num <= 0) {
        throw new Error('Number of digits must be greater than 0');
    }

    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num));
    return otp;
}

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if(!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required to create a ride');
    }

    const fare = await getFare(pickup, destination);

    const ride = rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        vehicleType,
        fare: fare[vehicleType]
    })

    
    return ride;
   
}

module.exports.confirmRide = async ({ rideId, captain }) => {
    if(!rideId) {
        throw new Error('Ride ID is required to confirm a ride');
    }

    await rideModel.findOneAndUpdate({ 
        _id: rideId 
    }, {
         status: 'accepted' ,
         captain : captain
        });

    const ride = await rideModel.findOne({ 
        _id: rideId 
    }).populate('user').populate('captain').select('+otp');

    if(!ride) {
        throw new Error('Ride not found');
    }
    return ride;
}

module.exports.startRide = async({rideId, otp, captain}) => {
    if(!rideId || !otp) {
        throw new Error('Ride ID and OTP are required to start a ride');
    }
    const ride = await rideModel.findOne({
        _id : rideId,
    }).populate('user').populate('captain').select('+otp');
    
    if(!ride) {
        throw new Error('Ride not found');
    }

    if(ride.status !== 'accepted') {
        throw new Error('Ride is not accepted yet');
    }

    if(ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id : rideId,
    },{
        status : 'ongoing',
        otp : ''
    });

    sendMessageToSocketId(ride.user.socketId,{
        event: 'ride-started',
        data: ride
    });

    return ride;
}

module.exports.endRide = async ({rideId, captain}) =>{
    if(!rideId) {
        throw new Error('Ride ID is required to end a ride');
    }

    const ride = await rideModel.findOne({
        _id : rideId,
    }).populate('user').populate('captain').select('+otp');

    if(!ride) {
        throw new Error('Ride not found');
    }

    if(ride.status !== 'ongoing') {
        throw new Error('Ride is not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id : rideId,
    },{
        status : 'completed',
    });

    return ride;
    
}
