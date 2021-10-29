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

    const handleClick = (e, data, target) => {
        //const { socket } = this.props;

        //console.log(e, data, target);
        console.log(data.cell_x);
        console.log(data.cell_y);

        //const [state, dispatch] = useContext(MessageRouterContext);
        //state.mr.sendMessage('Hello from React, cell clicked at ' + data.cell_x + ',' + data.cell_y);
    }

    const renderMenu = () => {
        return (
        <div>
            <ContextMenu id="some_unique_identifier">
                <MenuItem data={{d:"some_data"}} onClick={handleClick}>
                    ContextMenu Item 1
                </MenuItem>
                <MenuItem data={{d:"some_data"}} onClick={handleClick}>
                    ContextMenu Item 2
                </MenuItem>
                <MenuItem divider />
                <MenuItem data={{d:"some_data"}} onClick={handleClick}>
                    ContextMenu Item 3
                </MenuItem>
            </ContextMenu>
        </div>
        );
    }

    const renderBoard = () => {
        return worldData.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <ContextMenuTrigger
                        id={"some_unique_identifier_" + dataitem.x + "_" + dataitem.y}
                        cell_x={dataitem.x}
                        cell_y={dataitem.y}
                        collect={p => p}
                    >
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => handleCellClick(dataitem.x, dataitem.y)}
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>
                    </ContextMenuTrigger>
                    );
            })
        });
    }

    return <div className="board">
        {
            renderBoard()
        }
        {
            renderMenu()
        }
        </div>;
}

export default WorldMap;