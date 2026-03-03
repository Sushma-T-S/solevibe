import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const uploadImage = async (image, folder) => {
    try {
        const formData = new FormData()
        formData.append('image', image)
        
        if (folder) {
            formData.append('folder', folder)
        }

        const response = await Axios({
            ...SummaryApi.uploadImage,
            data: formData
            // Note: Do NOT set Content-Type manually for FormData
            // Axios automatically sets it with the correct boundary
        })

        // Check if response was successful
        if (response.data?.success) {
            return { 
                success: true, 
                data: response.data.data,
                message: response.data.message 
            }
        } else {
            return { 
                error: true, 
                message: response.data?.message || 'Upload failed' 
            }
        }
    } catch (error) {
        console.error('Upload image error:', error)
        return { 
            error: true, 
            message: error.response?.data?.message || error.message || 'Upload failed' 
        }
    }
}

export default uploadImage
