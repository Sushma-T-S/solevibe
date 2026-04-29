import UserModel from "../models/user.model.js"

export const admin = async(request,response,next)=>{
    try {
        console.log(`=== ADMIN DEBUG [${request.originalUrl}] userId: ${request.userId || 'none'} ===`)
       const  userId = request.userId

       if(!userId){
            return response.status(401).json({
                message : "User ID not found in request",
                error : true,
                success : false
            })
       }

       const user = await UserModel.findById(userId)

       if(!user){
            return response.status(404).json({
                message : "User not found",
                error : true,
                success : false
            })
       }

       if(user.role !== 'ADMIN'){
            return response.status(403).json({
                message : `Permission denied - User role is '${user.role}', requires 'ADMIN'`,
                error : true,
                success : false
            })
       }

       next()

    } catch (error) {
        console.error(`=== ADMIN ERROR [${request.originalUrl}] userId: ${userId || 'none'} ===`)
        console.error('Full error:', error)
        console.error('Error stack:', error.stack)
        console.error('=== END ADMIN ERROR ===')
        return response.status(500).json({
            message : "Permission denial - " + error.message,
            error : true,
            success : false
        })
    }
}
