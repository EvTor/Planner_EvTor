import Event from "../database/models/eventModel.js";
import User from "../database/models/userModel.js";
import {body, validationResult} from "express-validator";
import {accessForRegistered} from "../middleware/accessForRegistered.js";
import mailService from "../service/mailService.js";

class EventController {
    createNewEvent = [
        //Registration check
        accessForRegistered(),
        //Validation and sanitization of request body fields
        body("startDate")
            .isISO8601()
            .toDate()
            .withMessage("Incorrect start Date format"),
        body("endDate")
            .isISO8601()
            .toDate()
            .withMessage("Incorrect end Date format"),
        body("description")
            .optional({checkFalsy: true}),

        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error: "Failed to create new event", errors})
                }

                const userCreatorId = req.user._id;
                const {user, startDate, endDate, description, color} = req.body;
                //Add users who will see the event
                const usersShared = await User.find({'_id': {$in: user}});
                const usersSharedId = usersShared.map((user) => {
                    return {
                        "user_id": user._id,
                        "accepted": false
                    } || [];
                });

                usersSharedId.unshift(
                    {
                        "user_id": userCreatorId,
                        "accepted": true
                    });
                const event = new Event({user: usersSharedId, startDate, endDate, description, color});
                await Event.create(event);
                //Mail service
                const userCreator = await User.findById(userCreatorId);
                const type = "create";
                if (usersShared.length !== 0) {
                    await mailService.sendInvitationMail(userCreator, usersShared, event, type)
                }
                return res.json({message: "Event successfully created"})
            } catch (err) {
                res.status(400).json({error: "Post request error"})
            }
        }];

    showMyEvents = [
        //Registration check
        accessForRegistered(),
        //Get request
        async (req, res) => {
            try {
                const userCreatorId = req.user._id;
                //Find all events associated with User
                const myEvents = await Event.find({user: {$elemMatch: {user_id: userCreatorId, accepted: true}}});
                res.json(myEvents);

            } catch (err) {
                res.status(400).json({error: "GET request error"})
            }
        }
    ];

    showNotAcceptedEvents = [
        //Registration check
        accessForRegistered(),
        //Get request
        async (req, res) => {
            try {
                const userGuest = req.user._id;
                //Find all events associated with User
                const myEvents = await Event.find({user: {$elemMatch: {user_id: userGuest, accepted: false}}});
                res.json(myEvents);
            } catch (err) {
                res.status(400).json({error: "GET request error"})
            }
        }
    ];
    showCertainEvent = [
        //Registration check
        accessForRegistered(),
        //Get request
        async (req, res) => {
            try {
                const event = await Event.findById(req.params.id);
                if (event) {
                    return res.json(event);
                } else {
                    return res.status(404).json({error: "Event was not found"})
                }

            } catch (err) {
                res.status(400).json({error: "GET request error. Event with this id was not found."})
            }
        }
    ];
    updateCertainEvent = [
        //Registration check
        accessForRegistered(),
        //Validation and sanitization of request body fields
        body("startDate")
            .isISO8601()
            .toDate()
            .withMessage("Incorrect start Date format"),
        body("endDate")
            .isISO8601()
            .toDate()
            .withMessage("Incorrect end Date format"),
        body("description")
            .optional({checkFalsy: true}),
        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error: "Failed to create new event", errors})
                }
                //Check if user is the creator of the event
                const userCreatorId = req.user._id;
                const currentEvent = await Event.findById(req.params.id);
                const firstUser = currentEvent.user[0].user_id;
                if (userCreatorId != firstUser) {
                    return res.status(400).json({error: "You do not have a permission"});
                }
                const {user, startDate, endDate, description, color} = req.body;
                //Add users who will see the event
                const usersShared = await User.find({'_id': {$in: user}});
                const usersSharedId = usersShared.map((user) => {
                    return {
                        "user_id": user._id,
                        "accepted": false
                    } || [];
                });
                usersSharedId.unshift(
                    {
                        "user_id": userCreatorId,
                        "accepted": true
                    });
                const event = await Event.findByIdAndUpdate(req.params.id, {
                    user: usersSharedId,
                    startDate,
                    endDate,
                    description,
                    color
                }, {new: true});
                //Mail service
                const userCreator = await User.findById(userCreatorId);
                const type = "update";
                if (usersShared.length !== 0) {
                    await mailService.sendInvitationMail(userCreator, usersShared, event, type)
                }
                return res.json({message: "Event successfully updated "})
            } catch (err) {
                res.status(400).json({error: "Put request error"})
            }
        }];
    acceptEvent = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {
                const userID = req.user._id;
                const event = await Event.findById(req.params.id);
                const acceptedByUsers = event.user.map((userEvent) => {
                    if (userEvent.user_id == userID) {
                        return{
                            user_id: userEvent.user_id,
                            accepted: true,
                            _id:userEvent._id
                        }
                    }
                    return userEvent
                });
                await Event.findByIdAndUpdate(req.params.id, {user:acceptedByUsers}, {new: true});
                //Mail service
                const updatedEvent = await Event.findById(req.params.id);
                const userCreator = await User.findById(updatedEvent.user[0].user_id);
                const userAccepted = await User.findById(userID);
                const users = updatedEvent.user.map(user => {
                    return user.user_id
                }).slice(1);
                const usersShared = await User.find({'_id': {$in: users}});
                const type = "accept";
                await mailService.sendAcceptanceMail(userCreator, userAccepted, usersShared, updatedEvent, type)
                return res.json({message: "Event successfully accepted."});
            } catch (err) {
                res.status(400).json({error: "Accept event error. Put request error"})
            }
        }
    ];

    rejectEvent = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {
                const userID = req.user._id;
                const event = await Event.findById(req.params.id);
                let updatedEventUsers = event.user;
                event.user.forEach((userEvent, index) => {
                    if (userEvent.user_id.toString() === userID) {
                        updatedEventUsers.splice(index, 1);
                    }
                })
                await Event.findByIdAndUpdate(req.params.id, {user:updatedEventUsers}, {new: true});
                //Mail service
                const updatedEvent = await Event.findById(req.params.id);
                const userCreator = await User.findById(updatedEvent.user[0].user_id);
                const userDeclined = await User.findById(userID);
                const users = updatedEvent.user.map(user => {
                    return user.user_id
                }).slice(1);
                const usersShared = await User.find({'_id': {$in: users}});
                const type = "decline";
                await mailService.sendAcceptanceMail(userCreator, userDeclined, usersShared, updatedEvent, type)
                return res.json({message: "Event rejected. "});
            } catch (err) {
                res.status(400).json({error: "Reject event error. Put request error"})
            }
        }
    ];
    deleteEvent = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {
                //Check if user is the creator of the event
                const userCreatorId = req.user._id;
                const currentEvent = await Event.findById(req.params.id);
                const firstUser = currentEvent.user[0].user_id;
                if (userCreatorId != firstUser) {
                    return res.status(400).json({error: "You do not have a permission"});
                }
                const event = await Event.findByIdAndDelete(req.params.id);
                if (event) {
                    //Mail service
                    const userCreator = await User.findById(userCreatorId);
                    const users = event.user.map(user => {
                        return user.user_id
                    }).slice(1);
                    const usersShared = await User.find({'_id': {$in: users}});
                    const type = "delete";
                    if (usersShared.length !== 0) {
                        await mailService.sendInvitationMail(userCreator, usersShared, event, type)
                    }
                    return res.json({message: "Event successfully deleted"})
                } else {
                    return res.status(404).json({error: "Event was not found"})
                }
            } catch (err) {
                res.status(400).json({error: "Delete request error"})
            }
        }
    ];
}

const eventController = new EventController();
export default eventController;
