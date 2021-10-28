import React, {createContext} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const MessageRouterContext = createContext(null)
export { MessageRouterContext }

export default ({value, children}) => {
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
