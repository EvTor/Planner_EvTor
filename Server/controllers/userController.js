import User from "../database/models/userModel.js";
import Role from "../database/models/roleModel.js"
import {body, validationResult} from "express-validator";
import bcrypt from "bcryptjs";
import {v4 as uuidv4} from 'uuid';
import {accessForRegistered} from "../middleware/accessForRegistered.js";
import {accessForRole} from "../middleware/accessForRole.js";
import mailService from "../service/mailService.js";
import tokenService from "../service/tokenService.js";

class UserController {
    //Registration of a new user
    registration = [
        //Validation and sanitization of request body fields
        body("email")
            .trim()
            .isLength({min: 4, max: 40})
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .isLength({min: 3})
            .withMessage("Password must contain at least 3 characters"),
        body("firstName")
            .trim()
            .isLength({min: 1})
            .escape()
            .withMessage("First name is not specified")
            .isAlphanumeric()
            .withMessage("First name contains non-alphanumeric characters"),
        body("lastName")
            .trim()
            .isLength({min: 1})
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
                    return res.status(400).json({error: "Registration failed", errors})
                }
                const {email, password, firstName, lastName, role} = req.body;
                //Check if User with this email already exists
                const existingUser = await User.findOne({email})
                if (existingUser) {
                    return res.status(400).json({error: 'User with this email already exists'});
                }
                //Hash a password
                const saltRounds = 5;
                const hashPassword = bcrypt.hashSync(password, saltRounds);
                //Add a role
                let userRole = {value: "user"};
                if (role && (role !== "user")) {
                    userRole = await Role.findOne({value: role});
                }
                //Send activation link
                const activationLink = uuidv4();
                await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
                //Create new User
                const user = new User({
                    email,
                    password: hashPassword,
                    firstName,
                    lastName,
                    role: userRole.value,
                    activationLink
                });
                await User.create(user);
                return res.json({message: 'Successful registration', user});
            } catch (err) {
                console.log(err);
                res.status(400).json({error: 'Registration error'})
            }
        }
    ];
    activate = [
        async (req, res) => {
            try {
                const activationLink = req.params.link;
                const user = await User.findOne({activationLink});
                if (!user) {
                    return res.status(400).json({error: 'User was not found'});
                }
                user.isActivated = true;
                await user.save();
                return res.redirect(process.env.CLIENT_URL)
            } catch (err) {
                console.log(err);
                res.status(400).json({error: 'Activation error'})
            }
        }];
    //login of Registered user 
    login = [
        //Validation and sanitization of request body fields
        body("email")
            .trim()
            .isLength({min: 4, max: 40})
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .isLength({min: 3})
            .withMessage("Password must contain at least 3 characters"),
        //Request process after validation
        async (req, res) => {
            try {
                //Find and show validation errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({error: "Wrong email or password format", errors})
                }
                const {email, password} = req.body;
                //Check if User with this email exists
                const user = await User.findOne({email});
                if (!user) {
                    return res.status(400).json({error: `User with email ${email} was not found`})
                }
                //Compare password with valid hashed password using bcrypt
                const validPassword = bcrypt.compareSync(password, user.password);
                if (!validPassword) {
                    return res.status(400).json({error: "Wrong password"})
                }
                //Generate jwt token and save refresh Token in DB
                const tokens = tokenService.generateTokens(user._id, user.role, user.isActivated);
                const refreshTokenDB = await tokenService.saveTokenToDB(user._id, tokens.refreshToken);
                res.cookie('refreshToken', refreshTokenDB, {maxAge: 1000, httpOnly: true});
                return res.json({tokens, user, message: "Successful login!"});
            } catch (err) {
                console.log(err);
                res.status(400).json({error: 'Login error'})
            }

        }
    ];
    //Logout
    logout = [
        async (req, res) => {
            try {
                const {refreshToken} = req.cookies;
                res.clearCookie('refreshToken');
                await tokenService.removeToken(refreshToken);
                return res.json({message: 'Successful logout'});
            } catch (err) {
                console.log(err);
                res.status(400).json({error: 'Logout error'})
            }
        }];
    //Refresh token
    refresh = [
        async (req, res) => {
            try {
                if(!req.cookies.refreshToken){
                    throw 'User not logged in1'
                }
                const refresh = req.cookies.refreshToken;
                const refreshToken = refresh.refreshToken;
                const userData = tokenService.validateRefreshToken(refreshToken);
                const tokenFromDB = await tokenService.findTokenInDb(refreshToken);
                if (!userData || !tokenFromDB) {
                    throw 'User not logged in2'
                }

                const user = await User.findById(userData._id);
                //Generate jwt token and save refresh Token in DB
                const tokens = tokenService.generateTokens(
                    user._id,
                    user.role,
                    user.isActivated);
                const refreshTokenDB = await tokenService.saveTokenToDB(user._id, tokens.refreshToken);
                res.cookie('refreshToken', refreshTokenDB, {maxAge: 1000, httpOnly: true});
                return res.json({
                    "tokens": tokens,
                    user: {_id: user._id, role: user.role, isActivated: user.isActivated}
                });
            } catch (err) {
                console.log(err);
                res.status(401).json({error: 'User not logged in3'})
            }
        }
    ];
    showUserProfileData = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {
                const userToken = req.user;
                const userData = await User.findById(userToken._id);
                if (!userData) {
                    return res.status(400).json({error: "User data was not found"});
                }
                return res.json(userData);
            } catch (err) {
                console.log(err);
                res.status(400).json({error: 'Get request error, process failed'})
            }
        }
    ];
    showUserById = [
        //Registration check
        accessForRegistered(),
        //Access only for admin
        accessForRole(["admin"]),
        async (req, res) => {
            try {
                const userData = await User.findById(req.params.id);
                if (!userData) {
                    return res.status(400).json({error: "User data was not found"});
                }
                return res.json(userData);
            } catch (err) {
                console.log(err);
                res.status(400).json({error: 'Get request error, process failed'})
            }
        }
    ];

    //GET all registered users
    getUsers = [
        //Registration check
        accessForRegistered(),
        //Access only for admin
        accessForRole(["admin"]),
        async (req, res) => {
            try {
                const userList = await User.find();
                res.json(userList)
            } catch (err) {
                console.log(err);
                res.status(400).json({error: 'GET request error'})
            }
        }];
    //Get ids, emails and names of registered users
    getUsersNames = [
        //Access for registered users
        accessForRegistered(),
        async (req, res) => {
            try {
                const userList = await User.find();
                const namesIds = userList.map((user) => {
                    return {
                        "id": user.id,
                        "email": user.email,
                        "firstName": user.firstName,
                        "lastName": user.lastName
                    }
                })
                res.json(namesIds)
            } catch (err) {
                console.log(err);
                res.status(400).json({error: 'GET request error'})
            }
        }];
    //Edit profile of the registered user
    editProfile = [
        //Registration check
        accessForRegistered(),
        //Validation and sanitization of request body fields
        body("email")
            .trim()
            .isLength({min: 4, max: 40})
            .isEmail()
            .withMessage("Email is not valid"),
        body("password")
            .isLength({min: 3})
            .withMessage("Password must contain at least 3 characters"),
        body("firstName")
            .trim()
            .isLength({min: 1})
            .escape()
            .withMessage("First name is not specified")
            .isAlphanumeric()
            .withMessage("First name contains non-alphanumeric characters"),
        body("lastName")
            .trim()
            .isLength({min: 1})
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
                    return res.status(400).json({message: "Update failed", errors})
                }
                const {email, password, firstName, lastName, role} = req.body;
                //Check if User with this email already exists --- except registered user's email!!!
                const existingUser = await User.findOne({email});
                const userToken = req.user;
                const currentUser = await User.findById(userToken._id);
                if (existingUser && (existingUser.email !== currentUser.email) && (currentUser.role !== 'admin')) {
                    return res.status(400).json({error: 'User with this email already exists / You do not have an access '})
                }
                //Hash a password
                const saltRounds = 5;
                const hashPassword = bcrypt.hashSync(password, saltRounds);

                //Add a role
                let userRole = {value: "user"};
                if (role && (role !== "user") && (currentUser.role !== 'admin')) {
                    userRole = await Role.findOne({value: role});
                }
                //Update User
                const user = await User.findByIdAndUpdate(userToken._id, {
                        email,
                        password: hashPassword,
                        firstName,
                        lastName,
                        role: userRole.value
                    },
                    {new: true});
                return res.json({message: 'Successful update', user});
            } catch (err) {
                console.log(err);
                res.status(400).json({error: 'Put request error, Update failed'})
            }
        }
    ];
    deleteProfile = [
        //Registration check
        accessForRegistered(),
        async (req, res) => {
            try {
                const userToken = req.user;
                const user = await User.findById(req.params.id);
                if (!user) {
                    return res.status(400).json({error: "User was not found"})
                }
                if ((user._id !== userToken._id) && (userToken.role !== "admin")) {
                    return res.status(403).json({error: "You do not have an access"})
                }
                return res.json({message: "User was deleted", user})
            } catch (err) {
                console.log(err);
                res.status(400).json({error: 'Delete request error, process failed'})
            }
        }
    ]
}

const userController = new UserController();

export default userController;