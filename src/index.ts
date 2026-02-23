import express,{Request,Response,NextFunction} from 'express';
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const JWT_KEY="this can be anything";

app.use(cors());
app.use(express.json());
interface User{
    email:string;
    username:string;
    password:string;
};

function middleWare(req:Request,res:Response,next:NextFunction){
   console.log("hello from middleware")
    next();
}

function auth(req:Request,res:Response,next:NextFunction){
    const token=req.headers.token;
    if(typeof token !=="string"){
        return res.send("no token");
    }
    try{
        const payload=jwt.verify(token,JWT_KEY);
        next();
    }
    catch(err){
        return res.send("token expired");
    }
}

let users:User[]=[];
app.post("/signup",middleWare,async(req:Request,res:Response)=>{
        const {email,username,password}=req.body;
        if(typeof email !=="string" || typeof username !=="string" || typeof password !=="string" ){
            return res.json({error:"invalid input"});
        }

        let existingUser=users.find(user=>(user.email ===email || user.username === username));

        if(existingUser){
            return res.send("user and email already exists");
        }
        const hashedPassword= await bcrypt.hash(password,5);
        users.push({
            email:email,
            username:username,
            password:hashedPassword
        });

        return res.send("newer sign up of "+ username +" successful");

});

app.post("/login",middleWare,async(req:Request,res:Response)=>{
    const {username,password}=req.body;
    if(typeof password !=="string" || typeof username !=="string" ){
            return res.json({error:"invalid input"});
        }

    let validUser=await users.find(user=>user.username === username && bcrypt.compare(password,user.password));

    if(validUser){
        const payload={username};
        const token=jwt.sign(payload,JWT_KEY);
         return res.status(200).json({
        message: "Login successful",
        token: token
    });}
    return res.send("invaalid credentials");
})

app.post("/opt",auth,(req:Request,res:Response)=>{
             return res.send("successfully opted");
   
})

app.listen(port,()=>{
    console.log("listening on newer port 3000");
})


// // import express,{Request,Response,NextFunction} from "express";

// // const app=express();
// // const port=3000;

// // function validateInputs(req:Request,res:Response,next:NextFunction){

// //     const {a,b}=req.body ?? {};

// //     if(typeof a!=="number" || typeof b!=="number"){
// //         return res.status(400).json({error:"input is not a number"});
// //     }
// //     else{
// //         next();
// //     }


// // }

// // app.use(express.json());
 
// // app.post("/add",validateInputs,(req:Request,res:Response)=>{
// //     const {a,b}=req.body;
// //     return res.status(200).json({result:a+b});
// // });

// // app.post("/sub",validateInputs,(req:Request,res:Response)=>{
// //     const {a,b}=req.body;
// //     return res.status(200).json({result:a-b});
// // });

// // app.post("/mul",validateInputs,(req:Request,res:Response)=>{
// //     const {a,b}=req.body;
// //     return res.status(200).json({result:a*b});
// // });


// // app.post("/div",validateInputs,(req:Request,res:Response)=>{
// //     const {a,b}=req.body;
// //     return res.status(200).json({result:a/b});
// // });

// // app.listen(port,()=>{
// //     console.log("server running on 3000")
// // });


// import express,{Request,Response,NextFunction} from "express";

// const app=express();
// const port=3000;

// app.use(express.json());

// function validateInput(req:Request,res:Response,next:NextFunction){
//     const {email,password}=req.body;
//     if(typeof email !=="string" || typeof email !=="string"){
//         return res.json({error:"invalid input"})
//     }
//     next();
// }

// const todos:string[]=[];
// const users:User[]=[];
// interface User{
//     username:string
//     email:string;
//     password:string;
// }
// app.post("/signup",validateInput,(req:Request,res:Response)=>{
//     const {email,password}=req.body;
//     let username=email.split("@")[0];
//     let user={
//         username:username,
//         email:email,
//         password:password
//     }
//     users.push(user);
//     return res.json({"msg":email+"succesfully signed up"}) 
// });

// app.get("/getUsers",(req:Request,res:Response)=>{
//     return res.send(users);
// })


// app.post("/login",validateInput,(req:Request,res:Response)=>{
//     const {email,password}=req.body;
//     const user=users.find(
//         user=>user.email===email && user.password===password
//     );
//     if(user){
//         return res.send("welcome " + user.username);
//     }
//     else{
//         return res.send("invalid credentials")
//     }
   
// });

// app.get("/getUsers",(req:Request,res:Response)=>{
//     return res.send(users);
// })

// app.listen(port,()=>{
//     console.log("server running on 3000")
// });
