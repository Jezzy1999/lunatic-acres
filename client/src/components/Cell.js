import React from 'react';

export const Cell = (props) => {

    const getValue = (className) => {
        if(props.value.isEmpty === true ){
            return null;
        }
        if (props.value.contents === 1){
            const size = 30;
            const center = 20;
            const strokeWidth = 6;
            const radius = size / 2 - strokeWidth / 2;
            const circumference = 2 * Math.PI * radius;
            const progressOffset = ((100 - props.value.percentComplete) / 100) * circumference;

            return (
                <div className="overlay-circle">
                <svg width="40px" height="40px">
                    <circle
                        stroke='#7e7e7e'
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        opacity={0.8}
                    />
                    <circle
                        stroke='#aeaeae'
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        opacity={0.9}
                        strokeDasharray={circumference}
                        strokeDashoffset={progressOffset}
                    />
                </svg>
                <img className={className} alt="barley" src="data:image/png;base64,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"/>
                </div>
            )
        }
        else {
            return "C";
        }
    }

    let className = "cell" + (props.value.isEmpty ? " is-empty" : " has-crops");

    return (
        <div onClick={props.onClick} className={className}>
            {getValue(className)}
        </div>
    );
}

export default Cell;
