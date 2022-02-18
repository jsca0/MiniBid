const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    title:{
        type:String,
        require:true,
        min:1,
        max:256
    },
    start_date:{
        type:Date,
        default:Date.now
    },
    end_date:{
        type:Date,
        require:true,
    },
    starting_price:{
        type:Number,
        require:true,
    },
    condition:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    item_status:{ //will be 'SOLD' if item sells, otherwise 'EXPIRED'
        type:String,
        default:"" 
    }
    
})
module.exports=mongoose.model('items',itemSchema)