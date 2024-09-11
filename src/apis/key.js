import request from './index';

// 文件管理相关APIs
export const getAllKeys = () => request.get(`/system/keys/get`);

export const generateKeyApi = () => request.post(`/system/keys/generate`,null);

export const checkKeyValid = (key) => request.get(`/system/keys/validate/${key}`);

export const changeKeyInfo = (selectedKey) => request.put(`/system/keys/modify/${selectedKey}`,null);

export const deleteKeyInfo = (key) => request.delete(`/system/keys/delete/${key}`);