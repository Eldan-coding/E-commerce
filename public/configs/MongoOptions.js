const MongodbOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 1000
}

console.log('Estableciendo conexión a la base de datos Mongo...');
  
export default MongodbOptions;