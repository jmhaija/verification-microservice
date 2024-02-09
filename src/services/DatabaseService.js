import { MongoClient, ObjectId } from 'mongodb'
import errorHandler from './ErrorHandlingService.js'
import dotenv from 'dotenv'
dotenv.config()

let mongod
let database

export default {
  
  async createConnection() {
    try{
      mongod = await MongoClient.connect(process.env.MONGODB_CONNECTION_STRING)
      database = mongod.db()
    } catch(err) {
      const generatedErrorObject = errorHandler(500, err)
      if(generatedErrorObject) {
        console.error(generatedErrorObject)
      }
    }
  },

  getData(collectionName, id) {
    return new Promise(async (resolve, reject) => {
      try{
        const collection = await database?.collection(collectionName)
        collection.findOne({ _id: ObjectId(id) })
          .then((result) => {
            if(result == undefined) {
              reject(errorHandler(404, ''))
            }
            resolve(result)
          })
      } catch(err) {
        reject(errorHandler(500, err))
      }
    })
  },

  getAllData(collectionName) {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await database?.collection(collectionName)
        collection.find().toArray()
          .then((result) => {
            result.length === 0 
            ? reject(errorHandler(404, 'No data to be retrieved')) 
            : resolve(result)
          })
      } catch(err) {
        reject(errorHandler(500, err))
      }
    })
  },

  addData(collectionName, data) {
    return new Promise(async(resolve, reject) => {
      try{
        const collection = await database?.collection(collectionName)
        collection.insertOne(data)
          .then((result) => {
            resolve(result)
          })
      } catch(err) {
        reject(errorHandler(500, err))
      }
    })
  },

  updateData(collectionName, id, newData) {
    return new Promise(async(resolve, reject) => {
      try {
        const collection = await database?.collection(collectionName)
        collection.findOne({ _id: ObjectId(id) })
          .then((result) => {
            if(result === null) {
              reject(errorHandler(404, 'The supplied ID does not exist or cannot be retrieved'))
            } else {
              try {
                collection.updateOne(
                  { _id: ObjectId(id)},
                  { $set:  newData }
                ).then((result) => {                  
                  resolve(result)
                })
              } catch(err) {
                reject(errorHandler(500, err))
              }
            }
          })
      } catch(err) {
        reject(errorHandler(500, err))
      }
    })
  },

  deleteData(collectionName, id) {
    return new Promise(async(resolve, reject) => {
      try {
        const collection = await database.collection(collectionName)
        collection.deleteOne({ _id: ObjectId(id) })
          .then((result) => {
            result.deletedCount > 0 
            ? resolve(result) 
            : reject(errorHandler(404, 'The supplied ID does not exist or cannot be retrieved'))
          })
      } catch(err) {
        reject(errorHandler(500, err))
      }
    })
  },

  findOneBy(collectionName, query){
    return new Promise(async(resolve, reject) => {
      try{ 
        const collection = await database?.collection(collectionName)
        collection.findOne(query)
          .then((result) => {
            if(result === null) {
              reject(errorHandler(404, 'The data was not found or could not be retrieved with the supplied query.'))
            } else {
              resolve(result)
            }
          })
      } catch(err) {
        reject(errorHandler(500, err))
      }
    })
  },
  
  findBy(collectionName, query){
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await database?.collection(collectionName)
        collection.find(query)
          .toArray()
          .then((result) => {
            resolve(result)
          })
      } catch(err) {
        reject(errorHandler(500, err))
      }
    })
  },

  join(collectionName, match, secondCollectionName, localField, foreignField, as) {
    return new Promise(async(resolve, reject) => {
      try {
        const collection = await database.collection(collectionName)
        collection.aggregate([ 
          { '$match':  match }, 
          {
            $lookup: {
              from: secondCollectionName,
              localField: localField, 
              foreignField: foreignField, 
              as: as 
            }
          }
        ]).toArray()
          .then((result) => {
            resolve(result)
          })
      } catch(err) {
        reject(errorHandler(500, err))
      }
    })
  }  
}
