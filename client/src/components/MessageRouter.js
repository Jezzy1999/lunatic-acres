import React, {createContext, useReducer} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const initialState = {
    posts: [],
    socket: null,
    error: null
};

const Reducer = (state, action) => {
    switch (action.type) {
        case 'CELL_CLICKED':
            state.socket.send(JSON.stringify(action));
            return {
                ...state,
                posts: action.payload
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