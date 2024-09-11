import React, { Component } from 'react';
import {Select, Upload, Button, Col, Row, Modal, Input, Table, message} from 'antd';
import {
    getAllBuckets,
    addBucket,
    fetchFile,
    downloadFile,
    uploadFile,
    deleteFile,
    previewFile
} from '../../../apis/minio'
import { FilterOutlined } from '@ant-design/icons';
import webUrls from "../../../config/configUrls";
const { Option } = Select;

class FileManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bucketName: '',
            buckets: [],
            fileList: [],
            modalVisible: false,
            newBucketName: '',
            previewVisible: false,
            previewContent: null,
            filteredInfo: {},
            minioUrl: webUrls.minio
        };
    }

    handleButtonClick = () => {
        window.open(this.state.minioUrl, '_blank');
    };

    componentDidMount() {
        this.fetchAllBuckets().then(r => {
            console.log("初始化完成")
        });
    }

    fetchAllBuckets = async () => {
            getAllBuckets().then((response)=>{
                this.setState({ buckets: response });
                // 默认选择第一个存储桶
                if (response.length > 0) {
                    this.setState({ bucketName: response[0].name });
                }
                this.fetchFiles(response[0].name);
            }).catch (error=>{
                message.error("获取存储桶列表时出错!请联系管理员")
                console.error('获取存储桶列表时出错:', error);
            })
    };

    handleSaveBucket = async () => {
        const { newBucketName } = this.state;
        addBucket(newBucketName).then(()=>{
            this.fetchAllBuckets(); // 添加新 Bucket 后刷新列表
            message.success(`${newBucketName} 添加成功`);
            this.setState({ modalVisible: false, newBucketName: '' });
        }).catch (error => {
            console.error('添加 Bucket 时出错:', error);
            message.error(`添加 ${newBucketName} 失败`);
        })
    };

    fetchFiles = async (bucketName) => {
        fetchFile(bucketName).then((response)=>{
            console.log(response)
            this.setState({ fileList: response});
        }).catch (error=>{
            console.error('获取文件列表时出错:', error);
        })
    };

    handleBucketChange = (value) => {
        this.setState({ bucketName: value });
        this.fetchFiles(value).then(r => {
            console.log("bucket changed!")
        });
    };

    // 上传文件
    handleFileUpload = async (file) => {
        let uploadRequest = new FormData();
        uploadRequest.append("bucketName", this.state.bucketName)
        uploadRequest.append("file", file)
        console.log(uploadRequest)
        try {
            uploadFile(uploadRequest).then(response => {
                this.fetchFiles(this.state.bucketName); // 上传文件后刷新文件列表
                message.success(`${file.name} 上传成功`);
            })
        } catch (error) {
            console.error('上传文件时出错:', error);
            message.error(`${file.name} 上传失败`);
        }
    };

    // 下载文件
    handleDownload = async (fileName) => {
        // downloadFile(this.state.bucketName)
        console.log("download fileName: ", fileName)
        const encodedFileName = encodeURIComponent(fileName);
        downloadFile(this.state.bucketName, encodedFileName).then(response => {
            setTimeout(function() {
                console.log("After 500ms pause");
            }, 500);
            // 创建一个 URL 对象
            const url = window.URL.createObjectURL(new Blob([response.data]));
            // 创建一个 <a> 标签
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // 设置下载文件的文件名
            document.body.appendChild(link);
            link.click(); // 触发点击链接进行下载
            document.body.removeChild(link); // 下载完成后移除 <a> 标签
        }).catch(error => {
            console.error('Error downloading file: ', error);
            // 处理下载失败的情况
            throw error; // 抛出错误，供调用者进一步处理
        });
    };

    handleDeleteFile = async (fileName) => {
        try {
            let deleteRequest = new FormData
            deleteRequest.append("bucketName", this.state.bucketName)
            deleteRequest.append("objName", fileName)
            deleteFile(deleteRequest).then(response => {
                this.fetchFiles(this.state.bucketName); // 删除文件后刷新文件列表
                message.success(`${fileName} 删除成功`);
            })
        } catch (error) {
            console.error('删除文件时出错:', error);
            message.error(`${fileName} 删除失败`);
        }
    };

    handleModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

    handleInputChange = (e) => {
        this.setState({ newBucketName: e.target.value });
    };

    handlePreview = (fileName) => {
        try {
            console.log("preview fileName is: ", fileName);
            previewFile(this.state.bucketName,fileName).then(response => {
                console.log(response)
                this.setState({
                    previewContent: response
                },() => {
                    this.setState({
                        previewVisible: true
                    })
                })
            })
        } catch (error) {
            console.error('预览文件出错:', error);
            message.error(`${fileName} 预览失败`);
        }
    };

    handleCancelPreview = () => {
        this.setState({ previewVisible: false });
    };

    // 清除过滤
    handleClearFilters = (columnKey) => {
        const filteredInfo = { ...this.state.filteredInfo };
        delete filteredInfo[columnKey];
        this.setState({ filteredInfo }, () => this.handleSearch(columnKey, []));
    };

    // 应用过滤
    handleFilter = (columnKey, selectedKeys) => {
        this.setState({
            filteredInfo: {
                ...this.state.filteredInfo,
                [columnKey]: selectedKeys,
            },
        }, () => this.handleSearch(columnKey, selectedKeys));
    };

    // 处理搜索
    handleSearch = (columnKey, selectedKeys) => {
        // over
    };

    // 渲染过滤器的Dropdown
    renderFilterDropdown = (column) => ({
                                            setSelectedKeys, selectedKeys, confirm, clearFilters,
                                        }) => (
        <div style={{ padding: 8 }}>
            <Input
                placeholder={`Search ${column.title}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => this.handleFilter(column.key, selectedKeys)}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
                type="primary"
                onClick={() => this.handleFilter(column.key, selectedKeys)}
                icon="search"
                size="small"
                style={{ width: 90, marginRight: 8 }}
            >
            </Button>
            <Button onClick={() => {
                clearFilters();
                this.handleClearFilters(column.key);
            }}
                    size="small"
                    style={{ width: 90 }}
            >
                Reset
            </Button>
        </div>
    );

    // 修改列定义以包含过滤器
    getColumnsWithFilter = (columns) => {
        const { filteredInfo } = this.state;
        return columns.map(column => ({
            ...column,
            filterDropdown: column.key !== 'action' ? this.renderFilterDropdown(column) : undefined,
            filteredValue: filteredInfo[column.key] || null,
            onFilter: (value, record) => record[column.key].toString().includes(value),
            filterIcon: filteredInfo[column.key] && filteredInfo[column.key].length > 0 ? (
                <FilterOutlined style={{ color: '#1890ff' }} />
            ) : (
                <FilterOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
            ),
        }));
    };

    render() {
        const { buckets, bucketName, fileList, modalVisible, newBucketName ,previewVisible, previewContent} = this.state;
        const columns = [
            {
                title: '文件名',
                dataIndex: 'ObjectName',
                key: 'ObjectName',
                render: ObjectName => <span>{ObjectName}</span>
            },
            {
                title: '文件大小(byte)',
                dataIndex: 'size',
                key: 'size'
            },
            {
                title: '最后修改时间',
                dataIndex: 'lastModified',
                key: 'lastModified'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button onClick={() => this.handlePreview(record.ObjectName)} style={{ marginRight: 8 }}>
                            预览
                        </Button>
                        <Button onClick={() => this.handleDownload(record.ObjectName)} style={{ marginRight: 8 }}>
                            下载
                        </Button>
                        <Button onClick={() => this.handleDeleteFile(record.ObjectName)} type="danger">
                          删除
                        </Button>
                    </span>
                )
            }
        ];
        const columnsWithFilter = this.getColumnsWithFilter(columns);

        return (
            <div>
                <Row justify="space-between" style={{ marginBottom: '10px' }}>
                    <Col span={12}>
                        <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>文件管理</h2>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => this.handleButtonClick()}>
                            打开文件管理页面
                        </Button>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => this.handleModalVisible(true)}>新增 Bucket</Button>
                        <Modal
                            title="新增 Bucket"
                            visible={modalVisible}
                            onOk={() => this.handleSaveBucket()}
                            onCancel={() => this.handleModalVisible(false)}
                        >
                            <Input
                                placeholder="请输入 Bucket 名称"
                                value={newBucketName}
                                onChange={this.handleInputChange}
                            />
                        </Modal>
                    </Col>
                </Row>
                <div>
                    <Select value={bucketName} onChange={this.handleBucketChange} style={{ width: 200 }}>
                        {buckets.map((bucket, index) => (
                            <Option key={index} value={bucket.name}>
                                {bucket.name}
                            </Option>
                        ))}
                    </Select>
                    <Upload
                        beforeUpload={(file) => {
                            this.handleFileUpload(file).then(r => {
                                console.log("upload ok!")
                            });
                            return false;
                        }}
                    >
                        <Button>上传文件</Button>
                    </Upload>
                </div>
                <Table
                    style={{ marginTop: 20 }}
                    bordered
                    dataSource={this.state.fileList}
                    columns={columnsWithFilter}
                    rowKey="fileName"
                />
                <Modal
                    title="文件预览"
                    visible={previewVisible}
                    onCancel={this.handleCancelPreview}
                    width="80%"
                    footer={null}
                    destroyOnClose // 确保在关闭Modal时销毁iframe内容
                >
                    {previewContent && (
                        <iframe
                            src={previewContent}
                            style={{ width: '100%', height: '80vh' }} // 设置iframe的宽高
                            frameBorder="0"
                        />
                    )}
                </Modal>
            </div>
        );
    }
}

export default FileManagement;
