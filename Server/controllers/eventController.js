import Event from "../database/models/eventModel.js";
import User from "../database/models/userModel.js";
import Color from "../database/models/colorModel.js";

import { body, validationResult } from "express-validator";
import { accessForRegistered } from "../middleware/accessForRegistered.js";

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
            .optional({ checkFalsy: true }),

        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Failed to create new event", errors })
                };

                const userCreator = req.user.id;
                const { user, startDate, endDate, description, color } = req.body;

                //Add users who will see the event
                const usersShared = await User.find({ '_id': { $in: user } });
                const usersSharedId = usersShared.map((user) => {
                    return {
                        "user_id": user._id,
                        "accepted": false
                    } || [];
                });
                usersSharedId.unshift(
                    {
                        "user_id": userCreator,
                        "accepted": true
                    });

                const eventColor = await Color.findOne({ 'value': color }) || { 'value': "grey" };

                const event = new Event({ user: usersSharedId, startDate, endDate, description, color: eventColor.value });
                await Event.create(event);
                return res.json({ message: "Event successfully created", usersSharedId })
            } catch (err) {
                res.status(400).json({ message: "Post request error" })
            }
        }];

    showMyEvents = [
        //Registration check
        accessForRegistered(),
        //Get request
        async (req, res) => {
            try {
                const userCreator = req.user.id;
                //Find all events associated with User
                const myEvents = await Event.find({ user: { $elemMatch: { user_id: userCreator, accepted: true } } });
                res.json(myEvents);

            } catch (err) {
                res.status(400).json({ message: "GET request error" })
            }
        }
    ];

    showNotAcceptedEvents = [
        //Registration check
        accessForRegistered(),
        //Get request
        async (req, res) => {
            try {
                const userGuest = req.user.id;
                //Find all events associated with User
                const myEvents = await Event.find({ user: { $elemMatch: { user_id: userGuest, accepted: false } } });
                res.json(myEvents);

            } catch (err) {
                res.status(400).json({ message: "GET request error" })
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
                    return res.status(404).json({ message: "Event was not found" })
                }

            } catch (err) {
                res.status(400).json({ message: "GET request error. Event with this id was not found." })
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
            .optional({ checkFalsy: true }),

        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Failed to create new event", errors })
                };

                //Check if user is the creator of the event
                const userCreator = req.user.id;
                const currentEvent = await Event.findById(req.params.id);
                const firstUser = currentEvent.user[0].user_id;
                if (userCreator != firstUser) {
                    return res.status(400).json({ message: "You do not have a permission" });
                };


                const { user, startDate, endDate, description, color } = req.body;

                //Add users who will see the event
                const usersShared = await User.find({ '_id': { $in: user } });
                const usersSharedId = usersShared.map((user) => {
                    return {
                        "user_id": user._id,
                        "accepted": false
                    } || [];
                });
                usersSharedId.unshift(
                    {
                        "user_id": userCreator,
                        "accepted": true
                    });

                const eventColor = await Color.findOne({ 'value': color }) || { 'value': "grey" };
                const event = await Event.findByIdAndUpdate(req.params.id, { user: usersSharedId, startDate, endDate, description, color: eventColor.value }, { new: true });

                return res.json({ message: "Event successfully updated ", usersSharedId })
            } catch (err) {
                res.status(400).json({ message: "Put request error" })
            }
        }];

    acceptEvent = [
        //Registration check
        accessForRegistered(),

        async (req, res) => {
            try {
                const userID = req.user.id;
                const { user } = await Event.findById(req.params.id);
                user.forEach((userEvent) => {
                    if (userEvent.user_id == userID) {
                        userEvent.accepted = true;
                    }
                });

                await Event.findByIdAndUpdate(req.params.id, { user }, { new: true });
                return res.json({ message: "Event successfully accepted. ", user });
            } catch (err) {
                res.status(400).json({ message: "Accept event error. Put request error" })
            }
        }
    ];

    rejectEvent = [
        //Registration check
        accessForRegistered(),

        async (req, res) => {
            try {
                const userID = req.user.id;
                const { user } = await Event.findById(req.params.id);

                user.forEach((userEvent, index) => {
                    if (userEvent.user_id == userID) {
                        user.splice(index, 1);
                    }
                })
                await Event.findByIdAndUpdate(req.params.id, { user }, { new: true });
                return res.json({ message: "Event rejected. ", user });
            } catch (err) {
                res.status(400).json({ message: "Reject event error. Put request error" })
            }
        }
    ];

    deleteEvent = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {

            try {
                //Check if user is the creator of the event
                const userCreator = req.user.id;
                const currentEvent = await Event.findById(req.params.id);
                const firstUser = currentEvent.user[0].user_id;
                if (userCreator != firstUser) {
                    return res.status(400).json({ message: "You do not have a permission" });
                };

                const eventDelete = await Event.findByIdAndDelete(req.params.id);
                if (eventDelete) {
                    return res.json({ message: "Event successfully deleted", eventDelete })
                } else {
                    return res.status(404).json({ message: "Event was not found" })
                }

            } catch (err) {
                res.status(400).json({ message: "Delete request error" })
            }
        }
    ];
};

const eventController = new EventController();
export default eventController;
