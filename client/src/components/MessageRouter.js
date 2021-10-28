import React, {createContext, useReducer} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const initialState = {
    messages: [],
    listeners: [],
    mr: {},
    error: null
};

const MessageRouterContext = createContext(null)
export { MessageRouterContext }

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

export default ({value, children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    let socket;
    let ws;

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
        ws = {
            sendMessage
        }
    }
    return (
        <MessageRouterContext.Provider value={ws}>
            {children}
        </MessageRouterContext.Provider>
    )
};
