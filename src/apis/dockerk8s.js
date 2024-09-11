import request from "./indexDocker";

export const getAllContainers = () => request.get("/docker/containers");

export const getAllImages = () => request.get("/docker/images");

export const dockerStart = (containerId) => request.post(`/docker/start/${containerId}`)

export const dockerStop = (containerId) => request.post(`/docker/stop/${containerId}`)

export const dockerReStart = (containerId) => request.post(`/docker/restart/${containerId}`)

export const dockerDelete = (containerId) => request.delete(`/docker/delete/${containerId}`)

export const dockerLog = (containerId) => request.get(`/docker/logs/${containerId}`)

export const imageDelete = (imageId) => request.delete(`/docker/deleteImg/${imageId}`)

export const dockerCreate = (newContainer) => request.post(`docker/create`, newContainer)

export const imageDownload = (imageInfo) => request.post(`/docker/images/download`, imageInfo, { responseType: 'blob' })

export const addImages = (formData) => request.post(`/docker/addImg`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }}
)