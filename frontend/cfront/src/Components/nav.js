import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
function NavBar(){
    return(
    <div>
        <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="http://localhost:3000/">HOME</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="http://localhost:3000/search">Search</Nav.Link>
            <Nav.Link href="http://localhost:3000/testpage">Test Page</Nav.Link>
            <Nav.Link href="http://localhost:3000/userWelcome">Login</Nav.Link>
            <Nav.Link href="http://localhost:3000/userSignup">Signup</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
    );
};

export default NavBar;