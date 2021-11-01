import React, {createContext, useReducer} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const initialState = {
    messagesToSend: [],
    playerInfo: {},
    socket: null,
    connectedToServer: false,
    error: null
};

const Reducer = (state, action) => {
    let messageQueue = state.messagesToSend
    
    switch (action.type) {
        case 'SERVER_CONNECTED':
            return {
                ...state,
                connectedToServer: true
            };
        case 'CELL_CLICKED':
            messageQueue.push(action)
            return {
                ...state,
                messagesToSend: messageQueue
            };
        case 'PLAYER_LOGIN':
            messageQueue.push(action)
            return {
                ...state,
                messagesToSend: messageQueue
            };
        case 'PLAYER_UPDATE':
            let playerInfo = {Money: action.payload.money, Wheat: action.payload.seeds}
            return {
                ...state,
                playerInfo: playerInfo
            };
        default:
            return state;
    }
};

const MessageRouter = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    if (!state.socket) {
        state.socket = new W3CWebSocket('ws://127.0.0.1:8080/ws');

        state.socket.onopen = () => {
            console.log('WebSocket Client Connected');
            dispatch({type:"SERVER_CONNECTED", payload:null})
        };

        state.socket.onmessage = (message) => {
            const messageStruct = JSON.parse(message.data);
            const payloadObject = JSON.parse(messageStruct.payload);

            switch (messageStruct.type) {
                case "PLAYER_STATS":
                    dispatch({type:"PLAYER_UPDATE", payload:payloadObject})
                    break;
                default:
                    console.log("Unknown message type:" + messageStruct.type);
            }
        }
    }
    while ((state.messagesToSend.length > 0) && state.connectedToServer) {
        state.socket.send(JSON.stringify(state.messagesToSend.shift()));
    }
    return (
        <MessageRouterContext.Provider value={[state, dispatch]}>
            {children}
        </MessageRouterContext.Provider>
    );
};

export const MessageRouterContext = createContext(initialState);
export default MessageRouter;