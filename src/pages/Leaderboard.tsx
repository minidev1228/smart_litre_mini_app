import { currentDataAtom, levelAtom, tabsAtom } from "@/lib/atom";
import { useRecoilValue } from "recoil";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { seaCreatures } from "@/lib/seacreatures";
import ProgressBar from "@ramonak/react-progress-bar";
import DropIcon from "@/assets/svg/dropIcon.svg?react";
import { displayNumbers } from "@/lib/utils";
import { type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Water from "@/components/common/Water";

import { firestoreDB } from "@/firebase/firebase";
import { getDocs, collection } from "firebase/firestore"; 

 export const people = [
  {
    name: "Hina",
    drops: 45000,
  },
  {
    name: "Zainab",
    drops: 42000,
  },
  {
    name: "Abbas",
    drops: 41000,
  },
  {
    name: "Falak",
    drops: 40000,
  },
  {
    name: "Nurah",
    drops: 38000,
  },
  {
    name: "Saffy",
    drops: 37000,
  },
  {
    name: "Mikky",
    drops: 36000,
  },
  {
    name: "Jibby",
    drops: 35000,
  },
];

const balanceByLevel = [5000, 50000, 500000, 1000000, 10000000, 1000000000 ]

const CollectionMessage = [
  {
    progress:
      "Collect 5K DROPS to unlock Bronze character and advance to Silver level.",
    completed: "Well done, You’ve unlocked Ray.",
  },
  {
    progress:
      "Collect 50K DROPS to unlock Silver character and advance to Gold level.",
    completed: "Brilliant job! You’ve unlocked Octopus.",
  },
  {
    progress:
      "Collect 500K DROPS to unlock Gold character and advance to Platinum level.",
    completed: "Smashed it! You’ve unlocked Seahorse.",
  },
  {
    progress:
      "Collect 1M DROPS to unlock Gold character and advance to Platinum level.",
    completed: "You’re a Pro Hydrator! You’ve unlocked Anglerfish.",
  },
  {
    progress:
      "Collect 10M DROPS to unlock Diamond character and advance to Epic level.",
    completed: "You’re a Hydration Hero. You’ve unlocked Sea Turtle.",
  },
  {
    progress: "Collect 1B+ DROPS to unlock Epic Character!",
    completed: "The Master of Hydration. You’ve unlocked Jellyfish.",
  },
];

interface User {
  level: number; // Use 'number' instead of 'Number'
  username: string; // Use 'string' instead of 'String'
  dropsAmount: number; // Use 'number' instead of 'Number'
  balance : number;
  degree: number;
}

const Leaderboard = () => {
  const currentData = useRecoilValue(currentDataAtom);
  const level = useRecoilValue(levelAtom);
  const [api, setApi] = useState<CarouselApi>();
  const [messageApi, setMessageApi] = useState<CarouselApi>();
  const tabs = useRecoilValue(tabsAtom);

  const [currentTab, setCurrentTab] = useState(0);


  useEffect(() => {
    if (!api) {
      return;
    }

    // set selected index to the index of the current sea creature
    if (tabs.includes("leaderboard"))
      setTimeout(() => {
        api.scrollTo(
          seaCreatures.findIndex(
            (seaCreature) => seaCreature.title === currentData?.medal
          )
        );
      }, 50);
    setCurrentTab(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentTab(api.selectedScrollSnap());
    });
  }, [api, currentData, tabs]);

  useEffect(() => {
    if (!messageApi) return;
    messageApi.scrollTo(
      CollectionMessage.findIndex((_, indx) => indx === currentTab)
    );
  }, [messageApi, currentTab]);

  const [allUsers, setAllUsers] = useState<User[]>([])
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isNoOne, setIsNoOne] = useState(false);
  const [people, setPeople] = useState<User[]>([])


  useEffect(()=>{
    localStorage.removeItem('currentStep');
    localStorage.setItem('currentStep', String(level));
    setCurrentLevel(level);
    const run = async()=>{
      const users = await getDocs(collection(firestoreDB, "users"));
      const productsMap = users.docs.map(user => user.data() as User);
      let peo: User[] = [];
      setIsNoOne(true);
      for(let i = 0; i < productsMap.length; i++){
        if(level == 0 && productsMap[i].balance<balanceByLevel[level]){
          peo.push(productsMap[i]);
          setIsNoOne(false);
        }
        else if(productsMap[i].balance<balanceByLevel[level] && productsMap[i].balance>=balanceByLevel[level-1]){
          peo.push(productsMap[i]);
          setIsNoOne(false);
        }
      }
      for(let i = 0;i<peo.length;i++){
        for(let j = i + 1;j<peo.length;j++){
          if(peo[i].balance < peo[j].balance) [peo[i], peo[j]] = [peo[j], peo[i]];
        }
      }
      if(peo.length > 0) peo[0].degree = 1; 
      for(let i = 1;i<peo.length;i++){
        if(peo[i].balance === peo[i-1].balance){
          peo[i].degree = peo[i-1].degree;
          continue;
        }
        else peo[i].degree = peo[i-1].degree + 1;
      }
      setPeople(peo);
      setAllUsers(productsMap);
    }
    run();
  },[]);

  useEffect(()=>{
    // console.log("level =====>", level);
  }, [level]) 

  useEffect(()=>{
    let cl =  Number(localStorage.getItem('currentStep'));
    setCurrentLevel(cl);
    setIsNoOne(true);
    // console.log(cl);
    let peo = [];
    for(let i = 0; i < allUsers.length; i++){
      if(cl == 0 && allUsers[i].balance<balanceByLevel[cl]){
        // console.log("isNoOne ==> false")
        peo.push(allUsers[i]);
        setIsNoOne(false);
      }
      else if(allUsers[i].balance<balanceByLevel[cl] && allUsers[i].balance>=balanceByLevel[cl-1]){
        peo.push(allUsers[i]);
        setIsNoOne(false);
        // console.log(allUsers[i])
      }
    }
    for(let i = 0;i<peo.length;i++){
      for(let j = i + 1;j<peo.length;j++){
        if(peo[i].balance < peo[j].balance) [peo[i], peo[j]] = [peo[j], peo[i]];
      }
    }
    if(peo.length > 0) peo[0].degree = 1; 
    for(let i = 1;i<peo.length;i++){
      if(peo[i].balance === peo[i-1].balance){
        peo[i].degree = peo[i-1].degree;
        continue;
      }
      else peo[i].degree = peo[i-1].degree + 1;
    }
    setPeople(peo);
    // console.log(isNoOne)
  }, [localStorage.getItem('currentStep')]);

  return (
    currentData && (
      <div className="flex flex-col items-center w-full px-5">
        <Carousel setApi={setApi}>
          <CarouselContent className="w-[calc(100vw-8rem)] mt-2">
            {seaCreatures.map(({ Fish, title }, index) => (
              <CarouselItem key={index} className="flex flex-col items-center">
                <div className="font-extrabold text-[36px] leading-6 mb-4">
                  {title}
                </div>
                <div
                  className="h-[6rem] w-full bg-no-repeat bg-contain bg-center bg-[#5417b0] relative overflow-hidden mt-2"
                  style={
                    level > index
                      ? {
                          backgroundImage: `url(${Fish})`,
                          backgroundColor: "transparent",
                          width:title === "Bronze" ? 234 : "100%",
                        }
                      : {
                          maskImage: `url(${Fish})`,
                          maskSize: "100% 100%",
                          maskPosition: "center",
                        }
                  }
                >
                  {level === index && (
                    <Water incomingWaterLevel={currentData.waterlevel} />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious/>
          <CarouselNext/>
        </Carousel>
        <ProgressBar
          completed={
            currentTab < level
              ? 100
              : currentTab === level
              ? currentData.progress
              : 0
          }
          bgColor="#65E4F0"
          height="5px"
          className="w-full mt-2"
          isLabelVisible={false}
          borderRadius="10px"
          baseBgColor="#C3C3C340"
        />
        <Carousel setApi={setMessageApi}>
          <CarouselContent className="mt-2 w-[calc(100vw-3rem)]">
            {CollectionMessage.map(({ progress, completed }, idx) => (
              <CarouselItem
                key={idx}
                className="flex items-center justify-center"
              >
                {level > idx ? (
                  <div className="text-center font-bold text-[13px] leading-[18px] text-white/80 max-w-[16rem] mt-2">
                    {completed}
                  </div>
                ) : (
                  <div className="text-center font-bold text-[13px] leading-[18px] text-white/80 max-w-[18rem] mt-2">
                    {progress}
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex flex-col w-full gap-2 mt-5">
        {people.map((person, index) => {
          return (<div
            key={index}
            className="flex bg-[#C3C3C33D] rounded-[11px] py-3 pl-3 justify-between items-center w-full"
            style={{paddingRight:"3rem"}}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full w-[3rem] flex items-center justify-center h-[3rem] border-white border px-1 pb-3 pt-2 bg-[#934dca]" style={{border:"1px solid white"}}>
                <div
                  className="w-full h-full bg-contain bg-center bg-[#5417b0] relative overflow-hidden mt-2"
                  style={
                    currentData.progress === 100
                      ? {
                          backgroundImage: `url(${seaCreatures[currentLevel].Fish})`,
                          backgroundColor: "transparent",
                        }
                      : {
                          maskImage: `url(${seaCreatures[currentLevel].Fish})`,
                          maskSize: "100% 100%",
                          maskPosition: "center",
                        }
                  }
                ></div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="font-bold text-[11px]" style={{paddingLeft: '3px'}}>{person.username}</div>
                <div className="flex items-center gap-0.5">
                  <DropIcon className="w-3 h-3 -mt-1" style={{marginTop:'0.2px'}}/>
                  <div className="font-extrabold text-[11px]">
                    {displayNumbers(person.balance)}
                  </div>
                </div>
              </div>
            </div>
            <div className="font-extrabold text-[10px]">{person.degree}</div>
          </div>)})}
          {isNoOne && <div className="text-white/80 text-center text-[14px] font-extrabold leading-[18px] mt-4 mb-2">
            Currently no one has reached this level
        </div>
          }
        </div>
      </div>
    )
  );
};

export default Leaderboard;
