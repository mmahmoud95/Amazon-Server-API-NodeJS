//route of sub-Subcategory
const express=require("express");
var router=express.Router()
const  { getallSub_subcategory, saveSub_subcategory, getSub_subcategoryByid, patchSub_subcategory, deletSub_subcategory,subOfSubCategoery}=require('../controllers/InternalSubCategory')
const { auth } = require('../middlewares/userAuth');
const{authRole}=require('../middlewares/adminAuth')

//to get all sub_Subcategory or by id without login
router.get("/",getallSub_subcategory)
router.get('/:id',getSub_subcategoryByid)

//to get all sub_Subcategory or by id if you login as admin or user
router.get("/login/inside_sub",auth,getallSub_subcategory)
router.get('/login/inside_sub/:id',auth,getSub_subcategoryByid)

//get subSubcategories of specific subcategory:
router.get('/subSub/:subId',subOfSubCategoery)

//to save new sub_Subcategory by admin
router.post('/login/inside_sub/save',auth,authRole,saveSub_subcategory)

//to update or edit sub_Subcategory  by admin
router.patch('/login/inside_sub/:id',auth,authRole,patchSub_subcategory)

//to delete sub_Subcategory by admin
router.delete('/login/inside_sub/:id',auth,authRole,deletSub_subcategory)
  
 module.exports=router
