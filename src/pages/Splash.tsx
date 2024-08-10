import Logo from "@/assets/svg/logo.svg?react";
import LogoText from "@/assets/svg/logo-text.svg?react";
import { useEffect } from "react";

import { useTWAEvent } from '@tonsolutions/telemetree-react';

const SplashPage = () => {

  const eventBuilder = useTWAEvent();

  useEffect(()=>{
    const currentDate = new Date();
    // Convert to Dubai time (GMT+4)
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' };
    const dubaiDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    let today = dubaiDate.toString();
    if(localStorage.getItem("today") === today) return;
    eventBuilder.track(`Users joined at ${today}`, {});
    localStorage.setItem("today", today);
  }, [])

  return (
    <div className="flex gap-5 items-center justify-center flex-col h-screen">
      <Logo />
      <div className="overflow-hidden">
        <LogoText className="animate-appearFromBottom" />
      </div>
    </div>
  );
};

export default SplashPage;
