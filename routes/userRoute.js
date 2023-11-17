const express=require('express');
const router=express.Router();
const {signUp,logIn,logInAdmin,deleteUser,updateUser, updateUserById, CheckEmail, updateUserAddressById}=require('../controllers/userController')
const{auth}=require('../middlewares/userAuth')
const{authRole}=require('../middlewares/adminAuth')


router.post('/signup',signUp)
router.post('/login',logIn)
router.post('/checkEmail',CheckEmail)
router.post('/loginAdmin',logInAdmin)
// delete user by his id  if you are admin
router.delete('/login/delete',auth,authRole,deleteUser)
// update your first name and last name
router.patch('/login/update',auth,updateUser)
// update your address of user by his id 
router.patch('/login/updateAddress',updateUserAddressById)

router.patch('/login/update/user',auth,authRole,updateUserById)


module.exports=router;