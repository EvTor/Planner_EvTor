import express from 'express';

import userController from '../controllers/userController.js';
import roleController from '../controllers/roleController.js';
import eventController from '../controllers/eventController.js';
import colorController from '../controllers/colorController.js';
import groupController from '../controllers/groupController.js';

const router = express.Router();

//user routes//////////////////////////////////////////////////
//GET requests
router.get('/users', userController.getUsers);      //only for admin
router.get('/user/profile', userController.showUserData);   //user's profile data
router.get('/users/names', userController.getUsersNames)  //only ids and names
//POST requests
router.post('/registration', userController.registration);

router.post('/login', userController.login);
//PUT requests
router.put('/user/put', userController.editProfile);
//Delete requests
router.delete('/user/delete', userController.deleteProfile);

//event routes//////////////////////////////////////////////////
//GET requests
router.get('/events', eventController.showMyEvents);
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

//color routes//////////////////////////////////////////////////
//GET requests
router.get('/colors', colorController.getColors);
//POST requests
router.post('/colors', colorController.createNewColor);     //only for admin
//Delete requests
router.delete('/colors/:id', colorController.deleteColor);  //only for admin

//group routes//////////////////////////////////////////////////
//GET requests
router.get('/groups', groupController.showMyGroups);
router.get('/groups/:id', groupController.showCertainGroup);
//POST requests
router.post('/groups', groupController.createNewGroup);
//PUT requests
router.put('/groups/:id', groupController.updateCertainGroup);

router.put('/groups/accept/:id', groupController.acceptEnterGroup);  //Accept event from other user
//Delete requests
router.delete('/groups/:id', groupController.deleteGroup);

export default router;
