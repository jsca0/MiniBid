const Item = require('../models/Item')

//Verify that the current user owns the requested item
async function verifyUserOwnsItem(req,res,next){
    const itemid = req.params.itemId
    const userid = req.user._id

    try {
        const getItemById = await Item.findById(itemid)
        const isOwner = userid == getItemById.userid
        if (!isOwner) {
            return res.status(400).send({message:'User does not own item.'}) 
        }
        next()
    }catch(err){
        res.send({message:err})
    }
}
module.exports=verifyUserOwnsItem