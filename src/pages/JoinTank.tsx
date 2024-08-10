import Fishes from "@/assets/images/fishes.gif";
import binance from "@/assets/logos/Bianance.svg";
import bybit from "@/assets/logos/Bybit.svg";
import okxx from "@/assets/logos/OKX.svg";
import bingx from "@/assets/logos/Bing.svg";
import htx from "@/assets/logos/HTX.svg";
import kucoin from "@/assets/logos/Kucoin.svg";
import mexc from "@/assets/logos/MEXC.svg";
import binanceMedal from "@/assets/svg/binance-medal.svg?react";
import bybitMedal from "@/assets/svg/bybit-medal.svg?react";
import okxxMedal from "@/assets/svg/okxx-medal.svg?react";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
} from "@/components/ui/drawer";
import { IoCloseCircleSharp } from "react-icons/io5";
import {  useSetRecoilState } from "recoil";
// useRecoilState,
import {  tabsAtom } from "@/lib/atom";
// currentTankAtom,
import { MdPerson } from "react-icons/md";
// import { displayMinimizedNumbers } from "@/lib/utils";
import { Toast } from "@/lib/toast";

import { database } from "@/firebase/firebase";
import {ref, onValue} from 'firebase/database'

 export const tanks = [
  {
    name: "Binance",
    image: binance,
    Medal: binanceMedal,
    money: 2300000,
  },
  {
    name: "Bybit",
    image: bybit,
    Medal: bybitMedal,
    money: 1700000,
  },
  {
    name: "OKX",
    image: okxx,
    Medal: okxxMedal,
    money: 1600000,
  },
  {
    name: "Bing X",
    image: bingx,
    money: 518400,
  },
  {
    name: "HTX",
    image: htx,
    money: 128300,
  },
  {
    name: "Kucoin",
    image: kucoin,
    money: 51700,
  },
  {
    name: "MEXC",
    image: mexc,
    money: 33700,
  },
];

const JoinTank = () => {
  // const [, setCurrentTank] = useRecoilState(currentTankAtom);
  const setTabs = useSetRecoilState(tabsAtom);

  const [binanceNumber, setBinanceNumber] = useState(0);
  const [bingNumber, setBingNumber] = useState(0);
  const [bybitNumber, setBybitNumber] = useState(0);
  const [htxNumber, setHtxNumber] = useState(0);
  const [kucoinNumber, setKucoinNumber] = useState(0);
  const [mexcNumber, setMexcNumber] = useState(0);
  const [okxNumber, setOkxNumber] = useState(0);


  useEffect(()=>{
    const binanceRef = ref(database, '/Binance');
    const bingRef = ref(database, '/Bing X');
    const bybitRef = ref(database, '/Bybit');
    const htxRef = ref(database, '/HTX');
    const kucoinRef = ref(database, '/Kucoin');
    const mexcRef = ref(database, '/MEXC');
    const okxRef = ref(database, '/OKX');

    onValue(binanceRef, (num) => {setBinanceNumber(num.val())});
    onValue(bingRef, (num) => {setBingNumber(num.val())});
    onValue(bybitRef, (num) => {setBybitNumber(num.val())});
    onValue(htxRef, (num) => {setHtxNumber(num.val())});
    onValue(kucoinRef, (num) => {setKucoinNumber(num.val())});
    onValue(mexcRef, (num) => {setMexcNumber(num.val())});
    onValue(okxRef, (num) => {setOkxNumber(num.val())});
  }, []);


  return (
    <div className="flex flex-col items-center px-6 pt-5">
      <div className="font-extrabold text-center text-[36px] leading-6">
        Join Tank
      </div>
      <img src={Fishes} className="w-full mt-3" />
      <div className="text-white/80 font-bold text-[16px] text-center mt-3 max-w-[18rem]">
        Which tank do you want to join and see us being listed on?
      </div>
      <div className="rounded-[11px] mt-2 w-full bg-[#C3C3C340]">
        {tanks.map((tank, index) => (
          <Drawer key={index}>
            <DrawerTrigger className="flex items-center justify-between w-full gap-2 p-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img src={tank.image} alt={tank.name} className="h-10" />
                  <div className="absolute flex items-center bg-[#a016f5] shadow-[0px_0px_20px_0px_#FFFFFF80_inset] rounded-full left-1/2 -translate-x-1/2 px-[3px] py-[0.1px] font-extrabold text-[8px] -bottom-[4px]">
                    <MdPerson />
                    <div className="mt-0.5 text-[6px] font-extrabold">
                      {
                        tank.name == "Binance" ? binanceNumber :
                        tank.name == "Bing X" ? bingNumber :
                        tank.name == "Bybit" ? bybitNumber :
                        tank.name == "HTX" ? htxNumber :
                        tank.name == "Kucoin" ? kucoinNumber :
                        tank.name == "MEXC" ? mexcNumber :
                        tank.name == "OKX" ? okxNumber : ""
                      }
                    </div>
                  </div>
                </div>
                <div className="font-bold text-[15px]">{tank.name}</div>
              </div>
              {tank.Medal ? (
                <tank.Medal className="w-8 h-8" />
              ) : (
                <div className="flex items-center justify-center w-8 h-8">
                  {index + 1}
                </div>
              )}
            </DrawerTrigger>
            <DrawerContent className="flex flex-col items-center pb-16 pt-7">
              <DrawerTitle className="ml-auto mr-5">
                <DrawerClose>
                  <IoCloseCircleSharp color="#FFFFFF80" size={25} />
                </DrawerClose>
              </DrawerTitle>
              <img src={tank.image} alt={tank.name} className="w-[150px]" />
              <div className="font-bold text-[24px] leading-[18px] my-8">
                {tank.name}
              </div>
              <DrawerClose
                onClick={() => {
                  // setCurrentTank(tank);
                  localStorage.setItem("currentTank",tank.name)
                  localStorage.setItem("joinedTank","yes")
                  setTabs((tabs) =>
                    tabs.length === 1 ? tabs : tabs.slice(0, tabs.length - 1)
                  );
                 Toast(`You joined the ${tank.name} Tank`, "info")
                }}
                className="w-[250px] bg-[#9712F4] h-[48px] font-bold text-[16px] leading-5 rounded-[30px] mb-2"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                Join Tank
              </DrawerClose>
            </DrawerContent>
          </Drawer>
        ))}
      </div>
    </div>
  );
};

export default JoinTank;
