const jwt = require("jsonwebtoken");


const authMiddleWare = (req,res,next) =>{
    const token = req.header("Authorization")?.split(" ")[1];
       const JWT_SECRET = process.env.JWT_SECRET;
    if(!token)return res.status(401).json({msg:"No Token,Unauthorized"});
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = {id:decoded.id};
        next();
    }catch (err){
        return res.status(401).json({msg: "Invalid token"});
    }
};
module.exports = authMiddleWare;