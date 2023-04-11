import User from "../database/models/userModel.js";
import Role from "../database/models/roleModel.js"
import { body, validationResult } from "express-validator";
//Bcrypt to hash passwords
import bcrypt from "bcryptjs";
//jsonwebtoken for token generation
import jwt from "jsonwebtoken";
import { secret } from "../config.js";
import { accessForRegistered } from "../middleware/accessForRegistered.js";
import { accessForRole } from "../middleware/accessForRole.js";

//Generation of the access token 
const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, secret.key, { expiresIn: "24h" })
};

class UserController {

    //Registration of a new user
    registration = [
        //Validation and sanitization of request body fields
        body("email")
            .trim()
            .isLength({ min: 4, max: 40 })
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .isLength({ min: 3 })
            .withMessage("Password must contain at least 3 characters"),
        body("firstName")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("First name is not specified")
            .isAlphanumeric()
            .withMessage("First name contains non-alphanumeric characters"),
        body("lastName")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Last name is not specified")
            .isAlphanumeric()
            .withMessage("Last name contains non-alphanumeric characters"),

        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Registration failed", errors })
                }

                const { email, password, firstName, lastName } = req.body;

                //Check if User with this email already exists
                const existingUser = await User.findOne({ email })
                if (existingUser) {
                    return res.status(400).json({ message: 'User with this email already exists' });
                }
                else {
                    //Hash a password
                    const saltRounds = 5;
                    const hashPassword = bcrypt.hashSync(password, saltRounds);

                    //Add a role
                    const userRole = await Role.findOne({ value: "user" });

                    //Create new User
                    const user = new User({ email, password: hashPassword, firstName, lastName, role: [userRole.value] });
                    await User.create(user);
                    return res.json({ message: 'Successful registration', user });
                }

            } catch (err) {
                console.log(err);
                res.status(400).json({ message: 'Registration error' })
            }
        }
    ];


    //login of Registered user 
    login = [
        //Validation and sanitization of request body fields
        body("email")
            .trim()
            .isLength({ min: 4, max: 40 })
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .isLength({ min: 3 })
            .withMessage("Password must contain at least 3 characters"),
        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Wrong email or password format", errors })
                }
                const { email, password } = req.body;

                //Check if User with this email exists
                const userLogin = await User.findOne({ email });
                if (!userLogin) {
                    return res.status(400).json({ message: `User with email ${email} was not found` })
                };

                //Compare password with valid hashed password using bcrypt
                const validPassword = bcrypt.compareSync(password, userLogin.password);
                if (!validPassword) {
                    return res.status(400).json({ message: "Wrong password" })
                }

                //Generate jwt token
                const token = generateAccessToken(userLogin._id, userLogin.role);
                return res.json({ token });
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: 'Login error' })
            }

        }
    ];

    showUserData = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {
                const userToken = req.user;
                const userData = await User.findById(userToken.id);

                if (!userData) {
                    return res.status(400).json({ message: "User data was not found" });
                }
                else
                    return res.json(userData);

            } catch (err) {
                console.log(err);
                res.status(400).json({ message: 'Get request error, process failed' })
            }
        }

    ];


    //GET all registered users
    getUsers = [

        //Access only for admin
        accessForRole(["admin"]),
        async (req, res) => {
            try {
                const userList = await User.find();
                res.json(userList)
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: 'GET request error' })
            }
        }];

    //Get ids and names of registered users
    getUsersNames = [

        //Access for registered users
        accessForRegistered(),

        async (req, res) => {
            try {
                const userList = await User.find();
                const namesIds = userList.map((user) => {
                    return {
                        "id": user.id,
                        "firstName": user.firstName,
                        "lastName": user.lastName
                    }

                })
                res.json(namesIds)
            } catch (err) {
                console.log(err);
                res.status(400).json({ message: 'GET request error' })
            }
        }];



    //Edit profile of the registered user
    editProfile = [

        //Registration check
        accessForRegistered(),
        //Validation and sanitization of request body fields
        body("email")
            .trim()
            .isLength({ min: 4, max: 40 })
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .isLength({ min: 3 })
            .withMessage("Password must contain at least 3 characters"),
        body("firstName")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("First name is not specified")
            .isAlphanumeric()
            .withMessage("First name contains non-alphanumeric characters"),
        body("lastName")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Last name is not specified")
            .isAlphanumeric()
            .withMessage("Last name contains non-alphanumeric characters"),

        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Update failed", errors })
                }

                const { email, password, firstName, lastName } = req.body;

                //Check if User with this email already exists --- except registered user's email!!!
                const existingUser = await User.findOne({ email });
                const userToken = req.user;
                const currentUser = await User.findById(userToken.id);

                if (existingUser && (existingUser.email !== currentUser.email)) {
                    return res.status(400).json({ message: 'User with this email already exists' });
                }
                else {
                    //Hash a password
                    const saltRounds = 5;
                    const hashPassword = bcrypt.hashSync(password, saltRounds);

                    //Add a role
                    const userRole = await Role.findOne({ value: "user" });

                    //Update User
                    const user = await User.findByIdAndUpdate(userToken.id, { email, password: hashPassword, firstName, lastName, role: [userRole.value] }, { new: true });
                    return res.json({ message: 'Successful update', user });
                }

            } catch (err) {
                console.log(err);
                res.status(400).json({ message: 'Put request error, Update failed' })
            }
        }
    ];



    deleteProfile = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {
                const userToken = req.user;
                const deleteUser = await User.findByIdAndDelete(userToken.id);

                if (!deleteUser) {
                    return res.status(400).json({ message: "User with was not found" })
                }
                else
                    return res.json({ message: "User was deleted", deleteUser })

            } catch (err) {
                console.log(err);
                res.status(400).json({ message: 'Delete request error, process failed' })
            }
        }

    ]

}

const userController = new UserController();

export default userController;