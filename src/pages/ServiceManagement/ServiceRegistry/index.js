import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Row, Col, Card } from 'antd';
import axios from 'axios';
import webUrls from "../../../config/configUrls";

const { Option } = Select;

const ServiceRegistry = () => {
    const nacosUrl = webUrls.nacos

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await axios.post('/api/services', values);
            message.success('Service registered successfully.');
            form.resetFields();
        } catch (error) {
            console.error('Error registering service:', error);
            message.error('Failed to register service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Col>
                <Card title="服务注册">
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        <Form.Item name="serviceName" label="服务名" rules={[{ required: true, message: '请输入服务名' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="protectThreshold" label="保护阈值" rules={[{ required: true, message: '请输入保护阈值' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="serviceIp" label="服务 IP" rules={[{ required: true, message: '请输入服务 IP' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="servicePort" label="服务端口" rules={[{ required: true, message: '请输入服务端口' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="group" label="分组" rules={[{ required: true, message: '请选择分组' }]}>
                            <Select>
                                <Option value="DEFAULT_GROUP">DEFAULT_GROUP</Option>
                                {/* 其他分组选项 */}
                            </Select>
                        </Form.Item>
                        <Form.Item name="metadata" label="元数据">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item name="serviceRouteType" label="服务路由类型" rules={[{ required: true, message: '请选择服务路由类型' }]}>
                            <Select>
                                <Option value="random">随机</Option>
                                <Option value="weighted">加权</Option>
                                {/* 其他服务路由类型选项 */}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>注册服务</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </div>
    );
};

export default ServiceRegistry;
