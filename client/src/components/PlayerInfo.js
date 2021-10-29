import React from 'react';

export const PlayerInfo = (props) => {

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

export default PlayerInfo;
