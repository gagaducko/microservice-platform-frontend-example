import React, {useState, useEffect, useRef} from 'react';
import {Table, Button, Space, Modal, Form, Input, message, Upload} from 'antd';
import Column from "antd/es/table/Column";
import {addImages, getAllImages, imageDelete, imageDownload} from "../../../../apis/dockerk8s";
import {SearchOutlined, UploadOutlined} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const DockerImagesManagement = () => {
    const [images, setImages] = useState([]); // Docker镜像数据
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDownloadModalVisible, setIsDownloadModalVisible] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [form] = Form.useForm();
    const [downloadForm] = Form.useForm();
    const [isAddContainerModalVisible, setIsAddContainerModalVisible] = useState(false);
    const [addContainerForm] = Form.useForm();
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
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            // 调用后端接口获取Docker镜像数据
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('请求超时'));
                }, 2000);
            });
            // 使用Promise.race等待getAllContainers或timeoutPromise
            const response = await Promise.race([
                getAllImages().catch(error => {
                    // 确保getAllContainers中的错误不会被内部捕获
                    throw error;
                }),
                timeoutPromise
            ]);
            console.log("images:", response);
            setImages(response);
        } catch (error) {
            console.error('Error fetching images:', error);
            if (error.message === '请求超时') {
                message.error('请求超时，请稍后重试！');
            } else {
                message.error('获取镜像异常！');
            }
        }
    };

    const handleAddContainer = () => {
        setIsAddContainerModalVisible(true);
    };

    const handleAddContainerOk = async () => {
        try {
            const values = await addContainerForm.validateFields();
            console.log("values is: ", values)
            const formData = new FormData();
            formData.append('tar_file', values.tar_file.fileList[0].originFileObj);
            formData.append('container_name', values.container_name);
            console.log("formData is: ", formData)
            message.info("增加镜像中，请耐心等待……")
            message.info("预计等待1-2分钟……")
            setIsAddContainerModalVisible(false);
            await addImages(formData); // 调用新增容器的API
            message.success('镜像已新增');
            fetchImages(); // 重新获取镜像列表
            addContainerForm.resetFields();
        } catch (error) {
            console.error('Error adding container:', error);
            message.error('添加镜像失败，请重试！');
        }
    };

    const handleAddContainerCancel = () => {
        setIsAddContainerModalVisible(false);
    };


    const handleDownloadImage = (imageId) => {
        setSelectedImageId(imageId);
        setIsDownloadModalVisible(true);
    };

    const handleDownloadOk = async () => {
        try {
            const values = await downloadForm.validateFields();
            setIsDownloadModalVisible(false);
            message.info('正在下载！请耐心等待……')
            const imageInfo = {
                image_id: selectedImageId,
                // downloadPath: values.downloadPath,
                tar_name: values.tar_name
            };
            message.info('下载中……预计等待1-2分钟')
            const response = await imageDownload(imageInfo); // 传递下载路径
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${values.tar_name}.tar`);
            document.body.appendChild(link);
            link.click();
            message.info('下载成功，请前往路径查看镜像包！');
            downloadForm.resetFields();
        } catch (error) {
            console.error('Error downloading image:', error);
            message.error('下载失败，请重试');
        }
    };

    const handleDownloadCancel = () => {
        setIsDownloadModalVisible(false);
    };

    const handleDeleteImage = async (imageId) => {
        try {
            //  调用后端接口删除指定的Docker镜像
            await imageDelete(imageId).then(() => {
                message.success('镜像已删除');
                fetchImages();
            });
        } catch (error) {
            console.error('Error deleting image:', error);
            message.error('Failed to delete image.');
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <Button type="primary" onClick={handleAddContainer}>新增镜像</Button>
            </div>
            <Table dataSource={images} rowKey="image_id">
                <Column title="镜像名称" dataIndex="repository" key="repository" {...getColumnSearchProps('repository')} />
                <Column title="标签" dataIndex="tag" key="tag" {...getColumnSearchProps('tag')} />
                <Column title="创建时间" dataIndex="created" key="created" {...getColumnSearchProps('created')} />
                <Column title="大小" dataIndex="size" key="size" render={(text) => (text / 1024 / 1024).toFixed(2) + ' MB'} />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button type="primary" onClick={() => handleDownloadImage(record.image_id)}>下载</Button>
                            <Button type="danger" onClick={() => handleDeleteImage(record.image_id)}>删除</Button>
                        </Space>
                    )}
                />
            </Table>
            <Modal title="新增镜像" visible={isAddContainerModalVisible} onOk={handleAddContainerOk} onCancel={handleAddContainerCancel}>
                <Form form={addContainerForm} layout="vertical">
                    <Form.Item name="container_name" label="镜像名称" rules={[{ required: true, message: '请输入镜像名称' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="tar_file" label="选择tar包" rules={[{ required: true, message: '请选择tar包' }]}>
                        <Upload beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>选择tar文件</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="下载镜像" visible={isDownloadModalVisible} onOk={handleDownloadOk} onCancel={handleDownloadCancel}>
                <Form form={downloadForm} layout="vertical">
                    <Form.Item name="tar_name" label="镜像包名字" rules={[{ required: true, message: '请输入镜像包名字' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DockerImagesManagement;
