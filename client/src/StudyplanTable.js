import { Container, Row, Col, Table, Button, Badge, Alert } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './custom.css'
import {  useState } from 'react';

function StudyplanTable(props) {

    return (
        <Container className='margintop'>
              {props.errorMsg ? <Alert variant='danger' onClose={() => props.setErrorMsg('')} dismissible>{props.errorMsg}</Alert> : false}
            <Row className='justify-content-between'>
                <Col md={4}>
                    <h2>Piano di studi</h2>
                </Col>
                <Col md={4}> <Credits credits={props.credits} setCredits={props.setCredits} courses={props.courses} commitment={props.commitment} /></Col>
            </Row>   
            <Row >
                <Col>
                    <MyTable courses={props.courses} commitment={props.commitment} editPlan={props.editPlan}  savePlan={props.savePlan} deletePlan={props.deletePlan} setEditPlan={props.setEditPlan} removeCourse={props.removeCourse}/>
                </Col>
            </Row>
        </Container>

    );
}

function Credits(props){
    const credits = props.credits;
    let min=0;
    let max=0;
    const commitment=props.commitment;
    if(commitment==="full"){
        min = 60;
        max =80
    }
    else if(commitment==='part'){
        min=20;
        max=40;
    }
    return(
      <h5 className='text-end'>Crediti: <Badge bg={credits>=min&&credits<=max ? "success" : "danger"}>{credits}</Badge> </h5>  
    );
}

function MyTable(props) {


    return (
        <>
            {props.editPlan&&props.commitment&&props.commitment === "full" ? <h5>Piano full-time. Inserire da 60 a 80 crediti </h5> : false}
            {props.editPlan&&props.commitment&&props.commitment === "part" ? <h5>Piano part-time. Inserire da 20 a 40 crediti </h5> : false}
            {props.editPlan ? false : <Button className='btn-right' variant="warning" onClick={()=>{props.setEditPlan((old)=>!old); }}> Modifica </Button>}
            {props.editPlan ? false : <Button variant="dark" onClick={()=>props.deletePlan()}> Cancella </Button>}
            <Table>
                <thead>
                    <tr>
                        <th>Codice</th>
                        <th>Corso</th>
                        <th>Crediti</th>
                    </tr>
                </thead>

                <tbody>
                    {props.courses.map((course) => <MyRow course={course} key={course.code} editPlan={props.editPlan} removeCourse={props.removeCourse} />)}
                </tbody>
            </Table>
            {props.editPlan ?  <Button className='btn-right' variant="warning" onClick={()=>props.savePlan()}>Salva</Button> : false }
            {props.editPlan ?  <Button variant="dark" onClick={()=>props.setEditPlan((old)=>!old)}>Annulla</Button> : false }
        </>
    )
}

function MyRow(props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <tr>
                <MyData course={props.course}/>
                <MyAction setOpen={setOpen} open={open} course={props.course} editPlan={props.editPlan}  removeCourse={props.removeCourse}/>
            </tr>
        </>
    );
}

function MyData(props) {
    return (
        <>
            <td  >{props.course.code}</td>
            <td >{props.course.name}</td>
            <td >{props.course.credits}</td>     
        </>
    );
}

function MyAction(props) {
    return (
        <>
            <td className='text-center'>
        {props.editPlan ? <Button variant="warning" onClick={()=>props.removeCourse(props.course)}> <i className="bi bi-x-square"></i></Button> : false }
            </td>

        </>
    );
}
export {StudyplanTable}