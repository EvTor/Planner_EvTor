import {fetchData} from "./fetchData";

class GroupService {
    static createNewGroup = async (reqBody) => {
        const url = "/groups";
        const requestMethod = "POST";
        const needAccess = true;
        try {
            const {message} = await fetchData(url, requestMethod, reqBody, needAccess);
            console.log({message});
            return `${message}`
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static showMyGroups = async () => {
        const url = "/groups";
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
    static showCertainGroup = async (id) => {
        const url = `/groups/${id}`;
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
    static updateCertainGroup = async (id, reqBody) => {
        const url = `/groups/${id}`;
        const requestMethod = "PUT";
        const needAccess = true;
        try {
            const {message} = await fetchData(url, requestMethod, reqBody, needAccess);
            console.log({message});
            return `${message}`
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static acceptGroup = async (id) => {
        const url = `/groups/accept/${id}`;
        const requestMethod = "PUT";
        const reqBody = false;
        const needAccess = true;
        try {
            const {message} = await fetchData(url, requestMethod, reqBody, needAccess);
            console.log({message});
            return `${message}`
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static rejectGroup = async (id) => {
        const url = `/groups/reject/${id}`;
        const requestMethod = "PUT";
        const reqBody = false;
        const needAccess = true;
        try {
            const {message} = await fetchData(url, requestMethod, reqBody, needAccess);
            console.log({message});
            return `${message}`
        } catch (err) {
            console.log(err)
            throw err
        }
    };
    static deleteGroup = async (id) => {
        const url = `/groups/${id}`;
        const requestMethod = "DELETE";
        const reqBody = false;
        const needAccess = true;
        try {
            const {message} = await fetchData(url, requestMethod, reqBody, needAccess);
            console.log({message});
            return `${message}`
        } catch (err) {
            console.log(err)
            throw err
        }
    };
}

export default GroupService;
