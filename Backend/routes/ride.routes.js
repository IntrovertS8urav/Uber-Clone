const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({min:3}).withMessage('Invalid pickup location'),
    body('destination').isString().isLength({min:3}).withMessage('Invalid dropoff location'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({min:3}).withMessage('Invalid pickup location'),
    query('destination').isString().isLength({min:3}).withMessage('Invalid dropoff location'),
    rideController.getFareEstimate
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isString().withMessage('Invalid ride ID'),
    rideController.confirmRide
)


router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride ID'),
    query('otp').isLength({min:6, max:6}).withMessage('Invalid OTP'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isString().withMessage('Invalid ride ID'),
    rideController.endRide
)


module.exports = router;