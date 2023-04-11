import jwt from "jsonwebtoken";
import { secret } from "../config.js";

const accessForRole = (roles) => {
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

            const { role: userRoles } = jwt.verify(token, secret.key);
            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res.status(403).json({ message: "You do not have an access" })
            }
            next();
        } catch (err) {
            console.log(err);
            return res.status(403).json({ message: "Access error" });
        }
    };
};
export { accessForRole };