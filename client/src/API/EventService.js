import {fetchData} from "./fetchData";

class EventService {
    static createNewEvent = async (reqBody) => {
        const url = "/events";
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
    static showMyEvents = async () => {
        const url = "/events";
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
    static showNotAcceptedEvents = async () => {
        const url = "/eventsNotAccepted";
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
    static showCertainEvent = async (id) => {
        const url = `/events/${id}`;
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
    static updateCertainEvent = async (id, reqBody) => {
        const url = `/events/${id}`;
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
    static acceptEvent = async (id) => {
        const url = `/events/accept/${id}`;
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
    static rejectEvent = async (id) => {
        const url = `/events/reject/${id}`;
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
    static deleteEvent = async (id) => {
        const url = `/events/${id}`;
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

export default EventService;
