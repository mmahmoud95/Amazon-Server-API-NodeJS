//route of Subcategory
const express=require("express");
var router=express.Router()
const  { getallSubcategory, saveSubcategory, getSubcategoryByid, patchSubcategory, deletSubcategory}=require('../controllers/subcategory')
router.get('/',getallSubcategory)
router.get('/:id',getSubcategoryByid)
router.post('/',saveSubcategory)
router.patch('/:id',patchSubcategory)
router.delete('/:id',deletSubcategory)


module.exports=router