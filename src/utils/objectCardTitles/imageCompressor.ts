export const compressImageNative = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Achicamos las dimensiones para que no sea una foto gigante de 4K
        const MAX_WIDTH = 800; 
        const MAX_HEIGHT = 800; 
        let width = img.width;
        let height = img.height;

        // Calculamos las proporciones para no deformar la imagen
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertimos el canvas de nuevo a archivo. 
        // AQUÍ ESTÁ EL 0.7 QUE PEDISTE PARA BAJAR EL PESO
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg", // La pasamos a JPG que es más liviano
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Error al comprimir la imagen"));
            }
          },
          "image/jpeg",
          0.7 // <--- Calidad al 70%
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};