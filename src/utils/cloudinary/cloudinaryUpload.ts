export const uploadImageToCloudinary = async (
  file: File,
  folder: string,
  publicId: string
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "fobj_preset"); 
  formData.append("cloud_name", "duu76homw");

  // --- Estos son los parámetros nuevos para organizar la imagen ---
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  // ----------------------------------------------------------------

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/duu76homw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      // Agregué esto para que si Cloudinary falla, te diga exactamente por qué en la consola
      const errorData = await response.json();
      console.error("Detalle del error de Cloudinary:", errorData);
      throw new Error("Error en Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error al subir a Cloudinary:", error);
    return null;
  }
};