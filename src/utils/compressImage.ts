import imageCompression from "browser-image-compression";

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1, // compress to max 1MB
    maxWidthOrHeight: 1920, // max dimension
    useWebWorker: true, // non-blocking
    fileType: "image/webp", // convert to webp for smaller size
  };

  try {
    const compressed = await imageCompression(file, options);
    console.log(
      `Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressed.size / 1024 / 1024).toFixed(2)}MB`,
    );
    return compressed;
  } catch (err) {
    console.error("Compression failed, using original:", err);
    return file; // fallback to original if compression fails
  }
};
