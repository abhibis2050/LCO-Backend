const UserModel = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const CookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto")

exports.signUp = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("photo is req for signup", 400));
  }
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new CustomError("name,email and password are required", 400));
  }

  let result;
  let files = req.files.photo;
  result = await cloudinary.v2.uploader.upload(files.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  const user = await UserModel.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  CookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  //check the presence of email and password
  if (!email || !password) {
    return next(new CustomError("PLEASE PROVIDE EMAIL  AND PASSWORD", 400));
  }

  //GET USER FROM DB
  //we wrote ("+password") because we mentioned passwod as select:false in model
  //so password will not be shown until we write this
  const user = await UserModel.findOne({ email }).select("+password");

  //CHECKING WHETHER THE USER IS PRESENT OR NOT
  if (!user) {
    return next(new CustomError("Email or password doesnot match", 400));
  }

  //VERIFYING THE PASSWORD
  const isPasswordCorrect = await user.validatePassword(password);
  if (!isPasswordCorrect) {
    return next(new CustomError("Password doesnot match", 400));
  }

  //IF ALL GOES GOOD,SEND A TOKEN
  CookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  //res.cookie("property",value,expiry)
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: "true",
    message: "Logout Successful",
  });
});


exports.forgotPassword = BigPromise(async (req, res, next) => {
  const {email} = req.body
  const user = await UserModel.findOne({email})
  if(!user){
    return next(new CustomError('email not found as registered',400))
  }
   
  const forgotToken = user.getForgotPasswordToken()

 await user.save({validateBeforeSave:true})

const myUrl = `${req.protocol}://${req.get('host')}/password/reset/${forgotToken}`

const message = `Copy paste this link in your URL and hit enter ${myUrl}`

try {
  
  await mailHelper({
    email:user.email,
    subject:"LCO Tstore password reset email",
    message 
  })
  res.status(200).json({
    success:true,
    message:"emails sent"
  })
} catch (error) {
  user.forgotPasswordToken=undefined
  user.forgotPasswordExpiry=undefined
  await user.save({validateBeforeSave:save})

  return next(new CustomError(error.message,500))
}

})


exports.resetPassword = BigPromise(async (req, res, next) => {
 const token = req.params.token

 const encryToken = crypto.createHash("sha256").update(token).digest("hex");

const user = await UserModel.findOne({encryToken,
  forgotPasswordExpiry:{$gt:Date.now()}
})
  
if(!user){
  return next(new CustomError('token is invalid or expired',400))
}

if(req.body.password !== req.body.conformPassword) {
  return next(new CustomError('password and conform password didnot match',400))
}

user.password = req.body.password

user.forgotPasswordToken = undefined
user.forgotPasswordExpiry = undefined

await user.save() 


//send json response or send token

CookieToken(user,res)

})