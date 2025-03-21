const mongoose=require("mongoose");
mongoose.connect(process.env.MONGO_URL="mongodb://localhost:27017/Kickoutdepression").then(()=>console.log("database connected successfully")).catch((err)=>{
    console.log(err);
});

const userSchema=mongoose.Schema({
    name:{
        type:String,
    },
    age:{
        type:String
    },
    email:{
        type:String
    },
    mobile:{
        type:Number
    },

});

module.exports=mongoose.model('user',userSchema);