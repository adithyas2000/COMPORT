import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import getAuthState from './authRender';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import env from 'react-dotenv';
function NavBar() {
  function logout() {
    const lhost = env.LOCALHOST;
    var res = axios.get(lhost + 'logout/', { headers: { "Authorization": window.sessionStorage.getItem("auth") } })
      .then(
        r => {
          window.sessionStorage.removeItem("auth");
          window.sessionStorage.removeItem("name");
          window.location.href = "/userWelcome";
        }
      )
    // alert("Auth:"+window.sessionStorage.getItem("auth"));

  }

  var authToken = window.sessionStorage.getItem("auth");
  var authorized = (authToken !== null);
  return (
    <div>

      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/"><h1 style={{ color: '#4da6ff' }}>Comport</h1></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/testpage">Test Page</Nav.Link>
            {!getAuthState() && <Nav.Link href="/userWelcome">Login</Nav.Link>}
            {!getAuthState() && <Nav.Link href="/userSignup">Signup</Nav.Link>}
            <Nav.Link href="/favourites">Favourites</Nav.Link>



            {getAuthState() && <NavDropdown title={"Account : " + window.sessionStorage.getItem("name")} id="basic-nav-dropdown">
              <NavDropdown.Item href="#">Action</NavDropdown.Item>
              <NavDropdown.Item href="#">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">
                <p id='logoutTextNavbar' onClick={logout}>LOGOUT</p>
              </NavDropdown.Item>
            </NavDropdown>}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
