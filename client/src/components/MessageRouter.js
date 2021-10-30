import React, {createContext, useReducer} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const initialState = {
    messagesToSend: [],
    socket: null,
    error: null
};

const Reducer = (state, action) => {
    let messageQueue = state.messagesToSend
    messageQueue.push(action)
    
    switch (action.type) {
        case 'CELL_CLICKED':
            return {
                ...state,
                messagesToSend: messageQueue
            };
        case 'PLAYER_LOGIN':
            return {
                ...state,
                messagesToSend: messageQueue
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
            while (state.messagesToSend.length > 0) {
                state.socket.send(JSON.stringify(state.messagesToSend.shift()));
            }
        };

        state.socket.onmessage = (message) => {
            console.log(message);
        }
    }
    return (
        <MessageRouterContext.Provider value={[state, dispatch]}>
            {children}
        </MessageRouterContext.Provider>
    );
};

export const MessageRouterContext = createContext(initialState);
export default MessageRouter;