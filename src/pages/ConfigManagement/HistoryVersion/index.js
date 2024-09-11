import React, {useEffect, useRef, useState} from 'react';
import {Table, Input, Button, Row, Space, Col, message, Form, Modal} from 'antd';
import Highlighter from "react-highlight-words";
import {SearchOutlined} from "@ant-design/icons";
import webUrls from "../../../config/configUrls";
import {getHistoryConfigDetails, getHistoryConfigs, getListConfig, updateConfigFunc} from "../../../apis/nacosOpenAPI";
const {Column} = Table;

const HistoryVersion = () => {
    const nacosUrl = webUrls.nacos
    const [versions, setVersions] = useState([]); // 历史版本数据
    const [searchText, setSearchText] = useState(''); // 表格筛选的文本
    const [searchedColumn, setSearchedColumn] = useState(''); // 表格筛选的列
    const [currentConfig, setCurrentConfig] = useState('修改config');
    const [viewVisible, setViewVisible] = useState(false);
    const [dataId, setDataId] = useState('');

    let inputSearch = useRef(null);

    useEffect(() => {
        message.info("请输入配置ID进行历史版本查询");
    }, []);

    useEffect(() => {
        console.log("versions is:", versions)
    }, [versions])

    const handleButtonClick = () => {
        window.open(nacosUrl, '_blank');
    };

    const fetchConfigs = async (configDataId, groupName) => {
        try {
            let pageItems = []
            let dataId = configDataId
            let group = groupName
            await getHistoryConfigs(dataId, group).then(response => {
                for(let j = 0; j < response.pageItems.length; j++) {
                    pageItems.push(response.pageItems[j])
                }
            })
            console.log("pageItems is ", pageItems)
            setVersions(pageItems)
        } catch (error) {
            message.error('Failed to fetch configurations.');
        }
    };


    const handleQuery = () => {
        // 查询逻辑，可以根据服务名称和分组名称进行过滤
        const configDataId = document.getElementById('configDataId').value;
        const groupName = document.getElementById('groupName').value;
        console.log('历史config名称:', configDataId, "groupName为：", groupName)
        fetchConfigs(configDataId, groupName).then(res => {
            console.log("查询结果如下：", res)
        });
    };

    const showDetails = async (record) => {
        console.log(record)
        await getHistoryConfigDetails(record.dataId, record.group, record.id).then(res => {
            console.log("res is", res)
            setCurrentConfig(res.content)
            setDataId(res.dataId);
        })
        handleShowConfig()
    };

    const handleShowConfig = () => {
        console.log("handle show config", currentConfig)
        setViewVisible(true)
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleViewCancel = () => {
        console.log("handle view cancel")
        setCurrentConfig('');
        handleCloseConfig()
    };

    const handleCloseConfig = () => {
        setViewVisible(false);
    }

    const handleEditSave = async () => {
        try {
            let updateConfig = new FormData
            updateConfig.append("dataId", dataId)
            updateConfig.append("group", "DEFAULT_GROUP")
            updateConfig.append("content", currentConfig)
            console.log("updateConfig is:", updateConfig)
            updateConfigFunc(updateConfig).then(res => {
                console.log("res is:", res)
            })
            message.success('Config updated successfully.');
            setViewVisible(false);
            fetchConfigs(dataId, "DEFAULT_GROUP");
        } catch (error) {
            message.error('Failed to update configuration.');
        }
    };

    const getColumnSearchProps = (dataIndex, placeholder) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        inputSearch = node;
                    }}
                    placeholder={placeholder}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
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
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => inputSearch.select());
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


    return (
        <div>
            <Row justify="space-between" style={{marginBottom: '10px'}}>
                <Col span={12}>
                    <h2 style={{fontWeight: 'bold', fontSize: '20px'}}>历史版本</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleButtonClick}>Nacos页面</Button>
                </Col>
            </Row>
            <Form layout="inline" style={{ marginBottom: '20px' }}>
                <Form.Item label="配置DataId" style={{ marginRight: '10px' }}>
                    <Input id="configDataId" placeholder="请输入配置的DataId" />
                </Form.Item>
                <Form.Item label="分组名称" style={{ marginRight: '10px' }}>
                    <Input id="groupName" placeholder="请输入分组名称" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleQuery}>查询</Button>
                </Form.Item>
            </Form>
            <Table dataSource={versions} rowKey="id">
                <Column
                    title="Data ID"
                    dataIndex="dataId"
                    key="dataId"
                    {...getColumnSearchProps('dataId', 'Data ID')}
                />
                <Column
                    title="Group"
                    dataIndex="group"
                    key="group"
                    {...getColumnSearchProps('group', 'Group')}
                />
                <Column
                    title="操作人"
                    dataIndex="srcUser"
                    key="srcUser"
                    {...getColumnSearchProps('srcUser', '操作人')}
                />
                <Column
                    title="最后更新时间"
                    dataIndex="lastModifiedTime"
                    key="lastModifiedTime"
                    {...getColumnSearchProps('lastModifiedTime', '最后更新时间')}
                />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button type="link" onClick={() => showDetails(record)}>查看详情</Button>
                        </Space>
                    )}
                />
            </Table>
            <Modal
                title="查看该历史配置"
                visible={viewVisible}
                onCancel={handleViewCancel}
                footer={[
                    <Button key="back" onClick={handleViewCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleEditSave}>
                        回退该版本
                    </Button>,
                ]}
                width={1000}
            >
                <Form.Item
                    label="历史内容"
                    name="content"
                    style={{margin: 0}}
                >
                    <pr></pr>
                    <Input.TextArea
                        rows={40}
                        value={currentConfig}
                        onChange={(e) => setCurrentConfig(e.target.value)}
                    />
                </Form.Item>
            </Modal>
        </div>
    );
};

export default HistoryVersion;
