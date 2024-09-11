import request from './index';

export const getTokenAll = () => request.get("/system/tokens/get");


export const createToken = (newToken) => request.post(`/system/tokens/create`, null, {
    params: newToken
})

export const deleteToken = (name) => request.delete(`/system/tokens/delete`, {
    params: { name }
})

export const updateToken = (oldName, newName) => request.put(`/system/tokens/update`, null, {
    params: { oldName, newName }
})

export const verifyToken = (tokenNeedVerify) => request.get(`/system/tokens/verify/${tokenNeedVerify}`);