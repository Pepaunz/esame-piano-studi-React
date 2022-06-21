import { Col, Button, Row, Container } from 'react-bootstrap';
import {StudyplanTable} from './StudyplanTable'
function Main(props) {
    return(
      <>
      {!props.planCourses.length && !props.editPlan ?
      <Container className='mt-5'>
        <Row className='justify-content-center mb-3'>
          <Col md="auto"> <h3>Non hai nessun piano di studi. Creane uno adesso</h3></Col>
        </Row>
        <Row className='justify-content-center mb-3' >
        <Col md='auto' > <Button variant='dark' onClick={() => {props.setEditPlan(old => !old); props.setCommitment("full");}}>Full-time</Button></Col>
        <Col md='auto' > <Button variant='dark' onClick={() => {props.setEditPlan(old => !old); props.setCommitment("part");} }>Part-time</Button></Col>
        </Row>
      </Container>
      : <>
        <StudyplanTable 
        errorMsg={props.errorMsg} setErrorMsg={props.setErrorMsg} setCredits={props.setCredits} credits={props.credits} courses={props.planCourses} commitment={props.commitment}
        setEditPlan={props.setEditPlan} editPlan={props.editPlan} removeCourse={props.removeCourse} savePlan={props.savePlan} deletePlan={props.deletePlan} />
      </>
    }
    </>);
  }

  export default Main;