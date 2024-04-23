import React from "react";
import Layout from "../../components/layout";
import Header from "../../components/header";
import LogOutIcon from "../../icons/logOutIcon";
import Card from "../../components/cards";
import LineComponent from "../../components/lineComponent";
import { useNavigate } from "react-router-dom";


const Home: React.FC = () => {
  const navigator = useNavigate();

  const searchNavigator = () => navigator('/search');
  
  return (
    <div className="overflow-x-hidden w-full flex flex-col h-full justify-between items-stretch">
      <Header />
      <Layout>
        <div className="text-white flex justify-between w-full mt-3 md:mt-5 mb-3 md:mb-5">
          <div className="flex flex-col">
            <span className="font-bold text-lg pb-1 md:text-[50px] md:mb-2">
              Hola FOBJ
            </span>
            <p className="text-xs opacity-50 md:text-2xl">
              Buscá o reportá un objeto
            </p>
          </div>
          <div className="flex items-center">
            <span className="mr-4">icon</span>
            <LogOutIcon />
          </div>
        </div>

        <LineComponent />

        <div className="flex flex-col md:flex md:justify-around md:items-center md:flex-row justify-between w-full items-center md:mt-10 mt-5 gap-5">
          <div className="md:w-[500px] md:h-[200px] w-full h-[140px] bg-primary rounded-[30px] md:text-6xl text-3xl flex justify-center items-center hover:cursor-pointer" onClick={searchNavigator}>
            <h2 className="uppercase text-backgroundcolor">Buscar</h2>
          </div>
          <div className="md:w-[500px] md:h-[200px] w-full h-[140px] bg-primary rounded-[30px] md:text-6xl text-3xl flex justify-center items-center hover:cursor-pointer">
            <h2 className="uppercase text-backgroundcolor">Reportar</h2>
          </div>
        </div>
        <div className="flex justify-between w-full md:mt-10 mt-5 items-center">
          <span className="md:text-3xl font-bold text-blackColor self-start justify-self-start ml-1 text-xl">
            Objetos perdidos
          </span>
          <span className="text-secondary md:text-[25px] text-xs hover:cursor-pointer hover:underline" onClick={searchNavigator}>
            Buscar
          </span>
        </div>

        <div className="flex justify-around items-center w-full md:mt-10 overflow-x-auto md:overflow-hidden">
          <div className="flex justify-center items-center md:w-full gap-3 p-2 md:justify-around md:gap-0">
            <Card title={"Dni"} obj={"dni"} amount={120} />
            <Card title={"Ropa"} obj={"ropa"} amount={120} />
            <Card title={"Dinero"} obj={"dinero"} amount={120} />
            <Card title={"Telefono"} obj={"tel"} amount={120} />
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
