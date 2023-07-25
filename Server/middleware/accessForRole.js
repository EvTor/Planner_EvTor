import tokenService from "../service/tokenService.js";

const accessForRole = (roles) => {
    return (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            //Token -> headers.authorization (without type - bearer)
            const accessToken = req.headers.authorization.split(' ')[1];
            if (!accessToken) {
                return res.status(403).json({error: "User not logged in"});
            }

            //Validate token
            const userData = tokenService.validateAccessToken(accessToken);
            if (!userData) {
                return res.status(403).json({error: "User not logged in"});
            }
            let hasRole = false;
            if (roles.includes(userData.role)) {
                hasRole = true;
            }
            if (!hasRole) {
                return res.status(403).json({error: "You do not have an access"})
            }
            next();
        } catch (err) {
            console.log(err);
            return res.status(403).json({error: "Access error"});
        }
    };
};
export {accessForRole};