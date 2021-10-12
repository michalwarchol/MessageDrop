import React from 'react'
import styles from "./Wrapper.module.scss";

interface Props {
    size?: "sm" | "md" | "lg";
}

const Wrapper:React.FC<Props> = ({size="md", children}) => {
    let cn = styles.wrapperMd;
    switch(size){
        case "lg":
            cn = styles.wrapperLg;
            break;
        case "md":
            cn = styles.wrapperMd;
            break;
        case "sm":
            cn= styles.wrapperSm;
            break;
        default: 
            cn=styles.wrapperMd;
    }
    return(
        <div className={cn}>
            {children}
        </div>
    )
}
export default Wrapper;