const express = require("express");
const { valid } = require("joi");
// const validateContact = require("../model/contact");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const Contact = require("../model/contact");

router.post("/contact", authenticate, async (req, res) => {
  const { name, email, address, phone } = req.body;

  const contact = new Contact({
    name,
    email,
    address,
    phone,
    postedBy: req.userID,
  });
  await contact.save();

  res.status(201).json({ message: "user registered successfully" });

  // if (err){
  //     return res.status(400).json({error: error.details[0].message})
  // }

  // try{

  // }catch(err) {
  //     console.log(err);
  // }
});

router.get("/contact", authenticate, async (req, res) => {
  try {
    // fetch all contacts of current user
    const contacts = await Contact.find({ postedBy: req.userID });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/contact/:id", authenticate, async (req, res) => {
  try {
    // fetch contact by id
    const contact = await Contact.findById(req.params.id);
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/contact/:id", authenticate, async (req, res) => {
  const { name, email, address, phone } = req.body;
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (address) contactFields.address = address;
  if (phone) contactFields.phone = phone;
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  contact.set(contactFields);
  await contact.save();
  res.json(contact);
});

router.delete("/contact/:id", authenticate, async (req, res) => {
  try {
    // delete contact of current user
    const contact = await Contact.findById(req.params.id);
    contact.remove();
    res.json({ message: "contact deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
