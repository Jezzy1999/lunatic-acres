import React from 'react';

export const Cell = (props) => {

    const getValue = (className) => {
        if(props.value.isEmpty === true ){
            return null;
        }
        if (props.value.contents === 1){
            var sprite = "sprite-wheat" + props.value.state
            return (
                <div className={sprite}></div>
            )
        }
        return null;
    }

    let className = "cell" + (props.value.isEmpty ? " is-empty" : " has-crops");

    return (
        <div className={className} onClick={props.onClick}>
            {getValue(className)}
            {props.menu}
        </div>
    );
}

export default Cell;
