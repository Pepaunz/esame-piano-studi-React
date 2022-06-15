import { useState } from 'react';
import {Container, Row, Col, Table, Collapse, Button} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './custom.css'

function Main(props){
    return(
       <Container className='margintop'>
        <Row>
            <Col>
                <h2>{props.title}</h2>
            </Col>
        </Row>
        <Row >
            <Col>
              {props.onlyCourses ? <CourseTable courses={props.courses} editPlan={props.editPlan}/> : <PlanTable courses={props.courses} commitment={props.commitment}/> }  
            </Col>
        </Row>
       </Container>
    );
}

function CourseTable(props){
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

function PlanTable(props){
    return(
        <>
        {props.commitment ==="full" ? <h5>Piano full-time. Inserire da 60 a 80 crediti </h5> :  <h5>Piano part-time. Inserire da 20 a 40 crediti </h5> }
        <Table>
            <thead>
                <tr>
                    <th>Codice</th>
                    <th>Corso</th>
                    <th>Crediti</th>
                    <th>Incompatibilità</th>
                </tr>
            </thead>

            <tbody>
                {props.courses.map((course)=> <MyRow course={course} key={course.code} isPlan={true}/>)}
            </tbody>
        </Table>
        </>
    )
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

function MyData(props){
    return(
        <>
        {
        props.isPlan ?
        <>
            <td >{props.course.code}</td>
            <td >{props.course.name}</td> 
            <td >{props.course.credits}</td> 
            <td >{props.course.incomp}</td> 
        </> :
        <>
        <td >{props.course.code}</td>
        <td >{props.course.name}</td> 
        <td >{props.course.credits}</td> 
        <td >{props.course.students}</td> 
        <td >{props.course.maxstud}</td> 
    </>
        }
    </>
    );
}

function MyAction(props){
    return(
        <> 
        {props.isPlan ? 
        <>
        
        </> :  <td>
                <Button variant='light' onClick={()=>props.setOpen((old)=>!old)}>
                    {props.open ?  <i className="bi bi-chevron-compact-up"></i> : <i className="bi bi-chevron-compact-down"></i> }  
                </Button> 
            </td>
        }       
        </>  
    );
}

export {Main};


