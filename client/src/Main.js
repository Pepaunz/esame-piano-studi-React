import {Container, Row, Col, Table} from 'react-bootstrap';
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
            <Col   >
                <MyTable courses={props.courses}/>
            </Col>
        </Row>
       </Container>
    );
}

function MyTable(props){
    return(
        
        <Table responsive>
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
                    props.courses.map((course)=><MyRow course={course} key={course.code}/>)
                }
            </tbody>

        </Table>
    );
}

function MyRow(props){
    return(
        <>
        <tr >
            <MyData course= {props.course}/> 
            <MyAction/>
        </tr>
         </>
    );
}

function MyData(props){
    return(
        <>
            <td >{props.course.code}</td>
            <td >{props.course.name}</td> 
            <td >{props.course.credits}</td> 
            <td >{props.course.students}</td> 
            <td >{props.course.maxstuds}</td> 
        </>
    );
}

function MyAction(props){
    return(
        <td>
        </td>
    );
}

export {Main};