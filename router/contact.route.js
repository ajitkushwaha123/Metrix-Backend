import express from "express";
import {Contact} from "../models/Contact.model.js"
const contact = express();

contact.post("/" , async (req , res) => {
    const {name , phone , email , city , restourantName} = req.body;
    try{
        const newContact = new Contact({
            name,
            phone,
            email,
            city,
            restourantName
        })

        await newContact.save();

        console.log(newContact);

        return res.status(200).json({
          success: true,
          msg: "Form Submitted successfully... !",
        });
    }catch(err)
    {
        return res.status(400).json({
            success : false,
            msg : "Error Submiting contact form...!"
        })
    }
})

export default contact;
