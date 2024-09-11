import React, {useEffect, useRef, useState} from 'react';
import {Button, Table, message, Popconfirm, Modal, Input, Col, Row} from 'antd';
import {changeKeyInfo, checkKeyValid, deleteKeyInfo, generateKeyApi, getAllKeys} from "../../../apis/key";
import {SearchOutlined} from "@ant-design/icons";

const KeyManagement = () => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedKey, setSelectedKey] = useState('');
    const [newKey, setNewKey] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const searchInput = useRef(null); // 使用 useRef 创建 inputSearch 引用

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

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

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        setLoading(true);
        try {
            const response = await getAllKeys();
            console.log("response is:", response)
            setKeys(response);
        } catch (error) {
            message.error('获取密钥失败');
        } finally {
            setLoading(false);
        }
    };

    const generateKey = async () => {
        try {
            await generateKeyApi();
            message.success('密钥生成成功');
            fetchKeys();
        } catch (error) {
            message.error('生成密钥失败');
        }
    };

    const validateKey = async (key) => {
        try {
            const response = await checkKeyValid(key);
            if (response) {
                message.success('密钥在系统中，有效');
            } else {
                message.error('密钥无效');
            }
        } catch (error) {
            message.error('校验密钥失败');
        }
    };

    const modifyKey = async () => {
        try {
            await changeKeyInfo(selectedKey);
            message.success('密钥修改成功');
            fetchKeys();
            setIsModalVisible(false);
        } catch (error) {
            message.error('修改密钥失败');
        }
    };

    const deleteKey = async (key) => {
        try {
            await deleteKeyInfo(key)
            message.success('密钥删除成功');
            fetchKeys();
        } catch (error) {
            message.error('删除密钥失败');
        }
    };

    const columns = [
        {
            title: '密钥',
            dataIndex: 'key',
            key: 'key',
            ...getColumnSearchProps('key'),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="link" onClick={() => validateKey(record.key)}>校验</Button>
                    <Button type="link" onClick={() => { setSelectedKey(record.key); setIsModalVisible(true); }}>修改</Button>
                    <Popconfirm title="确定删除吗?" onConfirm={() => deleteKey(record.key)}>
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        <div>
            <Row justify="space-between" style={{marginBottom: '10px'}}>
                <Col span={12}>
                    <h2 style={{fontWeight: 'bold', fontSize: '20px'}}>密钥管理</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={generateKey} style={{marginBottom: '20px'}}>生成密钥</Button>
                </Col>
            </Row>

            <Table columns={columns} dataSource={keys.map(key => ({key}))} loading={loading} rowKey="key"/>
            <Modal
                title="修改密钥"
                visible={isModalVisible}
                onOk={modifyKey}
                onCancel={() => setIsModalVisible(false)}
            >
                <Input value={selectedKey} disabled/>
                <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="请输入新密钥"/>
            </Modal>
        </div>
    );
};

export default KeyManagement;
