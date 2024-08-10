/* eslint-disable react-hooks/exhaustive-deps */
import DropIcon from "@/assets/svg/dropIcon.svg?react";
import EnergyIcon from "@/assets/svg/energyIcon.svg?react";
import AnimatedNumber from "@/components/common/AnimatedNumber";
import Controls from "@/components/common/Controls";
import Water from "@/components/common/Water";
import { Button } from "@/components/ui/button";
import { seaCreatures } from "@/lib/seacreatures";
import { cn, displayNumbers } from "@/lib/utils";
import ProgressBar from "@ramonak/react-progress-bar";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { firestoreDB } from "@/firebase/firebase";
import { getDoc, doc, DocumentData } from "firebase/firestore";
// import { useTWAEvent } from '@tonsolutions/telemetree-react';
import {
  currentDataAtom,
  tabsAtom,
  currentTankAtom,
  levelAtom,
  balanceAtom,
  energyAtom,
  confettiAtom,
} from "@/lib/atom";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaChevronRight } from "react-icons/fa6";
import { Toast } from "@/lib/toast";

import { database } from "@/firebase/firebase";
import {ref, child, onValue, get, set} from 'firebase/database'
import userAvartar from '../assets/svg/user.svg'

import binance from '../assets/logos/Bianance.svg'
import bybit from '../assets/logos/Bybit.svg'
import okxx from '../assets/logos/OKX.svg'
import bingx from '../assets/logos/Bing.svg'
import htx from '../assets/logos/HTX.svg'
import kucoin from '../assets/logos/Kucoin.svg'
import mexc from '../assets/logos/MEXC.svg'

