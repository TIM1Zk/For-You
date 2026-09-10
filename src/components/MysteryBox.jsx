import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Coffee, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  PartyPopper, 
  Heart, 
  X, 
  Ticket, 
  Utensils, 
  Check, 
  Star,
  Award,
  Shuffle,
  Dices
} from 'lucide-react';
import confetti from 'canvas-confetti';

const triggerSpecialConfetti = (type = 'matcha') => {
  const colors = type === 'matcha' 
    ? ['#56ab2f', '#a8e063', '#d4fc79', '#ffffff', '#ffb7c5']
    : ['#ff416c', '#ff4b2b', '#ffb347', '#ffcc33', '#ffffff'];

  const end = Date.now() + 2 * 1000;
  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 60,
      origin: { x: 0.1, y: 0.6 },
      colors
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 60,
      origin: { x: 0.9, y: 0.6 },
      colors
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

export default function MysteryBox({ onBack }) {
  // Prize slots array: either ['matcha', 'bbq'] or ['bbq', 'matcha']
  const [boxSlots, setBoxSlots] = useState(() => {
    const saved = localStorage.getItem('mystery_box_slots');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const initial = Math.random() < 0.5 ? ['matcha', 'bbq'] : ['bbq', 'matcha'];
    localStorage.setItem('mystery_box_slots', JSON.stringify(initial));
    return initial;
  });

  // Box opened state
  const [openedBoxes, setOpenedBoxes] = useState(() => {
    const saved = localStorage.getItem('mystery_opened_boxes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [false, false]; // [box0Opened, box1Opened]
  });

  // Shuffling animation state
  const [isShuffling, setIsShuffling] = useState(false);

  // Matcha Cups Redeemed (0 to 10)
  const [matchaRedeemed, setMatchaRedeemed] = useState(() => {
    const saved = localStorage.getItem('matcha_redeemed_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // BBQ Voucher Status
  const [bbqClaimed, setBbqClaimed] = useState(() => {
    return localStorage.getItem('bbq_claimed_status') === 'true';
  });
  const [bbqClaimedDate, setBbqClaimedDate] = useState(() => {
    return localStorage.getItem('bbq_claimed_date') || '';
  });

  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const openBox = (boxIndex) => {
    if (isShuffling || openedBoxes[boxIndex]) return;

    const newOpened = [...openedBoxes];
    newOpened[boxIndex] = true;
    setOpenedBoxes(newOpened);
    localStorage.setItem('mystery_opened_boxes', JSON.stringify(newOpened));

    const prize = boxSlots[boxIndex];
    if (prize === 'matcha') {
      triggerSpecialConfetti('matcha');
      showToast('🎉 ว้าว! สุ่มได้ ชาเขียว LawCofe 10 แก้ว 🍵✨');
    } else {
      triggerSpecialConfetti('bbq');
      showToast('🔥 เย้! สุ่มได้ เลี้ยงปิ้งย่างมื้อพิเศษ 🥩✨');
    }
  };

  const handleRandomPick = () => {
    if (isShuffling) return;
    const unopenedIndices = openedBoxes
      .map((isOpened, idx) => (!isOpened ? idx : null))
      .filter((idx) => idx !== null);

    if (unopenedIndices.length === 0) {
      showToast('🎁 คุณเปิดครบทั้ง 2 กล่องแล้วนะคับ! กดปุ่ม "สุ่มสลับใหม่" เพื่อเล่นใหม่ได้เลย');
      return;
    }

    const randomChoice = unopenedIndices[Math.floor(Math.random() * unopenedIndices.length)];
    openBox(randomChoice);
  };

  const handleShuffleAndReset = () => {
    setIsShuffling(true);
    showToast('🎲 กำลังสับเปลี่ยนตำแหน่งกล่องสุ่ม...');

    // Close boxes first
    const closed = [false, false];
    setOpenedBoxes(closed);
    localStorage.setItem('mystery_opened_boxes', JSON.stringify(closed));

    setTimeout(() => {
      // Randomize slots
      const newSlots = Math.random() < 0.5 ? ['matcha', 'bbq'] : ['bbq', 'matcha'];
      setBoxSlots(newSlots);
      localStorage.setItem('mystery_box_slots', JSON.stringify(newSlots));
      setIsShuffling(false);
      showToast('✨ สุ่มสลับกล่องเรียบร้อย! ลองเลือกเปิดกล่องใหม่เลยนะ 💖');
    }, 700);
  };

  const openAllBoxes = () => {
    if (isShuffling) return;
    const allOpened = [true, true];
    setOpenedBoxes(allOpened);
    localStorage.setItem('mystery_opened_boxes', JSON.stringify(allOpened));
    triggerSpecialConfetti('matcha');
    setTimeout(() => triggerSpecialConfetti('bbq'), 350);
    showToast('🎁 เปิดเฉลยของขวัญทั้ง 2 กล่องเรียบร้อย! 💖✨');
  };

  const toggleMatchaCup = (index) => {
    let newCount;
    if (index < matchaRedeemed) {
      newCount = index;
    } else {
      newCount = index + 1;
    }
    setMatchaRedeemed(newCount);
    localStorage.setItem('matcha_redeemed_count', newCount.toString());
    
    if (newCount > matchaRedeemed) {
      triggerSpecialConfetti('matcha');
      showToast(`🍵 ใช้สิทธิ์ชาเขียวแก้วที่ ${newCount} เรียบร้อย! (เหลืออีก ${10 - newCount} แก้ว)`);
    } else {
      showToast(`🍵 คืนสิทธิ์ชาเขียวเรียบร้อย (เหลือ ${10 - newCount} แก้ว)`);
    }
  };

  const handleRedeemNextMatcha = () => {
    if (matchaRedeemed < 10) {
      const next = matchaRedeemed + 1;
      setMatchaRedeemed(next);
      localStorage.setItem('matcha_redeemed_count', next.toString());
      triggerSpecialConfetti('matcha');
      showToast(`🍵 ใช้สิทธิ์ชาเขียวแก้วที่ ${next} แล้ว! (เหลืออีก ${10 - next} แก้ว)`);
    } else {
      showToast('💚 คุณใช้สิทธิ์ชาเขียวครบทั้ง 10 แก้วแล้วนะคนเก่ง!');
    }
  };

  const handleToggleBbqClaim = () => {
    if (!bbqClaimed) {
      const dateStr = new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      setBbqClaimed(true);
      setBbqClaimedDate(dateStr);
      localStorage.setItem('bbq_claimed_status', 'true');
      localStorage.setItem('bbq_claimed_date', dateStr);
      triggerSpecialConfetti('bbq');
      showToast('🥩 ใช้สิทธิ์เลี้ยงปิ้งย่างแล้ว! เตรียมนัดวันไปกินกันเลยยย 🔥');
    } else {
      if (window.confirm('ต้องการเปลี่ยนสถานะกลับเป็น "พร้อมใช้งาน" มั้ยคับ?')) {
        setBbqClaimed(false);
        setBbqClaimedDate('');
        localStorage.setItem('bbq_claimed_status', 'false');
        localStorage.setItem('bbq_claimed_date', '');
        showToast('🥩 คืนสถานะคูปองปิ้งย่างพร้อมใช้งานเรียบร้อย!');
      }
    }
  };

  // Render individual prize component inside opened box
  const renderPrizeContent = (prizeType) => {
    if (prizeType === 'matcha') {
      return (
        <motion.div 
          className="prize-card-view prize-matcha"
          initial={{ opacity: 0, scale: 0.85, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          {/* Ribbon Tag */}
          <div className="prize-ribbon">
            <Star size={14} fill="currentColor" /> SPECIAL REWARD <Star size={14} fill="currentColor" />
          </div>

          <div className="prize-main-header">
            <div className="prize-avatar-wrap matcha-avatar">
              <Coffee size={32} />
            </div>
            <div className="prize-title-block">
              <span className="prize-company">LAWSON 108 • LawCofe</span>
              <h2 className="prize-title">ชาเขียว LawCofe 10 แก้ว 🍵✨</h2>
            </div>
          </div>

          <p className="prize-desc">
            คูปองแลกรับชาเขียวสุดโปรดจาก <strong>LawCofe</strong> หอมหวาน สดชื่น อร่อยฟิน เติมพลังให้คนเก่งครบ 10 แก้วเต็มๆ โดยสปอนเซอร์ใจดี (ไอติม) 💚
          </p>

          {/* Stamp Card Area */}
          <div className="stamp-tracker-box">
            <div className="stamp-tracker-header">
              <span className="stamp-label">
                <Ticket size={14} style={{ display: 'inline', marginRight: '4px' }} /> บัตรสะสมสิทธิ์ดื่มชาเขียว
              </span>
              <span className="stamp-count-badge">
                เหลือ {10 - matchaRedeemed} / 10 แก้ว
              </span>
            </div>

            {/* 10 Stamps Grid */}
            <div className="stamps-grid">
              {Array.from({ length: 10 }).map((_, idx) => {
                const isStamped = idx < matchaRedeemed;
                return (
                  <motion.button
                    key={idx}
                    type="button"
                    className={`stamp-cell ${isStamped ? 'stamped' : 'unstamped'}`}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleMatchaCup(idx)}
                    title={isStamped ? `แก้วที่ ${idx + 1}: ใช้สิทธิ์แล้ว (แตะเพื่อคืน)` : `แก้วที่ ${idx + 1}: ยังไม่ได้ใช้ (แตะเพื่อใช้สิทธิ์)`}
                  >
                    <span className="stamp-num">#{idx + 1}</span>
                    <div className="stamp-icon-center">
                      {isStamped ? (
                        <CheckCircle2 size={20} className="check-stamp-icon" />
                      ) : (
                        <Coffee size={18} className="cup-empty-icon" />
                      )}
                    </div>
                    <span className="stamp-text">
                      {isStamped ? 'ดื่มแล้ว 💚' : '1 แก้ว 🍵'}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Quick Action Button for Matcha */}
            <div className="stamp-footer-actions">
              <button 
                className="btn-use-matcha" 
                onClick={handleRedeemNextMatcha}
                disabled={matchaRedeemed >= 10}
              >
                <Coffee size={16} /> {matchaRedeemed >= 10 ? 'ใช้สิทธิ์ครบ 10 แก้วแล้ว 🎉' : 'กดใช้สิทธิ์ 1 แก้ว 🍵 (-1)'}
              </button>
              {matchaRedeemed > 0 && (
                <button 
                  className="btn-restore-matcha"
                  onClick={() => {
                    const next = matchaRedeemed - 1;
                    setMatchaRedeemed(next);
                    localStorage.setItem('matcha_redeemed_count', next.toString());
                    showToast(`🍵 คืนสิทธิ์ชาเขียว 1 แก้วเรียบร้อย (เหลือ ${10 - next} แก้ว)`);
                  }}
                >
                  คืน 1 แก้ว (+1)
                </button>
              )}
            </div>
          </div>

          {/* Slogan footnote */}
          <div className="prize-footnote matcha-note">
            <span>💚 กติกา: แตะสั่งเมื่อไหร่ เค้าพร้อมไปซื้อหรือโอนให้ทันที ไม่มีวันหมดอายุ!</span>
          </div>
        </motion.div>
      );
    }

    if (prizeType === 'bbq') {
      return (
        <motion.div 
          className="prize-card-view prize-bbq"
          initial={{ opacity: 0, scale: 0.85, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          {/* Ribbon Tag */}
          <div className="prize-ribbon bbq-ribbon">
            <Flame size={14} fill="currentColor" /> VIP ALL YOU CAN EAT <Flame size={14} fill="currentColor" />
          </div>

          <div className="prize-main-header">
            <div className="prize-avatar-wrap bbq-avatar">
              <Utensils size={32} />
            </div>
            <div className="prize-title-block">
              <span className="prize-company bbq-company">PREMIUM BUFFET & BBQ</span>
              <h2 className="prize-title">เลี้ยงปิ้งย่างมื้อพิเศษ 🥩🥓🔥</h2>
            </div>
          </div>

          <p className="prize-desc">
            สิทธิ์กินบุฟเฟต์ปิ้งย่าง/ชาบูมื้อใหญ่ เลือกร้านที่คุณอยากกินได้ตามใจชอบเลยนะ อิ่มไม่อั้น เนื้อลายสวยๆ กุ้งเด้งๆ พร้อมคนบริการคอยย่างและเสิร์ฟให้ตลอดมื้อ! ❤️
          </p>

          {/* VIP Perks List */}
          <div className="bbq-perks-box">
            <h4 className="perks-title">
              <Award size={16} className="perks-icon" /> สิทธิพิเศษระดับ VIP ที่คุณจะได้รับ:
            </h4>
            <ul className="perks-list">
              <li>
                <Check size={16} className="perk-check" />
                <span><strong>เลือกร้านได้ไม่อั้น:</strong> คุณแฟนเลือกร้านปิ้งย่างที่อยากกินได้เลยเต็มที่</span>
              </li>
              <li>
                <Check size={16} className="perk-check" />
                <span><strong>บริการย่างเนื้อให้:</strong> คอยคีบ คอยย่าง ตัดเนื้อ เสิร์ฟใส่จานให้ตลอดมื้อ</span>
              </li>
              <li>
                <Check size={16} className="perk-check" />
                <span><strong>สปอนเซอร์ 100%:</strong> ไอติมรับจบจ่ายให้ทั้งหมด สั่งเมนูพิเศษได้เต็มที่</span>
              </li>
              <li>
                <Check size={16} className="perk-check" />
                <span><strong>ไม่มีวันหมดอายุ:</strong> นัดวันเวลาที่คุณสะดวกเมื่อไหร่ ไปลุยกันได้เลย!</span>
              </li>
            </ul>
          </div>

          {/* Claim / Redemption Ticket Status */}
          <div className={`bbq-claim-card ${bbqClaimed ? 'claimed' : 'ready'}`}>
            <div className="claim-status-row">
              <div className="claim-badge-wrap">
                <span className={`claim-status-badge ${bbqClaimed ? 'used' : 'available'}`}>
                  {bbqClaimed ? '🎉 ใช้สิทธิ์แล้ว' : '✨ พร้อมใช้งาน'}
                </span>
              </div>
              {bbqClaimed && (
                <span className="claim-date-text">
                  แลกสิทธิ์เมื่อ: {bbqClaimedDate}
                </span>
              )}
            </div>

            <button 
              className={`btn-claim-bbq ${bbqClaimed ? 'claimed' : ''}`}
              onClick={handleToggleBbqClaim}
            >
              {bbqClaimed ? (
                <>
                  <CheckCircle2 size={18} /> ใช้สิทธิ์แล้ว (แตะเพื่อเปลี่ยนสถานะ)
                </>
              ) : (
                <>
                  <Flame size={18} /> กดใช้สิทธิ์ชวนไปกินปิ้งย่าง 😋🥩
                </>
              )}
            </button>
          </div>

          {/* Slogan footnote */}
          <div className="prize-footnote bbq-note">
            <span>🔥 กติกา: ขอแค่ปุ้มบอกว่า "อยากกินปิ้งย่าง" เค้ารีบเคลียร์คิวพาไปทันทีคับ!</span>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <motion.div
      className="mystery-page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <button className="btn-back-absolute" onClick={onBack}>
        <X size={20} /> กลับหน้าหลัก
      </button>

      {/* Atmospheric Glow Blobs */}
      <div className="mystery-glow mystery-glow-green"></div>
      <div className="mystery-glow mystery-glow-orange"></div>
      <div className="mystery-glow mystery-glow-pink"></div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            className="mystery-toast"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
          >
            <Sparkles size={16} className="toast-icon" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mystery-content-container">
        {/* Header */}
        <div className="mystery-header">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mystery-badge"
          >
            <Dices size={14} /> Random Mystery Box
          </motion.div>
          <motion.h1
            className="mystery-title"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            กล่องสุ่มของขวัญแห่งความรัก 🎁✨
          </motion.h1>
          <motion.p
            className="mystery-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            มี 2 กล่องปริศนาซ่อนของรางวัลไว้ (ชาเขียว 10 แก้ว vs เลี้ยงปิ้งย่าง) สุ่มลุ้นได้เลยว่ากล่องไหนจะซ่อนรางวัลอะไรอยู่! 💖
          </motion.p>
        </div>

        {/* Action Controls */}
        <motion.div 
          className="mystery-quick-actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {/* Random Pick Button */}
          {(!openedBoxes[0] || !openedBoxes[1]) && (
            <button className="btn-open-all" onClick={handleRandomPick} disabled={isShuffling}>
              <Dices size={16} /> สุ่มเปิดกล่องนำโชค 🎲
            </button>
          )}

          {/* Shuffle & Reset Button */}
          <button className="btn-reset-boxes" onClick={handleShuffleAndReset} disabled={isShuffling}>
            <Shuffle size={14} className={isShuffling ? 'animate-spin' : ''} /> สลับตำแหน่งกล่องใหม่ 🔀
          </button>

          {/* Open All */}
          {(!openedBoxes[0] || !openedBoxes[1]) && (
            <button className="btn-reset-boxes" onClick={openAllBoxes} disabled={isShuffling}>
              <PartyPopper size={14} /> เปิดเฉลยทั้ง 2 กล่อง ✨
            </button>
          )}
        </motion.div>

        {/* 2 Mystery Boxes Grid */}
        <div className={`mystery-boxes-grid ${isShuffling ? 'shuffling-state' : ''}`}>
          
          {[0, 1].map((boxIdx) => {
            const isOpened = openedBoxes[boxIdx];
            const prizeType = boxSlots[boxIdx];
            const boxColorClass = boxIdx === 0 ? 'box-purple-pink' : 'box-coral-gold';

            return (
              <motion.div
                key={boxIdx}
                className={`mystery-card-container ${isOpened ? (prizeType === 'matcha' ? 'theme-matcha is-opened' : 'theme-bbq is-opened') : 'theme-mystery'}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: isShuffling ? [1, 0.92, 1.05, 1] : 1, 
                  x: isShuffling ? (boxIdx === 0 ? [0, 40, -40, 0] : [0, -40, 40, 0]) : 0,
                  y: 0 
                }}
                transition={{ duration: 0.5, delay: boxIdx * 0.1 }}
              >
                <div className="mystery-card-header">
                  <span className={`box-number-tag ${isOpened ? (prizeType === 'bbq' ? 'bbq-tag' : '') : 'mystery-tag'}`}>
                    {isOpened ? (prizeType === 'matcha' ? 'กล่องที่เปิดได้: ชาเขียว 🍵' : 'กล่องที่เปิดได้: ปิ้งย่าง 🥩') : `กล่องปริศนา #${boxIdx + 1} 🎁`}
                  </span>
                  <span className={`box-theme-tag ${isOpened ? (prizeType === 'bbq' ? 'bbq-theme' : '') : 'mystery-theme'}`}>
                    {isOpened ? (prizeType === 'matcha' ? 'Matcha Special' : 'Yakiniku VIP') : '❓ สุ่มลุ้นรางวัล'}
                  </span>
                </div>

                {!isOpened ? (
                  /* UNOPENED MYSTERY BOX */
                  <div className="unopened-box-view" onClick={() => openBox(boxIdx)}>
                    <motion.div 
                      className={`gift-box-3d mystery-gift-box ${boxColorClass}`}
                      whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
                      whileTap={{ scale: 0.94 }}
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: boxIdx === 0 ? [0, -2, 2, 0] : [0, 2, -2, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2.8,
                        delay: boxIdx * 0.3,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="box-sparkle-ring mystery-ring"></div>
                      <div className="box-icon-wrap">
                        <Gift size={64} className="box-svg-icon" />
                      </div>
                      <div className="box-question-mark mystery-q">?</div>
                    </motion.div>
                    
                    <h3 className="box-prompt-title">กล่องสุ่มใบที่ {boxIdx + 1}</h3>
                    <p className="box-prompt-sub">แตะกล่องนี้เพื่อเปิดลุ้นรางวัล ✨</p>
                    
                    <button className="btn-open-box btn-open-mystery" onClick={() => openBox(boxIdx)}>
                      <Sparkles size={16} /> แตะเพื่อเปิดกล่องที่ {boxIdx + 1} 🎲
                    </button>
                  </div>
                ) : (
                  /* REVEALED PRIZE CARD */
                  renderPrizeContent(prizeType)
                )}
              </motion.div>
            );
          })}

        </div>

        {/* Sweet Bottom Encouragement */}
        <motion.div 
          className="mystery-bottom-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Heart size={20} className="bottom-heart-icon" />
          <p className="bottom-love-text">
            "ไม่ว่าจะเปิดได้กล่องไหน เค้าก็ตั้งใจทำให้ด้วยความรักทั้งหมดเลยนะคนเก่ง ขอให้ยิ้มเยอะๆ ในทุกๆ วันนะครับ รักปุ้มที่สุดเลย ❤️"
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
}
