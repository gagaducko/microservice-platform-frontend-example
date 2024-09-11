import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Col, Row, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const { Column } = Table;

const ListenQuery = () => {
    const [listeners, setListeners] = useState([
        {
            ip: '172.30.240.1',
            md5: '4ef740692a773e3a8a7999e429d27af5',
            dataId: 'gateway-router.json',
            group: 'DEFAULT_GROUP'
        },
        {
            ip: '172.30.240.1',
            md5: '7d19cfced7a144fe92780f2d2fde792f',
            dataId: 'gateway-flow-rules.json',
            group: 'DEFAULT_GROUP'
        }
    ]); // 监听器数据
    const [searchText, setSearchText] = useState(''); // 表格筛选的文本
    const [searchedColumn, setSearchedColumn] = useState(''); // 表格筛选的列

    const inputSearch = useRef(null); // 使用 useRef 创建 inputSearch 引用

    useEffect(() => {
        fetchListeners();
    }, []);

    const handleViewDetails = () => {
    };

    const fetchListeners = async () => {
        try {


            // setListeners(response);
        } catch (error) {
            console.error('Error fetching listeners:', error);
            message.error('Failed to fetch listeners.');
        }
    };

    const getColumnSearchProps = (dataIndex, placeholder) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={inputSearch}
                    placeholder={`Search ${placeholder}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value, record) => (record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : ''),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => inputSearch.current.select(), 100);
            }
        },
        render: (text) =>
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

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    return (
        <div>
            <Row justify="space-between" style={{marginBottom: '10px'}}>
                <Col span={12}>
                    <h2 style={{fontWeight: 'bold', fontSize: '20px'}}>监听查询</h2>
                </Col>
            </Row>
            <Table dataSource={listeners} rowKey="dataId">
                <Column title="IP" dataIndex="ip" key="ip" {...getColumnSearchProps('ip', 'IP')} />
                <Column title="MD5" dataIndex="md5" key="md5" {...getColumnSearchProps('md5', 'MD5')} />
                <Column title="Data ID" dataIndex="dataId"
                        key="dataId" {...getColumnSearchProps('dataId', 'Data ID')} />
                <Column title="Group" dataIndex="group" key="group" {...getColumnSearchProps('group', 'Group')} />
            </Table>

        </div>
    );
};

export default ListenQuery;
