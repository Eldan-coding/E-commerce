import mongoose  from "mongoose";
const productosCollection = 'productos';

const ProductoEsquema = mongoose.Schema({
    timestamp: {type: String, require:true},
    nombre: {type: String, require:true},
    descripcion: {type: String, require:true},
    foto: {type: String, require:true},
    precio: {type: Number, require:true},
    stock: {type: Number, require:true}
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

export default  mongoose.model(productosCollection,ProductoEsquema);