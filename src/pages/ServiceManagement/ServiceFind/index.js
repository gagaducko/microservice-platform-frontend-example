import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Col, Row, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import webUrls from "../../../config/configUrls";
import {SearchOutlined} from "@ant-design/icons";
import {getServiceAll} from "../../../apis/nacosOpenAPI";

const { Column } = Table;
const { Option } = Select;

const ServiceFind = () => {

    const nacosUrl = webUrls.nacos

    const [services, setServices] = useState([]); // 服务数据
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    useEffect(() => {
        fetchServiceAll();
    }, []);

    const fetchServiceAll = async () => {
        try {
            await getServiceAll().then(response => {
                console.log("nacos res:", response)
                // 假设API返回的数据结构如你所述
                setServices(response.serviceList.map((service, index) => ({
                    id: index, // 生成一个唯一的id
                    serviceName: service.name,
                    groupName: service.groupName,
                    clusterCount: service.clusterCount,
                    instanceCount: service.ipCount, // 根据API结构调整字段名
                    healthyInstanceCount: service.healthyInstanceCount,
                    triggerThreshold: service.triggerFlag // 根据API结构调整字段名
                })));
            })
        } catch (error) {
            message.error('加载服务数据失败')
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText('');
    };

    const handleButtonClick = () => {
        window.open(nacosUrl, '_blank');
    };

    const getColumnSearchProps = (dataIndex, placeholder) => ({
            filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
                <div style={{padding: 8}}>
                    <Input
                        placeholder={placeholder}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{width: 188, marginBottom: 8, display: 'block'}}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined/>}
                            size="small"
                            style={{width: 90}}
                        >
                            搜索
                        </Button>
                        <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                            重置
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
            onFilter: (value, record) =>
                record[dataIndex]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
    })

    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>服务发现</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleButtonClick}>Nacos页面</Button>
                </Col>
            </Row>
            <Table dataSource={services} rowKey="id">
                {/* 表格列保持不变 */}
                <Column
                    title="服务名"
                    dataIndex="serviceName"
                    key="serviceName"
                    {...getColumnSearchProps('serviceName', '服务名')}
                />
                <Column
                    title="分组名称"
                    dataIndex="groupName"
                    key="groupName"
                    {...getColumnSearchProps('groupName', '分组名称')}
                />
                <Column
                    title="集群数目"
                    dataIndex="clusterCount"
                    key="clusterCount"
                    {...getColumnSearchProps('clusterCount', '集群数目')}
                />
                <Column
                    title="实例数"
                    dataIndex="instanceCount"
                    key="instanceCount"
                    {...getColumnSearchProps('instanceCount', '实例数')}
                />
                <Column
                    title="健康实例数"
                    dataIndex="healthyInstanceCount"
                    key="healthyInstanceCount"
                    {...getColumnSearchProps('healthyInstanceCount', '健康实例数')}
                />
                <Column
                    title="触发保护阈值"
                    dataIndex="triggerThreshold"
                    key="triggerThreshold"
                    {...getColumnSearchProps('triggerThreshold', '触发保护阈值')}
                />
            </Table>
        </div>
    );
};

export default ServiceFind;
