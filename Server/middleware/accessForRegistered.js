import tokenService from "../service/tokenService.js";

const accessForRegistered = () => {
    return (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            //Token -> headers.authorization (without type - bearer)
            const accessToken = req.headers.authorization.split(' ')[1];
            if (!accessToken) {
                return res.status(401).json({error: "User not logged in"});
            }
            //Validate token
            const userData = tokenService.validateAccessToken(accessToken);
            if (!userData) {
                return res.status(401).json({error: "User not logged in"});
            }
            req.user = userData;
            next();
        } catch (err) {
            console.log(err);
            return res.status(401).json({error: "User not logged in"})
        }
    };
};
export {accessForRegistered};