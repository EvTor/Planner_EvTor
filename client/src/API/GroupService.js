import { fetchData } from "./fetchData";

class GroupService {

    static createNewGroup = async (reqBody) => {
        const url = "/groups";
        const requestMethod = "POST";
        const needAccess = true;
        const { message, usersSharedId, errors } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!usersSharedId) {
            if (errors) {
                throw new Error(`${message} because: ${errors.errors.map(error => error.msg)}`)
            } else throw new Error(message)
        }
        else { return message };
    };


    static showMyGroups = async () => {
        const url = "/groups";
        const requestMethod = "GET";
        const reqBody = false;
        const needAccess = true;
        const data = await fetchData(url, requestMethod, reqBody, needAccess);
        if (data.message) {
            throw new Error(data.message)
        }
        return data;
    };

    static showCertainGroup = async (id) => {
        const url = `/groups/${id}`;
        const requestMethod = "GET";
        const reqBody = false;
        const needAccess = true;
        const data = await fetchData(url, requestMethod, reqBody, needAccess);
        if (data.message) {
            throw new Error(data.message)
        }
        return data;
    };

    static updateCertainGroup = async (id, reqBody) => {
        const url = `/groups/${id}`;
        const requestMethod = "PUT";
        const needAccess = true;
        const { message, usersSharedId, errors } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!usersSharedId) {
            if (errors) {
                throw new Error(`${message} because: ${errors.errors.map(error => error.msg)}`)
            } else throw new Error(message)
        }
        else { return message };
    };

    static acceptGroup = async (id) => {
        const url = `/groups/accept/${id}`;
        const requestMethod = "PUT";
        const reqBody = false;
        const needAccess = true;
        const { message, user } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!user) {
            throw new Error(message)
        }
        else { return { message, user } };
    };

    static rejectGroup = async (id) => {
        const url = `/groups/reject/${id}`;
        const requestMethod = "PUT";
        const reqBody = false;
        const needAccess = true;
        const { message, user } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!user) {
            throw new Error(message)
        }
        else { return message };
    };

    static deleteGroup = async (id) => {
        const url = `/groups/${id}`;
        const requestMethod = "DELETE";
        const reqBody = false;
        const needAccess = true;
        const { message, groupDelete } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!groupDelete) {
            throw new Error(message)
        }
        else { return message };
    };
}

export default GroupService;
