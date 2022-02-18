const express = require('express')
const router = express.Router()

const Item = require('../models/Item')
const Bid = require('../models/Bid')
const Auction = require('../models/Auction')
const {itemDataValidation, itemPatchValidation} = require('../validations/validation')
const verifyToken = require('../verifications/verifyToken')
const verifyUserOwnsItem = require('../verifications/verifyOwnership')

// POST (Create item) 
router.post('/', verifyToken, async(req,res)=>{
    // Validate user input
    const {error} = itemDataValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    try{   
        //Time item will expire
        const expires = new Date(req.body.end_date)

        //create a new Item
        const itemData = new Item ({
            title:req.body.title,
            condition:req.body.condition,
            description:req.body.description,
            end_date:expires,
            starting_price:req.body.starting_price,
            userid:req.user._id, //give the item the user
        })

        //create a new Auction for the item
        const auction = new Auction ({
            itemid:itemData._id,//give the auction the item
            action_status:"OPEN",
            current_price:req.body.starting_price    
        })
        await auction.save() //save auction 

        const itemToSave = await itemData.save() //save item
        res.send(itemToSave)
    }catch(err){
        res.send({message:err})
    }
})

//GET 1 (Read all items)
router.get('/', verifyToken, async(req,res) =>{
    //try to retrieve all items...
    try{
        const items = await Item.find()
        res.send(items)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// GET 2 (Read by ID)
router.get('/:itemId', verifyToken, async(req,res) =>{
    //try to get the item by it's Id...
    try{
        const getItemById = await Item.findById(req.params.itemId)
        res.send(getItemById)
    }catch(err){
        res.send({message:err})
    }
})

//GET 3 (Read sold item bidding history)
router.get('/:itemId/history', verifyToken, async(req,res) =>{
    //try to find all bids with itemid and sort by date...
    try{
        const getItemById = await Item.findById(req.params.itemId)
        if (getItemById.item_status != 'SOLD') { 
           return res.status(400).send({message:'Item must be sold'}) 
        }
        const bidding_history = await Bid.find({itemid:req.params.itemId}).sort({date: -1})
        res.send(bidding_history) 
    }catch(err){
        res.send({message:err})
    }
})

//GET 4 (Read all sold items)
router.get('/sold' , verifyToken, async(req,res)=> {
    //try to find all sold items...
    try{
        const getSoldItems = await Item.find({item_status:"SOLD"}).sort({end_date:-1})
        res.send(getSoldItems) 
    }catch(err){
        res.send({message:err})
    }
})

//GET 5 (Read the item's auction)
router.get('/:itemId/auction', verifyToken, async(req,res)=> {
    try{
        const auction = await Auction.findOne({itemid:req.params.itemId})
        .populate({path:'winner', model:Bid})
        res.send(auction)
    }catch(err) {
        res.send({message:err})
    }
})

// PATCH (Update item)
//User must own the item and can't change the start or end dates or the starting price
router.patch('/:itemId', [verifyToken, verifyUserOwnsItem], async(req,res) =>{
    // Validate user input
    const {error} = itemPatchValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }
    //try to update item...
    try{
        const updateItemById = await Item.updateOne(
            {_id:req.params.itemId},
            {$set:{
                title:req.body.title,
                condition:req.body.condition,
                description:req.body.description,
                }
            })
        res.send(updateItemById)
    }catch(err){
        res.send({message:err})
    }
})

// DELETE (Delete item)
router.delete('/:itemId', [verifyToken, verifyUserOwnsItem], async(req,res)=>{
    //try to delete item...
    try{
        const deleteItemById = await Item.deleteOne({_id:req.params.itemId})
        res.send(deleteItemById)
    }catch(err){
        res.send({message:err})
    }
})

module.exports = router