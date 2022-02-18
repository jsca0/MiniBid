const express = require('express')
const router = express.Router()

const Item = require('../models/Item')
const Bid = require('../models/Bid')
const Auction = require('../models/Auction')
const {bidDataValidation} = require('../validations/validation')
const verifyToken = require('../verifications/verifyToken')

//POST (Bid on an item)
router.post('/:itemId', verifyToken, async(req, res)=>{
    const itemid = req.params.itemId
    const userid = req.user._id

    //validate user input
    const {error} = bidDataValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }
    const amount = req.body.amount

    try{
        const item = await Item.findById(itemid)//get item
        const auction = await Auction.findOne({itemid:itemid})//get auction

        //Users cant bid on their own items
        if(item.userid == userid) {
            return res.status(400).send({message:'User cannot bid on an item they own.'})
        }

        //The auction must be OPEN
        if (auction.action_status != "OPEN") {
            return res.status(400).send({message:'Auction is closed.'}) 
        }

        //The bid must be more than the current highest bid
        if (amount < auction.current_price) {
            return res.status(400).send({message:'Bid amount must be more than the current price.'})  
        }

        //create new bid
        const bidData = new Bid ({
            itemid:itemid,
            userid:userid,
            amount:amount,
            previous_bid:auction.current_bid //give it the previous bid
        })
        const bidToSave = await bidData.save()

        //update the auction with the new highest bid
        await Auction.updateOne(
            {_id:auction._id},
            {$set:{
                current_price:amount,
                current_bid:bidData._id
                }
            }
        )
        
        res.send(bidToSave)
    }catch(err){
        res.send({message:err})
    }
})

module.exports = router