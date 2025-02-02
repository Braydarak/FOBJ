export const renderDetails = (details: Record<string, any>) => {
    const ignoreFields = ["coordinates", "userId", "map"];
    const rows = [];

     
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
        const translatedKey = translations[key] || key;
        rows.push(
          <div key={key} className="grid grid-cols-4 grid-rows-1 gap-2">
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
            {translatedKey}
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              {details[key] || "N/A"}
            </div>
          </div>
        );
      }
    }

    return rows;
  };