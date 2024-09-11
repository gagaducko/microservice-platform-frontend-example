import React, { useState } from 'react';
import { Table, Button, Tag, Space } from 'antd';

// Mock 静态数据
const mockData = [
    {
        key: '1',
        username: 'user1',
        lastOperationTime: '2024-07-04 10:15:32',
        ip: '192.168.1.101',
        online: true,
        accountStatus: '正常'
    },
    {
        key: '2',
        username: 'user2',
        lastOperationTime: '2024-07-04 09:30:45',
        ip: '192.168.1.102',
        online: false,
        accountStatus: '正常'
    },
    {
        key: '3',
        username: 'user3',
        lastOperationTime: '2024-07-03 18:20:15',
        ip: '192.168.1.103',
        online: true,
        accountStatus: '禁用'
    }
];

const TerminalManagement = () => {
    const [data, setData] = useState(mockData);

    const handleToggleAccountStatus = (record) => {
        const newData = data.map(item => {
            if (item.key === record.key) {
                return { ...item, accountStatus: item.accountStatus === '正常' ? '禁用' : '正常' };
            }
            return item;
        });
        setData(newData);
    };

    const columns = [
        {
            title: '用户名称',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: '上一次操作时间',
            dataIndex: 'lastOperationTime',
            key: 'lastOperationTime'
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip'
        },
        {
            title: '在线状态',
            dataIndex: 'online',
            key: 'online',
            render: online => (
                <Tag color={online ? 'green' : 'red'}>
                    {online ? '在线' : '离线'}
                </Tag>
            )
        },
        {
            title: '账号状态',
            dataIndex: 'accountStatus',
            key: 'accountStatus',
            render: accountStatus => (
                <Tag color={accountStatus === '正常' ? 'green' : 'red'}>
                    {accountStatus}
                </Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleToggleAccountStatus(record)}>
                        {record.accountStatus === '正常' ? '禁用' : '启用'}
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <h2 style={{ fontWeight: 'bold', fontSize: '20px' }}>终端管理</h2>
            <Table columns={columns} dataSource={data} />
        </div>
    );
};

export default TerminalManagement;
