const mongoose = require('mongoose')

const auctionSchema = mongoose.Schema({
    itemid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item',
    },
    current_price:{
        type:Number
    },
    current_bid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bid',
        default:null
    },
    action_status:{
        type:String
    },
    winner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    }
})
module.exports=mongoose.model('auctions',auctionSchema)