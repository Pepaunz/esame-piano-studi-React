const URL = 'http://localhost:3001/api'

async function getAllCourses(){
    const response= await fetch(URL+'/courses');
    const courses = await response.json();

    if(response.ok){
        return courses.map((course)=>({code:course.code, name:course.name, credits:course.credits, maxstud:course.maxstud, prerequisite:course.prerequisite, incomp:course.incomp}))
    } else{
        throw courses;
    }
    
}

const API= {getAllCourses}
export default API;