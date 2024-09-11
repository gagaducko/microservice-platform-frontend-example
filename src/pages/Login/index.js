import { useState } from 'react';
import styles from './index.module.scss';
import {Button, Input, Space, ConfigProvider, theme, message} from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginAuth } from '../../apis/login'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigateTo = useNavigate();

    const login = () => {
        message.info("登陆鉴权中……")
        console.log(username, password);
        navigateTo('/serviceManagement/serviceFind');
        loginAuth(username, password).then(
            response => {
                console.log("login response", response)
                localStorage.setItem("access_token", response.access_token);
                localStorage.setItem("refresh_token", response.refresh_token);
                localStorage.setItem("role", response.role);
                message.success('登陆成功！');
                navigateTo('/serviceManagement/serviceFind');
            }
        ).catch(error => {
            console.log("login error", error)
            message.error('登陆失败，请检查用户名和密码');
        })
    }

    return (
        <div className={styles.login}>
            <div className={styles.loginBox}>
                {/* 标题 */}
                <div className={styles.title}>
                    <h1>微服务平台</h1>
                    <p>Microservice Platform</p>
                </div>
                {/* 表单 */}
                <div className={styles.form}>
                    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
                        <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
                            <Input placeholder='用户名' onChange={e => setUsername(e.target.value)} />
                            <Input.Password placeholder='密码' onChange={e => setPassword(e.target.value)} />
                            <Button type='primary' block onClick={login}>登录</Button>
                        </Space>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    )
}

export default Login;