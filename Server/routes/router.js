import express from 'express';
import userController from '../controllers/userController.js';
import roleController from '../controllers/roleController.js';
import eventController from '../controllers/eventController.js';
import groupController from '../controllers/groupController.js';

const router = express.Router();
//user routes//////////////////////////////////////////////////
//GET requests
router.get('/users', userController.getUsers);      //only for admin
router.get('/user/profile', userController.showUserProfileData);   //user's profile data
router.get('/user/:id', userController.showUserById);   //show user by id / only for admin
router.get('/users/names', userController.getUsersNames)  //only ids, emails and names
router.get('/activate/:link', userController.activate);   // activate account ( activation link in email)
router.get('/refresh', userController.refresh);          //refresh tokens
//POST requests
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout )        //delete refresh token from DB
//PUT requests
router.put('/user/put/:id', userController.editProfile);    //Admin or account owner
//Delete requests
router.delete('/user/delete/:id', userController.deleteProfile);    //Admin or account owner
//event routes//////////////////////////////////////////////////
//GET requests
router.get('/events', eventController.showMyEvents);    //Show accepted events
router.get('/eventsNotAccepted', eventController.showNotAcceptedEvents);    //show not accepted events
router.get('/events/:id', eventController.showCertainEvent);
//POST requests
router.post('/events', eventController.createNewEvent);
//PUT requests
router.put('/events/:id', eventController.updateCertainEvent);
router.put('/events/accept/:id', eventController.acceptEvent);  //Accept event from other user
router.put('/events/reject/:id', eventController.rejectEvent);  //Reject event from other user
//Delete requests
router.delete('/events/:id', eventController.deleteEvent);
//role routes//////////////////////////////////////////////////
//GET requests
router.get('/roles', roleController.getRoles);
//POST requests
router.post('/roles', roleController.createNewRole);        //only for admin
//Delete requests
router.delete('/roles/:id', roleController.deleteRole);     //only for admin
//group routes//////////////////////////////////////////////////
//GET requests
router.get('/groups', groupController.showMyGroups);
router.get('/groups/:id', groupController.showCertainGroup);
//POST requests
router.post('/groups', groupController.createNewGroup);
//PUT requests
router.put('/groups/:id', groupController.updateCertainGroup);
//Delete requests
router.delete('/groups/:id', groupController.deleteGroup);
export default router;
