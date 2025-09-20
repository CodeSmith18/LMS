

const signUp = async (req, res) =>{
    const {username, password} = req.body;
    if(!username || !password) return req.status(400).json({error:"username and password is required"});
    
}