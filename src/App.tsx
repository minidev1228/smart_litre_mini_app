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
      projectId='3295559c-e2ea-4eb4-a307-04851be7f5a9'
      apiKey='53633d6d-4abb-4987-af51-b00a514ff2f2'
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
