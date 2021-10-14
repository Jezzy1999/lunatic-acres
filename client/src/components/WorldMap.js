import React from 'react';
import Cell from './Cell';

export default class WorldMap extends React.Component {
    state = {
        worldData: this.initWorldData(this.props.height, this.props.width),
        gameWon: false,
    };

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

    _handleContextMenu(e, x, y) {
        e.preventDefault();
        let updatedData = this.state.worldData;
        let win = false;

        this.setState({
            worldData: updatedData,
            gameWon: win,
        });
    }

    renderBoard(data) {
        return data.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => this.handleCellClick(dataitem.x, dataitem.y)}
                            cMenu={(e) => this._handleContextMenu(e, dataitem.x, dataitem.y)}
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>);
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
            </div>
        );
    }
}