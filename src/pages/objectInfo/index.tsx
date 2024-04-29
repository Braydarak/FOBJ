import React from "react";
import Layout from "../../components/layout";
import Header from "../../components/header";
import Button from "../../components/customButton";

const ObjectInfo: React.FC = () => {
  return (
    <div>
      <Header />
      <Layout>
        <h3 className="font-semibold text-[22px] w-full mt-10 text-inputText md:text-[40px] uppercase">
          REPORTADO POR JONYEZE
        </h3>
        <div className="md:flex md:w-full md:mt-20 items-center">
          <div className="md:w-full md:flex md:justify-center md:h-3/4">
            <div className="grid grid-cols-2 grid-rows-3 justify-center items-baseline mt-7 text-lg text-whiteBG font-semibold w-full md:mt-0 md:w-4/5 md:text-2xl">
              <div className="flex flex-col text-left mb-8 text-[22px] text-inputText md:text-[40px]">
                DNI
              </div>
              <div className="flex flex-col text-end text-[20px] font-medium md:text-[35px]">
                38.359.163
              </div>
              <div className="flex flex-col text-left text-[22px] text-inputText md:text-[40px]">
                NOMBRE
              </div>
              <div className="flex flex-col text-end text-[20px] font-medium md:text-[35px]">
                Jonathan
              </div>
              <div className="flex flex-col text-left text-[22px] text-inputText md:text-[40px]">
                APELLIDO
              </div>
              <div className="flex flex-col text-end text-[20px] font-medium md:text-[35px]">
                Darakdjian
              </div>
            </div>
          </div>
          <div className="md:flex md:flex-col md:items-center md:w-full ">
            <div className="font-semibold text-2xl text-center text-inputText md:text-[40px]">
              ENCONTRADO EN
            </div>
            <div className="w-[295px] h-[257px] bg-secondary rounded-[50px] mt-8 mb-10"></div>
          </div>
        </div>
        <div className="w-full md:w-[343px] md:mt-20">
          <Button
            text={"CONTACTAR"}
            textColor={"text-backgroundcolor"}
            bgColor={"bg-secondary"}
            disabled={false}
            roundedSize="rounded-[30px]"
            textSize="text-2xl"
          />
        </div>
      </Layout>
    </div>
  );
};

export default ObjectInfo;
