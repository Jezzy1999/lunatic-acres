import React, {useContext, useEffect} from 'react';
import Cell from './Cell';

import {MessageRouterContext} from './MessageRouter';

import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
} from "react-contextmenu";

const WorldMap = (props) => {

    const [state, dispatch] = useContext(MessageRouterContext);

    const [worldData, setWorldData] = React.useState(
        () => {
            let data = [];
            for (let y = 0; y < props.height; y++) {
                data.push([]);
                for (let x = 0; x < props.width; x++) {
                    data[y][x] = {
                        x: x,
                        y: y,
                        isEmpty: true,
                        contents: 0,
                        percentComplete: 0,
                    };
                }
            }
            return data;
        }
    );

    useEffect(() => {
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
    }, []);

    const handleCellClick = (x, y) => {
        let updatedData = [...worldData];
        if (updatedData[y][x].isEmpty === true) {
            updatedData[y][x].contents = 1;
            updatedData[y][x].isEmpty = false
        } else {
            updatedData[y][x].contents += 1;

            if (updatedData[y][x].contents > 2) {
                updatedData[y][x].isEmpty = true
                updatedData[y][x].percentComplete = 0
            }
        }
        setWorldData(updatedData)

        dispatch({type: 'CELL_CLICKED', payload: {x:x, y:y}});
    }

    const renderBoard = () => {
        return worldData.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => handleCellClick(dataitem.x, dataitem.y)}
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>
                );
            })
        });
    }

    return <div className="board">
        {
            renderBoard()
        }
        </div>;
}

export default WorldMap;