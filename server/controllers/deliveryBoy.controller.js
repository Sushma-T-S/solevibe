import bcrypt from 'bcryptjs';
import DeliveryBoyModel from '../models/deliveryBoy.model.js';
import { sendEmail } from '../config/sendEmail.js';

// Auto-generate password: DEL + 4-digit random number
const generatePassword = () => {
    return "DEL" + Math.floor(1000 + Math.random() * 9000);
};

// Email template for delivery boy credentials
const deliveryCredentialsTemplate = ({ name, email, password, isReset = false }) => {
    const title = isReset ? "Password Reset - SoleVibe Delivery" : "Welcome to SoleVibe Delivery";
    const message = isReset
        ? "Your password has been reset by the admin. Please use the new credentials below to log in."
        : "You have been registered as a delivery partner. Please use the credentials below to log in.";

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #4f46e5;">${title}</h2>
            <p>Hi ${name},</p>
            <p>${message}</p>
            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 4px 0;"><strong>Password:</strong> ${password}</p>
            </div>
            <p style="color: #dc2626; font-weight: bold;">Please change your password after first login for security.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #6b7280;">If you did not request this, please contact support immediately.</p>
        </div>
    `;
};

export const getAllDeliveryBoys = async (request, response) => {
    try {
        const deliveryBoys = await DeliveryBoyModel.find().select('-password').sort({ createdAt: -1 });

        return response.status(200).json({
            message: "Delivery boys fetched successfully",
            success: true,
            data: deliveryBoys
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const createDeliveryBoy = async (request, response) => {
    try {
        const { name, email, phone, location } = request.body;

        if (!name || !email || !phone) {
            return response.status(400).json({
                message: "Provide name, email and phone",
                success: false
            });
        }

        // Check if email already exists
        const existing = await DeliveryBoyModel.findOne({ email });
        if (existing) {
            return response.status(400).json({
                message: "Delivery boy with this email already exists",
                success: false
            });
        }

        // Auto-generate password
        const plainPassword = generatePassword();

        // Hash password
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const deliveryBoy = await DeliveryBoyModel.create({
            name,
            email,
            phone,
            password: hashedPassword,
            location: location || {}
        });

        // Send plain password to email
        const emailSent = await sendEmail({
            to: email,
            subject: "Delivery Login Credentials - SoleVibe",
            html: deliveryCredentialsTemplate({ name, email, password: plainPassword })
        });

        // Prepare response (exclude password)
        const responseData = deliveryBoy.toObject();
        delete responseData.password;

        return response.status(201).json({
            message: emailSent
                ? "Delivery boy created successfully. Credentials sent to email."
                : "Delivery boy created successfully. Email sending failed - please reset password manually.",
            success: true,
            data: responseData
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateDeliveryBoy = async (request, response) => {
    try {
        const { _id, name, email, phone, location, status } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Provide delivery boy ID",
                success: false
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (status) updateData.status = status;
        if (location) updateData.location = location;

        const deliveryBoy = await DeliveryBoyModel.findByIdAndUpdate(
            _id,
            updateData,
            { new: true }
        ).select('-password');

        if (!deliveryBoy) {
            return response.status(404).json({
                message: "Delivery boy not found",
                success: false
            });
        }

        return response.status(200).json({
            message: "Delivery boy updated successfully",
            success: true,
            data: deliveryBoy
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const deleteDeliveryBoy = async (request, response) => {
    try {
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Provide delivery boy ID",
                success: false
            });
        }

        const deliveryBoy = await DeliveryBoyModel.findByIdAndDelete(_id);

        if (!deliveryBoy) {
            return response.status(404).json({
                message: "Delivery boy not found",
                success: false
            });
        }

        return response.status(200).json({
            message: "Delivery boy deleted successfully",
            success: true,
            data: deliveryBoy
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const toggleDeliveryBoyStatus = async (request, response) => {
    try {
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Provide delivery boy ID",
                success: false
            });
        }

        const existing = await DeliveryBoyModel.findById(_id);

        if (!existing) {
            return response.status(404).json({
                message: "Delivery boy not found",
                success: false
            });
        }

        const newStatus = existing.status === "Active" ? "Inactive" : "Active";

        const deliveryBoy = await DeliveryBoyModel.findByIdAndUpdate(
            _id,
            { status: newStatus },
            { new: true }
        ).select('-password');

        return response.status(200).json({
            message: `Status updated to ${newStatus}`,
            success: true,
            data: deliveryBoy
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const resetDeliveryBoyPassword = async (request, response) => {
    try {
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Provide delivery boy ID",
                success: false
            });
        }

        const deliveryBoy = await DeliveryBoyModel.findById(_id);

        if (!deliveryBoy) {
            return response.status(404).json({
                message: "Delivery boy not found",
                success: false
            });
        }

        // Generate new password
        const newPlainPassword = generatePassword();

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPlainPassword, 10);

        // Update in DB
        deliveryBoy.password = hashedPassword;
        await deliveryBoy.save();

        // Send email with new password
        const emailSent = await sendEmail({
            to: deliveryBoy.email,
            subject: "Password Reset - SoleVibe Delivery",
            html: deliveryCredentialsTemplate({
                name: deliveryBoy.name,
                email: deliveryBoy.email,
                password: newPlainPassword,
                isReset: true
            })
        });

        return response.status(200).json({
            message: emailSent
                ? "Password reset successfully. New credentials sent to email."
                : "Password reset successfully. Email sending failed.",
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

