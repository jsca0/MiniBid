const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

const Item = require('./models/Item')
const Event = require('./models/Event')
const Auction = require('./models/Auction')

const itemsRoute = require('./routes/items')
const authRoute = require('./routes/auth')
const bidRoute = require('./routes/bid')
const Bid = require('./models/Bid')

app.use('/api/items', itemsRoute)
app.use('/api/user', authRoute)
app.use('/api/bid', bidRoute)

mongoose.connect(process.env.DB_CONNECTOR, ()=>{
    console.log('DB is connected')
})

//Listen for changes in the 'items' database...
Item.watch().on("change", async (data) => {
    //when a new Item is inserted into the database
    //a new Event is also submitted into the 'events' collection.
    //The event is set to expire on the new item's 'end_date'
    if (data.operationType === "insert") {
        const item = data.fullDocument
        //new event with expiration time
        const eventData = new Event({
            _id:item._id,
            expires:item.end_date
        })
        //try to save to database...
        try{
            await eventData.save()
        }catch(err){
            console.log(err)
        }
    }

    //if item is deleted...
    if (data.operationType == "delete") {
        //try to delete the item's auction and all the associated bids...
        try{
            const itemid = data.documentKey._id
            await Event.deleteOne({_id:itemid})
            await Auction.deleteOne({itemid:itemid})
            await Bid.deleteMany({itemid:itemid})
        }catch(err){
            console.log(err)
        }
    }
})

//Listen for changes in the 'events' database...
Event.watch().on("change", async (data) => {
    //When an event in the 'events 'database is deleted
    //the corresponding item is updated with the winner(if there is one)
    if (data.operationType == "delete") {
        const itemid = data.documentKey._id
        
        try{
            const auction =  await Auction.findOne({itemid:itemid}) //get auction
            
            var item_status = ''
            var winner = null

            //If there is no winner...
            if (auction.current_bid == null) {
                item_status  = "EXPIRED" //item has expired
            }
            else { 
                item_status = "SOLD" //item has been sold
                winner = auction.current_bid //the winner is the highest bid
            }

            //update the item with the item status.
            await Item.updateOne(
                {_id:itemid},
                {$set:{
                    item_status:item_status
                    }
                }
            )
            //update the auction's winner and set action status to CLOSED
            await Auction.updateOne(
                {_id:auction._id},
                {$set:{
                    action_status:"CLOSED", 
                    winner:winner
                    }
                }
            )
        }catch(err) {
            console.log(err)
        }
    }
})

app.listen(3000, ()=>{
    console.log('Server is running')
})
