import React, { useState } from 'react';
import {Button, Col, Input, message, Row, Tabs} from 'antd';
import DockerContainerManagement from './DockerContainerManagement';
import DockerImagesManagement from './DockerImagesManagement';
import {setBaseURL} from "../../../apis/indexDocker";
import axios from 'axios';

const { TabPane } = Tabs;

const DockerManagement = () => {
    const [activeTab, setActiveTab] = useState('containers');
    const [ipAddress, setIpAddress] = useState('');
    // 添加一个新的状态，用来表示是否请求成功
    const [requestSuccess, setRequestSuccess] = useState(false);

    const dockerTest = (url) => {
        return axios.get(url); // 发送GET请求
    };

    const handleInputChange = (e) => {
        setIpAddress(e.target.value);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const handleButtonClick = async () => {
        // 构建完整的URL
        const url = `http://${ipAddress}:31001`;
        console.log("url is:", url)
        // 发送请求
        // 创建一个2秒后拒绝的Promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('请求超时'));
            }, 2000);
        });

        try {
            // 使用Promise.race等待dockerTest或timeoutPromise
            const response = await Promise.race([
                dockerTest(url),
                timeoutPromise
            ]);

            console.log('请求成功，响应数据：', response);
            if (response.data === "Welcome to the Kubernetes and Docker management system!") {
                message.success("该IP下Docker管理正常");
                setRequestSuccess(true);
                // 动态设置 axios 的 baseURL
                await setBaseURL(url);
            } else {
                message.error("该IP下Docker管理异常，请重新输入IP");
                setRequestSuccess(false);
            }
        } catch (error) {
            console.error('请求失败，错误信息：', error);
            setRequestSuccess(false);
            if (error.message === '请求超时') {
                message.error("请求超时，请检查网络连接、对应IP的docker情况或重新尝试");
            } else {
                message.error("异常，请重新尝试");
            }
        }
    };

    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>容器管理</h2>
                </Col>
                <Col>
                    <Input
                        placeholder="请输入Docker的IP地址"
                        value={ipAddress}
                        onChange={handleInputChange}
                        style={{ width: 200, marginRight: 16 }}
                    />
                    <Button type="primary" onClick={handleButtonClick}>
                        确认
                    </Button>
                </Col>
            </Row>
            <Tabs defaultActiveKey="containers" activeKey={activeTab} onChange={handleTabChange}>
                <TabPane tab="容器管理" key="containers">
                    <DockerContainerManagement />
                </TabPane>
                <TabPane tab="镜像管理" key="images">
                    <DockerImagesManagement />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default DockerManagement;
