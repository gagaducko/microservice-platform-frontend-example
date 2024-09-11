// import {
//     AppstoreOutlined,
//     AuditOutlined,
//     BookOutlined,
//     BorderOutlined,
//     BulbOutlined,
//     CiCircleOutlined,
//     ContactsOutlined,
//     ContainerOutlined,
//     FileTextOutlined,
//     GlobalOutlined,
//     MailOutlined,
//     PrinterOutlined,
//     ReconciliationOutlined,
//     RobotOutlined, SafetyOutlined,
//     SaveOutlined,
//     SendOutlined,
//     SignatureOutlined,
//     SnippetsOutlined,
//     TeamOutlined,
//     TranslationOutlined,
//     UserOutlined
// } from "@ant-design/icons";
// import { Menu, theme } from "antd";
// import { useNavigate, useLocation } from "react-router-dom";
//
// const items = [
//     {
//         label: '服务管理',
//         key: '/serviceManagement',
//         icon: <BookOutlined />,
//         children: [
//             {
//                 label: '服务发现',
//                 key: '/serviceManagement/serviceFind',
//                 icon: <PrinterOutlined />
//             },
//             // {
//             //     label: '服务注册',
//             //     key: '/serviceManagement/serviceRegistry',
//             //     icon: <SaveOutlined />
//             // },
//             {
//                 label: '服务订阅',
//                 key: '/serviceManagement/serviceDescribe',
//                 icon: <MailOutlined />
//             }
//         ]
//     },
//     {
//         label: '配置管理',
//         key: '/configManagement',
//         icon: <RobotOutlined />,
//         children: [
//             {
//                 label: '配置列表',
//                 key: '/configManagement/configList',
//                 icon: <SendOutlined />
//             },
//             {
//                 label: '历史版本',
//                 key: '/configManagement/historyVersion',
//                 icon: <SignatureOutlined />
//             },
//             // {
//             //     label: '监听查询',
//             //     key: '/configManagement/listenQuery',
//             //     icon: <SnippetsOutlined />
//             // }
//         ]
//     },
//     {
//         label: '系统管理',
//         key: '/systemManagement',
//         icon: <BookOutlined />,
//         children: [
//             {
//                 label: '文件管理',
//                 key: '/systemManagement/fileManagement',
//                 icon: <ContainerOutlined />
//             },
//             {
//                 label: '密钥管理',
//                 key: '/systemManagement/keyManagement',
//                 icon: <GlobalOutlined />
//             },
//             {
//                 label: '字典管理',
//                 key: '/systemManagement/dictManagement',
//                 icon: <RobotOutlined />
//             },
//             {
//                 label: '令牌管理',
//                 key: '/systemManagement/tokenManagement',
//                 icon: <SafetyOutlined />
//             },
//         ]
//     },
//     {
//         label: '部署管理',
//         key: '/podDeployment',
//         icon: <ReconciliationOutlined />,
//         children: [
//             {
//                 label: '容器管理',
//                 key: '/podDeployment/dockerManagement',
//                 icon: <ContainerOutlined />
//             },
//             {
//                 label: '工作负载',
//                 key: '/podDeployment/deployManagement',
//                 icon: <AppstoreOutlined />
//             },
//             {
//                 label: 'pod管理',
//                 key: '/podDeployment/podManagement',
//                 icon: <GlobalOutlined />
//             }
//         ]
//     },
//     {
//         label: '监控管理',
//         key: '/monitoringAlarms',
//         icon: <RobotOutlined />,
//         children: [
//             {
//                 label: '日志管理',
//                 key: '/monitoringAlarms/logManagement',
//                 icon: <FileTextOutlined />
//             },
//             {
//                 label: '链路追踪',
//                 key: '/monitoringAlarms/swManagement',
//                 icon: <TranslationOutlined />
//             },
//             // {
//             //     label: '监控告警',
//             //     key: '/monitoringAlarms/pmManagement',
//             //     icon: <AuditOutlined />
//             // }
//         ]
//     },
//     {
//         label: '用户权限',
//         key: '/userAuth',
//         icon: <ContactsOutlined />,
//         children: [
//             {
//                 label: '用户管理',
//                 key: '/userAuth/userManagement',
//                 icon: <UserOutlined />
//             },
//             {
//                 label: '角色管理',
//                 key: '/userAuth/roleManagement',
//                 icon: <TeamOutlined />
//             },
//             {
//                 label: '权限管理',
//                 key: '/userAuth/permissionsManagement',
//                 icon: <SafetyOutlined />
//             }
//         ]
//     },
//     {
//         label: '低代码管理',
//         key: '/lowCodePage',
//         icon: <BookOutlined />,
//         children: [
//             {
//                 label: '流程编排',
//                 key: '/lowCodePage/modify',
//                 icon: <BorderOutlined />
//             },
//             {
//                 label: '低代码平台',
//                 key: '/lowCodePage/lowCodePf',
//                 icon: <BulbOutlined />
//             },
//             // {
//             //     label: '自动化部署',
//             //     key: '/lowCode/autoDeploy',
//             //     icon: <CiCircleOutlined />
//             // },
//         ]
//     },
// ]
//
// const View = () => {
//     const navigateTo = useNavigate();
//
//     const currentRoute = useLocation();
//
//     const menuClick = (e) => {
//         navigateTo(e.key);
//     }
//
//     const {
// 		token: { colorBgContainer },
// 	} = theme.useToken();
//
//     const routeParser = (str) => {
//         let arr = str.split("/");
//         if (arr.length === 0) throw new Error('Router parser error, path is NULL.');
//         let res = [""];
//         for (let x = 1; x < arr.length; x++) {
//             res[x] = res[x - 1] + '/' + arr[x];
//         }
//         return res.filter(item => item !== '');
//     }
//
//
//     const routeLastKey = (routeItem, path) => {
//         /*
//          * 返回最末端合法的 path, 用于侧边菜单栏的激活
//          */
//         const routeKeyArray = (arr) => {
//             /*
//              * 以数组形式返回 items 中的所有 key 集合
//              */
//             let res = [];
//             // console.log(arr);
//             for (let element of arr) {
//                 res.push(element.key);
//                 if ('children' in element) {
//                     routeKeyArray(element.children).map((_) => res.push(_));
//                 }
//             }
//             return res;
//         }
//         let routeParses = routeParser(path);
//         for (let routeParse of routeParses.reverse()) {
//             if (routeKeyArray(routeItem).includes(routeParse)){
//                 return routeParse;
//             }
//         }
//         throw new Error("routeLastKey() error, legal route is NULL.");
//     }
//
//     const checkMenuAuth = () => {
//         console.log("check menu now!")
//     }
//
//     return (
//         <Menu
//             defaultSelectedKeys={[routeLastKey(items, currentRoute.pathname)]}
//             defaultOpenKeys={routeParser(currentRoute.pathname)}
//             mode="inline"
//             items={items}
//             onClick={menuClick}
//             style={{
//                 background: colorBgContainer
//             }}
//             theme="light"
//         />
//     )
// }
//
// export default View;


