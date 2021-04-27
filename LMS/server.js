'use strict';
var http = require('http');
const host = '0.0.0.0';
const port = process.env.PORT || 3000;
const express = require('express');     
const app = express();      
app.use(express.json());
const Joi = require('joi'); 
app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
const courses = [
    { id: 1, name: 'AI', code: 'cse999' },
    { id: 2, name: 'DIP', description: 'digital image proccessing', code: 'cse888' },
    { id: 3, name: 'control' ,code: 'cse555'}
];
function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        code: Joi.string().pattern(new RegExp('^[a-zA-Z][a-zA-Z][a-zA-Z][0-9][0-9][0-9]$')).required(),
        description: Joi.string().max(200).optional()
    });
    return schema.validate(course);
}
app.get('/', (req, res) => {
    res.send("LMS");
});
app.get('/web/courses/create', (req, res) => {
    res.render("course.html");
});
app.get('/web/students/create', (req, res) => {
    res.render("student.html");
});
app.get('/api/courses', (req, res) => {
    res.send(courses);
});
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('THe course with the given id was not found.');
    res.send(course);
});
app.post('/api/courses', (req, res) => {
    const  result  = validateCourse(req.body);
    if (result.error)  return res.status(400).send(result.error.details[0].message);
    const course = {
        id: courses.length + 1,
        name: req.body.name,
        description: req.body.description,
        code: req.body.code
    };
    courses.push(course);
    res.send(course);
});
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('THe course with the given id was not found.');
    const result  = validateCourse(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    course.name = req.body.name;
    course.description = req.body.description;
    course.code = req.body.code;
    res.send(course);
});
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('THe course with the given id was not found.');
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});
const students = [
    { id: 1, name: 'AEA', code: '1600137' },
    { id: 2, name: 'AMM', code: '1234567' },
    { id: 3, name: 'AMA', code: '7654321' }
];
function validatestudent(student) {
    const schema = Joi.object({
        name: Joi.string().pattern(new RegExp('^([a-zA-Z0-9]|_|\')*$')).required(),
        code: Joi.string().min(7).max(7).required()
    });
    return schema.validate(student);
}
app.get('/api/students', (req, res) => {
    res.send(students);
});
app.get('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('THe student with the given id was not found.');
    res.send(student);
});
app.post('/api/students', (req, res) => {
    const result = validatestudent(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    const student = {
        id: students.length + 1,
        name: req.body.name,
        code: req.body.code
    };
    students.push(student);
    res.send(student);
});
app.put('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('THe student with the given id was not found.');
    const result = validatestudent(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    student.name = req.body.name;
    student.code = req.body.code;
    res.send(student);
});
app.delete('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('THe course with the given id was not found.');
    const index = students.indexOf(student);
    students.splice(index, 1);
    res.send(student);
});
app.listen(port, host, function () {
    console.log("Server started");
});
