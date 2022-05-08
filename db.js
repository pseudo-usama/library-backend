const { Client, Pool } = require('pg')






function readStudents() {
    return new Promise((async (resolve, rej) => {
        let conn
        try {
            conn = await openConnection()
            const result = await conn.query('SELECT * FROM student ORDER BY id;')
            resolve(result.rows)
        }
        catch (err) {
            console.error(err)
            rej()
        }
        endConnection(conn)
    }))
}

function readStudent(id) {
    return new Promise((async (resolve, rej) => {
        let conn
        try {
            conn = await openConnection()
            const result = await conn.query(`
                SELECT * FROM student
                WHERE id=${id};
            `)
            resolve(result.rows[0])
        }
        catch (err) {
            console.error(err)
            rej()
        }
        endConnection(conn)
    }))
}

function readBooks() {
    return new Promise((async (resolve, rej) => {
        let conn
        try {
            conn = await openConnection()
            const result = await conn.query(`
                SELECT book.*, student.first_name, CONCAT(student.first_name, ' ', student.last_name) AS student_name
                FROM book
                LEFT JOIN student
                ON student.id = book.student_id
                ORDER BY book.id;
            `)
            resolve(result.rows)
        }
        catch (err) {
            console.error(err)
            rej()
        }
        endConnection(conn)
    }))
}

function readBook(id) {
    return new Promise((async (resolve, rej) => {
        let conn
        try {
            conn = await openConnection()
            const result = await conn.query(`
                SELECT book.*, CONCAT(student.first_name, ' ', student.last_name) AS student_name
                FROM book
                LEFT JOIN student
                ON student.id = book.id
                WHERE book.id = ${id};
            `)
            resolve(result.rows[0])
        }
        catch (err) {
            console.error(err)
            rej()
        }
        endConnection(conn)
    }))
}

function addStudent(firstName, lastName) {
    return new Promise(async (resolve, rej) => {
        let conn
        try {
            conn = await openConnection()
            const result = await conn.query(`
                INSERT INTO student(first_name, last_name)
                VALUES('${firstName}', '${lastName}');
            `)
            resolve()
        }
        catch (err) {
            console.error(err)
            rej()
        }
        endConnection(conn)
    })
}

function addBook(name, author) {
    return new Promise(async (resolve, rej) => {
        let conn
        try {
            conn = await openConnection()
            const result = await conn.query(`
                INSERT INTO book(name, author)
                VALUES('${name}', '${author}');
            `)
            resolve()
        }
        catch (err) {
            console.error(err)
            rej()
        }
        endConnection(conn)
    })
}

function updateStudent(id, firstName, lastName) {
    return new Promise(async (resolve, rej) => {
        let conn
        try {
            conn = await openConnection()
            const result = await conn.query(`
                UPDATE student
                SET
                    first_name='${firstName}',
                    last_name='${lastName}'
                WHERE id=${id};
            `)
            resolve()
        }
        catch (err) {
            console.error(err)
            rej()
        }
        endConnection(conn)
    })
}

function updateBook(bookId, name, author, studentId, borrowingDate, returnDate) {
    return new Promise(async (resolve, rej) => {
        let conn
        try {
            conn = await openConnection()
            const result = await conn.query(`
                UPDATE book
                SET
                    name='${name}',
                    author='${author}'
                    ${studentId ? ',student_id=' + studentId : ''}
                    ${borrowingDate ? ",borrowing_date='" + borrowingDate + "'" : ''}
                    ${returnDate ? ",return_date='" + returnDate + "'" : ''}
                WHERE id=${bookId};
            `)
            resolve()
        }
        catch (err) {
            console.error(err)
            rej()
        }
        endConnection(conn)
    })
}


async function openConnection() {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'library',
        password: 'pseudo',
        port: 5432,
    })
    return pool


    // const client = new Client({
    //     user: 'postgres',
    //     host: 'localhost',
    //     database: 'library',
    //     password: 'pseudo',
    //     port: 5432,
    // })
    // await client.connect()
    // return client
}


async function endConnection(conn) {
    await conn.end()
}



module.exports = {
    readStudents: readStudents,
    readStudent: readStudent,
    readBooks: readBooks,
    readBook: readBook,
    addStudent: addStudent,
    addBook: addBook,
    updateStudent: updateStudent,
    updateBook: updateBook
}
