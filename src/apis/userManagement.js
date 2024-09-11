import request from './index';


// 用户管理
export const getUserAll = () => request.get('/user/sysUser/all');
export const addUser = (user) => request.post('/user/sysUser/add', user);
export const deleteUser = (id) => request.delete(`/user/sysUser/delete/${id}`);

export const updateUser = (user) => request.put('/user/sysUser/update', user);

// 角色管理
export const getRoleAll = () => request.get('/user/sysRole/all');

export const getRoleById = (id) => request.get(`/user/sysRole/getRolesById/${id}`);

export const getRoleByName = (name) => request.get(`/user/sysRole/getRolesByName/${name}`);


export const addRole = (role) => request.post('/user/sysRole/add', role);

export const deleteRole = (id) => request.delete(`/user/sysRole/delete/${id}`);

export const updateRole = (role) => request.put('/user/sysRole/update', role);

// 权限管理
export const getPermissionAll = () => request.get('/user/sysPermission/all');

export const getPermissionById = (id) => request.get(`/user/sysPermission/getPermissionById/${id}`);

export const getPermissionByName = (name) => request.get(`/user/sysPermission/getPermissionByName/${name}`);
export const addPermission = (permission) => request.post('/user/sysPermission/add', permission);
export const deletePermission = (id) => request.delete(`/user/sysPermission/delete/${id}`);
export const updatePermission = (permission) => request.put('/user/sysPermission/update', permission);

// 角色权限管理
export const createSysRolePermission = (sysRolePermission) => request.post('/user/sysRolePermission/add', sysRolePermission);
export const getSysRolePermissionById = (id) => request.get(`/user/sysRolePermission/find/${id}`);

export const getSysRolePermissionsByRoleId = (roleId) => request.get(`/user/sysRolePermission/role/${roleId}`);
export const updateSysRolePermission = (id, sysRolePermission) => request.put(`/user/sysRolePermission/update/${id}`, sysRolePermission);
export const deleteSysRolePermission = (id) => request.delete(`/user/sysRolePermission/remove/${id}`);

export const deleteSysRolePermissionByRoleId = (id) => request.delete(`/user/sysRolePermission/removeByRole/${id}`);

export const deleteSysRolePermissionByPermissionId = (id) => request.delete(`/user/sysRolePermission/removeByPermission/${id}`);

// 用户角色管理
export const createSysUserRole = (sysUserRole) => request.post('/user/sysUserRole', sysUserRole);

export const getSysUserRoleById = (id) => request.get(`/user/sysUserRole/find/${id}`);

export const getSysUserRolesByUserId = (userId) => request.get(`/user/sysUserRole/user/${userId}`);
export const updateSysUserRole = (id, sysUserRole) => request.put(`/user/sysUserRole/add/${id}`, sysUserRole);

export const deleteSysUserRole = (id) => request.delete(`/user/sysUserRole/remove/${id}`);

export const deleteSysUserRoleByUserId = (id) => request.delete(`/user/sysUserRole/removeByUser/${id}`);

export const deleteSysUserRoleByRoleId = (id) => request.delete(`/user/sysUserRole/removeByRole/${id}`);