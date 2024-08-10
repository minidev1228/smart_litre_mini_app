import Logo from "@/assets/svg/logo.svg?react";
import LogoText from "@/assets/svg/logo-text.svg?react";
import { useEffect } from "react";

import { useTWAEvent } from '@tonsolutions/telemetree-react';

import { ZonedDate } from '@progress/kendo-date-math';
import '@progress/kendo-date-math/tz/Asia/Dubai';

const SplashPage = () => {

  const eventBuilder = useTWAEvent();

  useEffect(()=>{
    const currentDate = new Date();
    const tzDate = ZonedDate.fromUTCDate(currentDate, 'Asia/Dubai');
    let today = tzDate.toLocalDate().toISOString();
    today = today.split("T")[0];
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
