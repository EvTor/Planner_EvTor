
import { fetchData } from "./fetchData";

class UserService {

    static registration = async (reqBody) => {
        const url = "/registration";
        const requestMethod = "POST";

        const { message, user, errors } = await fetchData(url, requestMethod, reqBody);
        if (!user) {
            if (errors) {
                const errorsArray = errors.errors.map(error => error.msg);
                return (`${message} because: ${errorsArray}`)
            } else return message
        }
        else { return (`${message}, ${user.firstName} ${user.lastName}!`) };
    };

    static login = async (reqBody) => {
        const url = "/login";
        const requestMethod = "POST";
        const { message, token, errors } = await fetchData(url, requestMethod, reqBody);
        if (!token) {
            if (errors) {
                const errorsArray = errors.errors.map(error => error.msg);
                return (`${message} because: ${errorsArray}`)
            } else return message
        }
        else {
            localStorage.setItem("token", `Bearer ${token}`);
            return ("Successful login!")
        }
    };

    static logout = () => {
        localStorage.removeItem("token")
    };

    static showUserData = async () => {
        const url = "/user/profile";
        const requestMethod = "GET";
        const reqBody = false;
        const needAccess = true;
        const data = await fetchData(url, requestMethod, reqBody, needAccess);
        if (data.message) {
            return data.message
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
            return data.message
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
                const errorsArray = errors.errors.map(error => error.msg);
                return (`${message} because: ${errorsArray}`)
            } else return message
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
            return message
        }
        return { message, deleteUser };
    }

}

export default UserService;
