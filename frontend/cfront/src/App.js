import Search from "./Components/Search";
import TestPage from "./Components/testPage";
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import NavBar from "./Components/nav";
import UserWelcome from "./Components/userWelcome";
import UserSignup from "./Components/userSignup";
import Favourites from "./Components/favourites";
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
      </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
