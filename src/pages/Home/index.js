import React, {useState} from 'react';
import {
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined, SearchOutlined, UserOutlined
} from '@ant-design/icons';
import {Avatar, Button, Dropdown, Flex, Layout, Menu, message, theme, Typography} from 'antd';
import MenuSide from '@/components/Menu';
import Crumb from '@/components/Crumb';
import logo from '@/assets/logo.svg'
import {Outlet, useNavigate} from 'react-router-dom';
import Login from "../Login";

const {Header, Content, Sider} = Layout;
const {Text} = Typography

const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const handleLogout = () => {
        // 清除本地的 access_token 和 refresh_token
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        localStorage.removeItem('routes');
        message.info("退出当前用户中~")
        // 跳转到登录页面
        navigate('/login');
        message.success("退出成功！")
    };

    const menuLogout = (
        <Menu>
            <Menu.Item key="logout" onClick={handleLogout}>
                退出登录
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider trigger={null} collapsible collapsed={collapsed} width={240} style={{background: colorBgContainer}}>
                <div className="logo">
                    <img src={logo} alt='Logo' className='logo-img'/>
                    <span className='logo-text'>微服务平台</span>
                </div>
                <MenuSide/>
            </Sider>
            <Layout style={{height: '100vh'}}>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
                    }}
                >
                    <Flex>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Crumb/>
                    </Flex>
                    {/*<Flex gap='middle' align='center' style={{*/}
                    {/*    fontSize: 20,*/}
                    {/*    marginRight: 30*/}
                    {/*}}>*/}
                    {/*    <SearchOutlined/>*/}
                    {/*    <BellOutlined/>*/}
                    {/*    <Avatar icon={<UserOutlined />} />*/}
                    {/*    <Text>嘎嘎鸭</Text>*/}
                    {/*</Flex>*/}
                    <div style={{display: 'flex', alignItems: 'center', marginRight: 30}}>
                        <SearchOutlined style={{fontSize: 20, marginRight: 20}}/>
                        <BellOutlined style={{fontSize: 20, marginRight: 20}}/>
                        <Dropdown overlay={menuLogout} trigger={['click']}>
                            <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                                <Avatar icon={<UserOutlined/>}/>
                                <Text style={{marginLeft: 8}}>嘎嘎鸭</Text>
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    style={{
                        padding: 24,
                        background: colorBgContainer,
                        overflow: 'auto'
                    }}
                >
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    );
};
export default Home;

