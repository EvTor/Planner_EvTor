import {API_URL} from "./config";
import UserService from "./UserService";
//Interceptor on response => if Authorization token is expired => update using Refresh token
export const authInterceptor = async (response, URL, requestOptions) => {
    if (response.status === 401) {
            const data = await fetch(`${API_URL}/refresh`,
                {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include"
                })
            try {
            if (!data.ok){
                await UserService.logout();
                window.location.reload();
                throw new Error('User is not authorised')
            }
            const response = await data.json();
            if (!response.tokens.accessToken){
                await UserService.logout();
                throw new Error('User is not authorised')
            }
            localStorage.setItem("token_Planner_EvTor", `Bearer ${response.tokens.accessToken}`);
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