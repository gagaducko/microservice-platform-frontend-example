import IconFont from '@/components/DataManagement/IconFont'
import React from "react";

const SolidIcon = ({icon, background, size = 28}) => {

    return (
        <div style={{
            width: Math.ceil(size * 1.6),
            height: Math.ceil(size * 1.6),
            background: background,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
        }}>
            <IconFont type={icon} style={{fontSize: size}}/>
        </div>
    )
}

export default SolidIcon