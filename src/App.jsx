import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [step, setStep] = useState(0);
  const [hearts, setHearts] = useState([]);
  const [easter, setEaster] = useState(false);
  const clickCount = useRef(0);

  const audioRef = useRef(null);
  const volumeInterval = useRef(null);

  const messages = [
    "Hey Ditiyaa… tui the loveliest, cutest, mastikhor-est girl i have ever seeen 💖",
    "Bee it any day, keep slayying ✨",
    " tui deserve koris being treated as a princess 👑",
    "Just be happyyy and besttt wishesss andd neverrrr be saadd💕",
    "Not a proposal… just a small Valentine's wish 🌸",
    "Hope this made you smile a little 💗"
  ];

  // Floating hearts
  const spawnHeart = () => {
    const id = Date.now();
    setHearts((h) => [...h, id]);
    setTimeout(() => {
      setHearts((h) => h.filter((x) => x !== id));
    }, 3000);
  };

  // Start music
  const startMusic = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.volume = 0.02;
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
    if (step === 0) startMusic();
    setStep(step + 1);
  };

  // Final screen logic
  useEffect(() => {
    if (step === messages.length - 1) {
      clearInterval(volumeInterval.current);
      const audio = audioRef.current;
      let vol = audio.volume;

      const finalFade = setInterval(() => {
        if (vol < 1) {
          vol += 0.02;
          audio.volume = vol;
        } else clearInterval(finalFade);
      }, 100);

      // Fade out after 10 seconds
setTimeout(() => {
  let vol = audio.volume;

  const fadeOut = setInterval(() => {
    if (vol > 0.01) {
      vol -= 0.02;       // reduce volume smoothly
      audio.volume = vol;
    } else {
      audio.pause();    // finally stop
      audio.volume = 0; // reset
      clearInterval(fadeOut);
    }
  }, 100); // 100ms × ~50 steps = ~5 seconds
}, 20000);

}
  }, [step]);

  // Easter egg
  const handlePhotoClick = () => {
    clickCount.current++;
    if (clickCount.current >= 5) setEaster(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(270deg, #f472b6, #f9a8d4, #fecdd3)",
      backgroundSize: "600% 600%",
      animation: "gradient 10s ease infinite",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden"
    }}>

      {/* Gradient animation */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>

      {/* Blurred background */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('/ditiyaa.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(20px)",
        opacity: 0.25
      }} />

      {/* Hearts */}
      {hearts.map((id) => (
        <div key={id} style={{
          position: "absolute",
          bottom: "0",
          left: Math.random() * 100 + "%",
          fontSize: "24px",
          animation: "float 3s linear",
        }}>💗</div>
      ))}

      <style>{`
        @keyframes float {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-200px); opacity: 0; }
        }
      `}</style>

      {/* Music */}
      <audio ref={audioRef}>
        <source src="/anyayo.mp3" type="audio/mpeg" />
      </audio>


      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        width: "90%",
        maxWidth: "600px",
        textAlign: "center",
        zIndex: 2
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
            onTouchStart={handleNext}
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
              src="/ditiyaa.jpg"
              onClick={handlePhotoClick}
              style={{ width: "100%", borderRadius: "15px", marginTop: "20px", cursor: "pointer" }}
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