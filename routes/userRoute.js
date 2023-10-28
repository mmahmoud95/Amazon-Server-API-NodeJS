const express=require('express');
const router=express.Router();
const {signUp,logIn,deleteUser,updateUser, updateUserById}=require('../controllers/userController')
const{auth}=require('../middlewares/userAuth')
const{authRole}=require('../middlewares/adminAuth')


router.post('/signup',signUp)
router.post('/login',logIn)
// delete user by his id  if you are admin
router.delete('/login/delete',auth,authRole,deleteUser)
// update your first name and last name
router.patch('/login/update',auth,updateUser)
// update  first name and last name of user by his id if you are an admin
router.patch('/login/update/user',auth,authRole,updateUserById)


module.exports=router;