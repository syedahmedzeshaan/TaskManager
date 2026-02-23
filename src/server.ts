import express,{Request,Response,NextFunction} from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { tokenToString } from "typescript";
import { describe } from "node:test";

const app=express();
const port =3000;
const jwt_secret="sjkghjkhtklbh";

app.use(express.json());
app.use(cors());

let users:User[]=[];
let todos:Todo[]=[];

interface Todo{
    id:number;
    username:string;
    desc:string;
    isDone:boolean;
}

let id=0;

interface User{
    username:string;
    email:string;
    password:string;
}

app.post("/signin",async(req:Request,res:Response)=>{
        const {username,email,password}=req.body;

        if(typeof username !== "string" || typeof email !== "string" || typeof password !== "string"){
            return res.json({
                error:"invalid input format"
            });  
        }

        let existingUser=users.find(user=>(user.username===username || user.email === email));
        if(existingUser){
            return res.json({
                msg:"user already exists"
            });
        }
        
        let hashedPassword=await bcrypt.hash(password,6);

        users.push({
            email:email,
            username:username,
            password:hashedPassword
        });

        return res.json({
            msg:"successfully signed up "+username
        });                   




});


app.post("/login",async(req:Request,res:Response)=>{
        const {username,email,password}=req.body;

        if(typeof username !== "string" || typeof email !== "string" || typeof password !== "string"){
            return res.json({
                error:"invalid input format"
            });  
        }

        let validUser=users.find(user=>user.username===username);

        if(validUser && await bcrypt.compare(password,validUser.password)){
            const payload={username};
            const token=jwt.sign(payload,jwt_secret);
            return res.json({
                msg:"login successful",
                token:token
            });
        }

});

//auth middleware

function auth(req:Request,res:Response,next:NextFunction){
    const token=req.headers.token;
    if(typeof token!=="string"){
        return res.send("token expired");
    }
    try{
        const payload=jwt.verify(token,jwt_secret) as any;
        (req as any).username = payload.username; 

        next();
    }
    catch(err){
        return res.json({err});
    }
}
//authenticated endpoints

app.get("/getTodos",auth,(req:Request,res:Response)=>{
    const username=(req as any).username;
    const userTodos=todos.filter(todo=>todo.username === username);
    return res.send(userTodos);

})

app.post("/addTodo",auth,(req:Request,res:Response)=>{
    const username=(req as any).username;
    const {desc,isDone}=req.body;
    todos.push({id:id,username:username,desc:desc,isDone:isDone});
    id++;
    return res.json({
        msg:"todo "+ desc+" added"
    });

});

app.delete("/removeTodo",auth,(req:Request,res:Response)=>{
    
    let username=(req as any).username;
    const todoId=req.body.todoId ;
    todos = todos.filter(t => t.id !== (req as any).todoId && t.username === username);
    return res.json({
        msg:"removed"
    });


});

app.put("/updateTodo",auth,(req:Request,res:Response)=>{
    const username = (req as any).username;
    const todoId=req.body.todoId ;
    const newDesc=req.body.desc;
    const newIsDone=req.body.isDone;

    let todo=todos.find(todo=>todo.id===todoId && todo.username === username);
    if(typeof todo === "undefined"){
        return res.json({
            msg:"todo dont exist"
    });
}

    if(newDesc !== undefined)todo.desc=newDesc;
    if (newIsDone !== undefined) todo.isDone = newIsDone;

    return res.json({
        msg: "Todo updated successfully",
        todo: todo
    });
    }
);

app.listen(port,()=>{
    console.log("listening on port "+port);
})