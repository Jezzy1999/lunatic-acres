import React, {createContext, useReducer} from "react";

const initialState = {
    posts: [],
    error: null
};

const Reducer = (state, action) => {
    switch (action.type) {
        case 'SET_POSTS':
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
    }
};

const MessageRouter = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);

    return (
        <MessageRouterContext.Provider value={[state, dispatch]}>
            {children}
        </MessageRouterContext.Provider>
    );
};

export const MessageRouterContext = createContext(initialState);
export default MessageRouter;