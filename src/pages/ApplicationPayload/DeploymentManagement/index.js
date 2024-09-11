import React, {useState, useEffect, useRef} from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Col, Row } from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {createSource, deleteDeployment, getAllDeployments} from "../../../apis/k8s";

const { Column } = Table;

const DeploymentManagement = () => {
    const [deployments, setDeployments] = useState([]); // Deployment 数据
    const [visible, setVisible] = useState(false); // 控制新增 Deployment 对话框的显示与隐藏
    const [deploymentName, setDeploymentName] = useState(''); // 新 Deployment 名称
    const [replicas, setReplicas] = useState(1); // 副本数
    const [form] = Form.useForm(); // 创建表单实例
    const [yamlContent, setYamlContent] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const searchInput = useRef(null);

    useEffect(() => {
        fetchDeployments();
    }, []);

    const fetchDeployments = async () => {
        try {
            await getAllDeployments().then(response => {
                setDeployments(response)
            })
        } catch (error) {
            console.error('Error fetching deployments:', error);
            message.error('Failed to fetch deployments.');
        }
    };

    const handleAddDeployment = () => {
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
            fetchDeployments();
            handleCancel();
        } catch (error) {
            console.error('Error creating resource:', error);
            message.error(error.response.error || '创建失败，请检查k8s和您的yaml');
        }
    };

    const handleDelete = async (record) => {
        try {
            const deploymentId = record.name;
            const namespace = record.namespace
            const request = {
                deployment_id: deploymentId,
                namespace: namespace
            }
            console.log("request body is: ", request)
            await deleteDeployment(request)
            message.success('删除deployment成功');
            fetchDeployments();
        } catch (error) {
            console.error('Error deleting deployment:', error);
            message.error('删除deployment失败');
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
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>Deployment管理</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleAddDeployment}>yaml 变更 Deployment</Button>
                </Col>
            </Row>
            <Table dataSource={deployments} rowKey="id">
                <Column title="名称" dataIndex="name" key="name" {...getColumnSearchProps('name')}/>
                <Column title="创建时间" dataIndex="age" key="age" {...getColumnSearchProps('age')}/>
                <Column title="命名空间" dataIndex="namespace" key="namespace" {...getColumnSearchProps('namespace')}/>
                <Column title="可用副本数" dataIndex="available" key="available" {...getColumnSearchProps('available')}/>
                <Column title="就绪副本数" dataIndex="ready" key="ready" {...getColumnSearchProps('ready')}/>
                <Column title="更新到最新副本数" dataIndex="up_to_date" key="up_to_date" {...getColumnSearchProps('up_to_date')}/>
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

export default DeploymentManagement;
