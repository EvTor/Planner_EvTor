import {fetchData} from "./fetchData";

class UserService {
    static registration = async (reqBody) => {
        const url = "/registration";
        const requestMethod = "POST";
        try {
            return await fetchData(url, requestMethod, reqBody);
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static login = async (reqBody) => {
        const url = "/login";
        const requestMethod = "POST";
        try {
            const {tokens, user} = await fetchData(url, requestMethod, reqBody);
            localStorage.setItem("token_Planner_EvTor", `Bearer ${tokens.accessToken}`);
            console.log({tokens, user});
            return ({tokens, user})
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static logout = async () => {
        const url = "/logout";
        const requestMethod = "POST";
        const reqBody = false;
        const needAccess = true;
        try {
            const data = await fetchData(url, requestMethod, reqBody, needAccess);
            localStorage.removeItem("token_Planner_EvTor");
            return data;
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static showUserProfileData = async () => {
        const url = "/user/profile";
        const requestMethod = "GET";
        const reqBody = false;
        const needAccess = true;
        try {
            return await fetchData(url, requestMethod, reqBody, needAccess);
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static showUserById = async (id) => {
        const url = `/user/${id}`;
        const requestMethod = "GET";
        const reqBody = false;
        const needAccess = true;
        try {
            return await fetchData(url, requestMethod, reqBody, needAccess);
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static getUsersNames = async () => {
        const url = "/users/names";
        const requestMethod = "GET";
        const reqBody = false;
        const needAccess = true;
        try {
            return await fetchData(url, requestMethod, reqBody, needAccess);
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static editProfile = async (id, reqBody) => {
        const url = `/user/put/${id}`;
        const requestMethod = "PUT";
        const needAccess = true;
        try {
            const {message, user} = await fetchData(url, requestMethod, reqBody, needAccess);
            return (`${message}, ${user.firstName} ${user.lastName}!`);
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static deleteProfile = async (id) => {
        const url = `/user/delete/${id}`;
        const requestMethod = "DELETE";
        const reqBody = false;
        const needAccess = true;
        try {
            const {message, user} = await fetchData(url, requestMethod, reqBody, needAccess);
            await this.logout();
            return {message, user};
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}

export default UserService;
