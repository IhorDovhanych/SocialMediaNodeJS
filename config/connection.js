const mongoose = require("mongoose");
const uri =
    "mongodb+srv://holdargraf:mongo@cluster0.rjnkduv.mongodb.net/?retryWrites=true&w=majority";
//const uri = "mongodb://0.0.0.0:27017/SocialNetwork"

//Set up Mongoose on MongoDB server - can replate '127.0.0.1' with 'localhost'
async function connect() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(
            "-> MongoDb conected \nMongo cluster link: https://cloud.mongodb.com/v2/64916c38d397545947beb29e#/clusters/detail/Cluster0"
        );
    } catch (error) {
        console.log("Error");
        console.error(error);
    }
}
connect();

module.exports = mongoose.connection;
