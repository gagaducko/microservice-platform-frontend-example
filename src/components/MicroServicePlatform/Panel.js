import {Divider, Typography} from 'antd'

const {Title} = Typography

const PanelTitle = ({children}) => {
    return (
        <>
            <Title level={3} style={{marginTop: 0}}>{children}</Title>
            <Divider style={{margin: '18px 0'}}/>
        </>
    )
}

const Panel = ({title, children}) => {
    return (
        <div style={{marginBottom: 22}}>
            <PanelTitle>{title}</PanelTitle>
            {children}
        </div>
    )
}

export default Panel