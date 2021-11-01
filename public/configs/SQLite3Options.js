const optionsSQLlite = {
    client: 'sqlite3',
    connection: {  filename: './public/db/ecommerce.sqlite'},
    useNullAsDefault: true
}

console.log('Estableciendo conexión a la base de datos SQLite3...');

export default optionsSQLlite;