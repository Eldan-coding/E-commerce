import dotenv from 'dotenv';
dotenv.config();
import express  from "express";
import ConnectionPersistencia from "./public/models/persistence/persistencia.js";
const db = new ConnectionPersistencia(process.env.ID_PERSISTENCIA);
import {productoListar, addProduct, updateProduct, deleteproduct} from "./public/controllers/producto_controller.js";
import { carritoListar, addToCart, borrarProductoCart } from './public/controllers/carrito_controller.js'; 

const app= express();
const PORT= 8080;
const routerProductos = express.Router();
const routerCarrito = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);

app.use(express.static('public'));

const server = app.listen (PORT, ()=>{
    console.log("Servidor HTTP corriendo en", server.address().port);
    db.instance
        .iniciarDB()
        .then((response) => console.log(response))
        .catch((err) => console.log(err.message));
});
server.on('error', error=>console.log('Error en servidor',error));

/* Router Productos */
routerProductos.get('/listar', await productoListar);

routerProductos.get('/listar/:id', await productoListar);

routerProductos.post('/agregar', await addProduct);

routerProductos.put('/actualizar/:id', await updateProduct);

routerProductos.delete('/borrar/:id', await deleteproduct);

/* Router Carrito */
routerCarrito.get('/listar', carritoListar);

routerCarrito.post('/agregar/:id_producto', await addToCart);

routerCarrito.delete('/borrar/:id', await borrarProductoCart);

export default db.instance;