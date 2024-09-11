import request from "./index";

let token = localStorage.getItem('access_token');

// export const getAllPods = () => request.get("/deploy/k8s/pods", {headers: {
//     "Authorization": "GaGaDuck: " + token
// }});
//
// export const getAllDeployments = () => request.get("/deploy/k8s/deployments", {headers: {
//     "Authorization": "GaGaDuck: " + token
// }});
//
//
// export const createSource = (yamlContent) => request.post('/deploy/k8s/create', yamlContent, {
//     headers: {
//         'Content-Type': 'application/yaml',
//         "Authorization": "GaGaDuck: " + token
//     },
// });
//
// export const deletePod = (requestBody) => request.post(`/deploy/k8s/deletePod`, requestBody, {headers: {
//     "Authorization": "GaGaDuck: " + token
// }});
//
// export const deleteDeployment = (requestBody) => request.post(`/deploy/k8s/deleteDeployment`, requestBody, {headers: {
//     "Authorization": "GaGaDuck: " + token
// }});


export const getAllPods = () => request.get("/k8s/pods");

export const getAllDeployments = () => request.get("/k8s/deployments");

export const createSource = (yamlContent) => request.post('/k8s/create', yamlContent)

export const deletePod = (requestBody) => request.post(`/k8s/deletePod`, requestBody)

export const deleteDeployment = (requestBody) => request.post(`/k8s/deleteDeployment`, requestBody)