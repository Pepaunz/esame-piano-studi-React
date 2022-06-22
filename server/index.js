'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const cors = require('cors');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB


// init express
const app = new express();
const port = 3001;

/*** Set up Passport ***/
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Username e/o password errati.' });
        
      return done(null, user);
    })
  }
));

 
 passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); 
    }).catch(err => {
      done(err, null);
    });
});

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions)); 

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'not authenticated'});
}

  // set up the session
  app.use(session({
    secret: "l'inganno della cadrega",
    resave: false,
    saveUninitialized: false 
  }));
  
  // then, init passport
  app.use(passport.initialize());
  app.use(passport.session());
  

/*API*/

//GET /api/courses
app.get('/api/courses', async (req,res)=>{
  try{
    const courses = await dao.listCourses();
    const incomp = await dao.getIncompatibility();
    const students = await dao.getStudents();
  
    
    
    courses.forEach( (elem) => {
      elem.students = students.filter((s)=>s.coursecode === elem.code).map((j) =>{
        return j.students;
      });
    });

    courses.forEach( (elem) => {
      elem.incomp = incomp.filter((i)=>i.coursecode === elem.code).map((j) =>{
        return j.incompatible;
      });
    });

  
    res.json(courses);
  }
  catch(err){
    console.log(err);
    res.status(500).json({error: `Database error while retrieving studyplan`}).end();
  }
});

// GET /api/studyplan
app.get('/api/studyplan', isLoggedIn, async (req, res) => {
  try {
    const studyplan = await dao.listStudyplan(req.user.id);
    res.json(studyplan);
  } catch(err) {
    console.log(err);
    res.status(500).json({error: `Database error while retrieving studyplan`}).end();
  }
});



//POST /api/studyplan
 app.post('/api/studyplan',isLoggedIn,[
  check('planCourses.*').isString().isLength({min:7, max:7}),
  check('credits').isInt(),
  check('commitment').isString().isLength({min:4,max:4 })
] ,async (req,res) =>{
  const errors= validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors: errors.array()});
  }
  const planCourses=req.body.planCourses;
  const commitment=req.body.commitment;
  const credits = req.body.credits

  try{

    const plan = await dao.checkPlan(req.user.id);
    if(plan){
      await dao.deletePlan(req.user.id);
      await dao.updateCommitment(null,req.user.id)
    }
    
    
    // recupero tutte le informazioni dei corsi dal dao
    let result=[]; 
    for (const code of planCourses){
      const row = await dao.getCourse(code);
      result.push(row);
    }
    //aggiungo incompatibilita
    const incomp = await dao.getIncompatibility();
    result.forEach(elem => {
      elem.incomp = incomp.filter((i)=>i.coursecode === elem.code).map((j) =>{
        return j.incompatible;
      });
    });

    //aggiungo numerostudenti
    const students = await dao.getStudents();
    result.forEach( (elem) => {
      elem.students = students.filter((s)=>s.coursecode === elem.code).map((j) =>{
        return j.students;
      });
    });

    //scorro l'array per fare i controlli

    result.map(course=>{
      if(checkIncomp(course,result))
        throw "alcuni corsi nel piano di studi sono incompatibili tra loro";
      if(checkMaxstud(course))
         throw "numero massimo di studenti raggiunto"
       if(!checkPrerequisite(course,result))
        throw "propedeuticita' non rispettata"
      if(!checkCredits(commitment,credits))
        throw "numero di crediti incorretto"
    })

   
    result.map( async (course)=>{
       await dao.insertCourse(course.code,req.user.id);
    })

    await dao.updateCommitment(commitment,req.user.id);
    res.status(200).end();
  
  }
  catch(err){
    res.status(503).json({error:"Validation error:" + err}).end();
  }
})

//delete /api/studyplan
app.delete('/api/studyplan', isLoggedIn, async(req,res)=>{
  try{
      await dao.deletePlan(req.user.id);
      await dao.updateCommitment(null,req.user.id);
      res.status(204).end();
  } catch(err){
      res.status(503).json({error:"Database error during deleting plan"})
  }
});

// utility
 function checkIncomp(course,courses){
    const incomp = course.incomp;
    if(incomp.length){
      for ( const inc of incomp){
        if(courses.some((c) => c.code===inc))
          return true
      }
      } else return false  
  }

  function checkMaxstud(course){
    const maxstud= course.maxstud;
    const students= course.students[0];
    return maxstud&&maxstud===students
  }

  function checkPrerequisite(course,courses){
    const prerequisite = course.prerequisite;
    if (prerequisite){
       return courses.some((c)=>c.code===prerequisite )
      }
    else return true
  }

  function checkCredits(commitment,credits){
    if(commitment ==="full"){
      if(credits < 60 || credits >80)
        return false
      else return true
      
    }
    else if(commitment ==="part"){
      if(credits < 20 || credits >40)
        return false
      else
        return true
      }
    }

    /* USERS API */
//login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        return res.json(req.user);
      });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});