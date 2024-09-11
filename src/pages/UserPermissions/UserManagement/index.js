import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Form, Row, Col, Tag, message } from 'antd';
import {
    getUserAll,
    addUser,
    deleteUser,
    getRoleById,
    deleteSysUserRoleByUserId,
    updateUser, getRoleByName
} from "../../../apis/userManagement";
import { getSysUserRolesByUserId, createSysUserRole, deleteSysUserRole } from "../../../apis/userManagement";

const { Column } = Table;

const UserManagement = () => {
    const [dataSource, setDataSource] = useState([]); // 用户数据
    const [visible, setVisible] = useState(false); // 控制新增用户对话框的显示与隐藏
    const [editVisible, setEditVisible] = useState(false); // 控制编辑用户对话框的显示与隐藏
    const [newUser, setNewUser] = useState({}); // 新增用户的数据
    const [editUser, setEditUser] = useState({}); // 编辑用户的数据
    const [inputRole, setInputRole] = useState(''); // 输入的角色
    const [userRoles, setUserRoles] = useState([]); // 用户选择的角色
    const [editUserRoles, setEditUserRoles] = useState([]); // 编辑用户的角色

    useEffect(() => {
        getUserInfoAll();
    }, []);

    // 获取所有的用户信息
    const getUserInfoAll = async () => {
        try {
            const users = await getUserAll();
            const usersWithRoles = await Promise.all(users.map(async user => {
                const rolesId = await getSysUserRolesByUserId(user.id);
                const roles = [];
                for (const roleUId of rolesId) {
                    const role = await getRoleById(roleUId.roleId);
                    roles.push(role);
                }
                return { ...user, roles: roles.map(role => role.name) };
            }));
            setDataSource(usersWithRoles);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            message.error("获取用户数据失败");
        }
    };

    const handleAddUser = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        setInputRole('');
        setUserRoles([]);
        setNewUser({});
    };

    const handleEditCancel = () => {
        setEditVisible(false);
        setInputRole('');
        setEditUserRoles([]);
        setEditUser({});
    };

    const handleSave = async () => {
        try {
            const user = await addUser(newUser);
            for (const role of userRoles) {
                await createSysUserRole({ userId: user.id, roleId: role.id });
            }
            await getUserInfoAll();
            handleCancel();
            message.success("用户添加成功");
        } catch (error) {
            console.error("Failed to add user:", error);
            message.error("添加用户失败");
        }
    };

    const handleEditSave = async () => {
        try {
            await updateUser(editUser);
            await deleteSysUserRoleByUserId(editUser.id);
            for (const role of editUserRoles) {
                await createSysUserRole({ userId: editUser.id, roleId: role.id });
            }
            await getUserInfoAll();
            handleEditCancel();
            message.success("用户更新成功");
        } catch (error) {
            console.error("Failed to update user:", error);
            message.error("更新用户失败");
        }
    };

    const handleInputChange = (e, field) => {
        setNewUser({ ...newUser, [field]: e.target.value });
    };

    const handleEditInputChange = (e, field) => {
        setEditUser({ ...editUser, [field]: e.target.value });
    };

    const handleRoleInputChange = e => {
        setInputRole(e.target.value);
    };

    const handleEditRoleInputChange = e => {
        setInputRole(e.target.value);
    };

    // role input确认
    const handleRoleInputConfirm = async () => {
        if (inputRole && !userRoles.some(role => role.name === inputRole)) {
            try {
                // 通过id获取角色
                // const role = await getRoleById(inputRole);
                // 通过name获取name
                const role = await getRoleByName(inputRole);
                if (role) {
                    setUserRoles([...userRoles, role]);
                } else {
                    message.error("角色不存在");
                }
            } catch (error) {
                console.error("Failed to fetch role:", error);
                message.error("获取角色失败");
            }
        }
        setInputRole('');
    };

    const handleEditRoleInputConfirm = async () => {
        if (inputRole && !editUserRoles.some(role => role.name === inputRole)) {
            try {
                // const role = await getRoleById(inputRole);
                const role = await getRoleByName(inputRole);
                if (role) {
                    setEditUserRoles([...editUserRoles, role]);
                } else {
                    message.error("角色不存在");
                }
            } catch (error) {
                console.error("Failed to fetch role:", error);
                message.error("获取角色失败");
            }
        }
        setInputRole('');
    };

    const handleRoleClose = removedRole => {
        setUserRoles(userRoles.filter(role => role.name !== removedRole));
    };

    const handleEditRoleClose = removedRole => {
        setEditUserRoles(editUserRoles.filter(role => role.name !== removedRole));
    };

    const handleEdit = async (record) => {
        try {
            const rolesId = await getSysUserRolesByUserId(record.id);
            const roles = [];
            for (const roleUId of rolesId) {
                const role = await getRoleById(roleUId.roleId);
                roles.push(role);
            }
            setEditUserRoles(roles);
            setEditUser(record);
            setEditVisible(true);
        } catch (error) {
            console.error("Failed to fetch user roles:", error);
            message.error("获取用户角色失败");
        }
    };

    const handleDelete = async userId => {
        try {
            await deleteUser(userId);
            await deleteSysUserRoleByUserId(userId); // 删除用户角色关联
            setDataSource(dataSource.filter(user => user.id !== userId));
            message.success("用户删除成功");
        } catch (error) {
            console.error("Failed to delete user:", error);
            message.error("删除用户失败");
        }
    };

    const handleFilter = (value, record, dataIndex) => {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    };

    return (
        <div>
            <Modal
                title="新增用户"
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
                <Form layout="horizontal">
                    <Form.Item label="用户名" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input value={newUser.username} onChange={(e) => handleInputChange(e, 'username')} />
                    </Form.Item>
                    <Form.Item label="用户昵称" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入昵称' }]}>
                        <Input value={newUser.nickName} onChange={(e) => handleInputChange(e, 'nickName')} />
                    </Form.Item>
                    <Form.Item label="电子邮箱" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入邮箱' }]}>
                        <Input value={newUser.email} onChange={(e) => handleInputChange(e, 'email')} />
                    </Form.Item>
                    <Form.Item label="电话号码" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入电话号码' }]}>
                        <Input value={newUser.mobile} onChange={(e) => handleInputChange(e, 'mobile')} />
                    </Form.Item>
                    <Form.Item label="密码" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password value={newUser.password} onChange={(e) => handleInputChange(e, 'password')} />
                    </Form.Item>
                    <Form.Item label="角色" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入用户角色' }]}>
                        <div>
                            {userRoles.map(role => (
                                <Tag key={role.name} closable onClose={() => handleRoleClose(role.name)}>
                                    {role.name.toUpperCase()}
                                </Tag>
                            ))}
                            <Input
                                type="text"
                                value={inputRole}
                                onChange={handleRoleInputChange}
                                onPressEnter={handleRoleInputConfirm}
                                onBlur={handleRoleInputConfirm}
                            />
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="编辑用户"
                visible={editVisible}
                onCancel={handleEditCancel}
                footer={[
                    <Button key="cancel" onClick={handleEditCancel}>
                        取消
                    </Button>,
                    <Button key="save" type="primary" onClick={handleEditSave}>
                        保存
                    </Button>,
                ]}
            >
                <br />
                <Form layout="horizontal">
                    <Form.Item label="用户名" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input value={editUser.username} onChange={(e) => handleEditInputChange(e, 'username')} />
                    </Form.Item>
                    <Form.Item label="用户昵称" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入昵称' }]}>
                        <Input value={editUser.nickName} onChange={(e) => handleEditInputChange(e, 'nickName')} />
                    </Form.Item>
                    <Form.Item label="电子邮箱" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入邮箱' }]}>
                        <Input value={editUser.email} onChange={(e) => handleEditInputChange(e, 'email')} />
                    </Form.Item>
                    <Form.Item label="电话号码" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入电话号码' }]}>
                        <Input value={editUser.mobile} onChange={(e) => handleEditInputChange(e, 'mobile')} />
                    </Form.Item>
                    <Form.Item label="角色" labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入用户角色' }]}>
                        <div>
                            {editUserRoles.map(role => (
                                <Tag key={role.name} closable onClose={() => handleEditRoleClose(role.name)}>
                                    {role.name.toUpperCase()}
                                </Tag>
                            ))}
                            <Input
                                type="text"
                                value={inputRole}
                                onChange={handleEditRoleInputChange}
                                onPressEnter={handleEditRoleInputConfirm}
                                onBlur={handleEditRoleInputConfirm}
                            />
                        </div>
                    </Form.Item>
                </Form>
            </Modal>

            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>用户管理</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleAddUser}>新增用户</Button>
                </Col>
            </Row>

            <Table dataSource={dataSource} rowKey="id">
                <Column title="用户id" dataIndex="id" key="id"
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
                <Column title="用户名" dataIndex="username" key="username"
                        filterDropdown={(filterProps) => (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder={`Search Username`}
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
                        onFilter={(value, record) => handleFilter(value, record, 'username')}
                />
                <Column title="用户昵称" dataIndex="nickName" key="nickName"
                        filterDropdown={(filterProps) => (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder={`Search Nickname`}
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
                        onFilter={(value, record) => handleFilter(value, record, 'nickName')}
                />
                <Column title="电子邮件" dataIndex="email" key="email"
                        filterDropdown={(filterProps) => (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder={`Search Email`}
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
                        onFilter={(value, record) => handleFilter(value, record, 'email')}
                />
                <Column title="电话号码" dataIndex="mobile" key="mobile"
                        filterDropdown={(filterProps) => (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder={`Search Phone`}
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
                        onFilter={(value, record) => handleFilter(value, record, 'mobile')}
                />
                <Column title="角色" dataIndex="roles" key="roles" render={roles => (
                    <>
                        {roles.map(role => (
                            <Tag key={role}>{role.toUpperCase()}</Tag>
                        ))}
                    </>
                )}/>
                <Column title="操作" key="action" render={(text, record) => (
                    <Space size="middle">
                        <Button type="primary" onClick={() => handleEdit(record)}>编辑</Button>
                        <Button type="danger" onClick={() => handleDelete(record.id)}>删除</Button>
                    </Space>
                )}/>
            </Table>
        </div>
    );
};

export default UserManagement;