import {
    AppstoreOutlined,
    BookOutlined, ContactsOutlined,
    ContainerOutlined, FileTextOutlined,
    GlobalOutlined,
    MailOutlined,
    PrinterOutlined,
    ReconciliationOutlined,
    RobotOutlined,
    SafetyOutlined,
    SendOutlined,
    SignatureOutlined,
    TeamOutlined,
    TranslationOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Menu, theme } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const initialItems = [
    {
        label: '服务管理',
        key: '/serviceManagement',
        icon: <BookOutlined />,
        children: [
            { label: '服务发现', key: '/serviceManagement/serviceFind', icon: <PrinterOutlined /> },
            { label: '服务订阅', key: '/serviceManagement/serviceDescribe', icon: <MailOutlined /> },
        ]
    },
    {
        label: '配置管理',
        key: '/configManagement',
        icon: <RobotOutlined />,
        children: [
            { label: '配置列表', key: '/configManagement/configList', icon: <SendOutlined /> },
            { label: '历史版本', key: '/configManagement/historyVersion', icon: <SignatureOutlined /> },
        ]
    },
    {
        label: '系统管理',
        key: '/systemManagement',
        icon: <BookOutlined />,
        children: [
            { label: '文件管理', key: '/systemManagement/fileManagement', icon: <ContainerOutlined /> },
            { label: '密钥管理', key: '/systemManagement/keyManagement', icon: <GlobalOutlined /> },
            { label: '字典管理', key: '/systemManagement/dictManagement', icon: <RobotOutlined /> },
            { label: '令牌管理', key: '/systemManagement/tokenManagement', icon: <SafetyOutlined /> },
        ]
    },
    {
        label: '部署管理',
        key: '/podDeployment',
        icon: <ReconciliationOutlined />,
        children: [
            { label: '容器管理', key: '/podDeployment/dockerManagement', icon: <ContainerOutlined /> },
            { label: '工作负载', key: '/podDeployment/deployManagement', icon: <AppstoreOutlined /> },
            { label: 'pod管理', key: '/podDeployment/podManagement', icon: <GlobalOutlined /> },
        ]
    },
    {
        label: '监控管理',
        key: '/monitoringAlarms',
        icon: <RobotOutlined />,
        children: [
            { label: '日志管理', key: '/monitoringAlarms/logManagement', icon: <FileTextOutlined /> },
            { label: '链路追踪', key: '/monitoringAlarms/swManagement', icon: <TranslationOutlined /> },
        ]
    },
    {
        label: '用户权限',
        key: '/userAuth',
        icon: <ContactsOutlined />,
        children: [
            { label: '用户管理', key: '/userAuth/userManagement', icon: <UserOutlined /> },
            { label: '角色管理', key: '/userAuth/roleManagement', icon: <TeamOutlined /> },
            { label: '权限管理', key: '/userAuth/permissionsManagement', icon: <SafetyOutlined /> },
        ]
    },
    {
        label: '低代码管理',
        key: '/lowCodePage',
        icon: <BookOutlined />,
        children: [
            { label: '流程编排', key: '/lowCodePage/modify', icon: <SendOutlined /> },
            { label: '低代码平台', key: '/lowCodePage/lowCodePf', icon: <MailOutlined /> },
        ]
    },
];

