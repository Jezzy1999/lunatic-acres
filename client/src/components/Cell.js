import React from 'react';

export default class Cell extends React.Component {


    getValue(){
        if(this.props.value.empty === 0 ){
            return null;
        }
        return "C";
    }

    render(){
        let className = "cell" + (this.props.value.isEmpty ? " is-empty" : "");

        return (
            <div ref="cell" onClick={this.props.onClick} className={className} onContextMenu={this.props.cMenu}>
                {this.getValue()}
            </div>
        );
    }
}