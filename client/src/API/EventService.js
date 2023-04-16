import { fetchData } from "./fetchData";

class EventService {

    static createNewEvent = async (reqBody) => {
        const url = "/events";
        const requestMethod = "POST";
        const needAccess = true;
        const { message, usersSharedId, errors } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!usersSharedId) {
            if (errors) {
                const errorsArray = errors.errors.map(error => error.msg);
                return (`${message} because: ${errorsArray}`)
            } else return message
        }
        else { return message };
    };


    static showMyEvents = async () => {
        const url = "/events";
        const requestMethod = "GET";
        const reqBody = false;
        const needAccess = true;
        const data = await fetchData(url, requestMethod, reqBody, needAccess);
        if (data.message) {
            return data.message
        }
        return data;
    };

    static showCertainEvent = async (id) => {
        const url = `/events/${id}`;
        const requestMethod = "GET";
        const reqBody = false;
        const needAccess = true;
        const data = await fetchData(url, requestMethod, reqBody, needAccess);
        if (data.message) {
            return data.message
        }
        return data;
    };

    static updateCertainEvent = async (id, reqBody) => {
        const url = `/events/${id}`;
        const requestMethod = "PUT";
        const needAccess = true;
        const { message, usersSharedId, errors } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!usersSharedId) {
            if (errors) {
                const errorsArray = errors.errors.map(error => error.msg);
                return (`${message} because: ${errorsArray}`)
            } else return message
        }
        else { return message };
    };

    static acceptEvent = async (id) => {
        const url = `/events/accept/${id}`;
        const requestMethod = "PUT";
        const reqBody = false;
        const needAccess = true;
        const { message, user } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!user) {
            return message
        }
        else { return { message, user } };
    };

    static rejectEvent = async (id) => {
        const url = `/events/reject/${id}`;
        const requestMethod = "PUT";
        const reqBody = false;
        const needAccess = true;
        const { message, user } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!user) {
            return message
        }
        else { return message };
    };

    static deleteEvent = async (id) => {
        const url = `/events/${id}`;
        const requestMethod = "DELETE";
        const reqBody = false;
        const needAccess = true;
        const { message, eventDelete } = await fetchData(url, requestMethod, reqBody, needAccess);
        if (!eventDelete) {
            return message
        }
        else { return message };
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

export default EventService;