// 获取并处理路由，递归提取所有的路径
const getRoutePaths = (routes) => {
    let paths = new Set();
    const traverseRoutes = (routes) => {
        routes.forEach(route => {
            if (route.path) {
                paths.add(route.path);
            }
            if (route.children) {
                traverseRoutes(route.children);
            }
        });
    };
    traverseRoutes(routes);
    return paths;
};

const View = () => {
    const navigateTo = useNavigate();
    const currentRoute = useLocation();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const menuClick = (e) => {
        navigateTo(e.key);
    };

    const authorizedRoutes = JSON.parse(localStorage.getItem("routes")) || [];
    console.log("authorizedRoutes is: ", authorizedRoutes)
    // const routeKeySet = new Set(authorizedRoutes.map(route => route.path));
    const routeKeySet = getRoutePaths(authorizedRoutes);
    console.log("routeKeySet", routeKeySet)
    const filterMenuItems = (menuItems) => {
        return menuItems.reduce((filtered, item) => {
            if (item.children) {
                const filteredChildren = filterMenuItems(item.children);
                if (filteredChildren.length > 0) {
                    filtered.push({ ...item, children: filteredChildren });
                }
            } else if (routeKeySet.has(item.key)) {
                filtered.push(item);
            }
            return filtered;
        }, []);
    };

    const filteredItems = filterMenuItems(initialItems);

    return (
        <Menu
            defaultSelectedKeys={[currentRoute.pathname]}
            defaultOpenKeys={[currentRoute.pathname]}
            mode="inline"
            items={filteredItems}
            onClick={menuClick}
            style={{ background: colorBgContainer }}
            theme="light"
        />
    );
};

export default View;
