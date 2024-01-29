import axios, { type AxiosResponse } from "axios";

interface HttpParams {
    method: string,
    body: string,
    headers: Record<string, string>
}

export async function httpClient(url: string, params: HttpParams, async: boolean = false):Promise<AxiosResponse> {
    if(undefined === params.headers.Authorization) {
        const token = getToken();
        params.headers.Authorization = `Bearer ${token}`;
    }
    if(async) {
        return syncHttpRequest(url, params.method, params.body, params.headers);
    }
    return await asyncHttpRequest(url, params.method, params.body, params.headers);
}

function getToken():string {
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InZpZGVvLWZhY3RvcnlAZnJhbmNldHYuZnIiLCJyb2xlcyI6eyJ2aWRlb2ZhY3RvcnktbWVkaWEiOlsiYWRtaW4iXSwidmlkZW9mYWN0b3J5LW1ldGFzIjpbImFkbWluIl0sInZpZGVvZmFjdG9yeS1hdXRoIjpbImFkbWluIl0sInZpZGVvZmFjdG9yeS13b3JrZXJzIjpbImFkbWluIl0sInZpZGVvZmFjdG9yeS1nYXRld2F5IjpbImFkbWluIl0sInZpZGVvZmFjdG9yeS1yaWdodHMiOlsiYWRtaW4iXX0sImV4cCI6MTcwNjUyNjA1M30.S9WbTnkcud8FfhOoikJfwe3Whk9xEA2k2tzQWept-FI';
}

async function syncHttpRequest(apiUrl: string, method: string, data: string, headers: Record<string, string>):Promise<AxiosResponse> {
    try {
        switch (method.toLowerCase()) {
            case 'get':
                return await axios.get(apiUrl, {headers});
            case 'post':
                return await axios.post(apiUrl, data, {headers});
            case 'put':
                return await axios.put(apiUrl, data, {headers});
            case 'patch':
                return await axios.patch(apiUrl, data, {headers});
            case 'delete':
                return await axios.delete(apiUrl, {headers});
            default:
                throw new Error(`Unsupported method: ${method}`);
        }
    } catch (error){
        console.error(error)
        throw error;
    }
}

function asyncHttpRequest(apiUrl: string, method: string, data: string, headers: Record<string, string>):Promise<AxiosResponse> {
    try {
        switch (method.toLowerCase()) {
            case 'get':
                return axios.get(apiUrl, {headers});
            case 'post':
                return axios.post(apiUrl, data, {headers});
            case 'put':
                return axios.put(apiUrl, data, {headers});
            case 'patch':
                return axios.patch(apiUrl, data, {headers});
            case 'delete':
                return axios.delete(apiUrl, {headers});
            default:
                throw new Error(`Unsupported method: ${method}`);
        }
    } catch (error){
        console.error(error)
        throw error;
    }
}

