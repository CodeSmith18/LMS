import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !password) return req.status(400).json({ error: "username and password is required" });

    const exist = await User.findOne({ email });
    if (exist) return req.status(400).json({ error: "Email already exist, Try Login !!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, hashedPassword });

    return res.status(201),json({message:"User Registration Done"})
}

const createAccessToken = (user) =>{
    jwt.sign({email:user.email,password:user.password},process.env.JWT_ACCESS_SECRET,{expiresIn:process.env.JWT_ACCESS_TOKEN_EXP});
}


const createRefreshToken = (user) =>{
    jwt.sign({email:user.email,password:user.password},process.env.JWT_REFRESH_SECRET,{expiresIn:process.env.JWT_REFRESH_TOKEN_EXP});
}



export  const login = async(req,res) =>{
    const {email,password} = req.body;
    const user = User.findOne({email});
    if(!user) return res.status(401).json({error:"Email id is not registered "})

    const isPassWordCorrect = await bcrypt.compare(password,user.password);
    if(!isPassWordCorrect) return res.status(401).json({error:"Incorrect Password"});

    const  accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken",accessToken,cookieOptions(15*60*1000));
    res.cookie("refreshToken",refreshToken,cookieOptions(7*24*60*60*1000));

    return res.status(201),json({message:"Login Succefull"});
}

export const getProfile = async (req, res) => {
  const user = await User.getUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};