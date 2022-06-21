import './custom.css'
import { useState } from 'react';
import { Container, Row, Col, Table, Collapse, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';


function CoursesTable(props) {
    return (
        <Container className='margintop'>
            <Row>
                <Col>
                    <h2>Lista dei corsi</h2>
                </Col>
            </Row>
            <Row >
                <Col>
                    <MyTable courses={props.courses} editPlan={props.editPlan} addCourse={props.addCourse} checkError={props.checkError} />
                </Col>
            </Row>
        </Container>
        
    );
}

function MyTable(props) {
    return (

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
                    props.courses.map((course) => <MyRow  course={course} key={course.code} editPlan={props.editPlan} addCourse={props.addCourse} checkError={props.checkError} />)
                }
            </tbody>

        </Table>
    );
}



function MyRow(props) {
    const [open, setOpen] = useState(false);
    const err = props.checkError(props.course);
    let msg="";
    switch(err){
        case  "exist" : msg="Il corso è già stato inserito nel piano di studio";
            break;
        case "incomp" : msg="Non puoi inserire questo corso perchè incompatibile";
            break;
        case "max" : msg="Numero massimo di studenti raggiunto";
            break;
        default : break
    }

    return (
        <>{err&&props.editPlan ? 
            <OverlayTrigger
            delay={{ hide: 450, show: 300 }}
            overlay={(props) => (
              <Tooltip {...props}>
                {msg}
              </Tooltip>
            )}
            placement="right"
          >
            <tr className="table-inactive">
                <MyData course={props.course} />
                <MyAction err={err} setOpen={setOpen} open={open} editPlan={props.editPlan} addCourse={props.addCourse} course={props.course} />
            </tr>
            </OverlayTrigger> 
            :  <tr >
                <MyData course={props.course} />
                <MyAction err={err} setOpen={setOpen} open={open} editPlan={props.editPlan} addCourse={props.addCourse} course={props.course} />
                </tr>
            }
         <Collapse in={open}>
             <tr>
                <td colSpan={3}>{props.course.prerequisite ? "Propedeuticità:  " + props.course.prerequisite : "Nessuna propedeuticità"}</td>            
                <td colSpan={3}>{props.course.incomp.length ? "Incompatibilità:  " + props.course.incomp : "Nessuna incompatibilità"}</td>
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
        <td>    
            <Button variant='light' onClick={() => props.setOpen((old) => !old) }>
                {props.open ? <i className="bi bi-chevron-compact-up"></i> : <i className="bi bi-chevron-compact-down"></i>}
            </Button>
            {props.editPlan ? <Button className='btn-margin' disabled={props.err} variant='dark' onClick={() => props.addCourse(props.course)}> <i className="bi bi-journal-plus"></i> </Button> : false}
        </td>
    );
}

export { CoursesTable };


