export const getObjectCardTitles = (selectedOption: string) => {
    switch (selectedOption) {
      case "Cash":
        return {
          top: "Cantidad",
          middle: "Localidad",
          bottom: "Fecha",
        };
      case "Clothing":
        return {
          top: "Marca",
          middle: "Descripción",
          bottom: "Fecha",
        };
      case "Dni":
        return {
          top: "Dni",
          middle: "Nombre",
          bottom: "Fecha",
        };
      case "Phone":
        return {
          top: "Marca",
          middle: "Color",
          bottom: "Fecha",
        };
      case "Other":
        return {
          top: "Titulo",
          middle: "Descripción",
          bottom: "Fecha",
        };
      default:
        return {
          top: "",
          middle: "",
          bottom: "",
        };
    }
  };