import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CurOrderContextProvider } from './context/OrderContext/CurOrderContext';
import { PrevOrderContextProvider } from './context/OrderContext/PrevOrderContext';
import { SubOrderContextProvider } from './context/OrderContext/SubscribedOrderContext';
import { AuthContextProvider } from './context/AuthContext';
import { BankContextProvider } from './context/BankContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BankContextProvider>
      <AuthContextProvider>
        <CurOrderContextProvider>
          <PrevOrderContextProvider>
            <SubOrderContextProvider>
              <App />
            </SubOrderContextProvider>
          </PrevOrderContextProvider>
        </CurOrderContextProvider>
      </AuthContextProvider>
    </BankContextProvider>
  </React.StrictMode>
);