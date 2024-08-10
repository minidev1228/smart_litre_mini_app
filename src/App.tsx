import { RecoilRoot } from "recoil";
import Layout from "./layout/Layout";
import LoadingPage from "./pages/Loading";
import { Suspense, useState, useEffect } from "react";
import GameLayout from "./layout/GameLayout";
import SplashPage from "./pages/Splash";
import { useUser } from "./hooks/useUser";
import BaseProvider from "./context/BaseProvider";
import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react';

const App = () => {
  const [showGame, setShowGame] = useState(false);
  const { user } = useUser();

  console.log("this is the user: ", user);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGame(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TwaAnalyticsProvider
      projectId='ed87fb96-ae86-41a4-9d58-39bfabb01cda'
      apiKey='c767f91b-1434-4ecb-b802-1e6ed1087eef'
      appName='smart_mini_app'
    >
    <RecoilRoot>
      <BaseProvider>
        <Layout>
          <Suspense fallback={<LoadingPage />}>
            {showGame ? <GameLayout /> : <SplashPage />}
          </Suspense>
        </Layout>
      </BaseProvider>
    </RecoilRoot>
    </TwaAnalyticsProvider>
  );
};

export default App;
