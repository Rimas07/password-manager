import { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LockScreen from "./pages/LockScreen";
import Vault from "./pages/Vault";
import AddEdit from "./pages/AddEdit";
import Settings from "./pages/Settings";
import Security from "./pages/Security";


const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function AnimatedRoutes({
  cryptoKey,
  onUnlock,
  onLock,
}: {
  cryptoKey: CryptoKey | null;
  onUnlock: (k: CryptoKey) => void;
  onLock: () => void;
}) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<LockScreen onUnlock={onUnlock} />} />
          <Route
            path="/vault"
            element={
              cryptoKey ? (
                <Vault cryptoKey={cryptoKey} onLock={onLock} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/add"
            element={
              cryptoKey ? (
                <AddEdit cryptoKey={cryptoKey} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/edit/:id"
            element={
              cryptoKey ? (
                <AddEdit cryptoKey={cryptoKey} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/settings"
            element={
              cryptoKey ? (
                <Settings cryptoKey={cryptoKey} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/security"
            element={
              cryptoKey ? (
                <Security cryptoKey={cryptoKey} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);

  const lock = useCallback(() => setCryptoKey(null), []);

  useEffect(() => {
    if (!cryptoKey) return;
    const minutes = Number(localStorage.getItem("autoLock") ?? 15);
    if (minutes === 0) return;

    let timer = setTimeout(lock, minutes * 60 * 1000);
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(lock, minutes * 60 * 1000);
    };
    const onAutoLockChange = (e: Event) => {
      clearTimeout(timer);
      const mins = (e as CustomEvent).detail as number;
      if (mins > 0) timer = setTimeout(lock, mins * 60 * 1000);
    };

    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("autolock-change", onAutoLockChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("autolock-change", onAutoLockChange);
    };
  }, [cryptoKey, lock]);

  return (
    <BrowserRouter>
      <AnimatedRoutes
        cryptoKey={cryptoKey}
        onUnlock={setCryptoKey}
        onLock={lock}
      />
    </BrowserRouter>
  );
}
