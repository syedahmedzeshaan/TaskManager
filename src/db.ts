
import mongoose from "mongoose";
import {MONGOOSE_URI} from "./config";

mongoose.connect(MONGOOSE_URI)
.then(()=>{
    console.log("connection established with database");
}).catch((err)=>{
    console.log("connection failed"+ err);
});

const Schema=mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;

//Schema

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const todoSchema=new Schema({
    desc:String,
    isDone:Boolean,
    userId:{type:ObjectId,required:true,ref: "User"}
})

//model

const userModel=mongoose.model("user",userSchema);
const todoModel=mongoose.model("todo",todoSchema);

export {userModel,todoModel};