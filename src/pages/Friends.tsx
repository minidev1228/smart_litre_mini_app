import FriendsIcon from "@/assets/svg/friends.svg";
import telegram from "@/assets/images/telegram.gif";
import premium from "@/assets/images/premium.gif";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import HandIcon from "@/assets/svg/hand.svg?react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { displayNumbers } from "@/lib/utils";
import { LevelDatable } from "@/components/common/level-datatable";
import { LevelFriend } from "@/interface/LevelFriend";
import DropIcon from "@/assets/svg/dropIcon.svg?react";
import { seaCreatures } from "@/lib/seacreatures";

// import {sendTelegramMessage} from "@/api/sendTelegramMessage"
import { firestoreDB } from "@/firebase/firebase";


import { getDocs, collection, doc, setDoc } from "firebase/firestore"; 

const balanceByLevel = [5000, 50000, 500000, 1000000, 10000000, 1000000000 ]

const inviteOptions = [
  {
    title: "Telegram User",
    drops: 2500,
    image: telegram,
  },
  {
    title: "Premium User",
    drops: 25000,
    image: premium,
  },
];

const friendsLevel: LevelFriend[] = [
  // {
  //   level: "Bronze",
  //   friend: 2500,
  //   premium: 25000,
  //   friendSum: 2500,
  //   premiumSum:25000
  // },
  {
    level: "Silver",
    friend: 10000,
    friendSum: 12500,
    premium: 50000,
    premiumSum:75000
  },
  {
    level: "Gold",
    friend: 25000,
    premium: 75000,
    friendSum: 37500,
    premiumSum:150000
  },
  {
    level: "Platinum",
    friend: 50000,
    premium: 250000,
    friendSum: 87500,
    premiumSum:400000
  },
  {
    level: "Diamond",
    friend: 100000,
    premium: 500000,
    friendSum: 187500,
    premiumSum:900000
  },
  {
    level: "Epic",
    friend: 1000000,
    premium: 5000000,
    friendSum: 1187500,
    premiumSum:5900000
  },
];

import openShareMenu from "@/context/telegram";
import { useEffect, useState } from "react";

const inviteFriend = ()=>{  
  let chatId = localStorage.getItem('chatId');
    
  const referralLink = `https://t.me/SmartLitreOfficial_bot?start=r_${chatId}`;
  const forwardMessage = `💧+2.5k DROPS as a first-time bonus\n💎+25k DROPS if you have Telegram Premium`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(forwardMessage)}`;
  window.location.href = telegramShareUrl;
  setTimeout(() => {
    openShareMenu();
  }, 200);
  // const run = async() =>{
    // let chatId = localStorage.getItem('chatId');
    // const referralLink = `https://t.me/SmartLitreOfficial_bot?start=r_${chatId}`;
    // const message = `Invite your friends and get bonuses for each invited friend!🎁\n\nYour referral link: \`${referralLink}\``;
    // const forwardMessage = `💧+2.5k DROPS as a first-time bonus\n💎+25k DROPS if you have Telegram Premium`;
    // const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(forwardMessage)}`;
    // window.location.href = telegramShareUrl;
  //   // const appUrl = `https://bluemoon-mini-app.vercel.app?userId=${chatId}&userName=${encodeURIComponent(userName)}`;
  //   const appUrl = `https://smart-litre-kappa.vercel.app`;
  //   const inlineKeyboard = [
  //       [
  //           { text: "Invite a friend", url: telegramShareUrl }],
  //       [
  //           { text: "Back to BlueMoon", web_app: { url: appUrl } }
  //       ],
  //   ];
  //   await sendTelegramMessage(chatId, message, inlineKeyboard);
  // }
  // run();

}


interface Friend{
  isPremium:boolean,
  name: String,
  level: number,
  amount: number,
  option: String,
  balance: number
  // option: "Telegram User",
}

interface User {
  level: number; // Use 'number' instead of 'number'
  balance : number;
  id: number;
  friends: Frd[];
  first_name:string;
}

interface Frd{
  id: number,
  plus: number,
  userName: String
}

