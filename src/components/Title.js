import appConfig from '../../config.json';
import React from "react";


export default function Title(props) {
    const Tag = props.tag || 'h1';
    return (
        <>
            <Tag>
                {props.children}
            </Tag>
            <style jsx>{`
            ${Tag}{
                color: ${appConfig.theme.colors.neutrals['200']}
            }`

            }</style>
        </>
    )
}