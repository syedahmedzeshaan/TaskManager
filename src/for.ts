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

/*
The data is stored in three main layers

```jsx
Database
 └── Collection
      └── Document
```

### 1.Data Base:

Highest level container, which holds collections (like folders)

→Stores whole applications data, each of which is independent from another

### 2.Collection

Collection is like a Table in SQL — holds a group of related documents

→All documents in a collection usually represent same type of data

→ ex :-  users collection holds all user documents

→But (unlike SQL tables), documents in a collection don’t need to have the same structure and can have extra fields.

```jsx
{ name: "harkirath", age: 23 }
{ name: "Zee", email: "zee@gmail.com", hobby: "music" }

```

### 3. Document

- A document is the actual record (like a single row in SQL)
- Stored as BSON, aka Binary json
- 

---

### Analogy

database → database → Container for collections

collection→ table → Group of similar documents

document→ row → Single data record in JSON form


Following are the steps one uses for dealing with the Database using mongoose libray

## 1. Start the MongoDB server

In the PowerShell as administrator run

```jsx
net start MongoDB
```

## 2. Import mongoose

```jsx
const mongoose=require("mongoose");
```

## 3. Connect to the Database

```jsx
mongoose.connect("mongodb://127.0.0.1:27017/db_name")
.then(()=>console.log("db connection successful"))
.catch((err)=>console.log(err));

    const Schema=mongoose.Schema;
    const ObjectId=mongoose.ObjectId;
```

- mongoose.connect(uri)→attemps to connect to a MongoDB Server
    - 127.0.0.1→local host
    - /db_name→ connects to this database if exists else creates
    - 27017→default mongo port

## 4. Schema Setup

```jsx
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId; 
//ObjectId → MongoDB’s unique identifier for documents

const userSchema = new Schema({
	username:String,
	password:String
})
```

This creates a  new Schema object that:

- Defines what fields exist
- Defines Datatypes and can have external validators

But at this point there is no real collection in the MongoDB yet, it is only a blueprint stored in memory

**Analogy:** Think of Schema like a Class Definition in OOP

## 6. Models

```jsx
const user=mongoose.model("user",userSchema)
```

This does 2 things:

1. Creates a Model class named *user*  that we can use in our code
2. Tells mongoose to create or use a collection in MongoDB . to note, it auto pluralises the name aka *user* to *users*

This model object can be accessed through which you can perform operations on the collection

## 7. CRUD Operations

all these functions are asynchronous

| Method | Description |
| --- | --- |
| **Model.create(doc)** | Shortcut for `new Model(doc).save()` |
| **Model.find(query)** | Returns an array of matching documents |
| **Model.findOne(query)** | Returns the first matching document |
| **Model.findById(id)** | Shortcut for `_id` lookup |
| **Model.updateOne(query, update)** | Updates the first matching document |
| **Model.updateMany(query, update)** | Updates all matching documents |
| **Model.deleteOne(query)** | Deletes one document |
| **Model.deleteMany(query)** | Deletes multiple documents |
| **Model.aggregate(pipeline)** | Performs MongoDB aggregation framework queries |
| **Model.populate()** | Replaces `ObjectId` references with full documents |
| **Model.findOneAndUpdate(query, update)** | Finds and updates in one step |
| **Model.findOneAndDelete(query)** | Finds and deletes in one step |
| **mongoose.disconnect()** | Closes the database connection |
*/