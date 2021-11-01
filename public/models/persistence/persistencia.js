import Memory from "./memoryClass.js";
import FileSystem from "./fileSystemClass.js";
import Maria from "./MariaClass.js";
import SQLite3 from "./SQLiteClass.js";
import Mongo from "./MongoClass.js";
import FireBase from "./FireBaseClass.js";

export default function ConnectionPersistencia(id) {
	this.instance =
		id == 1
			?  new FileSystem()
			: id == 2
			? new Maria()
			: id == 3
			? new SQLite3()
			: id == 4
			? new Mongo(process.env.MONGO_URL)
			: id == 5
			? new Mongo(process.env.MONGO_URL_ATLAS)
			: id == 6
			? new FireBase() 
			: new Memory();
}