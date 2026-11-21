import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Infinity as InfinityIcon, 
  Calendar, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Camera, 
  Edit3, 
  X, 
  Clock, 
  CheckCircle2, 
  RotateCcw,
  BookOpen,
  Image as ImageIcon,
  MessageCircleHeart
} from 'lucide-react';
import confetti from 'canvas-confetti';

const defaultTimelineMilestones = [
  {
    month: 1,
    title: "จุดเริ่มต้นความรักของเรา",
    date: "25 มี.ค. - เม.ย.",
    tagline: "Day 1 ที่โลกของเค้าสดใสขึ้นเพราะมีเธอ",
    story: "วันแรกที่เราเริ่มตกลงก้าวเข้ามาในชีวิตของกันและกัน ทุกอย่างดูตื่นเต้นและเต็มไปด้วยรอยยิ้ม ความรู้สึกที่ได้คุยกันในทุกๆ วันมันมีความสุขจนเค้าไม่อยากให้หมดวันเลย",
    highlight: "จุดเริ่มต้นของทุกรอยยิ้ม 💖",
    color: "#ff758c",
    bgGradient: "linear-gradient(135deg, rgba(255,117,140,0.15) 0%, rgba(255,183,197,0.05) 100%)",
    icon: "🌱",
    image: "/memories/cafe_mirror.jpg",
    imageCaption: "ความน่ารักแรกๆ ที่พาใจเค้าละลายเสมอ 📸✨"
  },
  {
    month: 2,
    title: "ความคุ้นเคยและโลกใบใหม่",
    date: "เม.ย. - พ.ค.",
    tagline: "เริ่มเรียนรู้และแบ่งปันเรื่องราวในแต่ละวัน",
    story: "ช่วงเวลาที่เริ่มคุ้นเคย ได้ยินเสียงหัวเราะของปุ้มบ่อยขึ้น ได้แชร์เรื่องเล็กๆ ในชีวิตประจำวัน ได้รู้ว่าคุณชอบอะไร ไม่ชอบอะไร และเค้าก็ตกหลุมรักความน่ารักนี้มากขึ้นทุกวัน",
    highlight: "ทุกบทสนทนามีค่าเสมอ ✨",
    color: "#ff8fa3",
    bgGradient: "linear-gradient(135deg, rgba(255,143,163,0.15) 0%, rgba(255,194,209,0.05) 100%)",
    icon: "☕",
    image: "/memories/cute_food_selfie.jpg",
    imageCaption: "โมเมนต์น่ารักๆ ตอนนั่งคุยและกินขนมด้วยกัน 🍦😋"
  },
  {
    month: 3,
    title: "กำลังใจข้างๆ ในวันที่เหนื่อย",
    date: "พ.ค. - มิ.ย.",
    tagline: "เป็นพลังใจให้กันเสมอไม่ว่าจะเจอเรื่องอะไร",
    story: "เริ่มมีวันที่เหนื่อยจากการเรียน จากสิ่งต่างๆ แต่ทุกครั้งที่หันมาก็มีปุ้มคอยรับฟัง และเค้าก็สัญญาว่าจะเป็นที่พักพิงที่อบอุ่นที่สุดให้คุณเสมอ",
    highlight: "กอดใจในวันที่อ่อนล้า 🫂",
    color: "#ff9ebb",
    bgGradient: "linear-gradient(135deg, rgba(255,158,187,0.15) 0%, rgba(254,207,239,0.05) 100%)",
    icon: "🌷",
    image: null,
    imageCaption: null
  },
  {
    month: 4,
    title: "สร้างความทรงจำร่วมกัน",
    date: "มิ.ย. - ก.ค.",
    tagline: "อาหารอร่อย ขนมหวาน และรูปคู่ที่เพิ่มขึ้น",
    story: "ช่วงเวลาแห่งความสุข ได้กินของอร่อยด้วยกัน ได้ไปร้านโปรด ชาเขียวหวานๆ และการสร้างอัลบั้มความทรงจำที่นับวันยิ่งมีเรื่องราวให้ย้อนนึกถึงแล้วยิ้มตาม",
    highlight: "ความสุขง่ายๆ ที่มีเธอร่วมทาง 🍧",
    color: "#f78ca0",
    bgGradient: "linear-gradient(135deg, rgba(247,140,160,0.15) 0%, rgba(254,209,199,0.05) 100%)",
    icon: "📸",
    image: "/memories/apollo_mirror.jpg",
    imageCaption: "เช็กอินกระจก APOLLO สุดชิคกับคนสวย 🤍"
  },
  {
    month: 5,
    title: "สวนความรักเริ่มผลิบาน",
    date: "ก.ค. - ส.ค.",
    tagline: "ผ่านเกือบครึ่งปี ความรู้สึกยิ่งชัดเจนและมั่นคง",
    story: "เหมือนต้นไม้ที่เราช่วยกันรดน้ำทะนุถนอมในทุกๆ วัน ความรัก ความเข้าใจ และความผูกพันมันเติบโตหยั่งรากลึกขึ้นเรื่อยๆ จนรู้เลยว่าคนนี้แหละคือคนพิเศษที่สุด",
    highlight: "ต้นไม้แห่งรักที่เติบโตอย่างงดงาม 🪴",
    color: "#e880a6",
    bgGradient: "linear-gradient(135deg, rgba(232,128,166,0.15) 0%, rgba(255,192,203,0.05) 100%)",
    icon: "🌸",
    image: "/memories/sport_badminton.jpg",
    imageCaption: "วันลุยๆ ออกกำลังกายแบดมินตัน เหงื่อท่วมแต่สุขใจมาก 🏸✌️"
  },
  {
    month: 6,
    title: "ครึ่งปีแห่งความอบอุ่น",
    date: "ส.ค. - ก.ย.",
    tagline: "Half Year Anniversary ก้าวข้ามครึ่งปีแรกมาด้วยกัน",
    story: "6 เดือนเต็มที่อยู่ข้างกัน ขอบคุณทุกความอดทน ความเข้าใจ และความน่ารักที่ปุ้มมอบให้เค้าเสมอ เป็น 6 เดือนที่เร็วมากเพราะเวลาแห่งความสุขมักผ่านไปไวเสมอ",
    highlight: "ก้าวผ่าน 180 วันที่แสนพิเศษ 🥂",
    color: "#c084fc",
    bgGradient: "linear-gradient(135deg, rgba(192,132,252,0.15) 0%, rgba(233,213,255,0.05) 100%)",
    icon: "✨",
    image: null,
    imageCaption: null
  },
  {
    month: 7,
    title: "ก้าวผ่านทุกบททดสอบ",
    date: "ก.ย. - ต.ค.",
    tagline: "ยิ่งรู้จัก ยิ่งผูกพัน ยิ่งรักและห่วงใย",
    story: "ไม่ว่าจะมีเรื่องเครียด หรือเรื่องที่ทำให้เหนื่อยใจ แต่การจับมือกันแน่นๆ ทำให้เรารู้ว่าไม่มีอะไรต้องกลัว แค่มีกันและกันอยู่ตรงนี้",
    highlight: "เคียงข้างกันในทุกฤดูกาล 🍂",
    color: "#818cf8",
    bgGradient: "linear-gradient(135deg, rgba(129,140,248,0.15) 0%, rgba(199,210,254,0.05) 100%)",
    icon: "💫",
    image: null,
    imageCaption: null
  },
  {
    month: 8,
    title: "Infinity 8 • รักไม่มีวันสิ้นสุด",
    date: "ต.ค. - 25 พ.ย.",
    tagline: "เลข 8 สัญลักษณ์แห่งความเป็นนิรันดร์ ♾️",
    story: "ครบรอบ 8 เดือนแล้วนะคนดี! เลข 8 เหมือนเครื่องหมายอนันต์ (Infinity) เค้าอยากบอกปุ้มว่า ความรัก ความหวังดี และความตั้งใจที่จะดูแลคุณ จะไม่มีวันลดลงเลย มีแต่จะเพิ่มขึ้นในทุกๆ วัน ขอบคุณที่เป็นความสุขและโลกทั้งใบของเค้านะครับ ❤️",
    highlight: "Happy 8th Month Anniversary รักปุ้มที่สุดในโลก! ♾️❤️",
    color: "#f43f5e",
    bgGradient: "linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(255,228,230,0.1) 100%)",
    icon: "♾️",
    image: "/memories/lantern_festival.jpg",
    imageCaption: "ท่ามกลางโคมไฟที่สวยงาม แต่คนที่สวยและสว่างที่สุดในใจคือคุณ 🏮✨"
  }
];

