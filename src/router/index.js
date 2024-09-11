import React from 'react';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import ServiceRegistry from '@/pages/ServiceManagement/ServiceRegistry';
import ServiceFind from "@/pages/ServiceManagement/ServiceFind";
import UserManagement from "@/pages/UserPermissions/UserManagement";
import RoleManagement from "@/pages/UserPermissions/RoleManagement";
import PermissionManagement from "@/pages/UserPermissions/PermissionManagement";
import DockerManagement from "@/pages/ApplicationPayload/DockerManagement";
import DeploymentManagement from "@/pages/ApplicationPayload/DeploymentManagement";
import PodManagement from "@/pages/ApplicationPayload/PodManagement";
import ConfigList from "@/pages/ConfigManagement/ConfigList";
import FilePage from "@/pages/SystemManagement/FileManagement";
import TerminalManagement from "@/pages/SystemManagement/TerminalManagement";
import DictionaryPage   from "@/pages/SystemManagement/DictManagement";
import LogManagement from "@/pages/MonitoringAlarms/LogManagement";
import TokenManagement from "@/pages/SystemManagement/TokenManagement";
import ModifyProcess from "@/pages/ProcessManagement/ModifyProcess";
import HistoryVersion from "@/pages/ConfigManagement/HistoryVersion";
import ListenQuery from "@/pages/ConfigManagement/ListenQuery";
import ServiceSubscription from "@/pages/ServiceManagement/ServiceSubscription";
import PrometheusPage from "@/pages/MonitoringAlarms/Prometheus";
import SkyWalkingPage from "@/pages/MonitoringAlarms/Skywalking";

import { Navigate } from 'react-router-dom';
import KeyManagement from "../pages/SystemManagement/KeyManagement";
import ProcessEditing from "../pages/LowCodePlatforms/ProcessEditing";
import LargeScreenDisplay from "../pages/LowCodePlatforms/LargeScreenDisplay";

const suspense = (Component) => (
    <React.Suspense fallback={<div>Loading...</div>}>
        {Component}
    </React.Suspense>
)

const routes = [
    {
        path: '/',
        element: <Navigate to='/login' />
    },
    {
        path: '/home',
        element: <Navigate to='/login' />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '*',
        element: <Navigate to='/login' />
    },
    {
        path: '/',
        element: <Home />,
        children: [
            {
                path: '/serviceManagement',
                label: '服务管理',
            },
            {
                path: '/serviceManagement/serviceFind',
                label: '服务发现',
                element: suspense(<ServiceFind/>)
            },
            // {
            //     path: '/serviceManagement/serviceRegistry',
            //     label: '服务注册',
            //     element: suspense(<ServiceRegistry />)
            // },
            {
                path: '/serviceManagement/serviceDescribe',
                label: '服务订阅',
                element: suspense(<ServiceSubscription />)
            },

            {
                path: '/configManagement',
                label: '配置管理',
            },
            {
                path: '/configManagement/configList',
                label: '配置列表',
                element: suspense(<ConfigList />)
            },
            {
                path: '/configManagement/historyVersion',
                label: '历史版本',
                element: suspense(<HistoryVersion />)
            },
            {
                path: '/configManagement/listenQuery',
                label: '监听查询',
                element: suspense(<ListenQuery />)
            },

            {
                path: '/systemManagement',
                label: '系统管理'
            },
            {
                path: '/systemManagement/fileManagement',
                label: '文件管理',
                element: suspense(<FilePage />)
            },
            {
                path: '/systemManagement/terminalManagement',
                label: '终端管理',
                element: suspense(<TerminalManagement />)
            },
            {
                path: '/systemManagement/dictManagement',
                label: '字典管理',
                element: suspense(<DictionaryPage />)
            },
            {
                path: '/systemManagement/tokenManagement',
                label: '令牌管理',
                element: suspense(<TokenManagement />)
            },
            {
                path: '/systemManagement/keyManagement',
                label: '密钥管理',
                element: suspense(<KeyManagement />)
            },
            {
                path: '/podDeployment',
                label: '应用负载'
            },
            {
                path: '/podDeployment/dockerManagement',
                label: '容器管理',
                element: suspense(<DockerManagement />)
            },
            {
                path: '/podDeployment/deployManagement',
                label: '工作负载',
                element: suspense(<DeploymentManagement />)
            },
            {
                path: '/podDeployment/podManagement',
                label: 'pod管理',
                element: suspense(<PodManagement />)
            },

            {
                path: '/monitoringAlarms',
                label: '监控报警'
            },
            {
                path: '/monitoringAlarms/logManagement',
                label: '日志管理',
                element: suspense(<LogManagement />)
            },
            {
                path: '/monitoringAlarms/swManagement',
                label: '链路追踪',
                element: suspense(<SkyWalkingPage />)
            },
            {
                path: '/monitoringAlarms/pmManagement',
                label: '监控管理',
                element: suspense(<PrometheusPage />)
            },

            {
                path: '/userAuth',
                label: '用户权限'
            },
            {
                path: '/userAuth/userManagement',
                label: '用户管理',
                element: suspense(<UserManagement />)
            },
            {
                path: '/userAuth/roleManagement',
                label: '角色管理',
                element: suspense(<RoleManagement />)
            },
            {
                path: '/userAuth/permissionsManagement',
                label: '权限管理',
                element: suspense(<PermissionManagement />)
            },

            {
                path: '/lowCodePage',
                label: '低代码管理'
            },
            {
                path: '/lowCodePage/lowCodePf',
                label: '低代码平台',
                element: suspense(<LargeScreenDisplay />)
            },
            {
                path: '/lowCodePage/modify',
                label: '流程编排',
                element: suspense(<ProcessEditing />)
            },
            // {
            //     path: '/lowCodePage/autoDeploy',
            //     label: '自动化部署',
            // },

        ]
    }
];

export default routes;