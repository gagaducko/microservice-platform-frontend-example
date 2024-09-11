import routes from "./router";
import {Navigate, useLocation, useNavigate, useRoutes} from "react-router-dom";
import {ConfigProvider, message, theme} from "antd";
import zhCN from 'antd/es/locale/zh_CN'
import React, {useEffect, useState} from "react";
import {testMenu} from "./apis/login";
import Login from "./pages/Login";

function BeforeRouterEnter() {
    const [authorizedRoutes, setAuthorizedRoutes] = useState([]);
    const location = useLocation();
    let token = localStorage.getItem('access_token');

    useEffect(() => {
        const filterAuthorizedRoutes = async (routes) => {
            const filteredRoutes = [];
            for (let route of routes) {
                if (route.children) {
                    const authorizedChildren = await filterAuthorizedRoutes(route.children);
                    if (authorizedChildren.length > 0) {
                        filteredRoutes.push({ ...route, children: authorizedChildren });
                    }
                } else {
                    // 如果没有更小了，也就是最低一级目录了
                    try {
                        if(route.path === "/" || route.path === "/home" || route.path === "/login" || route.path === "*") {
                            console.log("都是跳转到login的，都直接push,其他的再做检查")
                            filteredRoutes.push(route);
                            continue;
                        }
                        await testMenu(route.path, token).then(res => {
                            console.log("path:", route.path,  "res:", res)
                            if(res.success === true) {
                                filteredRoutes.push(route);
                                console.log(route.path + res.message)
                            } else {
                                console.log(route.path + res.message)
                            }
                        }); // 检查是否有权限访问该路径
                    } catch (error) {
                        // 如果没有权限，则不添加该路径
                        console.log("something wrong")
                    }
                }
            }

            return filteredRoutes;
        };

        const checkAuthorization = async () => {
            if (token) {
                console.log("token is: ", token)
                const authorizedRoutes = await filterAuthorizedRoutes(routes);
                setAuthorizedRoutes(authorizedRoutes);
            } else {
                setAuthorizedRoutes([{
                    path: '/login',
                    element: <Login />
                }]); // 如果没有 token，设置为只有login的数组
            }
        };

        checkAuthorization().then(res => {
            console.log("check over!")
        });
    // }, [location.pathname, token]);
        // 上面的在切换页面的时候又会重新校验一次，下面的只在token变化的时候才会校验一次。
    }, [token]);

    const outlet = useRoutes(authorizedRoutes);
    localStorage.setItem("routes", JSON.stringify(authorizedRoutes));

    if (authorizedRoutes === null) {
        return <div>Loading...</div>; // 权限检查尚未完成时显示加载指示
    }

    if (!token) {
        return <Login />;
    }

    if (authorizedRoutes.length === 0 && location.pathname !== '/login') {
        // 如果没有任何授权的路由且当前路径不是登录页，跳转到登录页
        console.log("没有供授权的路由")
        // return <Navigate to="/login" replace />;
        return <Login />;
    }

    // if (token && location.pathname === '/login') {
    //     return <Navigate to="/serviceManagement/serviceFind" replace />;
    // }



    return outlet;

    // const outlet = useRoutes(routes);
    //
    // /**
    //  * 如果访问登录页面，有token，跳转到首页
    //  * 如果访问的不是登录页面，没有token，跳转到登录页面
    //  */
    //
    // if (location.pathname !== '/login' && !token) {
    //     return <Navigate to="/login" replace />;
    // }
    //
    // return outlet
}

function App() {

    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                algorithm: theme.lightAlgorithm,
                components: {
                    Menu: {
                        darkSubMenuItemBg: '#ffffff'
                    }
                }
            }}>
            <BeforeRouterEnter />
        </ConfigProvider >
    );
}

export default App;