export default function InfinityTimeline({ onBack }) {
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [userNotes, setUserNotes] = useState(() => {
    const saved = localStorage.getItem('infinity_timeline_custom_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  const [editingNote, setEditingNote] = useState(false);
  const [tempNoteText, setTempNoteText] = useState("");

  const currentItem = defaultTimelineMilestones.find(m => m.month === selectedMonth) || defaultTimelineMilestones[7];

  const handleSelectMonth = (m) => {
    setSelectedMonth(m);
    setEditingNote(false);
    if (m === 8) {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff758c', '#c084fc', '#ffd700']
      });
    }
  };

  const startEditNote = () => {
    setTempNoteText(userNotes[selectedMonth] || "");
    setEditingNote(true);
  };

  const saveNote = () => {
    const updated = { ...userNotes, [selectedMonth]: tempNoteText };
    setUserNotes(updated);
    localStorage.setItem('infinity_timeline_custom_notes', JSON.stringify(updated));
    setEditingNote(false);
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { y: 0.7 }
    });
  };

  return (
    <motion.div
      className="infinity-page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button className="btn-back-absolute" onClick={onBack}>
        <X size={20} /> กลับหน้าหลัก
      </button>

      {/* Decorative Glows */}
      <div className="timeline-glow timeline-glow-pink"></div>
      <div className="timeline-glow timeline-glow-purple"></div>

      <div className="timeline-content-container">
        {/* Header */}
        <div className="timeline-header">
          <motion.div 
            className="timeline-badge"
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <InfinityIcon size={16} className="badge-infinity-icon" />
            <span>The Infinity Capsule • ครบรอบ 8 เดือน</span>
          </motion.div>

          <motion.h1 
            className="timeline-title"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            เส้นทางความทรงจำ 8 เดือนของเรา ♾️💖
          </motion.h1>

          <motion.p 
            className="timeline-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ย้อนดูบันทึกการเดินทางของความรักในแต่ละเดือน และแคปซูลความทรงจำที่ไม่มีวันสิ้นสุด
          </motion.p>
        </div>

        {/* Stepper / Story Dots Progress */}
        <motion.div 
          className="timeline-dots-track"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="dots-container">
            {defaultTimelineMilestones.map((m) => {
              const isActive = m.month === selectedMonth;
              const isPast = m.month < selectedMonth;

              return (
                <button
                  key={m.month}
                  className={`story-dot ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                  onClick={() => handleSelectMonth(m.month)}
                  title={`เรื่องราวที่ ${m.month}`}
                >
                  <span className="dot-fill"></span>
                </button>
              );
            })}
          </div>
          <span className="story-step-badge">
            เรื่องราวที่ {selectedMonth} / 8 {selectedMonth === 8 && '♾️'}
          </span>
        </motion.div>

        {/* Selected Month Capsule Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMonth}
            className="capsule-detail-card"
            style={{ background: currentItem.bgGradient }}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* Top Tag Row */}
            <div className="capsule-top-row">
              <div className="capsule-month-badge" style={{ backgroundColor: currentItem.color }}>
                {selectedMonth === 8 ? (
                  <>
                    <InfinityIcon size={16} /> เดือนที่ 8 • Infinity ♾️
                  </>
                ) : (
                  <>
                    <Calendar size={14} /> เดือนที่ {selectedMonth}
                  </>
                )}
              </div>
              <span className="capsule-date-tag">{currentItem.date}</span>
            </div>

            {/* Main Title */}
            <h2 className="capsule-main-title">{currentItem.title}</h2>
            <p className="capsule-tagline">“{currentItem.tagline}”</p>

            {/* Story Text Box */}
            <div className="capsule-story-box">
              <p className="capsule-story-text">{currentItem.story}</p>
            </div>

            {/* Photo Memory if exists */}
            {currentItem.image && (
              <motion.div 
                className="capsule-photo-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="capsule-photo-frame">
                  <img 
                    src={currentItem.image} 
                    alt={currentItem.title} 
                    className="capsule-memory-img" 
                  />
                  <div className="capsule-photo-badge">
                    <Camera size={13} /> Memory
                  </div>
                </div>
                {currentItem.imageCaption && (
                  <p className="capsule-photo-caption">
                    {currentItem.imageCaption}
                  </p>
                )}
              </motion.div>
            )}

            {/* Highlight Banner */}
            <div className="capsule-highlight-banner">
              <Sparkles size={18} style={{ color: currentItem.color, flexShrink: 0 }} />
              <span>{currentItem.highlight}</span>
            </div>

            {/* Custom Couple Note / Memory Capsule */}
            <div className="capsule-personal-note-section">
              <div className="note-section-header">
                <span className="note-section-title">
                  <MessageCircleHeart size={16} style={{ color: currentItem.color }} />
                  บันทึกความรู้สึกเพิ่มเติมของเดือนนี้:
                </span>
                {!editingNote && (
                  <button className="btn-edit-note" onClick={startEditNote}>
                    <Edit3 size={13} /> {userNotes[selectedMonth] ? 'แก้ไขบันทึก' : '+ เขียนความรู้สึก'}
                  </button>
                )}
              </div>

              {editingNote ? (
                <div className="note-edit-area">
                  <textarea
                    rows={3}
                    className="note-textarea"
                    placeholder="พิมพ์ความทรงจำ เรื่องที่ประทับใจ หรือข้อความที่อยากบอกกันในเดือนนี้..."
                    value={tempNoteText}
                    onChange={(e) => setTempNoteText(e.target.value)}
                  />
                  <div className="note-btn-group">
                    <button className="btn-save-note" onClick={saveNote}>
                      <CheckCircle2 size={14} /> บันทึกลงแคปซูล
                    </button>
                    <button className="btn-cancel-note" onClick={() => setEditingNote(false)}>
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <div className="note-display-box">
                  {userNotes[selectedMonth] ? (
                    <p className="user-note-text">“ {userNotes[selectedMonth]} ”</p>
                  ) : (
                    <p className="user-note-empty">
                      ยังไม่มีข้อความพิเศษสำหรับเดือนนี้ แตะที่ปุ่ม <strong>"+ เขียนความรู้สึก"</strong> เพื่อบันทึกความทรงจำหวานๆ เพิ่มเติมได้เลยนะ ✍️💖
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Next / Prev Nav */}
            <div className="capsule-nav-footer">
              <button
                className="btn-nav-capsule btn-nav-prev"
                disabled={selectedMonth <= 1}
                onClick={() => handleSelectMonth(selectedMonth - 1)}
              >
                <ChevronLeft size={18} /> ย้อนกลับ
              </button>

              <button
                className={`btn-nav-capsule btn-nav-next ${selectedMonth === 8 ? 'btn-nav-finish' : ''}`}
                onClick={() => {
                  if (selectedMonth < 8) {
                    handleSelectMonth(selectedMonth + 1);
                  } else {
                    confetti({
                      particleCount: 50,
                      spread: 80,
                      origin: { y: 0.6 }
                    });
                  }
                }}
              >
                {selectedMonth < 8 ? (
                  <>
                    อ่านต่อเรื่องถัดไป <ChevronRight size={18} />
                  </>
                ) : (
                  <>
                    ครบรอบ 8 เดือนแล้ว เย้! 🎉♾️
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 8-Month Anniversary Celebration Quote */}
        <motion.div 
          className="infinity-love-manifesto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="manifesto-icon-wrap">
            <Heart size={24} className="manifesto-heart" fill="currentColor" />
          </div>
          <div className="manifesto-body">
            <h3>คำสัญญาครบรอบ 8 เดือน (To Infinity & Beyond)</h3>
            <p>
              "ขอบคุณ 240+ วันที่ปุ้มอยู่เป็นความสุขของไอติมนะ ไม่ว่าจะผ่านไปกี่เดือน ความรัก ความใส่ใจ และความหวังดีนี้จะมีให้คุณเสมอไม่เปลี่ยนแปลง สุขสันต์วันครบรอบ 8 เดือนนะคะคนดีของเค้า ❤️"
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
