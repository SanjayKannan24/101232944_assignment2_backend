let express = require("express");
let mongoose = require("mongoose");
const cors = require("cors");

const Employee = require("./models/employee");
let app = express();
app.use(express.json());
app.use(cors());

const fs = require('fs');
// import employee.js
let EmployeeModel = require("./models/employee");

// Connecting to the MongoDB
mongoose.connect('mongodb+srv://SanjayKannan:SanjayKannanDB@assignment-02.5t6az.mongodb.net/101232944_assignment2?retryWrites=true&w=majority' , {
    useNewUrlParser : true,
    useUnifiedTopology : true
})

app.get("/" , (req , res) => {
    res.send("<h1>Assignment 02</h1>");
})

// 1. All Employee resources are fetched
app.get("/api/v1/employees" , async (req , res) => {
    const e = await EmployeeModel.find({});
    try{
        res.status(200).send(e);
    }catch(err){
        
        res.status(500).send(err);
    }
})

// 2. A new Employee resource is created
app.post("/api/v1/employees", async (req, res) => {
    let count = fs.readFileSync("count.txt");
    const newEmployee = new EmployeeModel({
        id : ++count,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        emailid : req.body.emailid
    });

    fs.writeFileSync("count.txt" , count.toString());
    try {
        await newEmployee.save();
        res.send(newEmployee);
    } catch (err) {
        res.status(500).send(err);
    }
});


// 3. One Employee resource is fetched
app.get("/api/v1/employees/:id" , async (req , res) => {
    const e = await EmployeeModel.find({id : req.params.id});
    
    try{
        if(!req.params.id){
            res.send("Id not found");
        }
        else{
            res.status(200).send(e);
        }
    }catch(err){
        res.status(500).send(err);
    }
})

// 4. Employee resource is updated
app.put("/api/v1/employees/:id" , async (req , res) => { 
    EmployeeModel.findOne({Id : req.params.id} , function(err , foundObject){
        if(err){
            res.status(500).send();
        }
        else{
            foundObject.firstname = req.body.firstname;
            foundObject.lastname = req.body.lastname;
            foundObject.emailid = req.body.emailid;

            foundObject.save(function(err , updatedObject) {
                if(err){
                    res.status(500).send();
                }
                else{
                    res.send(updatedObject);
                }
            });
        }
    });
})

app.delete("/api/v1/employees/:id" , async (req , res) => {
    try {    
        const e = await EmployeeModel.findOneAndDelete({id : req.params.id});

        if (!e) res.status(404).send("No item found");
        res.status(200).send("Successfully Deleted");
    } catch (err) {
        res.status(500).send(err);
    }
    
});

app.listen(8089 , () => {
    console.log("Server running at http://localhost:8089/")
})
