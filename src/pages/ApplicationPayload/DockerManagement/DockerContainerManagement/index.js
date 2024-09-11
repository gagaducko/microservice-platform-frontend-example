import React, {useState, useEffect, useRef} from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Tabs, InputNumber, Select } from 'antd';
import {
    dockerCreate,
    dockerDelete,
    dockerLog,
    dockerReStart,
    dockerStart,
    dockerStop,
    getAllContainers
} from "../../../../apis/dockerk8s";
import Highlighter from "react-highlight-words";
import {SearchOutlined} from "@ant-design/icons";

const { Column } = Table;
const { TabPane } = Tabs;
const { Option } = Select;

const DockerContainerManagement = () => {
    const [containers, setContainers] = useState([]); // Docker容器数据
    const [visible, setVisible] = useState(false); // 控制新增容器对话框的显示与隐藏
    const [logVisible, setLogVisible] = useState(false); // 控制新增容器对话框的显示与隐藏
    const [containerName, setContainerName] = useState(''); // 新容器名称
    const [imageName, setImageName] = useState(''); // 镜像来源
    const [command, setCommand] = useState(''); // Command
    const [port, setPort] = useState(''); // 端口
    const [mapping, setMapping] = useState(''); // 映射
    const [containerLog, setContainerLog] = useState(''); // 容器日志
    const [environmentVariables, setEnvironmentVariables] = useState([]); // 环境变量
    const [form] = Form.useForm(); // 创建表单实例

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const searchInput = useRef(null);

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

    useEffect(() => {
        fetchContainers();
    }, []);

    const fetchContainers = async () => {
        try {
            // 创建一个2秒后拒绝的Promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('请求超时'));
                }, 2000);
            });
            // 使用Promise.race等待getAllContainers或timeoutPromise
            const response = await Promise.race([
                getAllContainers().catch(error => {
                    // 确保getAllContainers中的错误不会被内部捕获
                    throw error;
                }),
                timeoutPromise
            ]);
            console.log("containers:", response);
            setContainers(response);
        } catch (error) {
            console.error('Error fetching containers:', error);
            if (error.message === '请求超时') {
                message.error('请求超时，请稍后重试！');
            } else {
                message.error('获取容器异常！');
            }
        }
    };



    const handleAddContainer = () => {
        setVisible(true);
    };

    const handleViewLog = () => {
        setLogVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        setContainerName('');
        setImageName('');
        setCommand('');
        setPort('');
        setMapping('');
        setEnvironmentVariables([]);
        form.resetFields();
    };

    const handleLogCancel = () => {
        setLogVisible(false);
        setContainerLog('');
    };

    const handleSave = async () => {
        message.info("正在创建镜像，请确保参数正确")
        const newContainer = {
            name: containerName,
            image: imageName,
            command: command,
            port: port,
            mapping: mapping,
            environmentVariables: environmentVariables
        };
        try {
            await dockerCreate(newContainer).then(() => {
                message.success('docker创建成功');
                fetchContainers();
                setVisible(false);
                setContainerName('');
                setImageName('');
                setCommand('');
                setPort('');
                setMapping('');
                setEnvironmentVariables([]);
                form.resetFields();
            })
        } catch (error) {
            console.error('Error creating container:', error);
            message.error('docker创建失败,请您检查参数');
        }
    };

    const handleStart = async (containerId) => {
        try {
            message.info('容器启动中');
            await dockerStart(containerId).then(() => {
                message.success('容器启动成功！');
                fetchContainers();
            })
        } catch (error) {
            console.error('Error starting container:', error);
            message.error('Failed to start container.');
        }
    };

    const handleStop = async (containerId) => {
        try {
            message.info('容器停止中');
            await dockerStop(containerId).then(() => {
                message.success('容器停止成功！');
                fetchContainers();
            })
        } catch (error) {
            console.error('Error stopping container:', error);
            message.error('Failed to stop container.');
        }
    };

    const handleRestart = async (containerId) => {
        try {
            message.info('容器重启中');
            await dockerReStart(containerId).then(() => {
                message.success('容器重启成功');
                fetchContainers();
            })
        } catch (error) {
            console.error('Error restarting container:', error);
            message.error('Failed to restart container.');
        }
    };

    const handleDelete = async (record) => {
        try {
            message.info("容器删除中")
            if (record.status === "running") {
                message.error("请先停止容器！")
                return
            }
            let containerId = record.id
            await dockerDelete(containerId).then(() => {
                message.success('容器删除成功！');
                fetchContainers();
            })
        } catch (error) {
            console.error('Error deleting container:', error);
            message.error('Failed to delete container.');
        }
    };

    const handleLog = async (containerId) => {
        try {
            message.info("容器日志查询中")
            await dockerLog(containerId).then(response => {
                console.log("docker log", response)
                setContainerLog(response)
                message.success('容器日志查询成功！');
                handleViewLog()
            })
        } catch (error) {
            console.error('Error deleting container:', error);
            message.error('Failed to delete container.');
        }
    };

    return (
        <div>
            <div style={{marginBottom: '10px'}}>
                <Button type="primary" onClick={handleAddContainer}>新增容器</Button>
            </div>
            <Table dataSource={containers} rowKey="id">
                <Column title="容器ID" dataIndex="id" key="id" {...getColumnSearchProps('id')} />
                <Column title="容器名称" dataIndex="name" key="name" {...getColumnSearchProps('name')} />
                <Column title="状态" dataIndex="status" key="status" {...getColumnSearchProps('status')} />
                <Column title="镜像" dataIndex="image" key="image" {...getColumnSearchProps('image')} />
                <Column title="创建时间" dataIndex="created" key="created" {...getColumnSearchProps('created')} />
                <Column
                    title="端口"
                    dataIndex="ports"
                    key="ports"
                    render={ports => Object.values(ports).map(portArray => portArray.map(p => `${p.HostIp}:${p.HostPort}`).join(',')).join(', ')}
                />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button type="primary" onClick={() => handleStart(record.id)}>启动</Button>
                            <Button onClick={() => handleStop(record.id)}>停止</Button>
                            <Button onClick={() => handleRestart(record.id)}>重启</Button>
                            <Button onClick={() => handleLog(record.id)}>日志</Button>
                            <Button type="danger" onClick={() => handleDelete(record)}>删除</Button>
                        </Space>
                    )}
                />
            </Table>
            <Modal
                title="新增容器"
                open={visible}
                onCancel={handleCancel}
                onOk={handleSave}
            >
                <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Form.Item
                        label="容器名称"
                        name="containerName"
                        rules={[{ required: true, message: '请输入容器名称' }]}
                    >
                        <Input value={containerName} onChange={(e) => setContainerName(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="镜像来源"
                        name="imageName"
                        rules={[{ required: true, message: '请输入镜像来源' }]}
                    >
                        <Input value={imageName} onChange={(e) => setImageName(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="Command"
                        name="command"
                        rules={[{ message: '请输入Command' }]}
                    >
                        <Input value={command} onChange={(e) => setCommand(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        label="端口"
                        name="port"
                        rules={[{ required: true, message: '请输入端口' }]}
                    >
                        <InputNumber value={port} onChange={(value) => setPort(value)} />
                    </Form.Item>
                    <Form.Item
                        label="映射"
                        name="mapping"
                        rules={[{ required: true, message: '请输入映射' }]}
                    >
                        <InputNumber value={mapping} onChange={(value) => setMapping(value)} />
                    </Form.Item>
                    <Form.Item
                        label="环境变量"
                        name="environmentVariables"
                        rules={[{ message: '请输入环境变量' }]}
                    >
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="输入环境变量，按Enter确认"
                            onChange={(values) => setEnvironmentVariables(values)}
                            tokenSeparators={[',']}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="容器日志"
                open={logVisible}
                onCancel={handleLogCancel}
                onOk={handleLogCancel}
            >
                <div>
                    {containerLog}
                </div>
            </Modal>
        </div>
    );
};

export default DockerContainerManagement;