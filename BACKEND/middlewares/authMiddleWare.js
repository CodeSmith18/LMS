import jwt from "jsonwebtoken";

const authMiddleWare = (req,res,next) =>{
    const authHeader = req.headers["authorization"];

    if(!authHeader) return res.status(401).json({message : "No Token"});

    const token = authHeader.split(" ")[1];
    try{
        const payload = jwt.verify(token,process.env.JWT_ACCESS_SECRET);
        req.userId = payload.id;
       return next();
    }
    catch(err){
        res.status(401).json({message:"Invalid token"});
    }
}


export default authMiddleWare;


