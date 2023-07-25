import jwt from "jsonwebtoken";
import tokenModel from "../database/models/tokenModel.js";

class TokenService{
//Generation of the access token
    generateTokens = (_id, role, isActivated) => {
        const payload = {
            _id,
            role,
            isActivated
        }
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30s'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    };

    saveTokenToDB = async (userId, refreshToken)=>{
        const tokenData = await tokenModel.findOne({user:userId})
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({user:userId, refreshToken})
        return token;
    };
    removeToken = async (refreshToken)=>{
    const tokenData = await tokenModel.deleteOne({refreshToken});
    return tokenData;
    };
    
    validateAccessToken=(token) =>{
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }
        catch (e) {
            return null;
        }
    };

    validateRefreshToken=(token) =>{
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;

        }
        catch (e) {
            return null;
        }
    };
    findTokenInDb = async (refreshToken)=>{
        const tokenData = await tokenModel.findOne(refreshToken._id);
        return tokenData;
    };

}
const tokenService = new TokenService();
export default tokenService;