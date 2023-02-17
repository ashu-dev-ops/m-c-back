require('dotenv').config()

const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProducts = require('./products.json')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    await Product.deleteMany()//deleting the all the old data
    await Product.create(jsonProducts)//passing an whole array of object in db
    console.log('Success!!!!')
    process.exit(0) //run ,populate the db , then close this program 
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()