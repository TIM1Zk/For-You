import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import quotesData from './data/quotes.json';
import { Camera, Trash2, Send, Clock, User, Loader2, Download, X } from 'lucide-react';
import { supabase } from './supabaseClient';

const surpriseVideos = [
  {
    id: 1,
    tabLabel: "ความทรงจำที่ 1 💖",
    title: "Our Precious Memories 💖",
    subtitle: "ของขวัญพิเศษสำหรับคุณคนเดียวคนเดิม",
    embedUrl: "https://www.youtube.com/embed/SEoDKUj-rVc?autoplay=1&rel=0&modestbranding=1",
    sweetText: (
      <>
        Happy 2-Month Anniversary นะคะที่รัก 🪐✨ <br />
        2 เดือนที่ผ่านมามันเป็นช่วงเวลาที่มีความสุขและมีความหมายที่สุดในชีวิตเค้าเลยนะ <br />
        ขอบคุณที่ก้าวเข้ามาเป็นโลกใบที่น่ารักที่สุด และคอยอยู่เคียงข้างคอยดูแลกันในทุกๆ วัน <br />
        รักคุณที่สุดในโลกและจะรักเพิ่มขึ้นในทุกๆ วันเลยนะคนดีของเค้า❤️
      </>
    )
  },
  {
    id: 2,
    tabLabel: "ความทรงจำที่ 2 🌟",
    title: "Our Sweet Moments 🌟",
    subtitle: "อีกหนึ่งความทรงจำดีๆ ที่อยากมอบให้คุณ",
    embedUrl: "https://www.youtube.com/embed/Tq_OcOSZekk?autoplay=1&rel=0&modestbranding=1",
    sweetText: (
      <>
        สุขสันต์วันพิเศษอีกหนึ่งวันนะคะที่รัก 🌟 <br />
        คลิปนี้เค้าตั้งใจทำขึ้นมาให้คุณอีกคลิปเป็นเซอร์ไพรส์พิเศษเลยนะ <br />
        หวังว่าคุณจะชอบและยิ้มแก้มปริเหมือนเคยนะคะ <br />
        รักคุณเพิ่มขึ้นทุกๆ วันเลยนะคนเก่งของเค้า ❤️
      </>
    )
  }
];

import { useRef } from 'react';

const HeartCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight || 500;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const particles = [];
    const numParticles = 75;
    const heartPoints = [];

    // Precalculate heart coordinates using the parametric formula
    for (let i = 0; i < numParticles; i++) {
      const t = (i / numParticles) * Math.PI * 2;
      // Parametric equations for a heart curve
      const x = 16 * Math.pow(Math.sin(t), 3);
      // y-coordinate is inverted for canvas space (y increases downwards)
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      heartPoints.push({ x, y });
    }

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        targetX: 0,
        targetY: 0,
        fontSize: Math.random() * 3 + 11, // font size between 11px and 14px
        // different speeds so they don't arrive at the same time
        speed: Math.random() * 0.04 + 0.015,
        color: `hsla(${340 + Math.random() * 25}, 100%, ${65 + Math.random() * 15}%, ${Math.random() * 0.6 + 0.4})`,
        angle: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    // Background floating hearts
    const floatingHearts = [];
    const maxFloating = 20;

    const createFloatingHeart = () => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 50 + 20,
        size: Math.random() * 8 + 5,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.sin(Math.random() * Math.PI) * 0.2,
        opacity: Math.random() * 0.4 + 0.2,
        angle: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.4
      };
    };

    for (let i = 0; i < maxFloating; i++) {
      floatingHearts.push(createFloatingHeart());
      // distribute them vertically at start
      floatingHearts[i].y = Math.random() * canvas.height;
    }

    let pulseScale = 1;
    let pulseDirection = 1;

    const drawHeartShape = (context, x, y, size, opacity) => {
      context.save();
      context.beginPath();
      context.translate(x, y);
      context.rotate(Math.PI);
      context.scale(size / 10, size / 10);
      context.moveTo(0, 0);
      context.bezierCurveTo(5, 5, 10, 2, 10, -5);
      context.bezierCurveTo(10, -12, 0, -17, 0, -17);
      context.bezierCurveTo(0, -17, -10, -12, -10, -5);
      context.bezierCurveTo(-10, 2, -5, 5, 0, 0);
      context.fillStyle = `rgba(255, 105, 180, ${opacity})`;
      context.shadowBlur = 10;
      context.shadowColor = 'pink';
      context.fill();
      context.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Heartbeat pulse calculation
      pulseScale += 0.004 * pulseDirection;
      if (pulseScale > 1.08) pulseDirection = -1;
      if (pulseScale < 0.94) pulseDirection = 1;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 20;
      // Adjust size based on width and height
      const scale = Math.min(canvas.width, canvas.height) * 0.015 * pulseScale;

      // 1. Draw floating hearts in background
      floatingHearts.forEach((fh) => {
        fh.y -= fh.speedY;
        fh.x += fh.speedX;
        fh.angle += fh.rotSpeed;

        if (fh.y < -30) {
          // Reset to bottom
          const fresh = createFloatingHeart();
          Object.assign(fh, fresh);
        }

        drawHeartShape(ctx, fh.x, fh.y, fh.size, fh.opacity);
      });

      // 2. Draw the main heart particles as text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      particles.forEach((p, idx) => {
        const hp = heartPoints[idx];
        p.targetX = centerX + hp.x * scale;
        p.targetY = centerY + hp.y * scale;

        // Smoothly move towards the target
        p.x += (p.targetX - p.x) * p.speed;
        p.y += (p.targetY - p.y) * p.speed;

        // Little breathing/vibrating movement
        const offset = Math.sin(p.angle) * 1.2;
        p.angle += p.pulseSpeed;

        // Set font size
        ctx.font = `bold ${p.fontSize}px 'Mitr', 'Sarabun', sans-serif`;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 75, 92, 0.6)';

        // Draw text
        ctx.fillText("ไอติมรักปุ้มนะ", p.x + offset, p.y + offset);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

