/* eslint-disable react-hooks/exhaustive-deps */
import SaveIcon from "@/assets/svg/save.svg?react";
import DropIcon from "@/assets/svg/dropIcon.svg?react";
import Telegram from "@/assets/PoIcons/telegram.gif";
import Twitter from "@/assets/PoIcons/Xicon.svg";
import Youtube from "@/assets/PoIcons/Youtube.svg";
import Tiktok from "@/assets/PoIcons/Tiktok.svg"
import Medium from "@/assets/PoIcons/Medium.svg"
import { Button } from "@/components/ui/button";
import { FaCheck, FaChevronRight } from "react-icons/fa6";
import { displayNumbers } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  balanceAtom,
  confettiAtom,
  currentTankAtom,
  tabsAtom,
} from "@/lib/atom";
import { Toast } from "@/lib/toast";

import { firestoreDB } from "@/firebase/firebase";
import { getDoc, doc, setDoc, DocumentData } from "firebase/firestore";

import { useTWAEvent } from '@tonsolutions/telemetree-react';

const allTasks = [
  {
    id: 0,
    title1: "Join our",
    title2:"Community channel",
    drops: 10000,
    image: Telegram,
    completed: false,
    link: "https://t.me/smartlitrecommunity",
    state:0
  },
  {
    id: 1,
    title1: "Subscribe to our",
    title2: "Youtube Channel",
    drops: 10000,
    image: Youtube,
    completed: false,
    link: "https://youtube.com/@smartlitre?feature=shared",
    state:0
  },
  {
    id: 2,
    title1: "Follow Our",
    title2: "X/Twitter account",
    drops: 10000,
    image: Twitter,
    completed: false,
    link: "https://x.com/smartlitre?s=21&t=AXJCLgvmsPnKoMsdF5V9Cw",
    state:0
  },
  {
    id: 3,
    title1: "Follow SmartLitre",
    title2: "On Medium",
    drops: 10000,
    image: Medium,
    completed: false,
    link: "https://medium.com/@smartlitre",
    state:0
  },
  {
    id: 4,
    title1: "Follow SmartLitre",
    title2: "On Tiktok",
    drops: 10000,
    image: Tiktok,
    completed: false,
    link: "https://www.tiktok.com/@smartlitre?_t=8oXsNn6Sx4S&_r=1",
    state:0
  },
  {
    id: 5,
    title1: "Follow Kiran(CEO)",
    title2: "On Tiktok",
    drops: 10000,
    image: Tiktok,
    completed: false,
    link: "https://www.tiktok.com/@kiranceo?_t=8oXsWsUEf7Q&_r=1",
    state:0
  },
];

