
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container,Row,Col } from 'react-bootstrap';
import MyNavbar from './navbar';
import {Main} from './Main';
import { useEffect, useState } from 'react';
import API from './API';

 const mockCourses = [
  {code:'02GOLOV', name: 'Architetture dei sistemi di elaborazione', credits: 12 , students:0 , maxstuds:5 },
  {code:'02LSEOV' , name:'Computer architectures ', credits:12 , students:1 , maxstuds:'' },
  {code:'01SQJOV'  , name:'Data Science and Database Technology ' , credits:8 , students:1 , maxstuds:'' }
]; 
  
function App() {

  const [courses, setCourses] = useState([]);
  const [editPlan, setEditPlan] = useState(false);
  const [commitment, setCommitment] = useState("");

  useEffect(()=>{
    API.getAllCourses()
    .then((courses)=>setCourses(courses))
    .catch(err=>console.log(err))
  },[]);

  return (
    <>
      <MyNavbar />
      <Container  >
        <Row >
          <Main onlyCourses={true} courses={courses} title='Lista dei corsi' editPlan={editPlan} />
        </Row>
      </Container>
      {!editPlan ?
        <Container className='mt-5'>
          <Row >
            <Col md={8}> <h3>Non hai nessun piano di studio. Creane uno adesso</h3></Col>
            <Col md={2}> <Button variant='dark' onClick={() => {setEditPlan(old => !old); setCommitment("full")}}>Full-time</Button></Col>
            <Col md={2}> <Button variant='dark' onClick={() => {setEditPlan(old => !old); setCommitment("part")} }>Part-time</Button></Col>
          </Row>
        </Container>
        : <>
          <Main courses={[]} title="Piano di studio" commitment={commitment} />
        </>
      }
    </>

  );
}

export default App;
