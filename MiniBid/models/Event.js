const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    _id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item',
    },
    expires:{
        type:Date
    }
})

//Events will be deleted when they expire
eventSchema.index({ "expires": 1 }, { expireAfterSeconds: 0 })

module.exports=mongoose.model('events',eventSchema)