import { API_URL } from "./config"

export const fetchData = async (url, requestMethod, reqBody = false, needAccess = false) => {
    const URL = `${API_URL}${url}`;

    const headers = () => {
        if (!needAccess) {
            return ({ "Content-Type": "application/json" })
        };
        const token = localStorage.getItem("token_Planner_EvTor");
        return {
            "Content-Type": "application/json",
            "Authorization": token
        };
    };

    const requestOptions = () => {
        if (!reqBody) {
            return {
                method: requestMethod,
                headers: headers(),
            }
        }
        return {
            method: requestMethod,
            headers: headers(),
            body: JSON.stringify(reqBody)
        }
    }

    return fetch(URL, requestOptions())
        .then((response) => {
            return response.json();
        })
        .catch((err) => { throw err });

};