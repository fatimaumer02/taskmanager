import mongoose from "mongoose";

export const connectDB = async ()=>{
  await mongoose.connect('mongodb+srv://fatimaumer862_db_user:UPWZrdLVxwM54vxQ@cluster0.xmi5gth.mongodb.net/taskmanager')
  .then(()=>{
    console.log("DB Connected")
  })
}
  