import mongoose  from "mongoose";
const carritoCollection = 'carritos';

const CarritoEsquema = mongoose.Schema({
    timestamp: {type: String, require:true},
    producto: {type: Array, require:true}
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

export default mongoose.model(carritoCollection,CarritoEsquema);