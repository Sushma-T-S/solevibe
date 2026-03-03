const uploadImageController = async (request, response) => {
  try {
    const file = request.file;

    console.log("===== UPLOAD DEBUG =====");
    console.log("Upload request received");
    console.log("File object:", file);
    console.log("File is undefined:", file === undefined);
    console.log("Request body:", request.body);
    console.log("=======================");

    if (!file) {
      return response.status(400).json({
        message: "No file uploaded - request.file is undefined",
        error: true,
        success: false,
      });
    }

    let imageUrl;

    // If using Cloudinary storage - file.path contains the full URL
    if (file.path && typeof file.path === 'string' && file.path.startsWith('http')) {
      imageUrl = file.path;
      console.log("Using Cloudinary URL:", imageUrl);
    } 
    // If using local disk storage
    else {
      imageUrl = `/uploads/${file.filename}`;
      console.log("Using local URL:", imageUrl);
    }

    console.log("Final imageUrl:", imageUrl);

    return response.json({
      message: "Upload done",
      data: imageUrl,
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("===== UPLOAD ERROR =====");
    console.error("Upload error:", error);
    console.error("Error stack:", error.stack);
    console.error("======================");

    return response.status(500).json({
      message: error.message || "Upload failed",
      error: true,
      success: false,
    });
  }
};

export default uploadImageController;
