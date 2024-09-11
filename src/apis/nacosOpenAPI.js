import request from './index';

export const getServiceAll = () => request.get("/service/discovery/services");

export const subscriberConfig = (serviceName, groupName, pageNo, pageSize) => request.get(`/service/discovery/subscriber?serviceName=${serviceName}&groupName=${groupName}&pageNo=${pageNo}&pageSize=${pageSize}`);

export const viewDetailConfig = (dataId, group) => request.get(`/config/config/get?dataId=${dataId}&group=${group}`);

export const getListConfig = () => request.get("/config/config/list");

export const deleteConfig = (dataId) => request.delete(`/config/config/delete?dataId=${dataId}`);

export const updateConfigFunc = (updateConfig) => request.post(`/config/config/update`, updateConfig);

export const createConfigFunc = (createConfig) => request.post(`/config/config/create`, createConfig);

export const getHistoryConfigs = (dataId, group) => request.get(`/config/config/historyOverall?dataId=${dataId}&group=${group}`);

export const getHistoryConfigDetails = (dataId, group, nid) => request.get(`/config/config/history?dataId=${dataId}&group=${group}&nid=${nid}`);