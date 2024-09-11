import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Form, Row, Col, message } from 'antd';
import {
    getPermissionAll,
    addPermission,
    updatePermission,
    deletePermission, deleteSysRolePermissionByPermissionId,
} from "../../../apis/userManagement";

const { Column } = Table;

const PermissionManagement = () => {
    const [dataSource, setDataSource] = useState([]); // 权限数据
    const [visible, setVisible] = useState(false); // 控制新增权限对话框的显示与隐藏
    const [editVisible, setEditVisible] = useState(false); // 控制编辑权限对话框的显示与隐藏
    const [form] = Form.useForm(); // 创建表单实例
    const [editForm] = Form.useForm(); // 创建编辑表单实例
    const [editingPermission, setEditingPermission] = useState(null); // 当前正在编辑的权限

    useEffect(() => {
        getPermissionAllToList();
    }, []);

    const getPermissionAllToList = async () => {
        try {
            const permissions = await getPermissionAll();
            setDataSource(permissions);
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
            message.error("获取权限数据失败");
        }
    };

    const handleAddPermission = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        form.resetFields();
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const newPermission = {
                name: values.permissionName,
                code: values.permissionCode,
                url: values.permissionUrl
            };
            await addPermission(newPermission);
            getPermissionAllToList();
            setVisible(false);
            form.resetFields();
            message.success("权限添加成功");
        } catch (error) {
            console.error("Failed to add permission:", error);
            message.error("添加权限失败");
        }
    };

    const handleEdit = (record) => {
        setEditingPermission(record);
        editForm.setFieldsValue(record);
        setEditVisible(true);
    };

    const handleEditCancel = () => {
        setEditVisible(false);
        editForm.resetFields();
        setEditingPermission(null);
    };

    const handleEditSave = async () => {
        try {
            const values = await editForm.validateFields();
            const updatedPermission = {
                ...editingPermission,
                name: values.name,
                code: values.code,
                url: values.url,
            };
            await updatePermission(updatedPermission);
            getPermissionAllToList();
            setEditVisible(false);
            editForm.resetFields();
            setEditingPermission(null);
            message.success("权限修改成功");
        } catch (error) {
            console.error("Failed to update permission:", error);
            message.error("修改权限失败");
        }
    };

    const handleDelete = async (permissionId) => {
        try {
            await deletePermission(permissionId);
            await deleteSysRolePermissionByPermissionId(permissionId).then(res => {
                console.log(res)
            })
            setDataSource(dataSource.filter(permission => permission.id !== permissionId));
            message.success("权限删除成功");
        } catch (error) {
            console.error("Failed to delete permission:", error);
            message.error("删除权限失败");
        }
    };

    const handleFilter = (value, record, dataIndex) => {
        return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    };

    return (
        <div>
            {/* 新增权限对话框 */}
            <Modal
                title="新增权限"
                visible={visible}
                onCancel={handleCancel}
                onOk={handleSave}
            >
                <Form layout="horizontal" form={form}>
                    <Form.Item
                        label="权限名"
                        name="permissionName"
                        labelCol={{ span: 6 }}
                        rules={[{ required: true, message: '请输入权限名' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="权限代码"
                        name="permissionCode"
                        labelCol={{ span: 6 }}
                        rules={[{ required: true, message: '请输入权限代码' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="权限URL"
                        name="permissionUrl"
                        labelCol={{ span: 6 }}
                        rules={[{ required: true, message: '请输入权限URL' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 编辑权限对话框 */}
            <Modal
                title="编辑权限"
                visible={editVisible}
                onCancel={handleEditCancel}
                onOk={handleEditSave}
            >
                <Form layout="horizontal" form={editForm}>
                    <Form.Item
                        label="权限ID"
                        name="id"
                        labelCol={{ span: 6 }}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="权限名"
                        name="name"
                        labelCol={{ span: 6 }}
                        rules={[{ required: true, message: '请输入权限名' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="权限代码"
                        name="code"
                        labelCol={{ span: 6 }}
                        rules={[{ required: true, message: '请输入权限代码' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="权限URL"
                        name="url"
                        labelCol={{ span: 6 }}
                        rules={[{ required: true, message: '请输入权限URL' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>权限管理</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleAddPermission}>新增权限</Button>
                </Col>
            </Row>

            {/* 权限数据表格 */}
            <Table dataSource={dataSource} rowKey="id">
                <Column title="权限ID" dataIndex="id" key="id"
                        filterDropdown={(filterProps) => (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder={`Search ID`}
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
                <Column title="权限名" dataIndex="name" key="name"
                        filterDropdown={(filterProps) => (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder={`Search Name`}
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
                <Column title="Code" dataIndex="code" key="code"
                        filterDropdown={(filterProps) => (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder={`Search Code`}
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
                        onFilter={(value, record) => handleFilter(value, record, 'code')}
                />
                <Column title="url" dataIndex="url" key="url"
                    // 添加过滤功能
                        filterDropdown={(filterProps) => (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder={`Search url`}
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
                        onFilter={(value, record) => handleFilter(value, record, 'url')}
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

export default PermissionManagement;
