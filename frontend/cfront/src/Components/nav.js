import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
function NavBar(){
    return(
    <div>
        <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">HOME</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/search">Search</Nav.Link>
            <Nav.Link href="/testpage">Test Page</Nav.Link>
            <Nav.Link href="/userWelcome">Login</Nav.Link>
            <Nav.Link href="/userSignup">Signup</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
    );
};

export default NavBar;