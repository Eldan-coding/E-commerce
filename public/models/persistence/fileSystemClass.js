import fs from "file-system";

export default function FileSystem() {
	this.products;
    this.cart;
	this.ID=0;
	
	this.getID=()=>{
		this.ID++;
		return this.ID;
	}

    this.GuardarCarritoFile= async ()=> await fs.writeFileSync('public/db/carrito.txt',JSON.stringify(this.cart, null, "\t"));
    this.GuardarProductosFile= async ()=>await fs.writeFileSync('public/db/productos.txt',JSON.stringify(this.products, null, "\t"));

	this.iniciarDB = async () => {
		this.products = JSON.parse(fs.readFileSync('public/db/productos.txt',"utf-8"));
		this.cart = JSON.parse(fs.readFileSync('public/db/carrito.txt',"utf-8"));
		this.ID=this.products[this.products.length-1].id;
		return 'File System Iniciado';
	};

	this.crear = async (array, items) => {
        if(array == "products"){
            this.products.push({id: this.getID(), ...items})
            await this.GuardarProductosFile();
        }else{
            this.cart.push(items);
            await this.GuardarCarritoFile();
        } 
		return items;
	};
    
	this.find = async (array) => array == "products" ? this.products : this.cart;

	this.findConId = async (array, id) => array == "products" ? this.products.find((p) => p.id == id) || false : this.cart.find((p) => p.id == id) || false;

	this.update = async (array, id, items) => {
		if(array=="products"){
			let index = this.products.findIndex((pro) => pro.id == id);
			let producto = this.findConId(array, id);
			if(index){
                this.products[index] = {id: producto.id, ...items};
                await this.GuardarProductosFile();
            } 
		}/*else{
			 let index = this.products.findIndex((car) => car.id == id);
			let car = this.findConId(array, id);
			index && (this.cart[index] = {id: car.id, ...items}); 
		}*/
		return this.findConId(array, id);
	};

	this.remove = async (array, id) => {
		if(array=="products"){
			let index = this.products.findIndex((pro) => pro.id == id);
			if (index > -1) {
				this.products.splice(index, 1);
                await this.GuardarProductosFile();
				return 'Eliminado';
			} else {
				return false;
			}	
		}else{
			let index = this.cart.findIndex((car) => car.producto.id == id);
			if (index > -1) {
				this.cart.splice(index, 1);
                await this.GuardarCarritoFile();
				return 'Eliminado del carrito';
			} else {
				return false;
			}
		}
	};

}