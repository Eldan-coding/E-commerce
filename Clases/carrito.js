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

export default Carrito;