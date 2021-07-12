
const express = require('express');

const router  = express.Router();

const db = require('../../../config/db');

const userModel = db.users;

const { validate } = require('../middleware/validation');
 
const bcrypt = require('bcryptjs');

const auth = require('../middleware/authGuard');

router.get('/',async(req,res)=>{
    res.status(200).render('login',{ layout:false,name:'Akashdeep',login:1,register:0 });
})

router.post('/',async(req,res)=>{
    let bodyData = req.body;
    const { error } = validate(bodyData)
    if(error) return res.status(400).send({Error:error.details[0].message}) 
    
    let existsUser = await userModel.findOne({ wherer : { UserEmail : bodyData.UserEmail }})
    if(!existsUser) return res.status(404).send({ msg : 'Data Not Found !!' })

    let isMatch = await bcrypt.compare(bodyData.UserPassword,existsUser.UserPassword)
    if(!isMatch) return res.status(404).send({ msg:'Password Not Matched !' })

    req.session.isAuth = true;    
    res.status(200).redirect('/login/home')

})


router.get('/home',auth,async(req,res)=>{
    console.log(req.session)
    res.status(200).render('home')
})


router.get('/logout',async(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/login')
    })
})












module.exports = router;