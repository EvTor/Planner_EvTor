import {API_URL} from "./config";
import {authInterceptor} from "./AuthInterceptor";

export const fetchData = async (
    url,
    requestMethod,
    reqBody,
    needAccess) => {
    const URL = `${API_URL}${url}`;
    //Interceptor on request => add Authorization token
    const token = localStorage.getItem("token_Planner_EvTor");
    let headers = {
        "Content-Type": "application/json"
    };
    if (needAccess) {
        headers["Authorization"] = token
    }
    let requestOptions = {
        headers,
        method: requestMethod,
        credentials: 'include',
    };
    if (reqBody) {
        requestOptions["body"] = JSON.stringify(reqBody)
    }
    const res = await fetch(URL, requestOptions)
        .then((res) => {
            return authInterceptor(res, URL, requestOptions)
        })
        .then((response) => {
            return response.json();
        })
        .catch((err) => {
            throw err
        });
    //Show errors described on back-end
    if (res.error) {
        if (res.errors) {
            throw `${res.error} because: ${res.errors.errors.map(error => error.msg)}`
        } else throw res.error
    }
    return res;
};