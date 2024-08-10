import { FaArrowLeft } from "react-icons/fa6";
// import { CgMoreVertical } from "react-icons/cg";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { tabsAtom, levelAtom } from "@/lib/atom";
const Navbar = () => {
  const setTabs = useSetRecoilState(tabsAtom);
  const level = useRecoilValue(levelAtom);
  return (
    <div className="w-full justify-between flex items-center py-4 px-4 grow-0 shrink basis-auto">
      <div
        onClick={() => {
            setTabs((tabs) =>
              tabs.length === 1 ? tabs : tabs.slice(0, tabs.length - 1)
            );
            localStorage.setItem('currentStep', (level).toString())
            // window.location.reload();
        }}
        className="rounded-xl border-[3.5px] p-1 border-[#C3C3C340]"
      >
        <FaArrowLeft color="white" />
      </div>
      <div className="uppercase font-[Distruction] font-thin leading-6">
        SmartLitre
      </div>
      <div style={{width:'10%'}}>&nbsp;</div>
      {/* <CgMoreVertical color="white" /> */}
    </div>
  );
};

export default Navbar;
