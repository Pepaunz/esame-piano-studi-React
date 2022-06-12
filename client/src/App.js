
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container,Row } from 'react-bootstrap';
import MyNavbar from './navbar';
import {Main} from './Main';
import { useState } from 'react';

const mockCourses = [
  {code:'02GOLOV', name: 'Architetture dei sistemi di elaborazione', credits: 12 , students:0 , maxstuds:5 },
  {code:'02LSEOV' , name:'Computer architectures ', credits:12 , students:1 , maxstuds:'' },
  {code:'01SQJOV'  , name:'Data Science and Database Technology ' , credits:8 , students:1 , maxstuds:'' }
];
  
function App() {

  const [courses, setCourses] = useState(mockCourses);
  return (
    <>
    <MyNavbar />
    <Container >
      <Row > 
        <Main courses={courses} title='Lista dei corsi'/>
        <Main courses={courses} title='Piano di studi'/>
      </Row>
    </Container>    
    </>
   
  );
}

export default App;
