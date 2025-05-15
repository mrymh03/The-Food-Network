/*
    FILE: ConsumerSearch.js [COMPLETE]
    AUTHOR: jch-r
    DEPENDENCIES: NavBarCD
*/
import NavBarCD from '../../components/NavBarCD'
import SearchBar from '../../components/SearchBar'

const ConsumerSearch = () => {
    return (
        <div className="consumer">
            <NavBarCD />
            <h1>CONSUMER SEARCH</h1>
            <SearchBar />
        </div>
    )
}

export default ConsumerSearch