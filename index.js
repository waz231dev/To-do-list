// require express
const express = require('express');
// require path
const path = require('path');
// setting port
const port = 3000;

// setting the database
const db = require('./config/mongoose')
const Task = require('./models/task');

// express app
const app = express();

// setting view engine
app.set('view engine', 'ejs');
// setting view engine path
app.set('views',path.join(__dirname,'views'));

// Middleware
// To use static files
app.use(express.static('assets'));
// To encode the form data
app.use(express.urlencoded());

// various background color for different categories
var bgColor=["pink","blue","red","green","purple"];

//setting route for home page 
app.get('/',function(req,res){

    Task.find({},function(err,tasks){
        if(err){
            console.log('Error in fetching data');
            return;
        }
        return res.render('home',{
            title:"TODO App",
            task_list:tasks,
            bg_color:bgColor
        });
    })
})

// setting route for adding tasks
app.post('/add-task',function(req,res){
    Task.create({
        description:req.body.description,
        category:req.body.category,
        date:req.body.date
    },function(err,newTask){
        if(err){
            console.log('Error in adding task:',err);
            return; 
        }
        console.log('*********',newTask);
        return res.redirect('back');
    })
})

// setting route for deleting tasks
app.get('/del-tasks', function(req,res){
    var id = req.query;

    var count=Object.keys(id).length;
    for(let i=0; i<count; i++){

        Task.findByIdAndDelete(Object.keys(id)[i],function(err){
           if(err){
               console.log('Error in deleting tasks:',err);
               return;
           } 
        });
    }
    return res.redirect('back');
});


app.listen(port,function(err){
    if(err){
        console.log('Error');
        return;
    }
    console.log('Server is running on the port:',port);
})