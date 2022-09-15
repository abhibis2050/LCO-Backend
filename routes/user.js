const express = require("express")

const router = express.Router()

const {signUp,login,logout,forgotPassword, resetPassword}= require("../controllers/userController")

// router.get('/signup',signUp)
router.route('/signup').post(signUp)
router.post("/login",login )
router.get("/logout",logout )
router.post("/forgotPassword",forgotPassword)
router.post('/password/reset/:token',resetPassword)




module.exports = router