import Carrito from "../models/Classes/carrito.js";
import db from "../../server.js"

const GetCurrentTime=()=>{
    const d=new Date();
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
};

export const carritoListar= async (req,res)=>{
    let carrito=await db.find();
    if(carrito.length > 0){
        res.json(carrito);
    }else{
        res.status(404).send({error: 'no hay productos en el carrito'})
    }
}

export const addToCart= async (req,res)=>{
        let params = req.params;
        let pro =await db.findConId("products",params.id_producto);
        if (pro){
            try {
                let cart=new Carrito(GetCurrentTime(),pro);
                res.json(await db.crear("cart",cart.getObject()));            
            } catch (error) {
                res.json(error);
            }
        }else{
            res.status(404).send({error: 'Producto no encontrado'})
        }
};

export const borrarProductoCart= async (req,res)=>{
    let params = req.params;
    let deletedItem=await db.remove("cart",params.id);

    if (deletedItem){
        res.json("Item "+deletedItem)
    }else{
        res.status(404).send({error: 'item no eliminado: no se encontro en el carrito'})
    }
}