const HomePage = () => {
  const tanks = [
    {
      name: "Binance",
      image: binance
    },
    {
      name: "Bybit",
      image: bybit
    },
    {
      name: "OKX",
      image: okxx
    },
    {
      name: "Bing X",
      image: bingx
    },
    {
      name: "HTX",
      image: htx
    },
    {
      name: "Kucoin",
      image: kucoin
    },
    {
      name: "MEXC",
      image: mexc
    },
  ];
  const setShowConfetti = useSetRecoilState(confettiAtom);
  const [tabs, setTabs] = useRecoilState(tabsAtom);
  const setCurrentSeaCreature = useSetRecoilState(currentDataAtom);
  const [currentTank, setCurrentTank] = useRecoilState(currentTankAtom);
  const [level, setLevel] = useRecoilState(levelAtom);
  const [balance, setBalance] = useRecoilState(balanceAtom);
  const [energy, setEnergy] = useRecoilState(energyAtom);
  const [numbers, setNumbers] = useState<
    {
      number: number;
      x: number;
      y: number;
    }[]
  >([]);

  const [waterLevel, setWaterLevel] = useState(0);

  const { Medal, drops, title, Fish } = seaCreatures[level];

  const currentTankName = localStorage.getItem("currentTank");
  const currentTankProps = tanks.filter((t) => t.name === currentTankName)[0];

  const currentLevelProgress = (balance / drops) * 100;
  const amount = Number(localStorage.getItem("dropsAmount") ?? "1");
  const maxEnergy = Number(localStorage.getItem("energyMax") ?? "500");

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

    
    // const eventBuilder = useTWAEvent();
    const addition = 100 / (10 * (level + 1));
    if (level < 6 && currentLevelProgress <= 100 && energy > 0) {
      setEnergy((prev) => Math.max(prev - 1, 0));
      const newBalance = balance + amount;
      setBalance(newBalance);
      localStorage.setItem("balance", newBalance.toString());
      const newProgress = waterLevel + addition;

      setWaterLevel(() => {
        if (newProgress > 100) {
          return 0;
        }
        if (newProgress === 100) return 99;
        return newProgress;
      });

      const clickX = event.clientX;
      const clickY = event.clientY;
      setNumbers([...numbers, { number: amount, x: clickX, y: clickY }]);
    }
    if (energy === 0) {
      Toast("You're exhausted. Wait for Energy to come up.", "info");
    }
  };

  useEffect(()=>{
    const run = async() =>{
      let id = localStorage.getItem("chatId");
      const userRef = doc(firestoreDB, "users", String(id));
      const docSnap : DocumentData = await getDoc(userRef);
      let data = docSnap.data();
      setBalance(data.balance);
    }
    run();
  }, [])

  useEffect(()=>{
    setTimeout(() => {
       setBalance(Number(localStorage.getItem("balance")));
    }, 600);
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prev) => Math.min(prev + 1, maxEnergy)); // Add energy up to 500
    }, 2000);
    if (energy >= maxEnergy) clearInterval(timer);
    return () => clearInterval(timer);
  }, [balance]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNumbers([]);
    }, 2000);
    return () => clearTimeout(timer);
  }, [balance]);

  useEffect(() => {
    if (currentLevelProgress >= 100) {
      setShowConfetti(true);
      if (currentLevelProgress === 100)
        Toast(
          `${title} Level Completed - ${
            seaCreatures[level + 1].title
          } Unlocked`,
          "success"
        );
      setTimeout(() => {
        setLevel(level + 1);
        localStorage.setItem("level", (level + 1).toString());
      }, 5000);
      setWaterLevel(0);
    }
  }, [currentLevelProgress]);


  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [displaiedNumber, setDisplaiedNumber] = useState(0);
  const [uunit, setUunit] = useState('');

  useEffect(()=>{
    if(numberOfUsers<1000 ){
      setUunit('');
      setDisplaiedNumber(numberOfUsers)
    }
    if(numberOfUsers>=1000){
      let num = Math.floor(numberOfUsers / 100);
      num = num / 10;
      setDisplaiedNumber(num);
      setUunit('k +');
    }
    if(numberOfUsers>=1000000){
      let num = Math.floor(numberOfUsers / 1000000);
      num = num / 10;
      setDisplaiedNumber(num);
      setUunit('M +');
    }
  }, [numberOfUsers])


  useEffect(()=>{
    const tankRef = ref(database, '/' +currentTankName);
    onValue(tankRef, (num) => {
      setNumberOfUsers(num.val());
    });


    let pre = localStorage.getItem('prevTank');
    if(pre && currentTankName !== null) return;
    if(currentTankName !== null) pre = currentTankName;
    get(child(ref(database), '/' + pre)).then((num) => {
      let updatedValue = currentTankName === null ? num.val() - 1 : num.val() + 1;

      if(currentTankName !== null){
        localStorage.setItem('prevTank', currentTankName);
        set(ref(database, '/' + currentTankName), Math.abs(updatedValue)); 
      }

      else{
        let prevName = localStorage.getItem('prevTank');
        set(ref(database, '/' + prevName), Math.abs(updatedValue));
        localStorage.removeItem('prevTank');
      }
    });
  }, [currentTankName]);


  return (
    <>
      <div className="flex flex-col items-center h-full px-3 grow shrink basis-auto">
        {!currentTankName ? (
          <Button
            onClick={() => {
              setTabs([...tabs, "jointank"]);
            }}
            className="w-[198px] bg-[#9712f3] h-[44px] font-bold text-[16px] leading-5 rounded-[30px]"
            style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
          >
            Join Tank
          </Button>
        ) : (
          <Drawer>
            <DrawerTrigger className="flex items-center gap-2 py-[6px] px-[13px] justify-between w-full bg-[#974FE7] rounded-full">
              <div className="flex items-center gap-2" >
                <img
                  src={currentTankProps.image}
                  alt={currentTankProps.name}
                  className="h-10"
                />
                <div className="font-bold text-[15px]" style={{width:"50px"}}>
                  {currentTankProps.name}
                </div>
                <div style={{width: '10rem'}}>&nbsp;</div>
                <div style={{display:'flex',flexDirection:'row', alignItems: 'center', width:'44px' , borderRadius:'10px', height:'15px' , padding:'3px 0px', backgroundColor:'rgb(182, 79, 247)', color:'white'}}>
                  <img src={userAvartar} style={{margin:'0px 5px 0px 10px', height:'7px', width:'7px'}} alt="" />
                  <div style={{paddingTop:"1px"}}>
                  <p style={{fontSize:'7px', textAlign:'end', fontWeight:'800', lineHeight:'24px'}} className="all-number-of-users">{displaiedNumber + uunit}</p>
                  </div>
                </div>
              </div>
              <FaChevronRight fontSize={20} className="text-white" />
            </DrawerTrigger>
            <DrawerContent className="flex flex-col items-center pb-20 pt-7">
              <DrawerTitle className="ml-auto mr-5">
                <DrawerClose>
                  <IoCloseCircleSharp color="#FFFFFF80" size={25} />
                </DrawerClose>
              </DrawerTitle>
              <img
                src={currentTankProps.image}
                // alt={currentTankProps.name}
                className="w-[150px]"
              />
              <div className="font-bold text-[24px] leading-[18px] my-8">
                {currentTankProps.name}
              </div>
              <DrawerClose
                onClick={() => {
                  setCurrentTank({ name: "", image: "" });
                  localStorage.removeItem("currentTank");
                  Toast(`You left the ${currentTank.name} Tank`, "info");
                }}
                className="w-[250px] bg-[#9712F4] h-[48px] font-bold text-[16px] leading-5 rounded-[30px]"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                Leave Tank
              </DrawerClose>
            </DrawerContent>
          </Drawer>
        )}
        <div className="flex mt-1 justify-center items-center gap-2 font-extrabold text-[36px]">
          <DropIcon height={28} width={28} />
          <div>{displayNumbers(parseInt(balance.toFixed(2)))}</div>
        </div>
        <Button
          onClick={() => {
            setCurrentSeaCreature({
              image: Fish,
              medal: title,
              progress: currentLevelProgress,
              waterlevel: waterLevel,
            });
            setTabs([...tabs, "leaderboard"]);
          }}
          className="bg-[#C3C3C340] gap-2 font-bold text-[15px] w-auto px-6 py-1 justify-center h-auto flex rounded-[11px] items-center"
        >
          <div>{title}</div>
          {Medal && <Medal className="w-5 h-5" />}
        </Button>
        <div className="w-full px-4 mt-3">
          <div className="flex justify-between font-bold">
            <div className="text-[11px]">Hydration Goal</div>
            <div className="text-[10px]">
              Level {level + 1}
              /6
            </div>
          </div>
          <ProgressBar
            completed={currentLevelProgress}
            bgColor="#65E4F0"
            height="5px"
            transitionDuration="0.5s"
            className="mt-1 mb-2"
            isLabelVisible={false}
            borderRadius="10px"
            baseBgColor="#C3C3C340"
          />
          <div className="flex items-center gap-1 mt-2">
            <EnergyIcon />
            <div className="font-extrabold text-[10px]">
              {energy}/{maxEnergy}
            </div>
          </div>
        </div>
        {numbers.map((num, index) => (
          <AnimatedNumber
            key={index}
            number={num.number}
            x={num.x - 220}
            onClick={handleClick}
            y={num.y - 80}
          />
        ))}
        <div className="flex justify-center w-full grow">
          <div
            onClick={handleClick}
            className={cn(
              "w-full grow bg-contain bg-center bg-no-repeat relative overflow-hidden flex flex-col justify-center items-center",
              currentLevelProgress >= 100 ? "animate-bouncing" : ""
            )}
          >
            <div
              className={cn(
                "w-full bg-contain bg-center bg-no-repeat bg-[#4d307a] relative overflow-hidden",
                currentLevelProgress >= 100 ? "animate-bouncing" : ""
              )}
              style={
                currentLevelProgress >= 100
                  ? {
                      backgroundImage: `url(${Fish})`,
                      backgroundColor: "transparent",
                      height: title === "Bronze" ? 126 : 200,
                    }
                  : {
                      maskImage: `url(${Fish})`,
                      maskSize: "100% 100%",
                      maskPosition: "center",
                      height: title === "Bronze" ? 126 : 200,
                    }
              }
            >
              {waterLevel < 100 && waterLevel > 0 && (
                <Water incomingWaterLevel={waterLevel} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Controls />
    </>
  );
};

export default HomePage;