import React, {useState, useEffect, useRef} from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Col, Row } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import {createSource, deletePod, getAllPods} from "../../../apis/k8s";

const { Column } = Table;

const PodManagement = () => {
    const [pods, setPods] = useState([]); // Pod 数据
    const [visible, setVisible] = useState(false); // 控制新增 Pod 对话框的显示与隐藏
    const [yamlContent, setYamlContent] = useState('');
    const [form] = Form.useForm(); // 创建表单实例
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const searchInput = useRef(null);

    useEffect(() => {
        fetchPods();
    }, []);

    const fetchPods = async () => {
        try {
            await getAllPods().then(response => {
                setPods(response)
                console.log(response)
            })
        } catch (error) {
            console.error('Error fetching pods:', error);
            message.error('Failed to fetch pods.');
        }
    };

    const handleAddPod = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        setYamlContent('');
        form.resetFields();
    };

    const handleSave = async () => {
        try {
            const response = await createSource(yamlContent);
            message.success(response.message || 'Resource created successfully.');
            fetchPods();
            handleCancel();
        } catch (error) {
            console.error('Error creating resource:', error);
            message.error(error.response.error || '创建失败，请检查k8s和您的yaml');
        }
    };

    const handleDelete = async (record) => {
        try {
            const podId = record.name;
            const namespace = record.namespace
            const request = {
                pod_id: podId,
                namespace: namespace
            }
            console.log("request body is: ", request)
            await deletePod(request)
            message.success('Pod deleted successfully.');
            fetchPods();
        } catch (error) {
            console.error('Error deleting pod:', error);
            message.error('Failed to delete pod.');
        }
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    ref={searchInput}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜索
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        重置
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>Pod管理</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleAddPod}>yaml 变更 Pod</Button>
                </Col>
            </Row>
            <Table dataSource={pods} rowKey="id">
                <Column title="名称" dataIndex="name" key="name" {...getColumnSearchProps('name')} />
                <Column title="创建时间" dataIndex="age" key="age" {...getColumnSearchProps('age')} />
                <Column title="命名空间" dataIndex="namespace" key="namespace" {...getColumnSearchProps('namespace')} />
                <Column title="状态" dataIndex="status" key="status" {...getColumnSearchProps('status')} />
                <Column title="重启次数" dataIndex="restarts" key="restarts" {...getColumnSearchProps('restarts')} />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button type="danger" onClick={() => handleDelete(record)}>删除</Button>
                        </Space>
                    )}
                />
            </Table>
            <Modal
                title="通过 YAML 创建资源"
                visible={visible}
                onCancel={handleCancel}
                onOk={handleSave}
            >
                <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Form.Item
                        label="YAML 内容"
                        name="yamlContent"
                        rules={[{ required: true, message: '请输入 YAML 内容' }]}
                    >
                        <Input.TextArea
                            value={yamlContent}
                            onChange={(e) => setYamlContent(e.target.value)}
                            rows={10}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PodManagement;
