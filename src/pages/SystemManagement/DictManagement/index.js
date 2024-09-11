import React, { useState, useEffect, useRef } from 'react';
import { Table, Modal, Form, Input, Button, message, Col, Row } from 'antd';
import { getAllDict, addDict, modifyDict, deleteDict } from '../../../apis/dict';
import { SearchOutlined } from "@ant-design/icons";

const { Column } = Table;

const DictionaryPage = () => {
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isAddMode, setIsAddMode] = useState(true);
    const [formData, setFormData] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const formRef = useRef(null);
    const searchInputs = useRef({});

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (modalVisible && formRef.current) {
            formRef.current.setFieldsValue(formData);
        }
    }, [formData, modalVisible]);

    const fetchData = async () => {
        try {
            const response = await getAllDict();
            setData(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAdd = async (values) => {
        try {
            await addDict(values);
            message.success('添加成功');
            fetchData();
            formRef.current.resetFields();
            setModalVisible(false);
        } catch (error) {
            message.error('添加失败');
            console.error('Error adding dict:', error);
        }
    };

    const handleModify = async (record) => {
        console.log("record is:", record)
        await setFormData(record);
        showModalVisible()
        // setModalVisible(true);
        // setIsAddMode(false);
    };

    const showModalVisible = () => {
        setModalVisible(true);
        setIsAddMode(false);
    }

    const handleModifySubmit = async (values) => {
        try {
            await modifyDict(values);
            message.success('修改成功');
            fetchData();
            formRef.current.resetFields();
            setModalVisible(false);
        } catch (error) {
            message.error('修改失败');
            console.error('Error modifying dict:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDict(id);
            message.success('删除成功');
            fetchData();
        } catch (error) {
            message.error('删除失败');
            console.error('Error deleting dict:', error);
        }
    };

    const showAddModal = () => {
        setModalVisible(true);
        setIsAddMode(true);
        setFormData({});
    };

    const handleCancel = () => {
        setModalVisible(false);
        setIsAddMode(true);
        setFormData({});
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => { searchInputs.current[dataIndex] = node; }}
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    搜索
                </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInputs.current[dataIndex].select(), 100);
            }
        },
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>字典管理</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
                        添加字典项
                    </Button>
                </Col>
            </Row>
            <Table dataSource={data} rowKey="id">
                <Column title="ID" dataIndex="id" key="id" {...getColumnSearchProps('id')} />
                <Column title="字典Key" dataIndex="code" key="code" {...getColumnSearchProps('code')} />
                <Column title="字典Value" dataIndex="content" key="content" {...getColumnSearchProps('content')} />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record) => (
                        <span>
                            <Button type="primary" onClick={() => handleModify(record)}>修改</Button>
                            <Button onClick={() => handleDelete(record.id)} style={{ marginLeft: 8 }}>
                                删除
                            </Button>
                        </span>
                    )}
                />
            </Table>

            <Modal
                title={isAddMode ? "添加字典项" : "修改字典项"}
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    ref={formRef}
                    onFinish={isAddMode ? handleAdd : handleModifySubmit}
                    initialValues={formData}
                >
                    {!isAddMode && (
                        <Form.Item label="ID" name="id">
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="字典 Key"
                        name="code"
                        rules={[{ required: true, message: '请输入Key' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="字典Value"
                        name="content"
                        rules={[{ required: true, message: '请输入Value' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DictionaryPage;
