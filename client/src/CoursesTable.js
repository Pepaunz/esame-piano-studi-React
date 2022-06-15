import { useState } from 'react';
import {Container, Row, Col, Table, Collapse, Button} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './custom.css'

function CoursesTable(props){
    return(
       <Container className='margintop'>
        <Row>
            <Col>
                <h2>Lista dei corsi</h2>
            </Col>
        </Row>
        <Row >
            <Col>
              <MyTable courses={props.courses} editPlan={props.editPlan}/>
            </Col>
        </Row>
       </Container>
    );
}

function MyTable(props){
    return(
        
        <Table>
            <thead >
                <tr>
                    <th>Codice</th>
                    <th>Corso</th>
                    <th>Crediti</th>
                    <th>#Studenti</th>
                    <th>#Max Studenti</th>
                </tr>
            </thead>
            
            <tbody >
                {
                    props.courses.map((course)=><MyRow course={course} key={course.code} editPlan={props.editPlan}/>)
                }
            </tbody>

        </Table>
    );
}



function MyRow(props){
    const [open,setOpen]=useState(false);

    return (
        <>
            <tr>
                <MyData course={props.course} isPlan={props.isPlan} />
                <MyAction setOpen={setOpen} open={open} expandable={props.course.prerequisite} isPlan={props.isPlan} />
            </tr>

            <Collapse in={open}>
             <tr>
                <td colSpan={3}>{props.course.prerequisite ? "Propedeuticità:  " + props.course.prerequisite : "Nessuna propedeuticità"}</td>
                <td colSpan={3}>{props.course.incomp ? "Incompatibilità:  " + props.course.incomp : "Nessuna incompatibilità"}</td>
             </tr>
            </Collapse>
            

        </>
    );
}

function MyData(props) {
    return (

        <>
            <td >{props.course.code}</td>
            <td >{props.course.name}</td>
            <td >{props.course.credits}</td>
            <td >{props.course.students}</td>
            <td >{props.course.maxstud}</td>
        </>


    );
}

function MyAction(props) {
    return (
        <>
            <td>
                <Button variant='light' onClick={() => props.setOpen((old) => !old)}>
                    {props.open ? <i className="bi bi-chevron-compact-up"></i> : <i className="bi bi-chevron-compact-down"></i>}
                </Button>
            </td>

        </>
    );
}

export {CoursesTable};


