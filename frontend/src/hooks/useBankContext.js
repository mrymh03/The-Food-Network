import { BankContext } from "../context/BankContext";
import { useContext } from "react";

export const useBankContext = () => {
    const context = useContext(BankContext)
    if (!context) {
        throw Error()
    }

    return context
}