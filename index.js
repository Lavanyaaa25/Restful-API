const express=require("express");
const app=express();
const PORT=8000;
const fs=require("fs");
const users=require("./MOCK_DATA.json");
const bodyParser=require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }))



//middleware
app.use(express.urlencoded({extended:false})); //parsing input data


app.use((req,res,next)=>{
    console.log("Hello from middleware 1");
    next();
});

app.use((req,res,next)=>{
    console.log("Hello from middleware 2");
    // return res.json({msg:"Hello from middleware"}) //terminate
    next(); 
    // exceutes next function
})

//property of one middleware is available in next example: req.userName


app.get("/api/users",(req,res)=>{
    res.setHeader('X-Purpose','Testing'); //custom headers-add x

    return res.json(users);
})
//in case of mobile app

app.get("/users",(req,res)=>{
const html=`
<ul>
${users.map(user=>`<li>${user.first_name}</li>`).join("")}
</ul>`;
res.send(html);
})
//in case of web,send html

app.get("/api/users/:id",(req,res)=>{
    const id=Number(req.params.id); //convert from string to num
    const user=users.find((user)=>user.id === id);
    if(!user)
        return res.status(404).json({error:"user not found"});
    return res.json(user);
}) //dynamic route, :id =varibale,dynamic

app.post("/api/users",(req,res)=>{
    //TODO=create new user
    const body=req.body;
    users.push({...body,id:users.length+1});
    // return res.json({users:users});
    
    fs.writeFile("MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        if(err) {
            console.error(err);
            return res.status(500).json({status: "error", message: "Failed to create user"});
        }
        return res.status(201).json({status: "success", id: users.length});
    });
   //test through postman, using form encoded
})

app.patch("/api/users/:id",(req,res)=>{
    //TODO=edit user details with id
    return res.json({status:"pending"});
})


app.delete("/api/users/:id",(req,res)=>{
    //TODO=delete user with id
    return res.json({status:"pending"});
})



app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
