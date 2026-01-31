import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [step, setStep] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [easter, setEaster] = useState(false);
  const [bassDrop, setBassDrop] = useState(false);

  const clickCount = useRef(0);
  const audioRef = useRef(null);
  const volumeInterval = useRef(null);

  // Audio analysis
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const audioCtxRef = useRef(null);
  const lastBassRef = useRef(0);
  const lastVibrateRef = useRef(0);

  const messages = [
    "Ditiyaa… hiii... uk? 💖",
    "tui the loveliest, cutest, mastikhor-est girl i have ever seeen 💖✨",
    "tui deserve koris being treated as a princess 👑",
    "Just be happyyy and besttt wishesss andd neverrrr be saadd💕",
    "Not a proposal… just a small Valentine's wish 🌸",
    "Hope this made you smile a little 💗"
  ];

  const floatingItems = Array.from({ length: 14 });

  const spawnHeart = () => {
    const id = Date.now();
    setHearts((h) => [...h, id]);
    setTimeout(() => {
      setHearts((h) => h.filter((x) => x !== id));
    }, 3000);
  };

  // 🎧 Music + bass-drop detection
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

    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(audio);
      const analyser = audioCtx.createAnalyser();

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      audioCtxRef.current = audioCtx;

      const detectBassDrop = () => {
        analyser.getByteFrequencyData(dataArray);

        const bass =
          dataArray.slice(0, 12).reduce((a, b) => a + b, 0) / 12;

        const bassJump = bass - lastBassRef.current;
        const now = Date.now();

        if (
          bassJump > 35 &&
          bass > 120 &&
          now - lastVibrateRef.current > 5000
        ) {
          setBassDrop(true);
          lastVibrateRef.current = now;
          setTimeout(() => setBassDrop(false), 120);
        }

        lastBassRef.current = bass;
        requestAnimationFrame(detectBassDrop);
      };

      detectBassDrop();
    }
  };

  const handleNext = () => {
    spawnHeart();
    if (step === 0) startMusic();
    setStep(step + 1);
  };

  const handlePhotoClick = () => {
    clickCount.current++;
    if (clickCount.current >= 2) setEaster(true);
  };

  // 🎚️ FINAL MUSIC FADE-OUT (2s wait + 5s fade)
  useEffect(() => {
    if (step === messages.length - 1) {
      const audio = audioRef.current;
      if (!audio) return;

      const delay = setTimeout(() => {
        let vol = audio.volume;

        const fadeOut = setInterval(() => {
          if (vol > 0.01) {
            vol -= 0.02;
            audio.volume = vol;
          } else {
            audio.pause();
            audio.volume = 0;
            clearInterval(fadeOut);
          }
        }, 200);
      }, 20000);

      return () => clearTimeout(delay);
    }
  }, [step]);

  const isMobile = window.innerWidth < 768;

  return (
    <motion.div
      animate={
        bassDrop
          ? { x: [-2, 2, -2], y: [-1, 1, -1] }
          : { x: 0, y: 0 }
      }
      transition={{ duration: 0.12 }}
      style={{
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
      }}
    >

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

      {/* FLOATING BACKGROUND OBJECTS */}
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
        <div
          key={id}
          style={{
            position: "absolute",
            bottom: "0",
            left: Math.random() * 90 + "vw",
            fontSize: "26px",
            animation: "float 3s linear"
          }}
        >
          💗
        </div>
      ))}

      {/* MUSIC */}
      <audio ref={audioRef}>
        <source src="/anyayo.mp3" type="audio/mpeg" />
      </audio>

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
    </motion.div>
  );
}
