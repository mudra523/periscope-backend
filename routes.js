const router = require('express').Router();
const activateController = require('./controllers/activate-controller');
const authController = require('./controllers/auth-controller');
const roomsController = require('./controllers/rooms-controller');
const userController = require('./controllers/user-controller');
const authMiddleware = require('./middlewares/auth-middleware');

// Here middleware function is passed to verify access token and if access token is verified we will append the user data to request body.
router.post('/api/send-otp', authController.sendOtp)
router.post('/api/verify-otp', authController.verifyOtp)
router.post('/api/activate', authMiddleware, activateController.activate)
router.get('/api/refresh', authController.refresh);
router.post('/api/logout', authMiddleware, authController.logout);


// to-do: update this routes
router.get('/api/user/:userId', authMiddleware, userController.findUser);
router.put('/api/user/update', authMiddleware, userController.updateUser);
router.put('/api/follow', authMiddleware, userController.follow);
router.put('/api/unfollow', authMiddleware, userController.unfollow);
// router.get('/api/user/:userId', userController.findUser);
// router.put('/api/user/update', userController.updateUser);
// router.put('/api/follow', userController.follow);
// router.put('/api/unfollow', userController.unfollow);

router.post('/api/rooms', authMiddleware, roomsController.create);
router.get('/api/rooms', authMiddleware, roomsController.index);
router.get('/api/room/:roomId', authMiddleware, roomsController.show);
router.delete('/api/room/:roomId', authMiddleware, roomsController.remove);
router.put('/api/room/addSpeaker', authMiddleware, roomsController.addSpeaker);
router.put('/api/room/removeSpeaker', authMiddleware, roomsController.removeSpeaker);
// router.post('/api/rooms', roomsController.create);
// router.get('/api/rooms', roomsController.index);
// router.get('/api/room/:roomId', roomsController.show);
// router.delete('/api/room/:roomId', roomsController.remove);
// router.put('/api/room/addSpeaker', roomsController.addSpeaker);
// router.put('/api/room/removeSpeaker', roomsController.removeSpeaker);

module.exports = router;