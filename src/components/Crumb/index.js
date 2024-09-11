import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import routes from '@/router';

const Crumb = () => {
    // 判断路由是否匹配，处理路径参数逻辑
    const matchRoute = (path, routePath) => {
        const pathParts = path.split('/').filter(p => p)
        const routeParts = routePath.split('/').filter(p => p)
        if (pathParts.length !== routeParts.length) {
            return false
        }
        return routeParts.every((part, index) => part.startsWith(':') || part === pathParts[index])
    }

    // 根据路径查找匹配路由，处理Children
    const findRoute = (path, routes, parentPath = '') => {
        for (const route of routes) {
            const fullPath = parentPath + route.path
            if (matchRoute(path, fullPath)) {
                return route
            }
            if (route.children) {
                const foundRoute = findRoute(path, route.children, fullPath)
                if (foundRoute) {
                    return foundRoute
                }
            }
        }
        return null
    }

    const location = useLocation()
    const pathSnippets = location.pathname.split('/').filter(i => i)

    let breadcrumbItems = pathSnippets.map((_, index, arr) => {
        const url = `/${arr.slice(0, index + 1).join('/')}`
        const route = findRoute(url, routes)
        const isLast = index === arr.length - 1
        return route ? {title: isLast ? route.label : <Link to={url}>{route.label}</Link>, key: url} : null
    }).filter(Boolean)

    let content = [];
    breadcrumbItems.forEach((item, idx) => {
        content.push(<span style={{ color: item.title.props ? '' : '#000' }} key={'_'+idx}>{item.title.props ? item.title.props.children : item.title}</span>);
        item.title.props ? content.push(<span style={{ margin: '0 8px' }} key={idx}>/</span>) : console.log('');
    })

    return (
        <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
            { content }
        </div>
    )
}
export default Crumb;
