import React, {useContext, useEffect, useState} from 'react';
import Cell from './Cell';

import {MessageRouterContext} from './MessageRouter';

const WorldMap = (props) => {
    // TODO I dont know how to fix this??
    // eslint-disable-next-line  
    const [state, dispatch] = useContext(MessageRouterContext);

    const [menuActive, setMenuActive] = useState({active:false});

/*    useEffect(() => {
        const interval = setInterval(() => {

            let updatedData = [...worldData];
            let anyUpdated = false;
            for (let y = 0; y < props.height; y++) {
                for (let x = 0; x < props.width; x++) {
                    if (updatedData[y][x].isEmpty === false) {
                        updatedData[y][x].percentComplete += 1
                        anyUpdated = true;
                    }
                }
            }
            if (anyUpdated) {
                setWorldData(updatedData)
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);*/

    const handleCellClick = (x, y) => {
        setMenuActive({
            active: true,
            x: x,
            y: y,
        });
    }

    const handleMenuSelect = (event) => {
        dispatch({type: 'CELL_CLICKED', payload: JSON.stringify({playerUid: state.playerInfo.uid, x: menuActive.x, y: menuActive.y, id: event.target.id})});
    }

    const renderBoard = () => {
        return state.worldState.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => handleCellClick(dataitem.x, dataitem.y)}
                            value={dataitem}
                            menu={addActiveMenuToCell(dataitem)}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>
                );
            })
        });
    }

    const renderMenu = () => {
        return (
            <div className={menuActive ? "dropdown" : "invisible-div"}>
                <ul>
                    <li onClick={handleMenuSelect} id="fertilize">Fertilize</li>
                    <li className="sub">Plant
                        <ul>
                            <li onClick={handleMenuSelect} id="plant_wheat">Wheat</li>
                        </ul>
                    </li>
                    <li onClick={handleMenuSelect} id="harvest">Harvest</li>
                </ul>
            </div>
        )
    }

    const addActiveMenuToCell = (dataitem) => {
        if (menuActive.active) {
            if ((menuActive.x === dataitem.x) &&
                (menuActive.y === dataitem.y)) {
                return renderMenu();
            }
        }
        return null;
    }

    return <div className="board">
        {
            renderBoard()
        }
        </div>;
}

export default WorldMap;