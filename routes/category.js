//route of category
const express=require("express");
var router=express.Router()
const { getallCategory, saveCategory, getCategoryByid, patchCategory, deletCategory}=require('../controllers/category')
// const {auth}=require('../middelware/auth')
// router.use(auth)
router.get("/",getallCategory)
 router.post('/',saveCategory)
 router.get('/:id',getCategoryByid)
 router.patch('/:id',patchCategory)
router.delete('/:id',deletCategory)
  
 module.exports=router