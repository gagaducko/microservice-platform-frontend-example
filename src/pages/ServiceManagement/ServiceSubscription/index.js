import React, { useState, useEffect, useRef } from 'react';
import {Table, Input, Button, Space, Form, message, Col, Row} from 'antd';
import Highlighter from 'react-highlight-words';
import Column from "antd/es/table/Column";
import {SearchOutlined} from "@ant-design/icons";
import webUrls from "../../../config/configUrls";
import {subscriberConfig} from "../../../apis/nacosOpenAPI";

const ServiceSubscription = () => {
    const nacosUrl = webUrls.nacos
    const [subscriptions, setSubscriptions] = useState(); // 订阅数据
    const [searchText, setSearchText] = useState(''); // 表格筛选的文本
    const [searchedColumn, setSearchedColumn] = useState(''); // 表格筛选的列

    const inputSearch = useRef(null); // 使用 useRef 创建 inputSearch 引用

    const fetchSubscriptions = async (serviceName, groupName, pageNo, pageSize) => {
        try {
            subscriberConfig(serviceName, groupName, pageNo, pageSize).then(response => {
                console.log(response)
                setSubscriptions(response.subscribers)
                if(response.subscribers.length === 0) {
                    message.info("抱歉，该微服务无订阅者，请确认服务及分组")
                }
            })
        } catch (error) {
            message.error('未找到对应服务订阅者消息');
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleButtonClick = () => {
        window.open(nacosUrl, '_blank');
    };

    useEffect(() => {
        // 初始的订阅者信息
        message.info("请输入服务及对应分组，以查询订阅者")
        // fetchSubscriptions('gateway','DEFAULT_GROUP', 1, 10);
    }, []);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex, placeholder) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={inputSearch}
                    placeholder={`Search ${placeholder}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => (record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : ''),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => inputSearch.current.select(), 100);
            }
        },
        render: (text) =>
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

    const handleQuery = () => {
        // 查询逻辑，可以根据服务名称和分组名称进行过滤
        const serviceName = document.getElementById('serviceName').value;
        const groupName = document.getElementById('groupName').value;
        console.log('查询服务名称:', serviceName, '分组名称:', groupName)
        fetchSubscriptions(serviceName, groupName, 1, 100).then(res => {
            console.log("查询结果如下：", res)
        });
    };

    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>服务订阅</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleButtonClick}>Nacos页面</Button>
                </Col>
            </Row>
            <Form layout="inline" style={{ marginBottom: '20px' }}>
                <Form.Item label="服务名称" style={{ marginRight: '10px' }}>
                    <Input id="serviceName" placeholder="请输入服务名称" />
                </Form.Item>
                <Form.Item label="分组名称" style={{ marginRight: '10px' }}>
                    <Input id="groupName" placeholder="请输入分组名称" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleQuery}>查询</Button>
                </Form.Item>
            </Form>
            <Table dataSource={subscriptions} rowKey="key">
                <Column
                    title="服务名称"
                    dataIndex="serviceName"
                    key="serviceName"
                    {...getColumnSearchProps('serviceName', '服务名称')}
                />
                <Column
                    title="地址"
                    dataIndex="addrStr"
                    key="addrStr"
                    {...getColumnSearchProps('addrStr', '地址')}
                />
                <Column
                    title="客户端版本"
                    dataIndex="agent"
                    key="agent"
                    {...getColumnSearchProps('agent', '客户端版本')}
                />
                <Column
                    title="应用名"
                    dataIndex="app"
                    key="app"
                    {...getColumnSearchProps('app', '应用名')}
                />
            </Table>
        </div>
    );
};

export default ServiceSubscription;