const URL = 'http://localhost:3001/api'

async function getAllCourses(){
    const response= await fetch(URL+'/courses');
    const courses = await response.json();

    if(response.ok){
        return courses.map((course)=>({code:course.code, name:course.name, credits:course.credits, maxstud:course.maxstud, students:course.students, prerequisite:course.prerequisite, incomp:course.incomp}))
    } else{
        throw courses;
    }
    
}

async function getStudyplan(){
    const response = await fetch(URL+'/studyplan', {credentials:'include'});
    const courses = await response.json();

    if(response.ok){
        return courses.map((course) => ({code:course.code, name:course.name, credits:course.credits, commitment:course.commitment, prerequisite:course.prerequisite}))
    } else{
        throw courses;
    }
}

function createPlan(planCourses, commitment, credits){
    let codes =[];
    planCourses.map(course => codes.push(course.code)); 
    console.log(codes);
    return new Promise((resolve,reject)=>{
        fetch (URL + '/studyplan', {
            method: 'POST',
            credentials:'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ planCourses:codes, commitment:commitment, credits:credits })
        }).then((response) => {
            if(response.ok){resolve(null);}
            else { 
                response.json()
                .then((message) => {reject(message);})
                .catch(()=>{ reject({error:"Cannot parse server response"})});
            }
        }).catch(()=> {reject({error:"Cannot comunicate with server"})});
    });
}

function deletePlan() {
    // call: DELETE /api/studyplan
    return new Promise((resolve, reject) => {
      fetch(URL+'/studyplan', {
        method: 'DELETE',
        credentials: 'include'
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          
          response.json()
            .then((message) => { reject(message); }) 
            .catch(() => { reject({ error: "Cannot parse server response." }) }); 
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); 
    });
  }

async function login(credentials) {
    let response = await fetch(URL+'/sessions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  
  async function logout() {
    await fetch(URL+'/sessions/current', { method: 'DELETE', credentials: 'include' });
  }
  
  async function getUserInfo() {
    const response = await fetch(URL+'/sessions/current', {credentials: 'include'});
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }

const API= {getAllCourses, getStudyplan, createPlan,login, logout, getUserInfo, deletePlan}
export default API;