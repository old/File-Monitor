import { MongoClient, Db } from "mongodb";

const fullDate = () => {
	const IntTwoChars = (i: number) => {
		return `0${i}`.slice(-2);
	};
	let date_ob = new Date();
	let date = IntTwoChars(date_ob.getDate());
	let month = IntTwoChars(date_ob.getMonth() + 1);
	let year = date_ob.getFullYear();
	let hours = IntTwoChars(date_ob.getHours());
	let minutes = IntTwoChars(date_ob.getMinutes());
	let seconds = IntTwoChars(date_ob.getSeconds());
	let dateDisplay = `${month}/${date}/${year} - ${hours}:${minutes}:${seconds}`;

	return dateDisplay;
};

const getCollection = async (db: Db, collectionName: string) => {
	const collections = await db.listCollections().toArray();
	const doesCollectionExist = collections.find((collection) => collection.name === collectionName);

	if (!doesCollectionExist) {
		// if the collection does not exist we create it
		const collection = await db.createCollection(collectionName);
		return collection;
	}
	return db.collection(collectionName);
};

export { fullDate, getCollection };
