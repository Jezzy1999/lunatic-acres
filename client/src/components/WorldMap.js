import React from 'react';
import Cell from './Cell';

import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
} from "react-contextmenu";

export default class WorldMap extends React.Component {

    state = {
        worldData: this.initWorldData(this.props.height, this.props.width),
        gameWon: false,
    };

    ComponentDidMount() {
    }
    /* Helper Functions */

    // Gets initial board data
    initWorldData(height, width) {
        let data = [];

        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isEmpty: true,
                };
            }
        }
        console.log(data);
        return data;
    }

    // Handle User Events

    handleCellClick(x, y) {
        let win = false;

        let updatedData = this.state.worldData;
        updatedData[x][y].isEmpty = !updatedData[x][y].isEmpty;

        this.setState({
            worldData: updatedData,
            gameWon: win,
        });
    }

    handleClick = (e, data, target) => {
        const { socket } = this.props;

        //console.log(e, data, target);
        console.log(data.cell_x);
        console.log(data.cell_y);

        socket.send('Hello from React, cell clicked at ' + data.cell_x + ',' + data.cell_y);
    }

    renderMenu(active, x, y) {
        return (
        <div>
            <ContextMenu id="some_unique_identifier">
                <MenuItem data={{d:"some_data"}} onClick={this.handleClick}>
                    ContextMenu Item 1
                </MenuItem>
                <MenuItem data={{d:"some_data"}} onClick={this.handleClick}>
                    ContextMenu Item 2
                </MenuItem>
                <MenuItem divider />
                <MenuItem data={{d:"some_data"}} onClick={this.handleClick}>
                    ContextMenu Item 3
                </MenuItem>
            </ContextMenu>
        </div>
        );
    }

    renderBoard(data) {
        return data.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <ContextMenuTrigger
                        id="some_unique_identifier"
                        cell_x={dataitem.x}
                        cell_y={dataitem.y}
                        collect={p => p}
                    >
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => this.handleCellClick(dataitem.x, dataitem.y)}
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>
                    </ContextMenuTrigger>
                    );
            })
        });
    }
    // Component methods
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
            this.setState({
                boardData: this.initWorldData(nextProps.height, nextProps.width),
                gameWon: false,
            });
        }
    }

    render() {
        return (
            <div className="board">
                {
                    this.renderBoard(this.state.worldData)
                }
                {
                    this.renderMenu(this.state.menuActive)
                }
            </div>
        );
    }
}