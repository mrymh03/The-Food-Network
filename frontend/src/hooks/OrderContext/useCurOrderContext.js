import { CurOrderContext } from "../../context/OrderContext/CurOrderContext";
import { useContext } from "react";

export const useCurOrderContext = () => {
    const context = useContext(CurOrderContext)
    if (!context) {
        throw Error()
    }

    return context
}