'use strict'

const sqlite = require('sqlite3');

const db= new sqlite.Database('studyplan.sqlite', (err)=>{
    if(err) throw err;
});

// get all courses

exports.listCourses = () => {
    return new Promise((resolve,reject)=>{
        const sql = 'select code,name,credits, maxstud, prerequisite, group_concat(incompatible) as incomp from course left join  incompatibility on course.code=incompatibility.coursecode group by code order by name';
        db.all(sql, [], (err,rows)=>{
            if(err){
                reject(err);
                return;
            }
            const courses = rows.map((course)=>({code: course.code, name:course.name, credits:course.credits, maxstud:course.maxstud, prerequisite:course.prerequisite, incomp:course.incomp}));
            resolve(courses);
        });
    });
};