const Friends = () => {

  const [friends, setFriends] = useState<Friend[]>([])


  useEffect(()=>{
      const run = async() =>{
        let id = localStorage.getItem("chatId");
        // let id = "6626270228";
        const users = await getDocs(collection(firestoreDB, "users"));
        const productsMap = users.docs.map(user => user.data() as User);
        let members : Friend[] = [];
        for(let i = 0;i<productsMap.length;i++){
          if(productsMap[i].id === Number(id)){
              let frds:Frd[] = productsMap[i].friends;
              // console.log(frds);
              for(let j = 0;j<frds.length;j++){
                let newFriend:Friend = {name:"", level:0, amount:0, option:"", balance:0, isPremium:false};
                newFriend.isPremium = frds[j].userName === "true"? true : false;
                newFriend.amount = frds[j].plus;
                newFriend.option = frds[j].userName === "true"?"Premium User":"Telegram User";
                let plus = frds[j].plus;
                // console.log(newFriend);
                for(let k = 0;k<productsMap.length;k++){
                  if(frds[j].id === productsMap[k].id){
                    newFriend.balance = productsMap[k].balance;
                    newFriend.level = 5;
                    for(let p = 0;p<balanceByLevel.length;p++){
                        if(newFriend.balance >= balanceByLevel[p]) continue;
                        else{
                          newFriend.level = p;
                          break;
                        } 
                    }
                    newFriend.name =  productsMap[k].first_name;
                    if(newFriend.level>1){
                      let lvl = newFriend.level;
                      lvl = lvl - 1;
                      // console.log(plus, friendsLevel[lvl].premiumSum, friendsLevel[lvl].friendSum)
                      if(plus !== friendsLevel[lvl].premiumSum && plus !== friendsLevel[lvl].friendSum){
                        let isNormal = !newFriend.isPremium;
                        // console.log(newFriend.name,"====>",newFriend.isPremium)
                        if(isNormal){
                          productsMap[i].balance += friendsLevel[lvl].friendSum - plus;
                          productsMap[i].friends[j].plus = friendsLevel[lvl].friendSum;
                          newFriend.amount = friendsLevel[lvl].friendSum;
                          newFriend.option = "Telegram User";
                        }
                        if(!isNormal){
                          productsMap[i].balance += friendsLevel[lvl].premiumSum - plus;
                          productsMap[i].friends[j].plus = friendsLevel[lvl].premiumSum;
                          newFriend.amount = friendsLevel[lvl].premiumSum;
                          newFriend.option = "Premium User";
                        }
                      }
                    }
                    break;
                  }
                }

                members.push(newFriend)
              }
              
              localStorage.setItem("balance", String(productsMap[i].balance));

              const ref = doc(firestoreDB, "users", String(id));
              setDoc(ref, productsMap[i]);
          }
        }
        setFriends(members);
      }
      run();
}, [])


  return (
    <div className="flex flex-col items-center pt-3">
      <div className="font-extrabold text-[20px]">Friends</div>
      <img src={FriendsIcon} alt="friends" className="w-[10rem] mt-2" />
      <div className="font-extrabold text-[14px] leading-[18px] mt-2 text-white/80">
        Invite friends and earn more DROPS
      </div>
      <div className="flex gap-3 mt-5">
        {inviteOptions.map((option, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-[#C3C3C31C] rounded-[11px] py-3 px-5"
            style={{
              boxShadow: "0px 4px 4px 0px #00000040",
            }}
          >
            <div className="font-extrabold text-[15px]">{option.title}</div>
            <img
              src={option.image}
              alt={option.title}
              className="h-[3rem] mt-[9px]"
            />
            <div className="flex items-center gap-0.5 mt-2">
              <DropIcon className="w-4 h-4" />
              <div className="font-extrabold text-[20px]">
                {displayNumbers(option.drops)}
              </div>
            </div>
            <div className="text-white/80 mt-[5px] font-extrabold text-[11px]">
              For you and your friend
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-full gap-4 px-12 mt-5">
        <Button
          className="bg-[#9712F4] font-bold h-12 w-full text-[16px] rounded-full"
          style={{
            boxShadow: "0px 4px 4px 0px #00000040",
          }}

          onClick={inviteFriend}
        >
          Invite Friends
        </Button>

        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="bg-[#BB73F569] font-bold h-12 w-full text-[16px] rounded-full"
              style={{
                boxShadow: "0px 4px 4px 0px #00000040",
              }}
            >
              Level Up Bonus
            </Button>
          </DrawerTrigger>
          <DrawerContent className="flex flex-col items-center pt-6 pb-3">
            <DrawerTitle className="flex items-center justify-between w-full mr-5">
              <div></div>
              <div className="font-extrabold translate-x-4 text-[24px] leading-6">
                Level Up Bonus
              </div>
              <DrawerClose>
                <IoCloseCircleSharp color="#FFFFFF80" size={25} />
              </DrawerClose>
            </DrawerTitle>
            <DropIcon className="mt-2 h-11 w-11" />
            <HandIcon height={50} />
            <div className="text-white/80 text-center text-[14px] font-extrabold leading-[18px] mt-4 mb-2">
              Earn more DROPS when your friend unlocks a new character for each level
            </div>
            <LevelDatable data={friendsLevel} />
          </DrawerContent>
        </Drawer>
      </div>
      <div className="flex flex-col w-full gap-2 px-5 mt-3">
        <div className="font-extrabold text-[15px] leading-[24px]">
          Friends List
        </div>
        <div className="flex flex-col w-full gap-3 mt-2">
          {friends.map((friend, index) => {
            const option = inviteOptions.find(
              (option) => option.title === friend.option
            );
            return (
              <div
                key={index}
                className="bg-[#C3C3C33D] pl-2 py-2 rounded-[11px] flex justify-between pr-5 items-center w-full"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-[2.5rem] flex items-center justify-center h-[2.5rem] border-white border px-1 bg-[#934dca]" style={{border:'1px solid white', padding:'4px'}}>
                    <div
                      className="w-full h-full bg-contain bg-center bg-[#5417b0] relative overflow-hidden"
                      style={{
                        maskImage: `url(${seaCreatures[friend.level].Fish})`,
                        maskSize: "100% 100%",
                        maskPosition: "center",
                      }}
                    ></div>
                  </div>
                  <div className="flex flex-col ">
                    <div className="flex items-center gap-1">
                      <img
                        src={option?.image}
                        alt={option?.title}
                        className="w-4 h-4"
                      />
                      <div className="font-bold text-[11px] leading-6">
                        {friend.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 -mt-0.5">
                      <DropIcon className="w-3 h-3" />
                      <div className="font-extrabold text-[11px] leading-6">
                        +{displayNumbers(friend.balance)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="font-extrabold text-[10px] leading-[18px]">
                  +{displayNumbers(friend.amount)}
                </div>
              </div>
            );
          })}
          { !friends.length &&
            <div className="text-white/80 text-center text-[14px] font-extrabold leading-[18px] mt-4 mb-2">
              Currently there are no friends here
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Friends;
