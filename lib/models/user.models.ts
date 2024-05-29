import mongoose from 'mongoose'
const followerSchema = new mongoose.Schema({ 
    user:{ 
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User' 
    },
    createdAt:{
        type:Date , 
        default:Date.now 
    }
})
const reactionSchema = new mongoose.Schema({
    thread:{ 
    type:mongoose.Schema.Types.ObjectId,
    ref:"Thread"
    } , 
    createdAt: {
        type: Date,
        default: Date.now,
      },
}) 
const userSchema = new mongoose.Schema({ 
    id:{
        type:String , 
        required:true 
    }, 
    username:{
        type:String , 
        required:true,
        unique:true  
    }, 
    name:{
        type:String , 
        required:true 
    }, 
    image:{
        type:String , 
        required:true 
    }, 
    bio:{
        type:String , 
        required:true 
    }, 
    threads:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Thread' 

    }], 
    onboarded:{ 
        type:Boolean, 
        default:false 
    },
   
    followers :  [followerSchema] , 
    following:[followerSchema] ,  

    reactions:[reactionSchema] 
    
    
    
    
})

  
userSchema.virtual("followersCount").get(function () {
    return this.followers.length;
  });
  
  userSchema.virtual("followingCount").get(function () {
    return this.following.length;
  });
  userSchema.virtual("reactionsCount").get(function(){ 
    return this.reactions.length 
  })
const User = mongoose.models.User||mongoose.model('User',userSchema) 

export default User 