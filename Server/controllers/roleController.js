import Role from "../database/models/roleModel.js";
import { body, validationResult } from "express-validator";
import { accessForRole } from "../middleware/accessForRole.js";
import { accessForRegistered } from "../middleware/accessForRegistered.js";
class RoleController {

    //Creation of a new role
    createNewRole = [
        //Access only for admin
        accessForRole(["admin"]),
        //Validation and sanitization of request body fields
        body("value")
            .isLength({ min: 1 })
            .escape()
            .withMessage("Role is not specified")
            .isAlphanumeric()
            .withMessage("Role contains non-alphanumeric characters"),

        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Failed to create a new role", errors })
                }
                const { value } = req.body;
                //Check if Role already exists
                const existingRole = await Role.findOne({ value });
                if (existingRole) {
                    return res.status(400).json({ message: "Role already exists" });
                }
                else {
                    await Role.create(req.body)
                        .then(result => res.json({ message: "A new role was successfully created", result }));
                }
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: "Failed to create a new role" });
            }
        }
    ];

    //Show all roles
    getRoles = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {
                const roleList = await Role.find();
                return res.json(roleList);
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: "Failed to get the list of roles" })
            }
        }
    ];

    //Delete role
    deleteRole = [
        //Access only for admin
        accessForRole(["admin"]),


        async (req, res) => {
            try {
                const deleted = await Role.findByIdAndDelete(req.params.id);
                return res.json({ message: "Role was successfully deleted", deleted })
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: "Failed to delete the role" })
            }
        }];

}

const roleController = new RoleController();

export default roleController;