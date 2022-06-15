import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './custom.css'
import { useState } from 'react';

function StudyplanTable(props) {
    return (
        <Container className='margintop'>
            <Row>
                <Col>
                    <h2>Piano di studi</h2>
                </Col>
            </Row>
            <Row >
                <Col>
                    <MyTable courses={props.courses} editPlan={props.editPlan} />
                </Col>
            </Row>
        </Container>
    );
}

function MyTable(props) {
    return (
        <>
            {props.commitment === "full" ? <h5>Piano full-time. Inserire da 60 a 80 crediti </h5> : <h5>Piano part-time. Inserire da 20 a 40 crediti </h5>}
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
                    {props.courses.map((course) => <MyRow course={course} key={course.code} isPlan={true} />)}
                </tbody>
            </Table>
        </>
    )
}

function MyRow(props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <tr>
                <MyData course={props.course} isPlan={props.isPlan} />
                <MyAction setOpen={setOpen} open={open} expandable={props.course.prerequisite} isPlan={props.isPlan} />
            </tr>
        </>
    );
}

function MyData(props) {
    return (
        <>
            <td >{props.course.code}</td>
            <td >{props.course.name}</td>
            <td >{props.course.credits}</td>
            <td >{props.course.incomp}</td>
        </>
    );
}

function MyAction(props) {
    return (
        <>
            <td>

            </td>

        </>
    );
}
export {StudyplanTable}