import jwt from 'jsonwebtoken'
import UserModel from '../models/user.model.js'

const generatedAccessToken = async(userId)=>{
    // Fetch user to get their role
    const user = await UserModel.findById(userId)
    
    const token = await jwt.sign({ 
        id : userId,
        role : user?.role || 'USER'
    },
        process.env.JWT_SECRET || "solevibe_jwt_secret_key_2024_secure",
        { expiresIn : '5h'}
    )

    return token
}

export default generatedAccessToken
