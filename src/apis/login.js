import request from './index';

export const loginAuth = (username, password) => request.post('/auth/oauth/token', {
    grant_type: "password",
    username: username,
    password: password,
    scope: "all",
    client_id: "client_id",
    client_secret: "client_password"
}, {headers: {
    "Content-Type": "application/x-www-form-urlencoded"
}});


export const testMenu = (menuPath, token) => request.get('/menu' +  menuPath);