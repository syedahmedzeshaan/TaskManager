// /*
//     jwt has 2 methods
//     sign and verify
//     it needs a payload which is generally {username}
//     const token=jwt.sign(payload,secret);
//     res.json({
//     msg:"successful"
//     token:token
//     })
// */

// import express,{Request,Response,NextFunction} from "express";
// import jwt from "jsonwebtoken";
// import cors from "cors";

// const port=3000;
// const app=express();
// const secret="akhil khare is an assshole";

// app.use(express.json());
// app.use(cors());

// app.post("/sign",(req:Request,res:Response)=>{
//     const username=req.body.username;
//     const token=jwt.sign({username},secret);
//     return res.json({
//         msg:"successful",
//         token:token
//     })
// })

// app.post("/verify",(req:Request,res:Response)=>{
//     const token=req.headers.token;
//     if(typeof token !== "string"){
//         return res.json({
//             error:"error"
//         });
//     }
//     try{
//         const username=jwt.verify(token,secret);
//         return res.json({
//             msg:username+" authorised"
//         });
//     }
//     catch(err){
//         return res.json({
//             error:"invalid token"
//         });
//     }
// })

// app.listen(3000,()=>{
//     console.log("for.ts listening")
// })

const bcrypt=require('bcrypt');

const username="";
const password="123456789";

async function main(){
		const hashedPassword = await bcrypt.hash(password,5);
		console.log(hashedPassword);
		
		const areSame=await bcrypt.compare(password,hashedPassword);
		console.log(areSame);
}

main();