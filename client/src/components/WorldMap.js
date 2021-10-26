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

    tick() {

        let updatedData = this.state.worldData;
        for (let y = 0; y < this.props.height; y++) {
            for (let x = 0; x < this.props.width; x++) {
                if (updatedData[y][x].isEmpty === false) {
                    updatedData[y][x].percentComplete += 1
                }
            }
        }
        this.setState({
            worldData: updatedData,
        });
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);        
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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
                    contents: 0,
                    percentComplete: 0,
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
        if (updatedData[x][y].isEmpty === true) {
            updatedData[x][y].contents = 1;
            updatedData[x][y].isEmpty = false
        } else {
            updatedData[x][y].contents += 1;

            if (updatedData[x][y].contents > 2) {
                updatedData[x][y].isEmpty = true
                updatedData[x][y].percentComplete = 0
            }
        }

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
    componentDidReceiveProps(nextProps) {
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