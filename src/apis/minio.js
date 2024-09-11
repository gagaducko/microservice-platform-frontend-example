import request from './index';

// 文件管理相关APIs
export const getAllBuckets = () => request.get("/minio/bucket/allBucket");

export const addBucket = (newBucket) => request.post('/minio/bucket/makeBucket?bucketName='+newBucket,null);

export const fetchFile = (bucket) => request.get(`/minio/file/listAll?bucketName=${bucket}`);

export const downloadFile = (bucket,file) => request.get(`/minio/file/download?bucketName=${bucket}&fileName=${file}`, {
    responseType: 'blob'
});

export const uploadFile = (uploadRequest) => request.post('/minio/file/upload', uploadRequest);

export const deleteFile = (deleteRequest) => request.post('/minio/file/delete', deleteRequest);

export const previewFile = (bucket,file) => request.get(`/minio/file/preview?bucketName=${bucket}&fileName=${file}`);