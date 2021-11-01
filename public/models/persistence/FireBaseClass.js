import MongodbOptions from "../../configs/MongoOptions.js";
import mongoose  from "mongoose";
import Productos_model from "./models/Productos_model.js";
import Carrito_model from "./models/Carrito_model.js";

import admin from "firebase-admin";
import serviceAccount from "../../db/ecommerce-c0a0e-firebase-adminsdk-9flqp-2b44474272.json"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommerce-c0a0e-firebaseio.com"
});

export default function FireBase(URL) {
    let queryProductos;
    let queryCarrito;    
    const db= admin.firestore();

	this.iniciarDB = async () => {    
        //productos
        queryProductos= db.collection("productos")
        //Carrito
        queryCarrito= db.collection("carrito")

        console.log("FireBase Iniciado")
	};

	this.crear = async (array, items) => {
        let document;
        if(array == "products"){
            try {
                document= queryProductos.doc();
                await document.create(items)
                console.log("¡Filas creadas en Collection 'productos'!");
            } catch (error) {
                console.log('Error en Create:', error);     
            } 
        }else{
            try {
                document= queryCarrito.doc();
                await document.create(items)
                console.log("¡Filas creadas en Collection 'carrito'!");
            } catch (error) {
                console.log('Error en Create:', error);     
            } 
        } 
		return items;
	};
    
	this.find = async (array) => {
        let datos=[];
        if(array == "products"){
            try {
                const querySnapshot=await queryProductos.get()
                let docs=querySnapshot.docs;
                datos=docs.map((doc)=>({
                    id: doc.id,
                    timestamp: doc.data().timestamp,
                    nombre: doc.data().nombre,
                    descripcion: doc.data().descripcion,
                    foto: doc.data().foto,
                    precio: doc.data().precio,
                    stock: doc.data().stock
                }))
            } catch (error) {
                console.log('Error en get:', error);        
            } finally {
                return datos;     
            }
        }else{
            try {
                const querySnapshot=await queryCarrito.get()
                let docs=querySnapshot.docs;
                datos=docs.map((doc)=>({
                    id: doc.id,
                    timestamp: doc.data().timestamp,
                    producto: doc.data().producto
                }))
            } catch (error) {
                console.log('Error en get:', error);        
            } finally {
                return datos;     
            }
        }
    };

	this.findConId = async (array, id) => {
        let datos=[];
        if(array == "products"){
            try {
                const doc= queryProductos.doc(id);
                const querySnapshot=await doc.get()
                datos=querySnapshot.data();
            } catch (error) {
                console.log('Error en get:', e);
            } finally {
                if (datos){
                    return {id: id, ...datos};
                }else{
                    return false;
                }   
            }
        }
    };

	this.update = async (array, id, items) => {
		if(array=="products"){
            try {
                const doc= queryProductos.doc(id);
                await doc.update(items);
            } catch (error) {
                console.log('Error en update:', error);     
            } 
		}
		return await this.findConId(array, id);
	};

	this.remove = async (array, id) => {
        let datos=[];
		if(array=="products"){
            try {
                const doc= queryProductos.doc(id);
                datos=await this.findConId(array,id);
                await doc.delete()
            } catch (error) {
                console.log('Error en Delete:', error);     
            }
            if (datos){
                return "Eliminado"
            }else{
                    return false
            }
		}else{
            datos=await this.find(array)
            let buscarProCart=datos.find((e)=>e.producto.id ==id || false);
            if (buscarProCart){
                try {
                    const doc=queryCarrito.doc(buscarProCart.id);
                    await doc.delete();
                } catch (error) {
                    console.log('Error en Delete:', error);     
                }
				return 'Eliminado del carrito';
			} else {
				return false;
			} 
		}
	};

}