import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import quotesData from './data/quotes.json';

function App() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    getRandomQuote(false);
    setIsVisible(true);
  }, []);

  const getRandomQuote = (isSpecial) => {
    const filteredQuotes = quotesData.filter(q => q.special === isSpecial);
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    setQuote(filteredQuotes[randomIndex]);
  };

  const handleRefresh = (isSpecial) => {
    setIsVisible(false);

    if (isSpecial) {
      triggerConfetti();
      // Trigger phone call
      window.location.href = 'tel:0628632916';
    }

    setTimeout(() => {
      getRandomQuote(isSpecial);
      setIsVisible(true);
    }, 300);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ffb7c5', '#ff9a9e', '#fecfef'],
        shapes: ['heart'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ffb7c5', '#ff9a9e', '#fecfef'],
        shapes: ['heart'],
      });
    }, 250);
  };

  return (
    <div className="app-container">
      {/* Dynamic background elements */}
      <div className="blob"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={quote.text}
            className="quote-card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="quote-text">“{quote.text}”</p>
            <p className="quote-author">— {quote.author}</p>

            <div className="button-group">
              <button
                className="btn-primary"
                onClick={() => handleRefresh(false)}
                aria-label="รับกำลังใจเพิ่ม"
              >
                ขอกำลังใจหน่อย ✨
              </button>

              <button
                className="btn-special"
                onClick={() => handleRefresh(true)}
                aria-label="กำลังใจสุดพิเศษ"
              >
                กำลังใจพิเศษ ❤️
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{
        position: 'absolute',
        bottom: '20px',
        fontSize: '0.7rem',
        color: '#aaa',
        letterSpacing: '1px'
      }}>
        WITH LOVE • MADE BY TIM1Zk • 2026
      </footer>
    </div>
  );
}

export default App;
