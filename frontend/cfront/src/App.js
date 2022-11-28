import Search from "./Components/Search";
import TestPage from "./Components/testPage";
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import NavBar from "./Components/nav";
import UserWelcome from "./Components/userWelcome";
import UserSignup from "./Components/userSignup";
import Favourites from "./Components/favourites";
import Loader from "./Components/loader";
import AccountSettings from "./Components/accountSettings";
import FavChart from "./Components/favChart";
function App() {
  
  return (
    <div>
      <NavBar/>
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<UserWelcome/>}/>
        <Route path="/search/" element={<Search/>}/>
        <Route path="/testpage/" element={<TestPage/>}/>
        <Route path="/userWelcome/" element={<UserWelcome/>}/>
        <Route path="/userSignup/" element={<UserSignup/>}/>
        <Route path="/favourites/" element={<Favourites/>}/>
        <Route path="/loader/" element={<Loader/>}/>
        <Route path="/settings/" element={<AccountSettings/>}/>
        <Route path="/chart/" element={<FavChart/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