const Earn = () => {
  const setShowConfetti = useSetRecoilState(confettiAtom);
  const currentTank = useRecoilValue(currentTankAtom);
  const setBalance = useSetRecoilState(balanceAtom);
  const [tabs, setTabs] = useRecoilState(tabsAtom);

  // Initialize state for task completion
  const [tasks, setTasks] = useState(allTasks);

  const eventBuilder = useTWAEvent();

  useEffect(()=>{
    let userName = localStorage.getItem("user_name");
    eventBuilder.track('Action', {
      label: 'Earn page visited user', // Additional info about the button
      category: userName, // Categorize the event
    });
  }, [])



  // Function to handle task completion
  const handleTaskCompletion = (taskId: number) => {
    const run1 = async() =>{
      let id = localStorage.getItem("chatId");
      // let id = "7055970459";

      // location.href = tasks[taskId].link;
      
      const userRef = doc(firestoreDB, "users", String(id));
      const docSnap : DocumentData = await getDoc(userRef);
      let data = docSnap.data();
      if(data.doneTasks === undefined){
        data.doneTasks = [];
        for(let i = 0;i<=5;i++) data.doneTasks[i] = 0;
      }
      data.doneTasks[taskId] = 1;
      // let bal : number = data.balance;
      // bal += 10000;
      // data.balance = bal;
      // localStorage.setItem('balance', String(bal));
      setDoc(userRef, data);

      const task = tasks.filter((t) => t.id === taskId);
      if (task[0].state === 0) {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, state: 1 } : task
          )
        );
        // Toast("Task complete", "info");
        // setShowConfetti(true);
      }
      window.location.href = tasks[taskId].link;
      // setTimeout(() => {
      //   setShowConfetti(false);
      // }, 5000);
    }
    const run2 = async() =>{
      let id = localStorage.getItem("chatId");
      // let id = "7055970459";
      const userRef = doc(firestoreDB, "users", String(id));
      const docSnap : DocumentData = await getDoc(userRef);
      let data = docSnap.data();
      data.doneTasks[taskId] = 2;
      let bal : number = data.balance;
      bal += 10000;
      data.balance = bal;
      localStorage.setItem('balance', String(bal));
      setDoc(userRef, data);
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, state: 2 } : task
        )
      );
      Toast("You've recieved +10,000 DROPS", "info");
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
    if(tasks[taskId].state === 0) run1();
    if(tasks[taskId].state === 1) run2();
  };

  useEffect(()=>{
    const run = async() =>{
      let id = localStorage.getItem("chatId");
      // let id = "7055970459";
      const userRef = doc(firestoreDB, "users", String(id));
      const docSnap : DocumentData = await getDoc(userRef);
      let arr = docSnap.data().doneTasks;
      let tasks = allTasks;
      for(let i = 0;i<6;i++){
        tasks[i].state = arr[i] !== undefined ? arr[i] : 0;
      }
      setTasks(tasks);  
    }

    run();
  }, [])

  const handleLinktasksCompletion = (taskId: number, URL?: string) => {
    if (URL) window.location.href = URL;
    localStorage.setItem("linkTaskId", taskId.toString());
    setTimeout(() => {
      if (taskId && tabs[1] === "earn") {
        const task = tasks.filter((t) => t.id === taskId);
        if (!task[0].completed) {
          setTasks(
            tasks.map((task) =>
              task.id === taskId ? { ...task, completed: true } : task
            )
          );
          setShowConfetti(true);
          Toast("Task complete", "info");
        }
      }
      localStorage.removeItem("linkTaskId");
    }, 1000);
  };

  useEffect(() => {
    const task = tasks.filter((t) => t.id === 6);
    if (currentTank.name !== "" && !task[0].completed) {
      if (localStorage.getItem("joinedTank") !== "yes") {
        setBalance((prev) => {
          localStorage.setItem("balance", (prev + 5000).toString());
          return prev + 5000;
        });
      }

      setTasks(
        tasks.map((task) =>
          task.id === 6 ? { ...task, completed: true } : task
        )
      );
      localStorage.setItem("joinedTank", "yes");
      // setShowConfetti(true);
      Toast("Task complete", "info");
    }
  }, [currentTank]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const taskId = localStorage.getItem("linkTaskId");
  //     if (taskId && tabs[1] === "earn") {
  //       const task = tasks.filter((t) => t.id === parseInt(taskId));
  //       if (!task[0].completed) {
  //         setTasks(
  //           tasks.map((task) =>
  //             task.id === parseInt(taskId) ? { ...task, completed: true } : task
  //           )
  //         );
  //         setShowConfetti(true);
  //         Toast("Task complete", "info");
  //       }
  //     }
  //     localStorage.removeItem("linkTaskId");
  //   }, 1000);
  //   setTimeout(() => {
  //     setShowConfetti(false);
  //   }, 5000);
  // }, [tasks]);
  return (
    <div className="px-5 pt-2">
      <div className="font-extrabold text-center text-[20px] leading-6">
        Earn more DROPS
      </div>
      <div className="flex flex-col items-center mt-1">
        <DropIcon className="mt-3" height={50} width={50} />
        <SaveIcon className="w-44" />
      </div>
      <div className="mt-3 font-extrabold text-[13px] leading-6">Tasks</div>
      <div className="flex flex-col gap-[5px] mt-1 w-full">
        { tasks.map((task, index) => {
            return task.state !== 2 ? (
              <Drawer key={index}>
                <DrawerTrigger asChild>
                  <Button
                    key={index}
                    className={`flex items-center h-[55px] justify-between w-full ${
                      task.state === 2 ? "bg-[#20C962]/50" : "bg-[#C3C3C33D]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={task.image}
                        alt={task.title1}
                        className="h-12 w-12"
                      />
                      <div className="flex flex-col">
                        <div className="font-bold text-[11px] leading-6">
                          <p>{task.title1}{task.title2}</p>
                        </div>
                        <div className="flex items-center -mt-1 gap-0.5 -ml-1">
                          <DropIcon className="h-3 w-3  -mt-0.5" />
                          <div className="font-extrabold text-[11px] leading-6">
                            +{displayNumbers(task.drops)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {task.state === 2 ? (
                      <FaCheck color="white" />
                    ) : (
                      <FaChevronRight color="white" />
                    )}
                  </Button>
                </DrawerTrigger>
                {
                  <DrawerContent className="flex flex-col items-center pb-8 pt-7">
                    <DrawerTitle className="ml-auto mr-5">
                      <DrawerClose>
                        <IoCloseCircleSharp color="#FFFFFF80" size={25} />
                      </DrawerClose>
                    </DrawerTitle>
                    <img
                      src={task.image}
                      alt={`${task.id}`}
                      className="w-[150px]"
                    />
                    <div className="text-[24px] leading-[18px] mt-6 mb-2" style={{    textAlign: "center", lineHeight: "normal", fontWeight:'bold'}}>
                      <p>{task.title1}</p>
                      <p>{task.title2}</p>
                    </div>
                    <p className="text-sm font-extrabold text-white leading-[18px] mt-2 mb-6">
                      Earn +{displayNumbers(task.drops)} DROPS
                    </p>
                    <DrawerClose
                      className="w-[250px] bg-[#9712F4] h-[48px] font-bold text-[16px] leading-5 rounded-[30px]"
                      style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                      onClick={() => {
                          task.state === 2
                          ? ""
                          : task.id === 6
                          ? setTabs([...tabs, "jointank"])
                          : handleTaskCompletion(task.id);
                        if (task.state === 2) {
                          return;
                        }
                      }}
                    >
                      {task.state === 2 ? "Completed" : task.state === 1 ?  "Redeem" : "Check"}
                    </DrawerClose>
                  </DrawerContent>
                }
              </Drawer>
            ):"" 
          }
        )}
        {
          tasks.map((task, index)=>{
            return task.state === 2 ? (
              <Button
                key={index}
                onClick={() =>
                  task.state === 2
                    ? ""
                    : handleLinktasksCompletion(task.id, task.link)
                }
                className={`flex items-center  h-[55px] justify-between w-full ${
                  task.state === 2 ? "bg-[#20C962]/50" : "bg-[#C3C3C33D]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src={task.image} alt={task.title1} className="h-12 w-12" />
                  <div className="flex flex-col">
                    <div className="font-bold text-[11px] leading-6">
                      {task.title1}
                      {task.title2}
                    </div>
                    <div className="flex items-center gap-0.5 -mt-1 -ml-1">
                      <DropIcon className="h-3 w-3  -mt-0.5" />
                      <div className="font-extrabold text-[11px] leading-6">
                        +{displayNumbers(task.drops)}
                      </div>
                    </div>
                  </div>
                </div>
                {task.state === 2 ? (
                  <FaCheck color="white" />
                ) : (
                  <FaChevronRight color="white" />
                )}
              </Button>
            ) :""
          })
        }
      </div>
    </div>
  );
};

export default Earn;
