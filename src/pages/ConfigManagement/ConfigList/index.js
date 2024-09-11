import React, {useState, useEffect, useRef} from 'react';
import {Table, Button, Space, Modal, Form, Input, message, Col, Row} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {
    createConfigFunc,
    deleteConfig,
    getListConfig,
    updateConfigFunc
} from "../../../apis/nacosOpenAPI";
import webUrls from "../../../config/configUrls";
const {Column} = Table;

const ConfigList = () => {
    const nacosUrl = webUrls.nacos
    const [configs, setConfigs] = useState([]); // 初始为空数组
    const [getContent, setGetContent] = useState('');
    const [visible, setVisible] = useState(false);
    const [currentConfig, setCurrentConfig] = useState('修改config');
    const [dataId, setDataId] = useState('');
    const [group, setGroup] = useState('DEFAULT_GROUP');
    const [content, setContent] = useState('');
    const [app, setApp] = useState('');
    const [namespace, setNamespace] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [viewVisible, setViewVisible] = useState(false);

    let inputSearch = useRef(null);

    useEffect(() => {
        fetchConfigs();
    }, []);

    useEffect(() => {
        console.log("config changes!", currentConfig);
    },[currentConfig])

    const handleButtonClick = () => {
        window.open(nacosUrl, '_blank');
    };

    const fetchConfigs = async () => {
        try {
            await getListConfig().then(response => {
                console.log(response)
                setConfigs(response.pageItems);
            })
        } catch (error) {
            message.error('Failed to fetch configurations.');
        }
    };

    const handleViewCancel = () => {
        console.log("handle view cancel")
        // setViewVisible(false);
        setCurrentConfig('');
        handleCloseConfig()
    };

    const handleCloseConfig = () => {
        setViewVisible(false);
    }


    const handleViewConfig = (config) => {
        try {
            console.log("config.content is:", config.content)
            setCurrentConfig(config.content)
            setDataId(config.dataId);
            handleShowConfig()
        } catch (error) {
            message.error('Failed to fetch configuration details.');
        }
    };

    const handleShowConfig = () => {
        console.log("handle show config", currentConfig)
        setViewVisible(true)
    };

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
            fetchConfigs();
        } catch (error) {
            message.error('Failed to update configuration.');
        }
    };

    const handleAddConfig = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        clearFields();
    };

    const handleSave = async () => {
        console.log("save")
        try {
            let createConfig = new FormData
            createConfig.append("dataId", dataId)
            createConfig.append("group", group)
            createConfig.append("content", content)
            console.log("createConfig is:", createConfig)
            await createConfigFunc(createConfig);
            message.success('Config created successfully.');
            setVisible(false);
            clearFields();
            fetchConfigs();
        } catch (error) {
            message.error('Failed to create configuration.');
        }
    };

    const handleDelete = (configId) => {
        try {
            deleteConfig(configId).then(response => {
                message.success('Config deleted successfully.');
                fetchConfigs();
            })
        } catch (error) {
            message.error('Failed to delete configuration.');
        }
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

    const clearFields = () => {
        setDataId('');
        setGroup('DEFAULT_GROUP');
        setContent('');
        setApp('');
        setNamespace('');
    };

    const getColumnSearchProps = (dataIndex, placeholder) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        inputSearch = node;
                    }}
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
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => inputSearch.select());
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
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
                    <h2 style={{fontWeight: 'bold', fontSize: '20px'}}>配置列表</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleAddConfig}>新增配置</Button>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleButtonClick}>Nacos页面</Button>
                </Col>
            </Row>
            <Table dataSource={configs} rowKey="dataId">
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
                    title="归属应用"
                    dataIndex="appName"
                    key="appName"
                    {...getColumnSearchProps('appName', '归属应用')}
                />
                <Column
                    title="命名空间"
                    dataIndex="tenant"
                    key="tenant"
                    {...getColumnSearchProps('tenant', '命名空间')}
                />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button type="primary" onClick={() => handleViewConfig(record)}>查看</Button>
                            <Button type="danger" onClick={() => handleDelete(record.dataId)}>删除</Button>
                        </Space>
                    )}
                />
            </Table>
            <Modal
                title="新增配置"
                visible={visible}
                onCancel={handleCancel}
                onOk={handleSave}
            >
                <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
                    <Form.Item
                        label="Data ID"
                        name="dataId"
                        rules={[{required: true, message: '请输入 Data ID'}]}
                    >
                        <Input value={dataId} onChange={(e) => setDataId(e.target.value)}/>
                    </Form.Item>
                    <Form.Item
                        label="Group"
                        name="group"
                        initialValue="DEFAULT_GROUP"
                    >
                        <Input value={group} onChange={(e) => setGroup(e.target.value)}/>
                    </Form.Item>
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{required: true, message: '请输入配置内容'}]}
                    >
                        <Input.TextArea rows={4} value={content} onChange={(e) => setContent(e.target.value)}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="查看配置"
                visible={viewVisible}
                onCancel={handleViewCancel}
                footer={[
                    <Button key="back" onClick={handleViewCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleEditSave}>
                        修改
                    </Button>,
                ]}
                width={1000}
            >
                <Form.Item
                    label="内容"
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

export default ConfigList;
