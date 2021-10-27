import React from 'react';

export default class PlayerInfo extends React.Component {

    state = {
        playerName: this.props.playerName,
        playerData: [],
    };

    render(){
        return (
            <div> 
                <table className="player-info" style={{'borderRadius':'5px'}}>
                <tbody>
                    <tr>
                        <td>Money</td>
                        <td>0</td>
                    </tr>
                    <tr>
                        <td>Wheat</td>
                        <td>0</td>
                    </tr>

                </tbody>
                </table>
            </div>
        );
    }
}