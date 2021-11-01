import MongodbOptions from "../../configs/MongoOptions.js";
import mongoose  from "mongoose";
import Productos_model from "./models/Productos_model.js";
import Carrito_model from "./models/Carrito_model.js";

export default function Mongo(URL) {

	this.iniciarDB = async () => {
        
        //productos
        try {
            await mongoose.connect(URL,MongodbOptions)
            await Productos_model.deleteMany({})
            console.log("¡Collection Productos Iniciada!");
        } catch (error) {
            console.log('Error al Iniciar:', error);     
        } finally {
            await mongoose.connection.close();
        }

        //Carrito
        try {
            await mongoose.connect(URL,MongodbOptions)
            await Carrito_model.deleteMany({})
            console.log("¡Collection Carrito Iniciada!");
        } catch (error) {
            console.log('Error al Iniciar:', error);     
        } finally {
            await mongoose.connection.close();
        }
	};

	this.crear = async (array, items) => {        
        if(array == "products"){
            try {
                await mongoose.connect(URL,MongodbOptions)
                await Productos_model.insertMany(items)
                console.log("¡Filas insertadas en Collection 'productos'!");
            } catch (error) {
                console.log('Error en Insert:', error);     
            } finally {
                await mongoose.connection.close();
            }
        }else{
            try {
                await mongoose.connect(URL,MongodbOptions)
                await Carrito_model.insertMany(items)
                console.log("¡Filas insertadas en Collection 'carritos'!");
            } catch (error) {
                console.log('Error en Insert:', error);     
            } finally {
                await mongoose.connection.close();
            }
        } 
		return items;
	};
    
	this.find = async (array) => {
        let datos=[];
        if(array == "products"){
            try {
                await mongoose.connect(URL,MongodbOptions)
                datos=await Productos_model.find({}).lean();
            } catch (error) {
                console.log('Error en find:', error);        
            } finally {
                await mongoose.connection.close();
                return datos;     
            }
        }else{
            try {
                await mongoose.connect(URL,MongodbOptions)
                datos=await Carrito_model.find({}).lean();
            } catch (error) {
                console.log('Error en find:', error);        
            } finally {
                await mongoose.connection.close();
                return datos;     
            }
        }
    };

	this.findConId = async (array, id) => {
        let datos=[];
        if(array == "products"){
            try {
                let oid=mongoose.Types.ObjectId(id);
                await mongoose.connect(URL,MongodbOptions)
                datos=await Productos_model.find({_id: oid}).lean();
            } catch (error) {
                console.log('Error en find:', e);
            } finally {
                await mongoose.connection.close();
                if (datos.length>0){
                    return datos;
                }else{
                    return false;
                }   
            }
        }
    };

	this.update = async (array, id, items) => {
        let oid=mongoose.Types.ObjectId(id);
		if(array=="products"){
            try {
                await mongoose.connect(URL,MongodbOptions)
                await Productos_model.updateMany({_id: oid}, {$set: items})
            } catch (error) {
                console.log('Error en UpdateMany:', error);     
            } finally {
                await mongoose.connection.close();
            }
		}
		return await this.findConId(array, id);
	};

	this.remove = async (array, id) => {
        let oid=mongoose.Types.ObjectId(id);
        let datos=[];
		if(array=="products"){
            try {
                datos=await this.findConId(array,id)
                await mongoose.connect(URL,MongodbOptions)
                await Productos_model.deleteMany({_id: oid})
            } catch (error) {
                console.log('Error en Delete:', error);     
            } finally {
                await mongoose.connection.close();
            }
            if (datos.length>0){
                return "Eliminado"
            }else{
                    return false
            }
		}else{
            datos=await this.find(array)
            let buscarProCart=datos.find((e)=>(e.producto)[0]._id.equals(oid) || false);
            if (buscarProCart){
                try {
                    await mongoose.connect(URL,MongodbOptions)
                    await Carrito_model.deleteMany({_id: buscarProCart._id})
                } catch (error) {
                    console.log('Error en Delete:', error);     
                } finally {
                    await mongoose.connection.close();
                }
				return 'Eliminado del carrito';
			} else {
				return false;
			}
		}
	};

}