import mysql from 'mysql2/promise';

let connection;
export async function createConnection() {
    if(!connection){
        return await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'my_bucker_list',
    });
    }
    return connection;
}