import mongoose from "mongoose";



const connectDB = async () => {
       const url = process.env.MONGO_URL;
       if(!url) throw new Error('Mongo_url is not there in the env');
       try{
         await mongoose.connect(url)
         return "Database Connected"
       }
       catch(err){
          return "Database Connection error"
       }
     
};

export default connectDB;