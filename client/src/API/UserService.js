
import { fetchData } from "./fetchData";

class UserService {

    static registration = async (reqBody) => {
        const url = "/registration";
        const requestMethod = "POST";

        const { message, user, errors } = await fetchData(url, requestMethod, reqBody);
        if (!user) {
            if (errors) {
                throw new Error(`${message} because: ${errors.errors.map(error => error.msg)}`)
            } else throw new Error(message)
        }
        else { return (`${message}, ${user.firstName} ${user.lastName}!`) };
    };

    static login = async (reqBody) => {
        const url = "/login";
        const requestMethod = "POST";
        const { message, token, errors } = await fetchData(url, requestMethod, reqBody);
        if (!token) {
            if (errors) {
                throw new Error(`${message} because: ${errors.errors.map(error => error.msg)}`)
            } else throw new Error(message)
        }
        else {
            localStorage.setItem("token_Planner_EvTor", `Bearer ${token}`);
            return ("Successful login!")
        }
    };

    static logout = () => {
        localStorage.removeItem("token_Planner_EvTor")
    };

    static showUserData = async () => {
        const url = "/user/profile";
        const requestMethod = "GET";
        const reqBody = false;
        const needAccess = true;
        const data = await fetchData(url, requestMethod, reqBody, needAccess);
        if (data.message) {
            throw new Error(data.message)
        }
        return data;
    };

    static getUsersNames = async () => {
        const url = "/users/names";
        const requestMethod = "GET";
        const reqBody = false;
        const needAccess = true;
        const data = await fetchData(url, requestMethod, reqBody, needAccess);
        if (data.message) {
            throw new Error(data.message)
        }
        return data;
    };

    static editProfile = async (reqBody) => {
        const url = "/user/put";
        const requestMethod = "PUT";
        const needAccess = true;
        const { message, user, errors } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!user) {
            if (errors) {
                throw new Error(`${message} because: ${errors.errors.map(error => error.msg)}`)
            } else throw new Error(message)
        }
        else { return (`${message}, ${user.firstName} ${user.lastName}!`) };
    };

    static deleteProfile = async () => {
        const url = "/user/delete";
        const requestMethod = "DELETE";
        const reqBody = false;
        const needAccess = true;
        const { message, deleteUser } = await fetchData(url, requestMethod, reqBody, needAccess);
        this.logout();
        if (!deleteUser) {
            throw new Error(message)
        }
        return { message, deleteUser };
    }

}

export default UserService;
