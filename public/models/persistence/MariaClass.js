import MariadbOptions from "../../configs/MariaOptions.js";
import knex from "knex";

export default function Maria() {

	this.iniciarDB = async () => {
        const KNEX=knex(MariadbOptions);
        //productos
        KNEX.schema.createTableIfNotExists('productos', table=>{
            table.increments('id'),
            table.string('timestamp'),
            table.string('nombre'),
            table.string('descripcion'),
            table.string('foto'),
            table.integer('precio'),
            table.integer('stock')
        })
        .then(()=>{
            console.log('tabla "Productos" creada(Maria)');
        })
        .catch(e=>{
            console.log('error', e)
        })
        .finally(()=>KNEX.destroy()); 

        //Carrito
        KNEX.schema.createTableIfNotExists('carrito', table=>{
            table.increments('id'),
            table.string('timestamp'),
            table.string('producto')
        })
        .then(()=>{
            console.log('tabla "Carrito" creada(Maria)');
        })
        .catch(e=>{
            console.log('error', e)
        })
        .finally(()=>KNEX.destroy()); 
	};

	this.crear = async (array, items) => {
        const KNEX=knex(MariadbOptions);
        
        if(array == "products"){
            KNEX('productos').insert(items)
            .then(()=>{
                console.log("¡Filas insertadas en 'productos'!");
                KNEX.destroy();
            })
            .catch(e=>{
                console.log('Error en Insert:', e);
                KNEX.destroy();
            })
        }else{
            let itemsCart={
                id: items.id,
                timestamp: items.timestamp,
                producto: JSON.stringify(items.producto)
            }
            KNEX('carrito').insert(itemsCart)
            .then(()=>{
                console.log("¡Filas insertadas en 'carrito'!");
                KNEX.destroy();
            })
            .catch(e=>{
                console.log('Error en Insert:', e);
                KNEX.destroy();
            })

        } 
		return items;
	};
    
	this.find = async (array) => {
        let datos=[];
        const KNEX=knex(MariadbOptions);
        if(array == "products"){
            try {
                datos=await KNEX.from('productos').select('*'); 
            } catch (e) {
                console.log('Error en Select:', e);        
            } finally {
                KNEX.destroy();
                return datos;     
            }
        }else{
            try {
                datos=await KNEX.from('carrito').select('*'); 
            } catch (e) {
                console.log('Error en Select:', e);        
            } finally {
                for (let x = 0; x < datos.length; x++) {
                    datos[x]={
                        id: datos[x].id,
                        timestamp: datos[x].timestamp,
                        producto: JSON.parse(datos[x].producto)
                    }  
                }
                KNEX.destroy();
                return (datos);     
            }
        }
    };

	this.findConId = async (array, id) => {
        let datos=[];
        const KNEX=knex(MariadbOptions);
        if(array == "products"){
            try {
                datos=await KNEX.from('productos').select('*').where('id',"=", id); 
            } catch (error) {
                console.log('Error en Select:', e);
            } finally {
                KNEX.destroy();
                if (datos.length>0){
                    return datos;
                }else{
                    return false;
                }   
            }
        }
    };

	this.update = async (array, id, items) => {
		if(array=="products"){
            const KNEX=knex(MariadbOptions);
        
            await KNEX.from('productos').where('id', '=', id).update(items)
            .then(() => {
                KNEX.destroy();
            })
            .catch(e=>{
                console.log('Error en Update:', e);
                KNEX.destroy();
            });	
		}
		return await this.findConId(array, id);
	};

	this.remove = async (array, id) => {
        let datos=[];
        const KNEX=knex(MariadbOptions);
		if(array=="products"){
            datos=await KNEX.from('productos').select('*').where('id',"=", id);
            await KNEX.from('productos').where('id', '=', id).del()
            .then(() => {
                KNEX.destroy();
            })
            .catch(e=>{
                console.log('Error en Delete:', e);
                KNEX.destroy();
            });
            if (datos.length>0){
                return "Eliminado"
            }else{
                    return false
            }
		}else{
            datos=await this.find(array);
            let idproCart=datos.find((e)=>(e.producto)[0].id==id || false);
            if (idproCart){
                await KNEX.from('carrito').where('id', '=', idproCart.id).del()
                .then(() => {
                    KNEX.destroy();
                })
                .catch(e=>{
                    console.log('Error en Delete:', e);
                    KNEX.destroy();
                });
				return 'Eliminado del carrito';
			} else {
				return false;
			}
		}
	};

}