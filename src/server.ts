import express,{Request,Response} from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {userModel,todoModel} from "./db";
import {auth} from "./auth";
import {PORT,JWT_SECRET} from "./config"

const app=express();



app.use(express.json());
app.use(cors());

app.post("/signin",async(req:Request,res:Response)=>{
        const {username,email,password}=req.body;

        if(typeof username !== "string" || typeof email !== "string" || typeof password !== "string"){
            return res.json({
                error:"invalid input format"
            });  
        }
        try{
            
        let existingUser=await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        });
        if(existingUser){
          return res.status(409).json({ msg: "user already exists" });
        }
        
        let hashedPassword=await bcrypt.hash(password,10);

        const user=await userModel.create({
            email:email,
            username:username,
            password:hashedPassword
        });

        return res.json({
            msg:user.username+" successfully signed up "+username
        });                   


        }
        catch(err){
            console.error(err);
            return res.status(500).json({
                 msg: "Internal server error"
            });
        }


});


app.post("/login",async(req:Request,res:Response)=>{
        const {username,password}=req.body;

        if(typeof username !== "string" || typeof password !== "string"){
           return res.status(400).json({ error: "invalid input format" }); 
        }

        try{
            let validUser=await userModel.findOne({username});
        
        if(!validUser){
            return res.status(401).json({
                    msg: "invalid credentials"
});
        }

        const isMatch=await bcrypt.compare(password,validUser.password);

        if(!isMatch){
            return res.status(401).json({ msg: "invalid credentials" });
        }
        const payload={id:validUser._id};
        const token=jwt.sign(payload,JWT_SECRET);
        return res.json({
            msg:"successful login",
            token:token
        });
        }

       catch(err){
            console.error(err);
            return res.status(500).json({
                 msg: "Internal server error"
            });
        }
        


});


//authenticated endpoints

app.get("/getTodos",auth,async(req:Request,res:Response)=>{
    const id=req.id;
    try{
        const todos=await todoModel.find({userId:id});
        return res.send(todos);
    }
    catch(err){
            console.error(err);
            return res.status(500).json({
                 msg: "Internal server error"
            });
        }
})

app.post("/addTodo",auth,async(req:Request,res:Response)=>{
   if (!req.id) {
            return res.status(401).json({ msg: "Unauthorized" });
    }
    const id=req.id;
   const desc=req.body.desc;
   const isDone=req.body.isDone;
   try{
    await todoModel.create({
        desc:desc,
        isDone:isDone,
        userId:new mongoose.Types.ObjectId(id)
   });

   return res.json({ msg: "Todo added" });
   }
    catch(err){
            console.error(err);
            return res.status(500).json({
                 msg: "Internal server error"
            });
        }
});

app.delete("/removeTodo",auth,async(req:Request,res:Response)=>{
    if(!req.id){
        return res.status(401).json({ msg: "Unauthorized" });
    }
    const id=req.id;
    const todoId=req.body.todoId;
    try{
        const isDone=await todoModel.deleteOne({_id:todoId,userId:id});
        if(isDone.deletedCount===1){
        return res.json({ msg: "Todo removed" })
}
        if(isDone.deletedCount===1){
            return res.json({ msg: "Todo dne" })
        }
    }

    catch(err){
            console.error(err);
            return res.status(500).json({
                 msg: "Internal server error"
            });
        }
    });

app.put("/updateTodo",auth,async(req:Request,res:Response)=>{
    if(!req.id){
        return res.status(401).json({ msg: "Unauthorized" });
    }
    const id=req.id;
    const todoId=req.body.todoId;
    const desc=req.body.desc;
    const isDone=req.body.isDone;

    const updateFields:any={};
    if(typeof isDone !=="undefined"){
        updateFields.isDone=isDone;
    }
    if(typeof desc !=="undefined"){
        updateFields.desc=desc;
    }

    try{
        const updatedTodo = await todoModel.findOneAndUpdate({
            _id:todoId,
            userId:id
        },
        updateFields,{
            new:true
        });

    if (!updatedTodo) {
    return res.status(404).json({ msg: "Todo not found" });
  }

   return res.json({
    msg: "Todo updated",
    todo: updatedTodo
  });
    }
      catch(err){
            console.error(err);
            return res.status(500).json({
                 msg: "Internal server error"
            });
        }
}
);

app.listen(PORT,()=>{
    console.log("listening on PORT "+PORT);
})