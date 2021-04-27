var http = require('http');
const Joi = require('joi');
const host = '0.0.0.0';
const express = require('express');
const app = express();

app.use(express.json());
const students = [
    { id: 1, name: 'student1', code: 'abc1235' },
    { id: 2, name: 'student2', code: 'abc1245' },
    { id: 3, name: 'student3', code: 'abc1255' }
];
const courses = [
    { id: 1, name: 'course1', code: 'abc123', description: '' },
    { id: 2, name: 'course2', code: 'abc124', description: '' },
    { id: 3, name: 'course3', code: 'abc125', description: '' }
];

app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/web/courses/create', (req, res) => {
    res.render("Page2.html");
});
app.get('/web/students/create', (req, res) => {
    res.render("Page1.html");
});

// To respond to http get request
app.get('/'/* path or url '/' represrnts route of the website*/, /* callback function */(req, res) => {
    // This req object has a bunch of useful propereties u can refrence documentation for more info
    res.send('Hello E7 Experment');
});

// to get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// to get all students
app.get('/api/students', (req, res) => {
    res.send(students);
});


app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    res.send(course);
});
// to get single student
// api/students/1 to get student of id 1
app.get('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }
    res.send(student);
});


app.post('/api/courses', (req, res) => {
    // validate request
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        code: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z][a-zA-Z][a-zA-Z][0-9][0-9][0-9]$')).required(),
        description: Joi.string().max(200).optional()
    });

    const result = schema.validate(req.body);
    //console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }


    const course = {
        id: courses.length + 1,
        name: req.body.name,
        code: req.body.code,
        description: req.body.description// assuming that request body there's a name property
    };
    courses.push(course);
    res.send(course);
});


// Updating resources
app.put('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    course.name = req.body.name;
    course.code = req.body.code;
    course.description = req.body.description;
    res.send(course);
});


// Deleting a course
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});


app.post('/api/students', (req, res) => {
    // validate request
    const schema = Joi.object({
        name: Joi.string().pattern(new RegExp('^([a-zA-Z0-9]|_|\')*$')).required(),
        code: Joi.string().min(7).max(7).required()
    });


    const result = schema.validate(req.body);
    //console.log(result);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const student = {
        id: students.length + 1,
        name: req.body.name,
        code: req.body.code
        // assuming that request body there's a name property
    };
    students.push(student);
    res.send(student);
});


// Updating resources
app.put('/api/students/:id', (req, res) => {
    // Look up the student 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    const { error } = validatestudent(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the student 
    // Return the updated student
    student.name = req.body.name;
    student.code = req.body.code;

    res.send(student);
});


// Deleting a student
app.delete('/api/students/:id', (req, res) => {
    // Look up the student 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }

    // Delete
    const index = students.indexOf(student);
    students.splice(index, 1);

    // Return the same student
    res.send(student);
});

// Environment variable
const port = process.env.port || 3000;

app.listen(port /*PortNumber*/, host, () => console.log(`Listeneing on port ${port}......`) /* optionally a function that called when the app starts listening to the given port */);



function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        code: Joi.string().min(6).pattern(new RegExp('^[a-zA-Z][a-zA-Z][a-zA-Z][0-9][0-9][0-9]$')).required(),
        description: Joi.string().max(200).optional()
    });
    return schema.validate(course);
}



function validatestudent(student) {
    const schema = Joi.object({
        name: Joi.string().pattern(new RegExp('^([a-zA-Z0-9]|_|\')*$')).required(),
        code: Joi.string().min(7).max(7).required()
    });
    return schema.validate(student);
}
