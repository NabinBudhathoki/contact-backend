const mongoose = require("mongoose");
const Joi = require('joi');
const { required } = require("joi");

const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    isFavorite: {
        type: Boolean,
        required: false,
      },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
  });

  const Contact =  mongoose.model("Contact",contactSchema );

  // const validateContact = data => {
  //   const schema = Joi.object({
  //     name: Joi.string().min(4).max(50).required(),
  //     address: Joi.string().min(4).max(100).required(),
  //     email: Joi.string().email().required(),
  //     phone: Joi.number().max(10000000000).required(),

  //   })
  //   return schema.validate(data);

  // };

  module.exports = Contact;
  
  // module.exports = validateContact;