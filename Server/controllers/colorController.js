import Color from "../database/models/colorModel.js";
import { body, validationResult } from "express-validator";
import { accessForRole } from "../middleware/accessForRole.js";
import { accessForRegistered } from "../middleware/accessForRegistered.js";

class ColorController {

    //Creation of a new color
    createNewColor = [
        //Access only for admin
        accessForRole(["admin"]),
        //Validation and sanitization of request body fields
        body("value")
            .isLength({ min: 1 })
            .escape()
            .withMessage("Color is not specified")
            .isAlphanumeric()
            .withMessage("Color contains non-alphanumeric characters"),

        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Failed to create a new color", errors })
                }
                const { value } = req.body;
                //Check if Color already exists
                const existingColor = await Color.findOne({ value });
                if (existingColor) {
                    return res.status(400).json({ message: "Color already exists" });
                }
                else {
                    await Color.create(req.body)
                        .then(result => res.json({ message: "A new color was successfully created", result }));
                }
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: "Failed to create a new color" });
            }
        }
    ];
    //Show all colors
    getColors = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {
                const colorList = await Color.find();
                return res.json(colorList);
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: "Failed to get the list of colors" })
            }
        }
    ];

    //Delete color
    deleteColor = [
        //Access only for admin
        accessForRole(["admin"]),


        async (req, res) => {
            try {
                const deleted = await Color.findByIdAndDelete(req.params.id);
                return res.json({ message: "Color was successfully deleted", deleted })
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: "Failed to delete the color" })
            }
        }];

}

const colorController = new ColorController();

export default colorController;