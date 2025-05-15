import { createContext, useReducer } from 'react'
export const BankContext = createContext()

export const BankReducer = (state, action) => {
    switch (action.type){
        case 'SHOW_BANKS':
            return {
                banks: action.payload
            }
        default:
            return state
    }
}

export const BankContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(BankReducer, {
        banks: null
    })

    return (
        <BankContext.Provider value={{...state, dispatch}}>
            { children }
        </BankContext.Provider>
    )
}  