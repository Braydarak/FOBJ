import React from "react";
import Layout from "../../components/layout";
import Header from "../../components/header";
import LogOutIcon from "../../icons/logOutIcon";
import Button from "../../components/customButton";
import Card from "../../components/cards";

const Home: React.FC = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 700,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  return (
    <Layout>
      <Header />
      <div className="bg-gray-800 text-white flex justify-between max-w-7xl py-2 w-full md:mt-14">
        <div className="w-3/4">
          <p className="font-bold text-lg pb-1 md:text-3xl">Hola FOBJ</p>
          <p className="text-xs md:text-sm opacity-50">
            Buscá o reportá un objeto
          </p>
        </div>
        <div className="flex items-center">
          <p className="mr-4">icon</p>
          <LogOutIcon />
        </div>
      </div>
      <hr
        className="border-b-1 border-gray-600 mx-auto opacity-25"
        style={{ width: "85%" }}
      />

      <div className="flex flex-col md:flex-row md:justify-between  md:w-3/5 justify-center items-center  mt-16">
        <div className="w-80  mt-sm-5 mb-md-5">
          <Button
            text="Buscar"
            textColor="text-backgroundcolor"
            bgColor="bg-primary"
            disabled={false}
            height="h-36"
            roundedSize="rounded-[30px]"
            fontSize="text-[30px]"
          />
        </div>
        <div className="w-80 mt-sm-5 mb-md-5">
          <Button
            text="Reportar"
            textColor="text-backgroundcolor"
            bgColor="bg-primary"
            disabled={false}
            height="h-36"
            roundedSize="rounded-[30px]"
            fontSize="text-[30px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:w-3/5 w-full mt-6">
        <p className="text-lg font-bold text-blackColor self-start justify-self-start ml-1">
          Objetos perdidos
        </p>
        <a
          href="#"
          className="text-secondary text-xs self-center justify-self-end mr-1"
        >
          Buscar
        </a>
      </div>

      <div className="flex justify-center items-center w-screen mt-10">
        <div className="overflow-hidden ml-5">
          <div className="hidden md:block ">
            <div className="flex justify-center items-center md:w-full">
              <Card title={"Dni"} obj={"Cantidad de dni"} amount={120} />
              <Card title={"Ropa"} obj={"Cantidad de dni"} amount={120} />
              <Card title={"Dinero"} obj={"Cantidad de dni"} amount={120} />
              <Card title={"Telefono"} obj={"Cantidad de dni"} amount={120} />
            </div>
          </div>
          <div className="md:hidden overflow-x-auto overflow-y-hidden"  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <div className="flex mt-4">
              <div className=" mx-2">
                <Card title={"Dni"} obj={"Cantidad de dni"} amount={120} />
              </div>
              <div className="inline-block mx-2">
                <Card title={"Ropa"} obj={"Cantidad de Ropa"} amount={150} />
              </div>
              <div className="inline-block mx-2">
                <Card title={"Dinero"} obj={"Cantidad de Dinero"} amount={90} />
              </div>
              <div className="inline-block mx-2">
                <Card
                  title={"Telefono"}
                  obj={"Cantidad de Telefonos"}
                  amount={300}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
