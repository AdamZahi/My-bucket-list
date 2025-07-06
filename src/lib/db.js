import mysql from 'mysql2/promise';

let connection;
export async function createConnection() {
    if(!connection){
        return await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'todo_app',
    });
    }
    return connection;
}