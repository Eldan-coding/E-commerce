import Producto from "../models/Classes/producto.js";
import db from "../../server.js"

const GetCurrentTime=()=>{
    const d=new Date();
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
};

export const productoListar = async (req,res)=>{
    let ID=req.params.id;
    let productos= await db.find("products");
    if(productos.length > 0){
        if (!ID){
            res.json(productos);
        }else{
            let product=await db.findConId("products",ID);
            if(product){
                res.json(product);
            }else{
                res.status(404).send({error: 'producto no encontrado'})
            }
        }
    }else{
        res.status(404).send({error: 'no hay productos cargados'})
    }
}

export const addProduct= async (req,res)=>{
    if(process.env.ADMIN=="true"){
        try {
            let body = req.body;
            //{nombre:nombre,descripcion:descripcion,foto:foto,precio:precio,stock:stock}
            const datos=Object.values(body);

            let product=new Producto(GetCurrentTime(),datos[0],datos[1],datos[2],datos[3],datos[4]);
            res.json(await db.crear("products",product.getObject()));            
        } catch (error) {
            res.json(error);
        }
    }else{ 
        res.status(401).send({
        error: -1,
        descripcion: "ruta '/agregar' metodo POST no autorizada "
        })
    }
}

export const updateProduct= async (req,res)=>{
    if(process.env.ADMIN=="true"){
        try {
            let params = req.params;
            let body = req.body;
            const datos=Object.values(body);
            let product=new Producto(GetCurrentTime(),datos[0],datos[1],datos[2],datos[3],datos[4]);
                
            let updatedProduct=await db.update("products",params.id,product.getObject());
            if (updatedProduct){
                res.json(updatedProduct)
            }else{
                res.status(404).send({error: 'producto no actualizado: no se encontro'})
            }            
        } catch (error) {
            res.json(error)
        }
    }else{
        res.status(401).send({
            error: -1,
            descripcion: "ruta '/actualizar/:id' metodo PUT no autorizada "
        })
    }
}

export const deleteproduct=async(req,res)=>{
    if(process.env.ADMIN=="true"){
        try {
            let params = req.params;
            let deletedProduct=await db.remove("products",params.id);

            if(deletedProduct){
                res.json("Producto "+deletedProduct)
            }else{
                res.status(404).send({error: 'producto no eliminado: no se encontro'})
            }            
        } catch (error) {
            res.json(error);
        }
    }else{
        res.status(401).send({
            error: -1,
            descripcion: "ruta '/borrar/:id' metodo DELETE no autorizada "
        })
    }
}
