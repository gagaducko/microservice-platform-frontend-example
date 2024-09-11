import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Form, Row, Col, Tag, message } from 'antd';
import {
    getRoleAll,
    addRole,
    deleteRole,
    getPermissionById,
    getSysRolePermissionsByRoleId,
    updateRole, createSysRolePermission, deleteSysRolePermissionByRoleId, getPermissionByName, deleteSysUserRoleByRoleId
} from "../../../apis/userManagement";

const { Column } = Table;

const RoleManagement = () => {
    const [dataSource, setDataSource] = useState([]); // 角色数据
    const [visible, setVisible] = useState(false); // 控制新增角色对话框的显示与隐藏
    const [editingRole, setEditingRole] = useState(null); // 当前编辑的角色
    const [roleName, setRoleName] = useState(''); // 角色名
    const [permissions, setPermissions] = useState([]); // 权限列表
    const [newPermission, setNewPermission] = useState(''); // 新权限输入
    const [form] = Form.useForm(); // 创建表单实例

    useEffect(() => {
        getRoleAllToList();
    }, []);

    const getRoleAllToList = async () => {
        try {
            const roles = await getRoleAll();
            const rolesWithPermissions = await Promise.all(roles.map(async role => {
                const permissionRolesAll = await getSysRolePermissionsByRoleId(role.id);
                const permissions = [];
                for (const permissionRole of permissionRolesAll) {
                    const permission = await getPermissionById(permissionRole.permissionId);
                    permissions.push(permission);
                }
                return { ...role, permissions: permissions.map(permission => permission.name)}
            }));
            setDataSource(rolesWithPermissions);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
            message.error("获取角色数据失败");
        }
    };

    const handleAddRole = () => {
        setEditingRole(null);
        setRoleName('');
        setPermissions([]);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const roleData = {
                name: values.roleName,
            };
            if (editingRole) {
                // 更新角色
                await updateRole({ ...editingRole, ...roleData });
                await updateRolePermissions(editingRole.id, permissions, 2);
                message.success("角色更新成功");
            } else {
                // 添加新角色
                const newRole = await addRole(roleData);
                await updateRolePermissions(newRole.id, permissions, 1);
                message.success("角色添加成功");
            }

            getRoleAllToList();
            setVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Failed to save role:", error);
            message.error(editingRole ? "更新角色失败" : "添加角色失败");
        }
    };

    const updateRolePermissions = async (roleId, permissions, type) => {
        try {
            console.log("permissions", permissions)
            console.log("roleId", roleId)
            console.log("type", type)
            if(type !== 1) {
                console.log("get roleId and permission delete");
                await deleteSysRolePermissionByRoleId(roleId);
            }
            console.log("bad !")
            for (const permission of permissions) {
                const permissionData = await getPermissionByName(permission);
                await createSysRolePermission({
                    roleId,
                    permissionId: permissionData.id
                });
            }
        } catch (error) {
            console.error("Failed to update role permissions:", error);
            message.error("更新角色权限失败");
        }
    };

    const handleEdit = async (record) => {
        try {
            const permissionsData = await getSysRolePermissionsByRoleId(record.id);
            const permissions = await Promise.all(permissionsData.map(async permissionRole => {
                const permission = await getPermissionById(permissionRole.permissionId);
                return permission.name;
            }));
            setEditingRole(record);
            form.setFieldsValue({ roleName: record.name });
            setPermissions(permissions);
            setVisible(true);
        } catch (error) {
            console.error("Failed to fetch role data:", error);
            message.error("获取角色数据失败");
        }
    };

    const handleDelete = async (roleId) => {
        try {
            await deleteRole(roleId);
            await deleteSysRolePermissionByRoleId(roleId)
            await deleteSysUserRoleByRoleId(roleId)
            setDataSource(dataSource.filter(role => role.id !== roleId));
            message.success("角色删除成功");
        } catch (error) {
            console.error("Failed to delete role:", error);
            message.error("删除角色失败");
        }
    };

    const handlePermissionInputChange = (e) => {
        setNewPermission(e.target.value);
    };

    const handlePermissionInputConfirm = async () => {
        if (newPermission && !permissions.includes(newPermission)) {
            try {
                // 通过id获取权限
                // const permission = await getPermissionById(newPermission);
                // 通过name获得权限
                const permission = await getPermissionByName(newPermission);
                if (permission) {
                    setPermissions([...permissions, permission.name]);
                } else {
                    message.error("权限不存在");
                }
            } catch (error) {
                console.error("Failed to fetch permission:", error);
                message.error("获取权限失败");
            }
        }
        setNewPermission('');
    };

    const handlePermissionDelete = (permission) => {
        setPermissions(permissions.filter(item => item !== permission));
    };

    const handleFilter = (value, record, dataIndex) => {
        if (dataIndex === 'name') {
            return record[dataIndex].toLowerCase().includes(value.toLowerCase());
        }
        else if (dataIndex === 'id') {
            return record[dataIndex].toString().includes(value.toString());
        } else if (dataIndex === 'permissions') {
            return record[dataIndex].some(permission => permission.toLowerCase().includes(value.toLowerCase()));
        }
    };

    return (
        <div>
            <Modal
                title={editingRole ? "编辑角色" : "新增角色"}
                visible={visible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSave}>
                        保存
                    </Button>,
                ]}
            >
                <br />
                <Form layout="horizontal" form={form}>
                    <Form.Item
                        label="角色名"
                        name="roleName"
                        labelCol={{ span: 3 }}
                        rules={[{ required: true, message: '请输入角色名' }]}
                    >
                        <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="权限" name="permissions" labelCol={{ span: 3 }}>
                        <Input
                            type="text"
                            value={newPermission}
                            onChange={handlePermissionInputChange}
                            onBlur={handlePermissionInputConfirm}
                            onPressEnter={handlePermissionInputConfirm}
                            placeholder="输入权限，按Enter确认"
                        />
                        <Space direction="horizontal" wrap>
                            {permissions.map(permission => (
                                <Tag
                                    closable
                                    onClose={() => handlePermissionDelete(permission)}
                                    key={permission}
                                >
                                    {permission}
                                </Tag>
                            ))}
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px'}}>角色管理</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleAddRole}>新增角色</Button>
                </Col>
            </Row>
            <Table dataSource={dataSource} rowKey="id">
                <Column title="角色id" dataIndex="id" key="id"
                        filterDropdown={(filterProps) => (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder={`搜索id`}
                                    value={filterProps.selectedKeys[0]}
                                    onChange={e => filterProps.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                    onPressEnter={() => filterProps.confirm()}
                                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                                />
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={() => filterProps.confirm()}
                                        size="small"
                                        style={{ width: 90 }}
                                    >
                                        确定
                                    </Button>
                                    <Button
                                        onClick={() => filterProps.clearFilters()}
                                        size="small"
                                        style={{ width: 90 }}
                                    >
                                        重置
                                    </Button>
                                </Space>
                            </div>
                        )}
                        onFilter={(value, record) => handleFilter(value, record, 'id')}
                />
                <Column title="角色名" dataIndex="name" key="name"
                        filterDropdown={(filterProps) => (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder={`搜索角色`}
                                    value={filterProps.selectedKeys[0]}
                                    onChange={e => filterProps.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                    onPressEnter={() => filterProps.confirm()}
                                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                                />
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={() => filterProps.confirm()}
                                        size="small"
                                        style={{ width: 90 }}
                                    >
                                        确定
                                    </Button>
                                    <Button
                                        onClick={() => filterProps.clearFilters()}
                                        size="small"
                                        style={{ width: 90 }}
                                    >
                                        重置
                                    </Button>
                                </Space>
                            </div>
                        )}
                        onFilter={(value, record) => handleFilter(value, record, 'name')}
                />
                <Column
                    title="权限"
                    dataIndex="permissions"
                    key="permissions"
                    render={permissions => (
                        <span>
                            {permissions.map(permission => (
                                <Tag key={permission}>
                                    {permission}
                                </Tag>
                            ))}
                        </span>
                    )}
                    filterDropdown={(filterProps) => (
                        <div style={{ padding: 8 }}>
                            <Input
                                placeholder={`搜索权限`}
                                value={filterProps.selectedKeys[0]}
                                onChange={e => filterProps.setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => filterProps.confirm()}
                                style={{ width: 188, marginBottom: 8, display: 'block' }}
                            />
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => filterProps.confirm()}
                                    size="small"
                                    style={{ width: 90 }}
                                >
                                    确定
                                </Button>
                                <Button
                                    onClick={() => filterProps.clearFilters()}
                                    size="small"
                                    style={{ width: 90 }}
                                >
                                    重置
                                </Button>
                            </Space>
                        </div>
                    )}
                    onFilter={(value, record) => handleFilter(value, record, 'permissions')}
                />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button type="primary" onClick={() => handleEdit(record)}>修改</Button>
                            <Button type="danger" onClick={() => handleDelete(record.id)}>删除</Button>
                        </Space>
                    )}
                />
            </Table>
        </div>
    );
};

export default RoleManagement;
