import React, { useState } from 'react';
import { Table, Button, Input, Space, DatePicker, Select, Modal, message, Col, Row } from 'antd';
import { DownloadOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import webUrls from "../../../config/configUrls"

const { RangePicker } = DatePicker;
const { Option } = Select;

const PrometheusPage = () => {
    const proUrl = webUrls.prometheus
    const handleButtonClick = () => {
        window.open(proUrl, '_blank');
    };
    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>监控告警</h2>
                </Col>
                <Col>
                    <Button type="primary" onClick={handleButtonClick}>详细监控告警界面</Button>
                </Col>
            </Row>
            <Row style={{ height: '100vh' }}>
                <Col span={24} style={{ height: '100%' }}> {/* 确保Col的高度是100% */}
                    <iframe
                        src={proUrl}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Embedded Page"
                    ></iframe>
                </Col>
            </Row>
        </div>
    );
};

export default PrometheusPage;
