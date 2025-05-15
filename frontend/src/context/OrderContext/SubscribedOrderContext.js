import { createContext, useReducer } from 'react'
export const SubOrderContext = createContext()

export const SubOrderReducer = (state, action) => {
    switch (action.type){
        case 'SHOW_ORDERS':
            return {
                orders: action.payload
            }
        case 'UNSUBSCRIBE':
            return {
                orders: state.orders.filter((o)=>o.bank_id !==action.payload.bank_id)
            }
        default:
            return state
    }
}

export const SubOrderContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(SubOrderReducer, {
        orders: null
    })

    return (
        <SubOrderContext.Provider value={{...state, dispatch}}>
            { children }
        </SubOrderContext.Provider>
    )
}   