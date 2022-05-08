const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const {
    readStudents,
    readStudent,
    readBooks,
    readBook,
    addStudent,
    addBook,
    updateStudent,
    updateBook,
} = require('./db')


const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))


// GET end points
app.get('/students', (req, res) => {
    readStudents()
        .then(result => res.json(result))
        .catch(() => res.status(500).send('Status 500! Server error while fetching students'))
})
app.get('/student/:id', (req, res) => {
    const { id } = req.params

    readStudent(id)
        .then(result => res.json(result))
        .catch(() => res.status(500).send('Status 500! Server error while fetching students'))
})

app.get('/books', (req, res) => {
    readBooks()
        .then(result => res.json(result))
        .catch(() => res.status(500).send('Status 500! Server error while fetching books'))
})
app.get('/book/:id', (req, res) => {
    const { id } = req.params

    readBook(id)
        .then(result => res.json(result))
        .catch(() => res.status(500).send('Status 500! Server error while fetching books'))
})

// POST end points
app.post('/student', (req, res) => {
    const { firstName, lastName } = req.body

    if (!firstName || !lastName)
        return res.status(400).send('Bad request 400: form data should contain "firstName" & "lastName" variables')

    addStudent(firstName, lastName)
        .then(() => res.status(201).send('Status 201: Student created'))
        .catch(() => res.status(500).send('Status 500: Server error while creating student'))
})

app.post('/book', (req, res) => {
    const { name, author } = req.body

    if (!name || !author)
        return res.status(400).send('Bad request 400: form data should contain "name" & "author" variables')

    addBook(name, author)
        .then(() => res.status(201).send('Status 201: Book created'))
        .catch(() => res.status(500).send('Status 500: Server error while creating book'))
})

// PUT end points
app.put('/student', (req, res) => {
    const { id, firstName, lastName } = req.body

    if (!id || !firstName || !lastName)
        return res.status(400).send('Bad request 400: form data should contain "firstName", "lastName" variables')

    updateStudent(id, firstName, lastName)
        .then(() => res.status(201).send('Status 201: Student updated'))
        .catch(() => res.status(500).send('Status 500: Server error while updating student'))
})
app.put('/book', (req, res) => {
    const { bookId, name, author, studentId, borrowingDate, returnDate } = req.body

    if (!bookId || !name || !author)
        return res.status(400).send('Bad request 400: form data should contain "bookId", "name", "author", "studentId", "borrowingDate" & "returnDate" variables')

    updateBook(bookId, name, author, studentId, borrowingDate, returnDate)
        .then(() => res.status(201).send('Status 201: Book updated'))
        .catch(() => res.status(500).send('Status 500: Server error while updating book'))
})


app.get('/', (req, res) => {
    res.send('Welcome! to library backend\nUse the REST end points for CRUD operations')
})
// Starting server
app.listen(5000, () => console.log('App started'))
