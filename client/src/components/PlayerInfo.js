import React, {useContext, useEffect} from 'react';

import {MessageRouterContext} from './MessageRouter';

export const PlayerInfo = (props) => {

    const [state, dispatch] = useContext(MessageRouterContext);
    
    useEffect(() => {
        dispatch({type: 'PLAYER_LOGIN', payload: JSON.stringify({playerName:"chris"})});
    }, []);

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
