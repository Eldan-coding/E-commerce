const MariadbOptions = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'ecommerce_db'
    }
}

console.log('Estableciendo conexión a la base de datos MariaDB...');

export default MariadbOptions;