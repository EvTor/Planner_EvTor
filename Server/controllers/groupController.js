import Group from "../database/models/groupModel.js";
import User from "../database/models/userModel.js";
import {body, validationResult} from "express-validator";
import {accessForRegistered} from "../middleware/accessForRegistered.js";

class GroupController {
    createNewGroup = [
        //Registration check
        accessForRegistered(),
        //Validation and sanitization of request body fields
        body("title")
            .optional({checkFalsy: true}),
        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error: "Failed to create new group", errors})
                }
                const userCreator = req.user._id;
                const {user, title} = req.body;
                //Add users who will see the group
                const usersShared = await User.find({'_id': {$in: user}});
                const usersSharedId = usersShared.map((user) => {
                    return {
                        "user_id": user._id,
                        "creator": false
                    } || [];
                });
                usersSharedId.unshift(
                    {
                        "user_id": userCreator,
                        "creator": true
                    });
                const group = new Group({user: usersSharedId, title});
                await Group.create(group);
                return res.json({message: "Group successfully created"})
            } catch (err) {
                res.status(400).json({error: "Post request error"})
            }
        }];
    showMyGroups = [
        //Registration check
        accessForRegistered(),
        //Get request
        async (req, res) => {
            try {
                const userCreator = req.user._id;
                //Find all events associated with User
                const myGroups = await Group.find({user: {$elemMatch: {user_id: userCreator, creator: true}}});
                res.json(myGroups);

            } catch (err) {
                res.status(400).json({error: "GET request error"})
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
                    return res.status(404).json({error: "Group was not found"})
                }

            } catch (err) {
                res.status(400).json({error: "GET request error. Group with this id was not found."})
            }
        }
    ];
    updateCertainGroup = [
        //Registration check
        accessForRegistered(),
        //Validation and sanitization of request body fields
        body("title")
            .optional({checkFalsy: true}),
        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error: "Failed to update group", errors})
                }
                //Check if user is the creator of the group
                const userCreator = req.user._id;
                const currentGroup = await Group.findById(req.params.id);
                const firstUser = currentGroup.user[0].user_id;
                console.log({"creator":userCreator, "first":firstUser})
                if (userCreator != firstUser) {
                    return res.status(400).json({error: "You do not have a permission"});
                }
                const {user, title} = req.body;
                const usersShared = await User.find({'_id': {$in: user}});
                //Add users who will see the group
                const usersSharedId = usersShared.map((user) => {
                    return {
                        "user_id": user._id,
                        "creator": false
                    }
                });
                usersSharedId.unshift(
                    {
                        "user_id": userCreator,
                        "creator": true
                    });
                await Group.findByIdAndUpdate(req.params.id, {user: usersSharedId, title}, {new: true});
                return res.json({message: "Group successfully updated"})
            } catch (err) {
                res.status(400).json({error: "Put request error"})
            }
        }];
    deleteGroup = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {
                //Check if user is the creator of the group
                const userCreator = req.user._id;
                const currentGroup = await Group.findById(req.params.id);
                const firstUser = currentGroup.user[0].user_id;
                if (userCreator != firstUser) {
                    return res.status(400).json({error: "You do not have a permission"});
                }
                const groupDelete = await Group.findByIdAndDelete(req.params.id);
                if (groupDelete) {
                    return res.json({message: "Group successfully deleted"})
                } else {
                    return res.status(404).json({error: "Group was not found"})
                }
            } catch (err) {
                res.status(400).json({error: "Delete request error"})
            }
        }
    ];
}

const groupController = new GroupController();
export default groupController;
