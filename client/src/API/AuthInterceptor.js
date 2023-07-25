import {API_URL} from "./config";
//Interceptor on response => if Authorization token is expired => update using Refresh token
export const authInterceptor = async (response, URL, requestOptions) => {
    if (response.status === 401) {
        try {
            const data = await fetch(`${API_URL}/refresh`,
                {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include"
                })
                .then(res => {
                    return res.json();
                });
            localStorage.setItem("token_Planner_EvTor", `Bearer ${data.tokens.accessToken}`);
            requestOptions.headers.Authorization = localStorage.getItem("token_Planner_EvTor");
            const nextResponse = await fetch(URL, requestOptions);
            //  Check if the second response is not status 401
            if (nextResponse.status === 401) {
                throw new Error('User is not authorised');
            }
            return nextResponse;
        } catch
            (err) {
            throw err
        }
    }
    return response
}