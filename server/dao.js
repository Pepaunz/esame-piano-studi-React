'use strict'

const sqlite = require('sqlite3');

const db= new sqlite.Database('studyplan.sqlite', (err)=>{
    if(err) throw err;
});

// get all courses

exports.listCourses = () => {
    return new Promise((resolve,reject)=>{
        const sql = 'select * from course order by name';
        db.all(sql, [], (err,rows)=>{
            if(err){
                reject(err);
                return;
            }
            const courses = rows.map((course)=>({code: course.code, name:course.name, credits:course.credits, maxstud:course.maxstud, students:course.students, prerequisite:course.prerequisite}));
            resolve(courses);
        });
    });
};

exports.getCourse = (code) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM course WHERE code=?';
    db.get(sql, [code], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({error: 'Course not found.'});
      } else {
        const course = { code: row.code, name: row.name, credits: row.credits, maxstud:row.maxstud, prerequisite:row.prerequisite};
        resolve(course);
      }
    });
  });
  };

  exports.getIncompatibility = () =>{
    return new Promise((resolve, reject)=> {
      const sql = 'SELECT * FROM incompatibility';
      db.all(sql, (err,rows) => {
        if(err){
          reject(err);
          return;
        }
        const incomp = rows.map((row) => ({coursecode: row.coursecode, incompatible: row.incompatible}));
        resolve(incomp);
      })
    })
  }

 exports.getStudents = () => {
    return new Promise((resolve, reject)=>{
      const sql = 'SELECT coursecode, COUNT(*) as students FROM studyplan group by coursecode';
      db.all(sql,(err,rows)=>{
        if (err){
          reject(err);
          return;
        }
        else {
          const stud = rows.map((row)=> ({coursecode:row.coursecode, students:row.students}));
          resolve(stud);
        }
      })
    })
  }

  exports.insertCourse = (coursecode,userid) =>{
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO studyplan(coursecode,userid) VALUES(?, ?)';
      db.run(sql, [coursecode,userid], function (err) {  
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    }); 
  }

  exports.updateCommitment = (commitment,userid) =>{
    return new Promise((resolve,reject) =>{
        const sql = "UPDATE user SET commitment=? WHERE id=?";
        db.run(sql,[commitment,userid], (err)=>{
            if(err){
                reject(err);
                return;
            }
            console.log("cambiato")
            resolve();
        })
    })
  }

  exports.listStudyplan = (userId) => {
    return new Promise((resolve, reject) => {
      const sql ='SELECT code, C.name, credits, prerequisite, commitment FROM studyplan S JOIN course C on C.code=S.coursecode JOIN user U on S.userid=U.id WHERE userid = ?';
  
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const plan = rows.map((e) => (
          {
            code: e.code,
            name: e.name,
            credits: e.credits,
            prerequisite: e.prerequisite,
            commitment: e.commitment,
          }));
  
        resolve(plan);
      });
    });
  };

  exports.checkPlan = (userid) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM studyplan WHERE userid=?';
      db.get(sql, [userid], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (row == undefined) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

  }

  exports.deletePlan = (userid) => {
    return new Promise((resolve,reject) => {
        const sql = 'DELETE FROM studyplan WHERE userid = ?';
        db.run(sql,[userid], (err)=>{
            if(err){
                reject(err);
                return;
            }else
                resolve(null);
        });
    });
};