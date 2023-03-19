//jshint esversion:6
require('dotenv').config()
const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const mongoose=require('mongoose')
const app=express()
const encrypt=require('mongoose-encryption')


//mongoose
mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true})
const userSchema=new mongoose.Schema({
	email:String,
	password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})
const userModel=mongoose.model('User',userSchema)

//app methods
app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
	extended:true
}))

app.listen(3000,function(){
	console.log('Server started at port 3000')
})

app.get('/',function(req,res){
	res.render('home')
})
app.get('/login',function(req,res){
	res.render('login')
})
app.get('/register',function(req,res){
	res.render('register')
})
app.post('/register',function(req,res){
	const userInfo={
		email:req.body.username,
		password:req.body.password
	}
	const user=new userModel(userInfo)
	user.save().then(()=>{
		console.log('New user was created')
		res.render('secrets')
	})
})
app.post('/login',function(req,res){
	const username=req.body.username;
	const password1=req.body.password
	userModel.findOne({email:username}).then((result)=>{
		if(result.password===password1){
		console.log('User founded')
		res.render('secrets')
		}
	})
})