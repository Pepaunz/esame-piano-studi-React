import {Navbar, Container, Nav, Button} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function MyNavbar(props){
     return (
        <Navbar fixed="top" bg="dark" variant="dark"  >
          <Container fluid>
            <Navbar.Brand style={{cursor:'pointer'}} > 
            <i className="bi bi-book-half"></i>
            {'  '}Studyplanner
            </Navbar.Brand>

               <Nav>
              {props.name ?
              <>
                <Navbar.Brand>Welcome {props.name} </Navbar.Brand>
                <Button onClick={props.logout}  variant='dark' size='sm' >Logout</Button>  
              </>
                :
                false
              }
              </Nav>
               
          </Container>
        </Navbar>
      );
  }
  export default MyNavbar;