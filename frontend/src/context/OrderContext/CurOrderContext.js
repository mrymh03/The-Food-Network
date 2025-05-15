import { createContext, useReducer } from 'react'
export const CurOrderContext = createContext()

export const CurOrderReducer = (state, action) => {
    switch (action.type){
        case 'DELETE_ORDER':
            return {
                orders: state.orders.filter((o)=>o._id !==action.payload._id)
            }
        case 'SHOW_ORDERS':
            return {
                orders: action.payload
            }
        default:
            return state
    }
}

export const CurOrderContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(CurOrderReducer, {
        orders: null
    })

    return (
        <CurOrderContext.Provider value={{...state, dispatch}}>
            { children }
        </CurOrderContext.Provider>
    )
}   