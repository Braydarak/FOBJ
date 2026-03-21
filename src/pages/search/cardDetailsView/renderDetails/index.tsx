export const renderDetails = (details: Record<string, any>) => {
  const ignoreFields = ["coordinates", "userId", "map", "id"];
  const rows: JSX.Element[] = [];

  const translations: Record<string, string> = {
    amount: "Cantidad",
    location: "Localidad",
    date: "Fecha",
    userId: "Correo electrónico",
    description: "Descripcion",
    brand: "marca",
    name: "nombre",
    address: "apellido",
    documentNumber: "dni",
    information: "informacion",
    model: "modelo",
  };

  for (const key in details) {
    if (!ignoreFields.includes(key)) {
      if (key === "imageUrl") {
        if (details[key]) {
         
          rows.unshift(
           
            <div key={key} className="col-span-4 flex justify-center mb-6">
              <img
                src={details[key]}
                alt="Fotografía del objeto"
                className="w-full max-h-64 object-contain rounded-xl shadow-md border border-gray-200"
              />
            </div>,
          );
        }
        continue;
      }
      // ----------------------------------------------

      const translatedKey = translations[key] || key;
      rows.push(
        <div key={key} className="grid grid-cols-4 grid-rows-1 gap-2 mb-2">
          <div className="bg-blue-500 text-white text-left text-xl md:text-2xl font-semibold col-span-2 uppercase px-2 rounded-l-md">
            {translatedKey}
          </div>
          <div className="bg-blue-500 text-white text-end text-lg md:text-xl font-medium col-span-2 px-2 rounded-r-md truncate">
            {details[key] || "N/A"}
          </div>
        </div>,
      );
    }
  }

  return rows;
};
