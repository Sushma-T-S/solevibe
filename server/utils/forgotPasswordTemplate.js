const forgotPasswordTemplate = ({ name, otp })=>{
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
        <!-- Logo and Header -->
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
            <h1 style="color: #2874f0; margin: 0; font-size: 28px; font-weight: bold;">SoleVibe</h1>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 20px 0;">
            <p style="color: #333333; font-size: 16px; line-height: 1.5;">Hi ${name},</p>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.5;">
                We received a request to reset your password for your SoleVibe account. 
                Use the OTP below to proceed:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #2874f0 0%, #1a4db3 100%); 
                        border-radius: 8px; padding: 25px; text-align: center; 
                        margin: 25px 0; box-shadow: 0 4px 15px rgba(40, 116, 240, 0.3);">
                <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; 
                           text-transform: uppercase; letter-spacing: 1px;">Your OTP</p>
                <p style="color: #ffffff; font-size: 36px; font-weight: bold; 
                           margin: 0; letter-spacing: 8px;">${otp}</p>
            </div>
            
            <p style="color: #666666; font-size: 14px; line-height: 1.5;">
                <strong>Important:</strong> This OTP is valid for <span style="color: #2874f0; font-weight: bold;">1 hour</span> only. 
                Please do not share this OTP with anyone for security reasons.
            </p>
            
            <p style="color: #666666; font-size: 14px; line-height: 1.5;">
                If you didn't request a password reset, please ignore this email or contact our support team.
            </p>
        </div>
        
        <!-- Footer -->
        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
            <p style="color: #999999; font-size: 12px; margin: 0;">
                This is an automated message from <strong>SoleVibe</strong>. Please do not reply to this email.
            </p>
            <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                © ${new Date().getFullYear()} SoleVibe. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `
}

export default forgotPasswordTemplate
