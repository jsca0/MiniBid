const mongoose = require('mongoose')

const bidSchema = mongoose.Schema({
    itemid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item',
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    amount:{
        type:Number,
        require:true,
    },
    previous_bid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bid',
        default:null
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('bids', bidSchema)