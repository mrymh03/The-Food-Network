import { useState } from "react"
import { Link } from 'react-router-dom'
import { useAuthContext } from "../../hooks/useAuthContext"
import MapComponent from "../../components/Map.js"
import MapForHome from "../../components/MapForHome.js"

const Home = () => {
    return(
         <body>
            <div class= "navigation">
            <p class="logo">THE FOOD NETWORK</p>
            <Link to="/login">
            <button class= "signup">My Account</button>
            </Link>
            </div>
            <div class= "b">
                <div class="section">
                <img width= "50%" src="familyDinner.jpg"/>
                <p>The Food Network is a tool to help your family find nearby food banks for your dietary needs. Find a nearby food bank,
                or, search for a specific food your family needs and we will help you locate it. Make a free account to start!
                </p>
                </div>
                &nbsp;
                <div class="section">
                <p>If you are a food bank representative, this is a resource you can use to help your community find you. List what you
                usually keep in stock so that families with specific needs can find you. Make an account today!</p>
                <img width="50%" src="foodBank.jpg"/>
                </div>
                <div >
                        <h2>Find Food Banks Near You</h2>
                        <MapForHome />
                </div>
                <div>
                <p>THE FOOD NETWORK</p>
                </div>
            </div>
        </body>
    )
}
export default Home;