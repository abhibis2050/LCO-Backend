//In case we don't want to use the Big promise we can use try-catch along with async-await

module.exports = (func)=>(req,res,next)=>{
    Promise.resolve(func(req,res,next)).catch(next)

}





 
