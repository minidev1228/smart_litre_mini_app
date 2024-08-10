import Logo from "@/assets/svg/logo.svg?react";
import LogoText from "@/assets/svg/logo-text.svg?react";

const SplashPage = () => {
  useEffect(()=>{
    console.log("This is Dubai Now time!");
    const currentDate = new Date();

    // Convert to Dubai time (GMT+4)
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' };
    const dubaiDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    console.log("========>", dubaiDate.toString());
    // eventBuilder.track('visit', {});
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
