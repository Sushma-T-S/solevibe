import jwt from 'jsonwebtoken'

const auth = async(request,response,next)=>{
    try {
        // Try to get token from cookie first, then from authorization header
        let token = request.cookies?.accessToken
        
        // If no cookie token, try Authorization header
        if (!token && request.headers?.authorization) {
            const authHeader = request.headers.authorization
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' "')[1]
            }
        }
       
        console.log("Auth middleware - Token:", token ? "present" : "not present")
        console.log("Auth middleware - Cookies:", request.cookies)

        if(!token){
            return response.status(401).json({
                message : "Provide token"
            })
        }

        const decode = await jwt.verify(token,process.env.JWT_SECRET || "solevibe_jwt_secret_key_2024_secure")

        if(!decode){
            return response.status(401).json({
                message : "unauthorized access",
                error : true,
                success : false
            })
        }

        console.log("Auth middleware - Decoded JWT:", decode)

        request.userId = decode.id
        request.userRole = decode.role // Include role from JWT

        next()

    } catch (error) {
        console.error("Auth middleware error:", error.message)
        return response.status(401).json({
            message : "Unauthorized: " + error.message,
            error : true,
            success : false
        })
    }
}

export default auth
