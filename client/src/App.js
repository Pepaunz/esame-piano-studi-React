
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Container,Row} from 'react-bootstrap';
import MyNavbar from './navbar';
import Main from './Main'
import {CoursesTable} from './CoursesTable';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import API from './API';
import { LoginForm } from './login';

  const mockCourses = [
 
   {code:'02LSEOV' , name:'Computer architectures ', credits:12 , students:1 , maxstuds:'' ,incomp:"02GOLOV"},
   {code:'01SQJOV'  , name:'Data Science and Database Technology ' , credits:8 , students:1 , maxstuds:'' ,incomp:"3348932" }
 ]; 

 function App(){
  return (
    <Router>
      <App2/>
    </Router>
  )
}
  
function App2() {

  const [courses, setCourses] = useState([]);
  const [editPlan, setEditPlan] = useState(false);
  const [commitment, setCommitment] = useState("");
  const [planCourses, setPlanCourses]= useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');
  const[credits,setCredits] = useState(0);
   
  const navigate = useNavigate();

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch(err) {
        console.log(err);
      }
    };
    checkAuth();
  }, []);
  

  useEffect(()=>{
    API.getAllCourses()
    .then((courses)=>setCourses(courses))
    .catch(err=>console.log(err))
  },[loggedIn,editPlan]);

  useEffect(()=>{
    if(loggedIn){
      
    API.getStudyplan()
    .then((courses)=>{setPlanCourses(courses)})
    .catch(err=>console.log(err));
  }
  setCredits(0)
  },[loggedIn, editPlan] );

 useEffect(()=>{
  let credits=0;
  planCourses.map(course => credits= credits + course.credits);
  setCredits(credits);
  if(planCourses[0]&&!commitment)
    setCommitment(planCourses[0].commitment);
 });
 
 
   
  function addCourse(course){
    if(!planCourses.some((c)=>c.code===course.code)){
      if(!checkMaxstud(course)){
      if(!checkIncomp(course)){
        if(checkPrerequisite(course)){
          setPlanCourses((old)=>[...old,course]);
          setCredits((old)=>old + course.credits);
        }
        else setErrorMsg("Devi prima inserire il corso propedeutico a questo");
      }
    }
    }   
  }
  function checkMaxstud(course){
    const maxstud= course.maxstud;
    const students= course.students[0];
    return maxstud&&maxstud===students;
  }

  function checkIncomp(course){
    const incomp = course["incomp"];
    if(incomp.length){
      for ( const inc of incomp){
        if(planCourses.some((c) => c.code===inc))
          return true
      }
      } else return false  
  }

  function checkPrerequisite(course){
    const prerequisite = course.prerequisite;
    if (prerequisite){
       return planCourses.some((c)=>c.code===prerequisite )
      }
    else return true
  }

  function checkError(course){
    let error = '';
    console.log(checkMaxstud(course));
    if(checkMaxstud(course))
    error="max"
    if(planCourses.some(c=>c.code===course.code))
      error="exist";
    if(checkIncomp(course))
      error="incomp";
    return error;

  }



function removeCourse(course){
  const code=course.code;
  if(planCourses.some(c=>c.prerequisite===course.code)){
    setErrorMsg("Non puoi eliminare questo corso perchè è propedeutico ad un altro");
  }
  else{
  setPlanCourses(planCourses.filter(f=> f.code!== code));
  setCredits(old=> old - course.credits);
  }
}

function savePlan(){
  if(commitment ==="full"){
    if(credits < 60 || credits >80)
      setErrorMsg("Compila correttamente il piano rispettando il vincolo dei crediti");
    else{
      API.createPlan(planCourses,commitment,credits)
      .then(()=> {setEditPlan(old=>!old); navigate('/');})
      .catch(err => console.log(err));
    }
  }
  else if(commitment ==="part"){
    if(credits < 20 || credits >40)
      setErrorMsg("Compila correttamente il piano rispettando il vincolo dei crediti");
    else{
      API.createPlan(planCourses,commitment,credits)
      .then(()=> {setEditPlan(old=>!old); navigate('/');})
      .catch(err => console.log(err));
    } 
    }
  }

  function deletePlan(){
    API.deletePlan()
    .then(()=> { setPlanCourses([]); setEditPlan(false);})
    .catch( err =>console.log(err))
   
  }

  const doLogin = (credentials) => {
    API.login(credentials)
      .then( user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        navigate('/');
       
      })
      .catch(err => {
        setMessage(err);
      }
        )
  }

  const doLogout = async () => {
    console.log("logout");
    await API.logout();
    setLoggedIn(false);
    setUser({});
    setPlanCourses([]);
    setEditPlan(false);
  }

 



  return (
    <>
      <MyNavbar logout={doLogout} name={user.name} />
      <Container>
        <Row >
          <CoursesTable courses={courses} editPlan={editPlan} addCourse={addCourse} checkError={checkError}/>
        </Row>
      </Container>
      <Routes>
      <Route path='/' element={loggedIn ? (<Main planCourses={planCourses} editPlan={editPlan}  errorMsg={errorMsg} setErrorMsg={setErrorMsg} setCredits={setCredits} credits={credits} commitment={commitment}
      setEditPlan={setEditPlan} setCommitment={setCommitment} removeCourse={removeCourse} savePlan={savePlan} deletePlan={deletePlan}/>) : <Navigate to='/login'/>}/>
      <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginForm login={doLogin} loginError={message} setLoginError={setMessage} /> }/>
      </Routes>
      
    </>

  );
}



export default App;
