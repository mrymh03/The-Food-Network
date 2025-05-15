import { createContext, useReducer } from 'react'
export const PrevOrderContext = createContext()

export const PrevOrderReducer = (state, action) => {
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

export const PrevOrderContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(PrevOrderReducer, {
        orders: null
    })

    return (
        <PrevOrderContext.Provider value={{...state, dispatch}}>
            { children }
        </PrevOrderContext.Provider>
    )
}   