import Group from "../database/models/groupModel.js";
import User from "../database/models/userModel.js";

import { body, validationResult } from "express-validator";
import { accessForRegistered } from "../middleware/accessForRegistered.js";

class GroupController {

    createNewGroup = [
        //Registration check
        accessForRegistered(),

        //Validation and sanitization of request body fields
        body("title")
            .optional({ checkFalsy: true }),

        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Failed to create new group", errors })
                };

                const userCreator = req.user.id;
                const { user, title } = req.body;

                //Add users who will see the event
                const usersShared = await User.find({ '_id': { $in: user } });
                const usersSharedId = usersShared.map((user) => {
                    return {
                        "user_id": user._id,
                        "accepted": false
                    }
                });
                usersSharedId.unshift(
                    {
                        "user_id": userCreator,
                        "accepted": true
                    });

                const group = new Group({ user: usersSharedId, title });
                await Group.create(group);
                return res.json({ message: "Group successfully created. Members of this group: ", usersSharedId })
            } catch (err) {
                res.status(400).json({ message: "Post request error" })
            }
        }];

    showMyGroups = [
        //Registration check
        accessForRegistered(),
        //Get request
        async (req, res) => {
            try {
                const userCreator = req.user.id;
                //Find all events associated with User
                const myGroups = await Group.find({ user: { $elemMatch: { user_id: userCreator, accepted: true } } });
                res.json(myGroups);

            } catch (err) {
                res.status(400).json({ message: "GET request error" })
            }
        }
    ];

    showCertainGroup = [
        //Registration check
        accessForRegistered(),
        //Get request
        async (req, res) => {
            try {
                const group = await Group.findById(req.params.id);
                if (group) {
                    return res.json(group);
                } else {
                    return res.status(404).json({ message: "Group was not found" })
                }

            } catch (err) {
                res.status(400).json({ message: "GET request error. Group with this id was not found." })
            }
        }
    ];

    updateCertainGroup = [
        //Registration check
        accessForRegistered(),

        //Validation and sanitization of request body fields
        body("title")
            .optional({ checkFalsy: true }),

        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Failed to update group", errors })
                };

                //Check if user is the creator of the group
                const userCreator = req.user.id;
                const currentGroup = await Group.findById(req.params.id);
                const firstUser = currentGroup.user[0].user_id;
                if (userCreator != firstUser) {
                    return res.status(400).json({ message: "You do not have a permission" });
                };

                const { user, title } = req.body;
                const usersShared = await User.find({ '_id': { $in: user } });

                //Add users who will see the event
                const usersSharedId = usersShared.map((user) => {
                    return {
                        "user_id": user._id,
                        "accepted": false
                    }
                });
                usersSharedId.unshift(
                    {
                        "user_id": userCreator,
                        "accepted": true
                    });

                const group = await Group.findByIdAndUpdate(req.params.id, { user: usersSharedId, title }, { new: true });

                return res.json({ message: "Group successfully updated. Members of this group: ", usersSharedId })
            } catch (err) {
                res.status(400).json({ message: "Put request error" })
            }
        }];

    acceptEnterGroup = [
        //Registration check
        accessForRegistered(),

        async (req, res) => {
            try {
                const userID = req.user.id;
                const { user } = await Group.findById(req.params.id);
                user.forEach((userGroup) => {
                    if (userGroup.user_id == userID) {
                        userGroup.accepted = true;
                    }
                });

                await Group.findByIdAndUpdate(req.params.id, { user }, { new: true });
                return res.json({ message: "Invitation to the group was successfully accepted. Members of this group: ", user });
            } catch (err) {
                res.status(400).json({ message: "Accept group error. Put request error" })
            }
        }

    ];


    deleteGroup = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {

                //Check if user is the creator of the group
                const userCreator = req.user.id;
                const currentGroup = await Group.findById(req.params.id);
                const firstUser = currentGroup.user[0].user_id;
                if (userCreator != firstUser) {
                    return res.status(400).json({ message: "You do not have a permission" });
                };

                const group = await Group.findByIdAndDelete(req.params.id);
                if (group) {
                    return res.json({ message: "Group successfully deleted", group })
                } else {
                    return res.status(404).json({ message: "Group was not found" })
                }

            } catch (err) {
                res.status(400).json({ message: "Delete request error" })
            }
        }
    ];

};

const groupController = new GroupController();
export default groupController;
