const joi = require('joi')

const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(256),
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schemaValidation.validate(data)
}

const itemDataValidation = (data) => {
    const schemaValidation = joi.object({
        title:joi.string().required().min(1).max(256),
        condition:joi.string().valid('new', 'used'),
        description:joi.string().required(),
        starting_price:joi.number().positive().precision(2).required(),
        end_date:joi.date().iso().greater('now').required() //format??
    })
    return schemaValidation.validate(data)
}

const itemPatchValidation = (data) => {
    const schemaValidation = joi.object({
        title:joi.string().min(1).max(256),
        condition:joi.string().valid('new', 'used'),
        description:joi.string()
    })
    return schemaValidation.validate(data)
}

const bidDataValidation = (data) => {
    const schemaValidation = joi.object({
        amount:joi.number().positive().precision(2).required()
    })
    return schemaValidation.validate(data)
}


module.exports.itemDataValidation = itemDataValidation
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.bidDataValidation = bidDataValidation
module.exports.itemPatchValidation=itemPatchValidation