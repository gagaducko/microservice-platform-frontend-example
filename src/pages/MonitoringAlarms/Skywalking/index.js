import React, { useState } from 'react';
import { Table, Button, Input, Space, DatePicker, Select, Modal, message, Col, Row } from 'antd';
import { DownloadOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import webUrls from "../../../config/configUrls"

const { RangePicker } = DatePicker;
const { Option } = Select;

const SkyWalkingPage = () => {
    const swUrl = webUrls.skyWalking
    const handleButtonClick = () => {
        window.open(swUrl, '_blank');
    };
    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>链路追踪</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleButtonClick}>详细链路追踪界面</Button>
                </Col>
            </Row>
            <Row style={{ height: '100vh' }}>
                <Col span={24} style={{ height: '100%' }}> {/* 确保Col的高度是100% */}
                    <iframe
                        src={swUrl}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Embedded Page"
                    ></iframe>
                </Col>
            </Row>
        </div>
    );
};

export default SkyWalkingPage;
