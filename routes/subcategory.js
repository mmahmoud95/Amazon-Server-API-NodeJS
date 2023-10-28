//route of Subcategory
const express=require("express");
var router=express.Router()
const  { getallSubcategory, saveSubcategory, getSubcategoryByid, patchSubcategory, deletSubcategory}=require('../controllers/subcategory')
const { auth } = require('../middlewares/userAuth');
const{authRole}=require('../middlewares/adminAuth')

//to get all Subcategory or by id without login
router.get("/",getallSubcategory)
router.get('/:id',getSubcategoryByid)

//to get all Subcategory or by id if you login as admin or user
router.get("/login/sub",auth,getallSubcategory)
router.get('/login/sub/:id',auth,getSubcategoryByid)

//to save new Subcategory by admin
router.post('/login/sub/save',auth,authRole,saveSubcategory)

//to update or edit Subcategory  by admin
router.patch('/login/update/sub/:id',auth,authRole,patchSubcategory)

//to delete Subcategory by admin
router.delete('/login/delete/sub/:id',auth,authRole,deletSubcategory)
  
 module.exports=router

