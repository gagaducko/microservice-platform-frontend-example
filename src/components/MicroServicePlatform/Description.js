import {Typography} from 'antd'

const {Text} = Typography
const Description = ({title, wrap = false, children}) => {
    return (
        <div style={{
            lineHeight: '40px'
        }}>
            {wrap ? (
                <>
                    <Text strong={true}>
                        {title}
                    </Text>
                    <br/>
                    <Text style={{marginTop: 20}}>
                        {children}
                    </Text>
                </>
            ) : (
                <>
                    <Text strong={true}>
                        {title}:
                    </Text>
                    <Text style={{marginLeft: 10}}>
                        {children}
                    </Text>
                </>
            )}

        </div>
    )
}

export default Description