const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const {sendMessageToSocketId} = require('../socket');
const rideModel = require('../models/ride.model');
const userModel = require('../models/user.model');
const { send } = require('process');

module.exports.createRide = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;
    try {
        const ride = await rideService.createRide({user : req.user._id, pickup ,destination, vehicleType})
        
        const pickUpCoordinates = await mapService.getAddressCoordinate(pickup);
        
        // console.log('Pickup Coordinates:', pickUpCoordinates);
        
        const captainsInRadius = await mapService.getCaptainInTheRadius(pickUpCoordinates.lng, pickUpCoordinates.ltd, 50); // 5 km radius
        
        // console.log('Captains in Radius:', captainsInRadius);

        ride.otp =""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user')

        captainsInRadius.map( captain =>{

            console.log(captain, ride)
            sendMessageToSocketId(captain.socketId,{
                event: 'new-ride',
                data: rideWithUser
            })

        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
};

module.exports.getFareEstimate = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { pickup, destination } = req.query;
    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;
    try {

        if (!req.captain) {
            return res.status(401).json({ message: 'Unauthorized: Captain not found' });
        }

        const captainId = req.captain._id || req.captain.id; 
        console.log('Captain ID:', captainId);

        const ride = await rideService.confirmRide( {rideId , captain : captainId} );

        if (ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-confirmed',
                data: ride
            });
        }
        
        return res.status(200).json(ride);
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}

module.exports.startRide = async(req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;
    try {

        const ride = await rideService.startRide({rideId, otp, captain: req.captain._id});
        sendMessageToSocketId(ride.user.socketId,{
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});

    }

    const { rideId } = req.body;
    try{
        const ride = await rideService.endRide({rideId, captain: req.captain._id});

        sendMessageToSocketId(ride.user.socketId,{
            event: 'ride-ended',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (error){
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}