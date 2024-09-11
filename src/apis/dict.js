import request from "./index";

// 字典管理相关apis
export const getAllDict = () =>request.get("/system/dict/allDict");

export const addDict = (dictItem) => request.post("/system/dict/addDict",dictItem);

export const modifyDict= (dictItem) => request.post("/system/dict/modifyDict",dictItem);

export const deleteDict = (id) => request.delete(`/system/dict/deleteDict?id=${id}`);