import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import LogOutIcon from "../../icons/logOutIcon";
import Card from "../../components/cards";
import LineComponent from "../../components/lineComponent";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import UserIcon from "../../components/userIcon";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../firebase";
import Loader from "../../components/loader";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { logout, loading, user } = useAuth();
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [counts, setCounts] = useState({
    dni: 0,
    clothing: 0,
    cash: 0,
    phone: 0,
    other: 0,
  });

  const searchNavigator = () => navigate("/search");
  const reportNavigator = () => navigate("/report");
  const objectsNavigator = () => navigate("/myobjects");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const fetchCounts = async () => {
      const getCollectionCount = async (
        collectionName: string,
      ): Promise<number> => {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        return snapshot.size;
      };

      try {
        const dniCount = await getCollectionCount("Dni");
        const ropaCount = await getCollectionCount("Clothing");
        const dineroCount = await getCollectionCount("Cash");
        const telCount = await getCollectionCount("Phone");
        const otrosCount = await getCollectionCount("Other");

        setCounts({
          dni: dniCount,
          clothing: ropaCount,
          cash: dineroCount,
          phone: telCount,
          other: otrosCount,
        });
        setLoadingCounts(false);
      } catch (error) {
        console.error("Error fetching collection counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0];
  };

  return (
    <div className="overflow-x-hidden w-full flex flex-col h-full justify-between items-stretch bg-backgroundcolor min-h-screen">
      <style>
        {`
          @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            opacity: 0;
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .delay-400 { animation-delay: 400ms; }
          
          /* Hide scrollbar for Chrome, Safari and Opera */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          /* Hide scrollbar for IE, Edge and Firefox */
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
      {loading || loadingCounts ? (
        <div className="flex items-center justify-center h-screen bg-backgroundcolor">
          <Loader />
        </div>
      ) : (
        <Layout>
          {/* Header Section */}
          <div className="text-primary flex justify-between items-center w-full mt-3 md:mt-8 mb-4 md:mb-8 animate-slide-up">
            <div className="flex flex-col">
              <span className="font-bold text-2xl md:text-[50px] md:mb-2 tracking-tight">
                Hola,{" "}
                <span className="text-secondary capitalize">
                  {user ? getFirstName(user.displayName || "") : ""}
                </span>
              </span>
              <p className="text-sm md:text-2xl text-inputText mt-1">
                ¿Perdiste algo?
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-secondary shadow-sm object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-secondary shadow-sm flex items-center justify-center bg-cardBG transition-transform duration-300 hover:scale-105">
                  <UserIcon />
                </div>
              )}
              <div
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-cardBG transition-colors duration-300 cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOutIcon />
              </div>
            </div>
          </div>

          <div className="w-full animate-slide-up delay-100">
            <LineComponent />
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col md:flex-row justify-between w-full items-center md:mt-12 mt-6 gap-6 md:gap-10 animate-slide-up delay-200">
            <div
              className="group relative md:w-1/2 w-full h-[140px] md:h-[220px] bg-gradient-to-br from-primary to-[#003380] rounded-[30px] flex justify-center items-center cursor-pointer overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              onClick={searchNavigator}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <h2 className="uppercase text-backgroundcolor font-bold tracking-wider text-3xl md:text-5xl z-10 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
                Buscar
              </h2>
            </div>
            <div
              className="group relative md:w-1/2 w-full h-[140px] md:h-[220px] bg-gradient-to-br from-secondary to-[#5A8EE0] rounded-[30px] flex justify-center items-center cursor-pointer overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              onClick={reportNavigator}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <h2 className="uppercase text-backgroundcolor font-bold tracking-wider text-3xl md:text-5xl z-10 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
                Reportar
              </h2>
            </div>
          </div>

          {/* Lost Objects Section */}
          <div className="flex justify-between w-full md:mt-14 mt-8 items-end animate-slide-up delay-300">
            <span className="md:text-4xl text-2xl font-bold text-primary tracking-tight">
              Objetos perdidos
            </span>
            <span
              className="text-secondary md:text-xl text-sm font-semibold cursor-pointer hover:underline hover:text-primary transition-colors duration-300"
              onClick={objectsNavigator}
            >
              Mis objetos
            </span>
          </div>

          <div className="w-full md:mt-8 mt-6 animate-slide-up delay-400 pb-24 md:pb-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full place-items-center">
              <div className="w-full flex justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-[24px] group">
                <Card
                  title={"Dni"}
                  obj={"dni"}
                  amount={counts.dni}
                  onClick={() => navigate(`/search?collection=Dni`)}
                />
              </div>
              <div className="w-full flex justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-[24px] group">
                <Card
                  title={"Ropa"}
                  obj={"ropa"}
                  amount={counts.clothing}
                  onClick={() => navigate(`/search?collection=Clothing`)}
                />
              </div>
              <div className="w-full flex justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-[24px] group">
                <Card
                  title={"Dinero"}
                  obj={"dinero"}
                  amount={counts.cash}
                  onClick={() => navigate(`/search?collection=Cash`)}
                />
              </div>
              <div className="w-full flex justify-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-[24px] group">
                <Card
                  title={"Teléfono"}
                  obj={"tel"}
                  amount={counts.phone}
                  onClick={() => navigate(`/search?collection=Phone`)}
                />
              </div>
              <div className="w-full flex justify-center col-span-2 md:col-span-1 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-[24px] group">
                <Card
                  title={"Otros"}
                  obj={"otros"}
                  amount={counts.other}
                  onClick={() => navigate(`/search?collection=Other`)}
                />
              </div>
            </div>
          </div>
        </Layout>
      )}
    </div>
  );
};

export default Home;
