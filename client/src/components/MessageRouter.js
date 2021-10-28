import React, {createContext, useReducer} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const initialState = {
    messages: [],
    listeners: [],
    mr: {},
    error: null
};

const Reducer = (state, action) => {
    console.log("Reducer:"+ state + " " + action)
    /*
    switch (action.type) {
        case 'ADD_LISTENER':
            return {
                ...state,
                posts: action.payload
            };
        case 'ADD_POST':
            return {
                ...state,
                posts: state.posts.concat(action.payload)
            };
        case 'REMOVE_POST':
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload)
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }*/
};

const MessageRouter = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    let socket;

    const sendMessage = (message) => {
        socket.emit(JSON.stringify(message));
    }

    if (!socket) {
        socket = new W3CWebSocket('ws://127.0.0.1:8080/ws');

        socket.onopen = () => {
            console.log('WebSocket Client Connected');
        };
      
        socket.onmessage = (message) => {
            //const payload = JSON.parse(msg);
            console.log(message);
        }
        state.mr = {
            socket: socket,
            sendMessage
        }        
    }
    return (
        <MessageRouterContext.Provider value={[state, dispatch]}>
            {children}
        </MessageRouterContext.Provider>
    )
};

export const MessageRouterContext = createContext(initialState);
export default MessageRouter;
