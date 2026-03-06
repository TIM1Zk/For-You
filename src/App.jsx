import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import quotesData from './data/quotes.json';

function App() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [normalDeck, setNormalDeck] = useState([]);
  const [specialDeck, setSpecialDeck] = useState([]);

  // Helper to shuffle an array
  const shuffleArray = (array) => {
    let result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  // Initialize and get the first quote
  const getNextQuote = (isSpecial) => {
    let nextQuote = null;

    if (isSpecial) {
      setSpecialDeck(prev => {
        let deck = prev.length > 0 ? prev : shuffleArray(quotesData.filter(q => q.special));
        nextQuote = deck[0];
        return deck.slice(1);
      });
    } else {
      setNormalDeck(prev => {
        let deck = prev.length > 0 ? prev : shuffleArray(quotesData.filter(q => !q.special));
        nextQuote = deck[0];
        return deck.slice(1);
      });
    }

    return nextQuote;
  };

  useEffect(() => {
    // Initial load: Prepare normal deck and get first quote
    const initialNormalQuotes = quotesData.filter(q => !q.special);
    const initialSpecialQuotes = quotesData.filter(q => q.special);

    const shuffledNormal = shuffleArray(initialNormalQuotes);
    const shuffledSpecial = shuffleArray(initialSpecialQuotes);

    setQuote(shuffledNormal[0]);
    setNormalDeck(shuffledNormal.slice(1));
    setSpecialDeck(shuffledSpecial);

    setIsVisible(true);
  }, []);

  const handleRefresh = (isSpecial) => {
    if (isSpecial) {
      triggerConfetti();
      window.location.href = 'tel:0628632916';
      return;
    }

    setIsVisible(false);
    setTimeout(() => {
      const next = getNextQuote(false);
      setQuote(next);
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
