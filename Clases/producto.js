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

export default Producto;