function App() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [normalDeck, setNormalDeck] = useState([]);
  const [specialDeck, setSpecialDeck] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImage, setNewImage] = useState(null); // Holds the object URL for upload preview
  const [imageFile, setImageFile] = useState(null);   // Holds the raw File object for upload
  const [imageName, setImageName] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [currentPage, setCurrentPage] = useState('home');

  // LOVE COUNTER STATES
  const [loveDuration, setLoveDuration] = useState({ years: 0, months: 0, days: 0 });
  const [leftImg, setLeftImg] = useState(null);
  const [rightImg, setRightImg] = useState(null);

  // SURPRISE VIDEO STATE
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(1);
  const activeVideo = surpriseVideos.find(v => v.id === activeVideoId) || surpriseVideos[0];

  // NEW: Gallery Preview State
  const [selectedImg, setSelectedImg] = useState(null);

  const startDate = new Date(2026, 2, 25);

  // Helper to shuffle an array (doesn't depend on state, but can be kept outside or as callback)
  const shuffleArray = useCallback((array) => {
    let result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }, []);

  // Confetti triggering helper
  const triggerConfetti = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#ffb7c5', '#ff9a9e', '#fecfef'], shapes: ['heart'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ffb7c5', '#ff9a9e', '#fecfef'], shapes: ['heart'] });
    }, 250);
  }, []);

  // Image downloading helper
  const downloadImage = useCallback(async (url, name) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name || 'image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("ไม่สามารถดาวน์โหลดรูปภาพได้");
    }
  }, []);

  // Initialize and get the first quote
  const getNextQuote = useCallback((isSpecial) => {
    const deck = isSpecial ? specialDeck : normalDeck;
    const filtered = (quotesData || []).filter(q => q.special === isSpecial);

    const currentDeck = deck.length > 0 ? deck : shuffleArray(filtered);
    const nextQuote = currentDeck[0] || { text: "สู้ๆ นะ!", author: "TIM1Zk" };
    const remaining = currentDeck.slice(1);

    if (isSpecial) {
      setSpecialDeck(remaining);
    } else {
      setNormalDeck(remaining);
    }

    return nextQuote;
  }, [specialDeck, normalDeck, shuffleArray]);

  const fetchLovePhotos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .in('name', ['__LOVE_LEFT__', '__LOVE_RIGHT__'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const left = data.find(img => img.name === '__LOVE_LEFT__');
      const right = data.find(img => img.name === '__LOVE_RIGHT__');

      if (left) setLeftImg(left.url);
      if (right) setRightImg(right.url);
    } catch (err) {
      console.error("Error fetching love photos:", err.message);
    }
  }, []);

  const fetchImages = useCallback(async () => {
    setIsLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .not('name', 'ilike', '__LOVE_%') // Don't show system images in gallery
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error.message);
    } finally {
      setIsLoadingImages(false);
    }
  }, []);

  useEffect(() => {
    // Calculate Detailed Duration
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const calculateDetailedDiff = (start, end) => {
      let years = end.getFullYear() - start.getFullYear();
      let months = end.getMonth() - start.getMonth();
      let days = end.getDate() - start.getDate();

      if (days < 0) {
        const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        days += prevMonthLastDay;
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }
      return { years, months, days };
    };

    setLoveDuration(calculateDetailedDiff(start, today));

    // Initial load for quotes
    if (quotesData && quotesData.length > 0) {
      const initialNormalQuotes = quotesData.filter(q => !q.special);
      const initialSpecialQuotes = quotesData.filter(q => q.special);
      const shuffledNormal = shuffleArray(initialNormalQuotes);
      setQuote(shuffledNormal[0] || { text: "สู้ๆ นะ!", author: "TIM1Zk" });
      setNormalDeck(shuffledNormal.slice(1));
      setSpecialDeck(shuffleArray(initialSpecialQuotes));
    }

    setIsVisible(true);
    fetchImages();
    fetchLovePhotos();
  }, []);

  const handleLoveImageUpload = useCallback(async (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("กรุณาเลือกเฉพาะไฟล์รูปภาพเท่านั้น");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์รูปภาพใหญ่เกินไป (สูงสุด 5MB)");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const storagePath = `system/love_${side}_${Date.now()}.${fileExt}`;

      // 1. Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(storagePath);

      // 2. Save to Database with special name
      const systemName = side === 'left' ? '__LOVE_LEFT__' : '__LOVE_RIGHT__';
      const timestamp = new Date().toLocaleString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      const { error: dbError } = await supabase
        .from('images')
        .insert([{ name: systemName, url: publicUrl, timestamp: timestamp }]);

      if (dbError) throw dbError;

      if (side === 'left') {
        setLeftImg(publicUrl);
      } else {
        setRightImg(publicUrl);
      }

      triggerConfetti();
    } catch (error) {
      console.error("Error uploading love image:", error.message);
      alert("ไม่สามารถอัพโหลดรูปได้ โปรดลองอีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  }, [triggerConfetti]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("กรุณาเลือกเฉพาะไฟล์รูปภาพเท่านั้น");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("ขนาดไฟล์รูปภาพใหญ่เกินไป (สูงสุด 5MB)");
        return;
      }
      // Revoke the old preview URL if exists to avoid memory leak
      if (newImage) {
        URL.revokeObjectURL(newImage);
      }
      setImageFile(file);
      setNewImage(URL.createObjectURL(file));
    }
  }, [newImage]);

  const saveImage = useCallback(async () => {
    if (!imageFile || !imageName.trim()) return;
    setIsUploading(true);

    try {
      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload raw File object directly instead of fetching base64
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      const timestamp = new Date().toLocaleString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      const newImgRecord = { name: imageName, url: publicUrl, timestamp: timestamp };
      const { data: dbData, error: dbError } = await supabase
        .from('images')
        .insert([newImgRecord])
        .select()
        .single();

      if (dbError) throw dbError;

      setImages(prev => [dbData, ...prev]);

      // Cleanup preview URL
      if (newImage) {
        URL.revokeObjectURL(newImage);
      }
      setImageFile(null);
      setNewImage(null);
      setImageName("");
      setShowUpload(false);
      triggerConfetti();
    } catch (error) {
      console.error("Error uploading image:", error.message);
      alert("เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ");
    } finally {
      setIsUploading(false);
    }
  }, [imageFile, imageName, newImage, triggerConfetti]);

  const deleteImage = useCallback(async (id, url) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้?")) return;
    try {
      const fileName = url.split('/').pop();
      await supabase.storage.from('gallery').remove([fileName]);
      await supabase.from('images').delete().match({ id });
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error.message);
    }
  }, []);

  const handleRefresh = useCallback((isSpecial) => {
    if (isSpecial) {
      triggerConfetti();
      window.location.href = 'tel:0628632916';
      return;
    }
    setIsVisible(false);
    setTimeout(() => {
      setQuote(getNextQuote(false));
      setIsVisible(true);
    }, 300);
  }, [getNextQuote, triggerConfetti]);


  return (
    <div className="app-container">
      <div className="blob"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <AnimatePresence mode="wait">
        {currentPage === 'home' && isVisible && !showUpload && (
          <motion.div
            className="home-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* LOVE COUNTER SECTION */}
            <div className="love-counter-section">
              <motion.h1
                className="counter-title"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                เรารักกันมาแล้ว
              </motion.h1>

              <div className="counter-display">
                <AnimatePresence mode="popLayout">
                  {loveDuration.years > 0 && (
                    <motion.div
                      className="count-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="days-number">{loveDuration.years}</span>
                      <span className="days-label">ปี</span>
                    </motion.div>
                  )}
                  {loveDuration.months > 0 && (
                    <motion.div
                      className="count-item"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="days-number">{loveDuration.months}</span>
                      <span className="days-label">เดือน</span>
                    </motion.div>
                  )}
                  <motion.div
                    className="count-item"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="days-number">{loveDuration.days}</span>
                    <span className="days-label">วัน</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="couple-cards">
                <div className="photo-card left">
                  <label className="photo-upload-label">
                    <input type="file" accept="image/*" onChange={(e) => handleLoveImageUpload(e, 'left')} hidden />
                    <div className="photo-frame">
                      {leftImg ? (
                        <img src={leftImg} alt="Left" className="couple-photo" />
                      ) : (
                        <div className="photo-placeholder">
                          <User size={32} />
                          <span>เพิ่มรูป (Me)</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                <div className="heart-separator">❤️</div>

                <div className="photo-card right">
                  <label className="photo-upload-label">
                    <input type="file" accept="image/*" onChange={(e) => handleLoveImageUpload(e, 'right')} hidden />
                    <div className="photo-frame">
                      {rightImg ? (
                        <img src={rightImg} alt="Right" className="couple-photo" />
                      ) : (
                        <div className="photo-placeholder">
                          <User size={32} />
                          <span>เพิ่มรูป (You)</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* QUOTE SECTION */}
            <motion.div
              key={quote.text}
              className="quote-card"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="quote-text">“{quote.text}”</p>
              <p className="quote-author">— {quote.author}</p>

              <div className="button-group">
                <button className="btn-primary" onClick={() => handleRefresh(false)}>ขอกำลังใจหน่อย ✨</button>
                <button className="btn-special" onClick={() => handleRefresh(true)}>กำลังใจพิเศษ ❤️</button>
              </div>

              <button className="btn-upload-toggle" onClick={() => setShowUpload(true)}>
                <Camera size={18} /> อัพโหลดความน่ารัก
              </button>

              <div className="button-group-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '15px' }}>
                <button className="btn-gallery" onClick={() => setCurrentPage('gallery')} style={{ margin: 0 }}>
                  ดู Gallery ความน่ารัก 🖼️
                </button>
                <button className="btn-love-heart" onClick={() => { triggerConfetti(); setCurrentPage('heart-page'); }}>
                  หัวใจรักปุ้มนะ 💖
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showUpload && (
          <motion.div
            className="quote-card upload-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h2 className="upload-title">เพิ่มความน่ารัก ✨</h2>

            <div className="upload-area">
              {!newImage ? (
                <label className="file-label">
                  <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                  <div className="upload-placeholder">
                    <Camera size={40} />
                    <span>เลือกรูปภาพน่ารักๆ</span>
                  </div>
                </label>
              ) : (
                <div className="preview-container">
                  <img src={newImage} alt="Preview" className="upload-preview" />
                  <button className="btn-remove-preview" onClick={() => setNewImage(null)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="ตั้งชื่อภาพนี้ว่าอะไรดี..."
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                className="name-input"
              />
            </div>

            <div className="button-group">
              <button className="btn-secondary" onClick={() => setShowUpload(false)}>
                ยกเลิก
              </button>
              <button
                className="btn-save"
                onClick={saveImage}
                disabled={!newImage || !imageName.trim() || isUploading}
              >
                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {isUploading ? 'กำลังบันทึก...' : 'บันทึกเลย!'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentPage === 'gallery' && (
        <motion.div
          className="gallery-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="blob" style={{ opacity: 0.5 }}></div>
          <div className="blob blob-2" style={{ opacity: 0.5 }}></div>
          <div className="gallery-header">
            <h2>Gallery ความน่ารัก ✨</h2>
            <button className="btn-back" onClick={() => setCurrentPage('home')}>กลับ</button>
          </div>
          <div className="gallery-full-container">
            {isLoadingImages ? (
              <div style={{ width: '100%', textAlign: 'center', marginTop: '50px', color: '#888' }}>
                <Loader2 className="animate-spin" size={30} style={{ margin: '0 auto', marginBottom: '10px' }} />
                <p>กำลังโหลดความน่ารัก...</p>
              </div>
            ) : (
              <AnimatePresence>
                {images.length === 0 ? (
                  <div style={{ width: '100%', textAlign: 'center', marginTop: '50px', color: '#aaa', gridColumn: '1 / -1' }}>
                    <p>ยังไม่มีรูปภาพใน Gallery เลย ลองอัพโหลดเป็นคนแรกสิ! ✨</p>
                  </div>
                ) : (
                  images.map((img) => (
                    <motion.div
                      key={img.id}
                      className="gallery-item"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      layout
                      onClick={() => setSelectedImg(img)}
                      style={{ cursor: 'zoom-in' }}
                    >
                      <img src={img.url} alt={img.name} className="gallery-img" loading="lazy" />
                      <div className="gallery-info">
                        <p className="img-name"><User size={12} /> {img.name}</p>
                        <p className="img-time"><Clock size={12} /> {img.timestamp}</p>
                        <button className="btn-delete" onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(img.id, img.url);
                        }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      )}

      {currentPage === 'heart-page' && (
        <motion.div
          className="heart-page-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="btn-back-absolute" onClick={() => setCurrentPage('home')}>
            <X size={20} /> กลับหน้าหลัก
          </button>

          <div className="heart-canvas-container">
            <HeartCanvas />
            <div className="heart-text-overlay">
              <p className="heart-sub-text">ตลอดไปและมากกว่าเดิมในทุกๆ วันนะคุณคนเก่ง 💕</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Shaking Gift Box */}
      {currentPage === 'home' && !showUpload && !showVideoModal && (
        <motion.div
          className="gift-box-floating"
          onClick={() => {
            triggerConfetti();
            setShowVideoModal(true);
          }}
          initial={{ scale: 0, rotate: -45 }}
          animate={{
            scale: 1,
            rotate: 0,
            y: [0, -10, 0]
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            },
            scale: { duration: 0.5 },
            rotate: { duration: 0.5 }
          }}
          whileHover={{ scale: 1.15, rotate: 5 }}
        >
          <div className="gift-bow">🎁</div>
          <span className="gift-badge">มีเซอร์ไพรส์! 💌</span>
        </motion.div>
      )}

      {/* SURPRISE VIDEO MODAL */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div 
            className="video-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="video-modal-content"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              {/* Close Button */}
              <button className="video-close-btn" onClick={() => setShowVideoModal(false)}>
                <X size={22} />
              </button>

              {/* Video Tabs Selector */}
              <div className="video-tabs-container">
                {surpriseVideos.map((vid) => (
                  <button
                    key={vid.id}
                    className={`video-tab-btn ${activeVideoId === vid.id ? 'active' : ''}`}
                    onClick={() => {
                      triggerConfetti();
                      setActiveVideoId(vid.id);
                    }}
                  >
                    {vid.tabLabel}
                  </button>
                ))}
              </div>

              <div className="video-header">
                <h2>{activeVideo.title}</h2>
                <p>{activeVideo.subtitle}</p>
              </div>

              {/* YouTube Video Container */}
              <div className="video-wrapper">
                <iframe 
                  key={activeVideo.id}
                  src={activeVideo.embedUrl} 
                  title={activeVideo.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              {/* Handwritten Sweet Card */}
              <div className="sweet-card">
                <p className="sweet-text">
                  “ {activeVideo.sweetText} ”
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="app-footer">
        WITH LOVE • MADE BY TIM1Zk • 2026
      </footer>

      {/* IMAGE PREVIEW MODAL */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="image-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              className="image-modal-content"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImg.url} alt={selectedImg.name} className="full-res-img" />

              <div className="modal-actions">
                <button className="modal-btn download-btn" onClick={() => downloadImage(selectedImg.url, selectedImg.name)}>
                  <Download size={20} /> ดาวน์โหลด
                </button>
                <button className="modal-btn close-btn" onClick={() => setSelectedImg(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-info">
                <h3>{selectedImg.name}</h3>
                <p><Clock size={14} /> {selectedImg.timestamp}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
