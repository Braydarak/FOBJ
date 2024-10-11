import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc , getDoc } from "firebase/firestore";
import { firestore } from "../../../firebase"
import Header from "../../../components/header";
import Layout from "../../../components/layout";
import Button from "../../../components/customButton";

const CardDetailsView: React.FC = () => {
  const location = useLocation();
  const { cardId, collectionName } = location.state || {}; // Obtener el id de la tarjeta seleccionada (pasado en el estado de react-router)
  const [cardDetails, setCardDetails] = useState<any>(null); // Estado para los detalles de la tarjeta
  const [loading, setLoading] = useState(false); // Estado de carga

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (cardId && collectionName) {
        try {
          const docRef = doc(firestore, collectionName, cardId); // Ajusta "cards" al nombre de tu colección en Firestore
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setCardDetails(docSnap.data()); // Guardamos los datos en el estado
          } else {
            console.log("No existe ese documento");
          }
        } catch (error) {
          console.error("Error al obtener los detalles de la tarjeta:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCardDetails();
  }, [cardId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!cardDetails) {
    return <div>No se encontraron detalles para esta tarjeta.</div>;
  }

  return (
    <>
      <Header />
      <Layout>
        <h3 className="text-2xl w-full font-semibold my-8 uppercase">
          Reportado por  {cardDetails.userId || "N/A"}
        </h3>
        <div className="w-full md:grid md:grid-cols-2">
          <div className="grid grid-cols-4 grid-rows-5 gap-4 w-full space-y-2 md:w-full">
            {/* row 1 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              usuario
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              {cardDetails.user || "N/A"}
            </div>

            {/* row 2 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              nombre
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              {cardDetails.name || "N/A"}
            </div>

            {/* row 3 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-2 uppercase">
              apellido
            </div>
            <div className="bg-blue-500 text-end text-xl font-medium col-span-2">
              {cardDetails.apellido || "N/A"}
            </div>

            {/* row 4 */}
            <div className="bg-blue-500 text-left text-2xl font-semibold col-span-1 uppercase">
              email
            </div>
            <div className="bg-blue-500 text-right text-xl font-medium col-span-3">
              {cardDetails.userId || "N/A"}
            </div>
          </div>
          <div className="md:w-1/2  md:justify-center  md:items-center md:text-center md:mx-auto">
            <div className="font-semibold text-2xl w-full text-center mt-8 md:mt-0 uppercase">
              Encontrado en
            </div>
            <div className="w-full mt-5 md:mt-10">
              {cardDetails.map || "Mapa no disponible"}
            </div>
          </div>
        </div>
        <div className="md:w-80 w-full mt-10 md:mt-14">
          <Button
            text="Contactar"
            textTransform="uppercase"
            textSize="text-[25px]"
            textColor="text-backgroundcolor"
            bgColor="bg-secondary"
            roundedSize="rounded-[30px]"
            disabled={false}
          />
        </div>
      </Layout>
    </>
  );
};

export default CardDetailsView;
