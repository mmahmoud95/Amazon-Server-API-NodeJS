//route of category
const express=require("express");
var router=express.Router()
const { getallCategory, saveCategory, getCategoryByid, patchCategory, deletCategory}=require('../controllers/category')

const { auth } = require('../middlewares/userAuth');
const{authRole}=require('../middlewares/adminAuth')
//to get all category or by id without login
router.get("/",getallCategory)
router.get('/:id',getCategoryByid)

//to get all category or by id if you login as admin or user
router.get("/login",auth,getallCategory)
router.get('/login/:id',auth,getCategoryByid)

//to save new category by admin
router.post('/login/save',auth,authRole,saveCategory)

//to update or edit category  by admin
router.patch('/login/update/:id',auth,authRole,patchCategory)

//to delete category by admin
router.delete('/login/delete/:id',auth,authRole,deletCategory)
  
 module.exports=router