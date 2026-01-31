import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [step, setStep] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [easter, setEaster] = useState(false);
  const [revealFX, setRevealFX] = useState(false);

  const clickCount = useRef(0);
  const audioRef = useRef(null);
  const volumeInterval = useRef(null);

  const messages = [
    "Ditiyaa… hiii... uk? 💖",
    "tui the loveliest, cutest, mastikhor-est girl i have ever seeen 💖✨",
    "tui deserve koris being treated as a princess 👑",
    "Just be happyyy and besttt wishesss andd neverrrr be saadd💕",
    "Not a proposal… just a small Valentine's wish 🌸",
    "Hope this made you smile a little 💗"
  ];

  const floatingItems = Array.from({ length: 14 });
  const fallItems = Array.from({ length: 24 }); // less clustered

  const spawnHeart = () => {
    const id = Date.now();
    setHearts((h) => [...h, id]);
    setTimeout(() => {
      setHearts((h) => h.filter((x) => x !== id));
    }, 3000);
  };

  const startMusic = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.volume = 0.02;
    audio.muted = false;
    audio.play();

    let vol = 0.02;
    volumeInterval.current = setInterval(() => {
      if (vol < 0.3) {
        vol += 0.03;
        audio.volume = vol;
      }
    }, 2000);
  };

  const handleNext = () => {
    spawnHeart();

    if (step === messages.length - 2) {
      setRevealFX(true);
      setTimeout(() => setRevealFX(false), 6000);
    }

    if (step === 0) startMusic();
    setStep(step + 1);
  };

  useEffect(() => {
    if (step === messages.length - 1) {
      clearInterval(volumeInterval.current);
    }
  }, [step]);

  const handlePhotoClick = () => {
    clickCount.current++;
    if (clickCount.current >= 2) setEaster(true);
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      width: "100vw",
      minHeight: "100svh",
      background: "linear-gradient(270deg, #f472b6, #f9a8d4, #fecdd3)",
      backgroundSize: "600% 600%",
      animation: "gradient 10s ease infinite",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden"
    }}>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @keyframes float {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-200px); opacity: 0; }
        }
      `}</style>

      {/* BLURRED BACKGROUND */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: isMobile ? "url('/mobile.jpg')" : "url('/desktop.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(35px)",
        transform: "scale(1.2)",
        opacity: 0.35
      }} />

      {/* FAST MOVING FLOATING OBJECTS */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none"
      }}>
        {floatingItems.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: ["0vw", `${Math.random() * 100}vw`],
              y: ["0vh", `${Math.random() * 100}vh`]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: "24px",
              opacity: 0.85
            }}
          >
            {["🎈", "✨", "💫"][i % 3]}
          </motion.div>
        ))}
      </div>

      {/* HEARTS */}
      {hearts.map((id) => (
        <div key={id} style={{
          position: "absolute",
          bottom: "0",
          left: Math.random() * 90 + "vw",
          fontSize: "26px",
          animation: "float 3s linear"
        }}>💗</div>
      ))}

      {/* MUSIC */}
      <audio ref={audioRef}>
        <source src="/anyayo.mp3" type="audio/mpeg" />
      </audio>

      {/* FALLING OBJECTS – LAST TAP */}
      {revealFX && (
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none"
        }}>
          {fallItems.map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "-15vh" }}
              animate={{ y: "110vh" }}
              transition={{
                duration: 6,
                delay: i * 0.15,   // spreads them out
                ease: "linear"
              }}
              style={{
                position: "absolute",
                left: `${(i % 8) * 12 + 4}%`, // even horizontal spacing
                fontSize: "28px",
                opacity: 0.95
              }}
            >
              {["🎀", "🍫", "💖"][i % 3]}
            </motion.div>
          ))}
        </div>
      )}

      {/* MAIN CARD */}
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        width: "90vw",
        maxWidth: "400px",
        textAlign: "center",
        zIndex: 2,
        boxShadow: "0 0 40px rgba(236,72,153,0.35)"
      }}>

        <motion.h2
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: "#db2777" }}
        >
          {messages[step]}
        </motion.h2>

        {step < messages.length - 1 ? (
          <motion.button
            onClick={handleNext}
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#ec4899",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Tap 💗
          </motion.button>
        ) : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <img
              src="/desktop.jpg"
              onClick={handlePhotoClick}
              style={{
                width: "100%",
                borderRadius: "15px",
                marginTop: "20px",
                cursor: "pointer"
              }}
            />
            {easter && (
              <p style={{ marginTop: "10px", color: "#db2777" }}>
                For you, I will. Always.💌
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
