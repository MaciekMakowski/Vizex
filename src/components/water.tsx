import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const WaterComponent = () => {
  const waveControls = useAnimation();
  const headerRef = useRef<HTMLDivElement>(null);
  const [wavePosition, setWavePosition] = useState(0);
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);
  const [scrollInfo, setScrollInfo] = useState({
    scrollPosition: 0,
    prevScrollPosition: 0,
  });

  const calcWavePosition = () => {
    const headerBottom = headerRef.current?.getBoundingClientRect().bottom;
    if (!headerBottom) return;
    const scrollPosition = window.innerHeight - headerBottom;
    const maxScroll = document.body.clientHeight - window.innerHeight;
    setWavePosition(Math.min(maxScroll, scrollPosition));
  };

  useEffect(() => {
    const animateWave = async () => {
      calcWavePosition();
      await waveControls.start({
        bottom: "0%",
        transition: { duration: 2, ease: "easeInOut" },
      });
      await waveControls.start({
        bottom: "-90%",
        transition: { duration: 2, ease: "easeInOut" },
      });
      setIsAnimationLoaded(true);
    };

    animateWave();
  }, [waveControls]);

  useEffect(() => {
    if (!isAnimationLoaded) return;
    const animateWave = async () => {
      await waveControls.start({
        bottom: `-${wavePosition}px`,
        opacity: 1,
        transition: {
          duration: 1,
          ease: "easeInOut",
        },
      });
    };
    animateWave();

    const handleScroll = () => {
      calcWavePosition();
      setScrollInfo({
        prevScrollPosition: scrollInfo.scrollPosition,
        scrollPosition: window.scrollY,
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      waveControls.stop();
    };
  }, [wavePosition, waveControls, isAnimationLoaded]);

  return (
    <div style={{ position: "absolute", width: "100%", height: "100vh" }}>
      <div ref={headerRef} style={{ position: "absolute", height: "100px" }} />
      <motion.div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "blue",
          borderRadius: "30% 30% 0 0",
          opacity: 0.5,
        }}
        initial={{ bottom: "-100%" }}
        animate={waveControls}
      />
    </div>
  );
};

export default WaterComponent;
