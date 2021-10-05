import express  from "express";
import fs from "file-system";

const app= express();
const PORT= 8080;
const routerProductos = express.Router();
const routerCarrito = express.Router();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);

app.use(express.static('public'));
let id=0;
let administrador=true;//variable Boolean para definir el tipo de usuario
let productos=JSON.parse(fs.readFileSync('public/productos.txt',"utf-8"));
let carrito=JSON.parse(fs.readFileSync('public/carrito.txt',"utf-8"));
if(productos.length>0){
    id=productos[productos.length-1].id;
}

class Producto{
    constructor(id,timestamp,nombre,descripcion,foto,precio,stock){
        this.id=id;
        this.timestamp=timestamp;
        this.nombre=nombre;
        this.descripcion=descripcion;
        this.foto=foto;
        this.precio=precio;
        this.stock=stock;
    }

    getObject(){
        return {
            id:this.id,
            timestamp:this.timestamp,
            nombre:this.nombre,
            descripcion:this.descripcion,
            foto:this.foto,
            precio:this.precio,
            stock:this.stock
        }
    }
}

class Carrito{
    constructor(timestamp,producto){
        this.timestamp=timestamp;
        this.producto=producto;
    }

    getObject(){
        return {
            timestamp:this.timestamp,
            producto:this.producto,
        }
    }
}

const getID=()=>{
    id++;
    return id;
}

const GetCurrentTime=()=>{
    const d=new Date();
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
};

const GuardarProductosFile=()=>fs.writeFileSync('public/productos.txt',JSON.stringify(productos, null, "\t"));
const GuardarCarritoFile=()=>fs.writeFileSync('public/carrito.txt',JSON.stringify(carrito, null, "\t"));

const addProduct=(P)=>{
    productos.push(P);
    GuardarProductosFile();
}

const addCart=(C)=>{
    carrito.push(C);
    GuardarCarritoFile();
}

const server = app.listen (PORT, ()=>{
    console.log("Servidor HTTP corriendo en", server.address().port);
});
server.on('error', error=>console.log('Error en servidor',error));

/* Router Productos */
routerProductos.get('/listar',(req,res)=>{
    if(productos.length > 0){
        res.json(productos);
    }else{
        res.json({error: 'no hay productos cargados'})
    }
});

routerProductos.get('/listar/:id',(req,res)=>{
    let params = req.params;
    let resultado={error: 'producto no encontrado'};
    for (let index = 0; index < productos.length; index++) {
        if(productos[index].id==params.id){
            resultado=productos[index];
        }
    }

    res.json(resultado)
});

routerProductos.post('/agregar',(req,res)=>{
    if(administrador){
        let body = req.body;
        console.log(body)
        const datos=Object.values(body);


        let product=new Producto(getID(),GetCurrentTime(),datos[0],datos[1],datos[2],datos[3],datos[4]);
        addProduct(product.getObject());
        res.json(product.getObject())
    }else{
        res.json({
            error: -1,
            descripcion: "ruta '/agregar' metodo POST no autorizada "
        })
    }
});

routerProductos.put('/actualizar/:id',(req,res)=>{
    if(administrador){
        let params = req.params;
        let body = req.body;
        const datos=Object.values(body);

        let resultado={error: 'producto no actualizado: no se encontro'};
        for (let index = 0; index < productos.length; index++) {
            if(productos[index].id==params.id){
                let product=new Producto(params.id,GetCurrentTime(),datos[0],datos[1],datos[2],datos[3],datos[4]);
                productos[index]=product.getObject();
                resultado=product.getObject();
            }
        }
        GuardarProductosFile();

        res.json(resultado)
    }else{
        res.json({
            error: -1,
            descripcion: "ruta '/actualizar/:id' metodo PUT no autorizada "
        })
    }
});

routerProductos.delete('/borrar/:id',(req,res)=>{
    if(administrador){
        let params = req.params;

        let arrayAux=[];
        let resultado={error: 'producto no eliminado: no se encontro'};
        for (let index = 0; index < productos.length; index++) {
            if(productos[index].id==params.id){
                resultado=productos[index];
            }else{
                arrayAux.push(productos[index]);
            }
        }
        productos=arrayAux;
        GuardarProductosFile();

        res.json(resultado)
    }else{
        res.json({
            error: -1,
            descripcion: "ruta '/borrar/:id' metodo DELETE no autorizada "
        })
    }
});

/* Router Carrito */
routerCarrito.get('/listar',(req,res)=>{
    if(productos.length > 0){
        res.json(productos);
    }else{
        res.json({error: 'no hay productos en el carrito'})
    }
});

routerCarrito.post('/agregar/:id_producto',(req,res)=>{
        let params = req.params;
        const pro = productos.find(element => element.id==params.id_producto);

        if (pro){
            let cart=new Carrito(GetCurrentTime(),pro);
            addCart(cart.getObject());
            res.json(cart.getObject())
        }else{
            res.json({error: 'Producto no encontrado'})
        }
});

routerCarrito.delete('/borrar/:id',(req,res)=>{
        let params = req.params;

        let arrayAux=[];
        let resultado={error: 'producto no eliminado: no se encontro'};
        for (let index = 0; index < carrito.length; index++) {
            if(carrito[index].producto.id==params.id){
                resultado=carrito[index];
            }else{
                arrayAux.push(carrito[index]);
            }
        }
        carrito=arrayAux;
        GuardarCarritoFile();

        res.json(resultado)
});