import jwt from "jsonwebtoken";
import { secret } from "../config.js";

const accessForRegistered = () => {
    return (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            //Token -> headers.authorization (without type - bearer)
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                console.log(err);
                return res.status(403).json({ message: "User not logged in" })
            }
            //Data with id and role of the user
            const decodedTokenData = jwt.verify(token, secret.key);
            req.user = decodedTokenData;
            next();
        } catch (err) {
            console.log(err);
            return res.status(403).json({ message: "User not logged in" })
        }
    };
};
export { accessForRegistered };