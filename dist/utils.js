"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = exports.fullDate = void 0;
const fullDate = () => {
    const IntTwoChars = (i) => {
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
exports.fullDate = fullDate;
const getCollection = (db, collectionName) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = yield db.listCollections().toArray();
    const doesCollectionExist = collections.find((collection) => collection.name === collectionName);
    if (!doesCollectionExist) {
        // if the collection does not exist we create it
        const collection = yield db.createCollection(collectionName);
        return collection;
    }
    return db.collection(collectionName);
});
exports.getCollection = getCollection;
