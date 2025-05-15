/*
    DEPENDENCIES: react-router-dom
*/
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

//AUTH PAGES:
import { useAuthContext } from './hooks/useAuthContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/auth/Home'

//FOOD BANK PAGES:
import FoodBank from './pages/foodbank/FoodBank'
import FoodBankOrderManagement from './pages/foodbank/FoodBankOrderMgmt'
import FoodBankProfileManagement from './pages/foodbank/FoodBankProfileMgmt'

//CONSUMER PAGES:
import ConsumerPage from './pages/consumer/Consumer'
import ConsumerSearch from './pages/consumer/ConsumerSearch'

//Using lambda expressions to create RBAC
function App() {
  const { user } = useAuthContext()
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route 
              path="/"
              element = {user ? (user.role == 'fb' ? <Navigate to="/foodbank/home"/> : <Navigate to="/consumer/home"/>) : <Home/>}
            />
            <Route 
              path="/login"
              element = {user ? (user.role == 'fb' ? <Navigate to="/foodbank/home"/> : <Navigate to="/consumer/home"/>) : <Login/>}
            />
            <Route 
              path="/register"
              element = {user ? (user.role == 'fb' ? <Navigate to="/foodbank/home"/> : <Navigate to="/consumer/home"/>) : <Register />}
            />
            <Route 
              path="/foodbank/home"
              element = {user ? (user.role == 'fb' ? <FoodBank /> : <Navigate to="/consumer/home"/>) : <Navigate to="/" />}
            />
            <Route 
              path="/foodbank/management"
              element = {user ? (user.role == 'fb' ? <FoodBankOrderManagement /> : <Navigate to="/consumer/home"/>) : <Navigate to="/" />}
            />
            <Route 
              path="/foodbank/profile"
              element = {user ? (user.role == 'fb' ? <FoodBankProfileManagement /> : <Navigate to="/consumer/home"/>) : <Navigate to="/" />}
            />
            <Route 
              path="/consumer/home"
              element = {user ? (user.role == 'consumer' ? <ConsumerPage /> : <Navigate to="/foodbank/home"/>) : <Navigate to="/" />}
            />
            <Route 
              path="/consumer/search"
              element = {user ? (user.role == 'consumer' ? <ConsumerSearch /> : <Navigate to="/foodbank/home"/>) : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
