export default function Memory() {
	this.products;
    this.cart;
	this.ID=0;
	
	this.getID=()=>{
		this.ID++;
		return this.ID;
	}

	this.iniciarDB = async () => {
		this.products = [];
		this.cart = [];
		return 'Arrays iniciados';
	};

	this.crear = async (array, items) => {
        array == "products" ? this.products.push({id: this.getID(), ...items}) : this.cart.push(items);
		return items;
	};
    
	this.find = async (array) => array == "products" ? this.products : this.cart;

	this.findConId = async (array, id) => array == "products" ? this.products.find((p) => p.id == id) || false : this.cart.find((p) => p.id == id) || false;

	this.update = async (array, id, items) => {
		if(array=="products"){
			let index = this.products.findIndex((pro) => pro.id == id);
			let producto = this.findConId(array, id);
			index && (this.products[index] = {id: producto.id, ...items});			
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
				return 'Eliminado';
			} else {
				return false;
			}	
		}else{
			let index = this.cart.findIndex((car) => car.producto.id == id);
			if (index > -1) {
				this.cart.splice(index, 1);
				return 'Eliminado del carrito';
			} else {
				return false;
			}
		}
	};

}
