import React, {useState, useEffect, useRef} from 'react';
import {Table, Input, Button, Modal, Form, Col, Row, message} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {createToken, deleteToken, getTokenAll, updateToken, verifyToken} from "../../../apis/tokens";

const TokenManagement = () => {
    const [tokens, setTokens] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isCheckModalVisible, setIsCheckModalVisible] = useState(false);
    const [checkTokenValue, setCheckTokenValue] = useState('');
    const [currentToken, setCurrentToken] = useState({});
    const [newToken, setNewToken] = useState({ name: '', content: '' });
    const [editTokenName, setEditTokenName] = useState('');

    const searchInput = useRef(null); // 使用 useRef 创建 inputSearch 引用

    const fetchTokens = async () => {
        try {
            const response = await getTokenAll();
            const newTokens = Object.keys(response).map(key => ({
                key,
                name: key,
                content: response[key],
            }));
            setTokens(newTokens);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTokens();
    }, []);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput.current = node;
                    }}
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
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
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
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

    const handleCreateOk = async () => {
        try {
            await createToken(newToken)
            fetchTokens();
            setIsCreateModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (name) => {
        try {
            await deleteToken(name);
            fetchTokens();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateChange = (field, e) => {
        const { value } = e.target;
        setNewToken({ ...newToken, [field]: value });
    };

    const showEditModal = (token) => {
        setCurrentToken(token);
        setEditTokenName(token.name);
        setIsEditModalVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const { name: oldName } = currentToken;
            const newName = editTokenName;
            if (oldName !== newName) {
                await updateToken(oldName, newName)
                fetchTokens();
            }
            setIsEditModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };

    const checkToken = async (token) => {
        try {
            const response = await verifyToken(token);
            if (response) {
                console.log(response)
                message.info("Token有效，内容如下：" + response)
            } else {
                message.error("令牌无效")
            }
        } catch (error) {
            console.error(error);
            message.info("令牌校验失败")
        }
    };

    // 在模态框的OK按钮事件中调用checkToken函数
    const handleCheckOk = async () => {
        await checkToken(checkTokenValue);
        setIsCheckModalVisible(false);
    };

    const columns = [
        {
            title: 'token名',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'token',
            dataIndex: 'content',
            key: 'content',
            width: 400, // 限制宽度
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="link" onClick={() => showEditModal(record)}>编辑名称</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.name)}>删除</Button>
                    <Button type="link" onClick={() => copyContent(record.content)}>复制</Button>
                </span>
            ),
        },
    ];

    const copyContent = (content) => {
        const tempInput = document.createElement('input');
        tempInput.value = content;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    };

    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>令牌管理</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: 16, marginRight: 5 }}>
                        创建token
                    </Button>
                    <Button type="primary" onClick={() => setIsCheckModalVisible(true)} style={{ marginBottom: 16}}>
                        校验token
                    </Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={tokens} />
            <Modal
                title="更新Token"
                visible={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={() => setIsEditModalVisible(false)}
            >
                <Input value={editTokenName} onChange={(e) => setEditTokenName(e.target.value)} />
            </Modal>
            <Modal
                title="创建Token"
                visible={isCreateModalVisible}
                onOk={handleCreateOk}
                onCancel={() => setIsCreateModalVisible(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="token名">
                        <Input value={newToken.name} onChange={(e) => handleCreateChange('name', e)} />
                    </Form.Item>
                    <Form.Item label="token内容">
                        <Input value={newToken.content} onChange={(e) => handleCreateChange('content', e)} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="校验Token"
                visible={isCheckModalVisible}
                onOk={handleCheckOk}
                onCancel={() => setIsCheckModalVisible(false)}
            >
                <Input
                    placeholder="请输入要校验的token"
                    value={checkTokenValue}
                    onChange={(e) => setCheckTokenValue(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default TokenManagement;
