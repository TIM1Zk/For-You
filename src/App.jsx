import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import quotesData from './data/quotes.json';
import { Camera, Trash2, Send, Clock, User, Loader2, Download, X, Play, Pause, Heart } from 'lucide-react';
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

const HeartCanvas = ({ isGate = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const particles = [];
    const numParticles = 75;
    const heartPoints = [];
    const stars = [];
    const numStars = 120; // Twinkling stars
    let shootingStar = null;

    // Drag-to-rotate 3D state variables
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    
    // rotationAngleY = horizontal rotation, rotationAngleX = vertical tilt
    let rotationAngleY = 0;
    let rotationAngleX = 0;
    let rotationVelocityY = 0;
    let rotationVelocityX = 0;

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random(),
          speed: Math.random() * 0.01 + 0.003,
          fading: Math.random() < 0.5
        });
      }
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight || 500;
      initStars();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const createShootingStar = () => {
      const startX = Math.random() * canvas.width * 0.7;
      const startY = Math.random() * canvas.height * 0.4;
      return {
        x: startX,
        y: startY,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 12 + 8,
        angle: Math.PI / 6 + Math.random() * (Math.PI / 12),
        opacity: 1.0,
        decay: Math.random() * 0.02 + 0.01
      };
    };

    // Precalculate heart coordinates using the parametric formula
    for (let i = 0; i < numParticles; i++) {
      const t = (i / numParticles) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      heartPoints.push({ x, y });
    }

    // Initialize particles with HSL components for easy depth-opacity scaling
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        targetX: 0,
        targetY: 0,
        fontSize: Math.random() * 3 + 11.5,
        speed: Math.random() * 0.04 + 0.015,
        h: 340 + Math.random() * 25,
        s: 100,
        l: 65 + Math.random() * 15,
        baseAlpha: Math.random() * 0.4 + 0.5, // 0.5 to 0.9 base opacity
        angle: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    const handleMouseDown = (e) => {
      if (isGate) return;
      isDragging = true;
      lastX = e.clientX || (e.touches && e.touches[0].clientX);
      lastY = e.clientY || (e.touches && e.touches[0].clientY);
      rotationVelocityX = 0;
      rotationVelocityY = 0;
    };

    const handleMouseMove = (e) => {
      if (isGate) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      
      if (isDragging && clientX !== undefined && clientY !== undefined) {
        const deltaX = clientX - lastX;
        const deltaY = clientY - lastY;
        
        rotationAngleY += deltaX * 0.007;
        rotationVelocityY = deltaX * 0.007;
        
        rotationAngleX += deltaY * 0.007;
        rotationVelocityX = deltaY * 0.007;
        
        lastX = clientX;
        lastY = clientY;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (e) => {
      if (isGate) return;
      isDragging = true;
      if (e.touches && e.touches.length > 0) {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }
      rotationVelocityX = 0;
      rotationVelocityY = 0;
    };

    const handleTouchMove = (e) => {
      if (isGate) return;
      if (e.cancelable) {
        e.preventDefault(); // Stop mobile browser scrolling
      }
      const clientX = e.touches && e.touches[0].clientX;
      const clientY = e.touches && e.touches[0].clientY;
      
      if (isDragging && clientX !== undefined && clientY !== undefined) {
        const deltaX = clientX - lastX;
        const deltaY = clientY - lastY;
        
        rotationAngleY += deltaX * 0.007;
        rotationVelocityY = deltaX * 0.007;
        
        rotationAngleX += deltaY * 0.007;
        rotationVelocityX = deltaY * 0.007;
        
        lastX = clientX;
        lastY = clientY;
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleMouseUp);

    let pulseScale = 1;
    let pulseDirection = 1;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply auto-rotation and spring physics
      if (!isDragging) {
        rotationAngleY += 0.006; // Continuous slow rotation around Y-axis
        
        rotationAngleX += rotationVelocityX;
        rotationAngleY += rotationVelocityY;
        
        rotationVelocityX *= 0.92;
        rotationVelocityY *= 0.92;
        
        const springForceX = (0 - rotationAngleX) * 0.025;
        rotationVelocityX += springForceX;
      }

      // Heartbeat pulse calculation
      pulseScale += 0.004 * pulseDirection;
      if (pulseScale > 1.08) pulseDirection = -1;
      if (pulseScale < 0.94) pulseDirection = 1;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 20;
      const scale = Math.min(canvas.width, canvas.height) * 0.015 * pulseScale;

      // 1. Draw Twinkling background stars
      stars.forEach((star) => {
        if (star.fading) {
          star.opacity -= star.speed;
          if (star.opacity <= 0.1) star.fading = false;
        } else {
          star.opacity += star.speed;
          if (star.opacity >= 0.9) star.fading = true;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.8})`;
        ctx.fill();
      });

      // 2. Draw Shooting Star
      if (!shootingStar && Math.random() < 0.006) {
        shootingStar = createShootingStar();
      }
      if (shootingStar) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= shootingStar.decay;
        if (shootingStar.opacity <= 0) {
          shootingStar = null;
        } else {
          ctx.save();
          ctx.beginPath();
          const grad = ctx.createLinearGradient(
            shootingStar.x, shootingStar.y,
            shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
            shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
          );
          grad.addColorStop(0, `rgba(0, 255, 255, ${shootingStar.opacity})`);
          grad.addColorStop(0.5, `rgba(255, 0, 127, ${shootingStar.opacity * 0.5})`);
          grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
            shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
          );
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Draw the main heart particles as text in 3D projection (ONLY if not gate page)
      if (!isGate) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        particles.forEach((p, idx) => {
          const hp = heartPoints[idx];

          const x0 = hp.x;
          const y0 = hp.y;
          const z0 = 0;

          // Rotate Y-axis
          const x1 = x0 * Math.cos(rotationAngleY) - z0 * Math.sin(rotationAngleY);
          const y1 = y0;
          const z1 = x0 * Math.sin(rotationAngleY) + z0 * Math.cos(rotationAngleY);

          // Rotate X-axis
          const x2 = x1;
          const y2 = y1 * Math.cos(rotationAngleX) - z1 * Math.sin(rotationAngleX);
          const z2 = y1 * Math.sin(rotationAngleX) + z1 * Math.cos(rotationAngleX);

          const depthRatio = (z2 + 16) / 32;
          const scaleProj = 0.8 + depthRatio * 0.4;

          p.targetX = centerX + x2 * scale * scaleProj;
          p.targetY = centerY + y2 * scale * scaleProj;

          p.x += (p.targetX - p.x) * p.speed;
          p.y += (p.targetY - p.y) * p.speed;

          const offset = Math.sin(p.angle) * 1.2;
          p.angle += p.pulseSpeed;

          ctx.font = `bold ${p.fontSize * scaleProj}px 'Mitr', 'Sarabun', sans-serif`;
          const alpha = p.baseAlpha * (0.3 + depthRatio * 0.7);
          ctx.fillStyle = `hsla(${p.h}, ${p.s}%, ${p.l}%, ${alpha})`;
          ctx.shadowBlur = 8 * scaleProj;
          ctx.shadowColor = `rgba(255, 75, 92, ${alpha * 0.6})`;

          ctx.fillText("ไอติมรักปุ้มนะ", p.x + offset, p.y + offset);
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGate]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', inset: 0, zIndex: 2 }} />;
};

function App() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [normalDeck, setNormalDeck] = useState([]);
  const [specialDeck, setSpecialDeck] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
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

  // Gallery Preview State
  const [selectedImg, setSelectedImg] = useState(null);

  // AUDIO STATES
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef(null);
  
  // HOLD HEART GAGE STATES
  const holdIntervalRef = useRef(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const startHolding = () => {
    setIsHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        triggerConfetti();
        setCurrentPage('heart-page');
        setHoldProgress(0);
        setIsHolding(false);
        // Autoplay romantic soundtrack
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().then(() => {
              setIsPlayingAudio(true);
            }).catch(err => {
              console.log("Music autoplay blocked by browser policy:", err);
            });
          }
        }, 400);
      }
    }, 30);
  };

  const stopHolding = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    const decayInterval = setInterval(() => {
      setHoldProgress(prev => {
        if (prev <= 0) {
          clearInterval(decayInterval);
          return 0;
        }
        return Math.max(0, prev - 8);
      });
    }, 20);
  };

  const togglePlayAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(err => {
        console.error("Audio playback failed:", err);
        alert("กรุณาเพิ่มไฟล์เสียง 'voice.mp3' ไว้ในโฟลเดอร์ public ก่อนนะครับ");
      });
    }
  }, [isPlayingAudio]);

  useEffect(() => {
    if (currentPage !== 'heart-page' && audioRef.current && isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  }, [currentPage, isPlayingAudio]);

  const startDate = new Date(2026, 2, 25);

  const shuffleArray = useCallback((array) => {
    let result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }, []);

  const triggerConfetti = useCallback(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff758c', '#ff7eb3', '#ff85a2', '#fdfbfb']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff758c', '#ff7eb3', '#ff85a2', '#fdfbfb']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const getNextQuote = useCallback((isSpecial) => {
    if (!quotesData || quotesData.length === 0) return { text: "รักคุณนะ", author: "ไอติม" };
    
    if (isSpecial) {
      if (specialDeck.length === 0) {
        const fresh = shuffleArray(quotesData.filter(q => q.special === true));
        const next = fresh[0] || { text: "คุณคือเรื่องราวดีๆ ในทุกๆ วันของเค้านะ", author: "ไอติม" };
        setSpecialDeck(fresh.slice(1));
        return next;
      } else {
        const next = specialDeck[0];
        setSpecialDeck(specialDeck.slice(1));
        return next;
      }
    } else {
      if (normalDeck.length === 0) {
        const fresh = shuffleArray(quotesData.filter(q => q.special === false));
        const next = fresh[0] || { text: "สู้ๆ นะครับคนเก่ง เค้าคอยอยู่เคียงข้างคุณเสมอนะ", author: "ไอติม" };
        setNormalDeck(fresh.slice(1));
        return next;
      } else {
        const next = normalDeck[0];
        setNormalDeck(normalDeck.slice(1));
        return next;
      }
    }
  }, [normalDeck, specialDeck, shuffleArray]);

  const loadCouplePhotos = async () => {
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
    } catch (e) {
      console.log('Error loading couple photos from Supabase, using local settings');
    }
  };

  const fetchImages = async () => {
    setIsLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .not('name', 'ilike', '__LOVE_%')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error.message);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleLoveImageUpload = async (e, position) => {
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
      const storagePath = `system/love_${position}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(storagePath);

      const systemName = position === 'left' ? '__LOVE_LEFT__' : '__LOVE_RIGHT__';
      const timestamp = new Date().toLocaleString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      const { error: dbError } = await supabase
        .from('images')
        .insert([{ name: systemName, url: publicUrl, timestamp: timestamp }]);

      if (dbError) throw dbError;

      if (position === 'left') {
        setLeftImg(publicUrl);
      } else {
        setRightImg(publicUrl);
      }
      triggerConfetti();
    } catch (error) {
      alert('อัพโหลดรูปภาพไม่สำเร็จ: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setNewImage(URL.createObjectURL(file));
    }
  };

  const submitImage = async () => {
    if (!imageFile) return alert('กรุณาเลือกรูปภาพก่อนนะครับ');
    if (!imageName.trim()) return alert('กรุณาตั้งชื่อภาพด้วยนะครับ');

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
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

      const { error: dbError } = await supabase
        .from('images')
        .insert([
          { 
            name: imageName, 
            url: publicUrl, 
            timestamp: timestamp 
          }
        ]);

      if (dbError) throw dbError;

      setNewImage(null);
      setImageFile(null);
      setImageName("");
      setShowUpload(false);
      fetchImages();
      triggerConfetti();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัพโหลด: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (id, url) => {
    if (!window.confirm('คุณแน่ใจหรอว่าจะลบรูปความทรงจำนี้น่ะ?🥺')) return;

    try {
      const fileName = url.split('/').pop();
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([fileName]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      fetchImages();
    } catch (error) {
      alert('ลบรูปภาพไม่สำเร็จ: ' + error.message);
    }
  };

  useEffect(() => {
    const calcDuration = () => {
      const diff = new Date() - startDate;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      let years = Math.floor(days / 365);
      let remDays = days % 365;
      let months = Math.floor(remDays / 30);
      let finalDays = remDays % 30;

      setLoveDuration({ years, months, days: finalDays });
    };

    calcDuration();
    const interval = setInterval(calcDuration, 1000 * 60 * 60);

    setQuote(getNextQuote(false));
    setIsVisible(true);
    loadCouplePhotos();
    fetchImages();

    return () => clearInterval(interval);
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
                <button className="btn-love-heart" onClick={() => { setCurrentPage('heart-gate-page'); }}>
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
              <button className="btn-primary" onClick={submitImage} disabled={isUploading}>
                {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} อัพโหลด
              </button>
              <button className="btn-secondary" onClick={() => { setShowUpload(false); setNewImage(null); }} style={{ backgroundColor: '#aaa' }}>
                ยกเลิก
              </button>
            </div>
          </motion.div>
        )}

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
                        onClick={() => setSelectedImg(img.url)}
                        style={{ cursor: 'zoom-in' }}
                      >
                        <img src={img.url} alt={img.name} className="gallery-img" loading="lazy" />
                        <div className="gallery-info">
                          <p className="img-name"><User size={12} /> {img.name}</p>
                          <p className="img-time"><Clock size={12} /> {img.timestamp}</p>
                          <button className="btn-delete" onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(img.id, img.url);
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
      </AnimatePresence>

      <AnimatePresence>
        {selectedImg && (
          <motion.div
            className="image-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
              <button className="btn-close-modal" onClick={() => setSelectedImg(null)}>
                <X size={24} />
              </button>
              <img src={selectedImg} alt="Enlarged view" className="enlarged-image" />
              <a href={selectedImg} download="memory.jpg" target="_blank" rel="noreferrer" className="btn-download-modal">
                <Download size={20} /> ดาวน์โหลดภาพ
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentPage === 'heart-gate-page' && (
        <motion.div
          className="heart-page-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button className="btn-back-absolute" onClick={() => { stopHolding(); setCurrentPage('home'); }}>
            <X size={20} /> กลับหน้าหลัก
          </button>

          {/* Nebula Glow Background */}
          <div className="nebula-glow nebula-pink"></div>
          <div className="nebula-glow nebula-blue"></div>

          {/* Background Space Stars behind hold content */}
          <HeartCanvas isGate={true} />

          <div className="heart-canvas-container" style={{ flexDirection: 'column', gap: '30px', zIndex: 10 }}>
            <h1 className="heart-title-glow" style={{ fontSize: '3.5rem', marginBottom: '10px' }}>Happy Anniversary</h1>
            <p className="heart-sub-text" style={{ fontSize: '1rem', color: '#ffb7c5', opacity: 0.8, textAlign: 'center', maxWidth: '380px', margin: '0 auto 40px auto' }}>
              เข้าสู่มิติความรักพิเศษของเราสองคน 🌌✨
            </p>

            {/* Circular Progress Hold Button */}
            <div className="hold-button-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={`hold-glow ${isHolding ? 'holding' : ''}`}></div>
              
              <button
                onMouseDown={startHolding}
                onMouseUp={stopHolding}
                onMouseLeave={stopHolding}
                onTouchStart={startHolding}
                onTouchEnd={stopHolding}
                className="btn-hold-heart"
              >
                {/* SVG circular progress */}
                <svg className="svg-progress" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" className="circle-track" />
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="54" 
                    className="circle-fill" 
                    style={{ 
                      strokeDasharray: '339', 
                      strokeDashoffset: 339 - (339 * holdProgress) / 100 
                    }} 
                  />
                </svg>
                <Heart size={36} className={`gate-heart-icon ${isHolding ? 'holding' : ''}`} />
              </button>
              
              <span className="hold-label">
                {isHolding ? 'กำลังส่งความรัก...' : 'กดหัวใจค้างไว้เพื่อเข้าสู่ระบบ 💖'}
              </span>
            </div>
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

          {/* Floating Audio Play/Pause Button on Top Right */}
          <button className={`btn-audio-top-right ${isPlayingAudio ? 'playing' : ''}`} onClick={togglePlayAudio}>
            {isPlayingAudio ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />}
          </button>

          {/* Nebula Glow Background */}
          <div className="nebula-glow nebula-pink"></div>
          <div className="nebula-glow nebula-blue"></div>

          <div className="heart-canvas-container">
            <HeartCanvas isGate={false} />
            <audio ref={audioRef} src="/voice-vhs.wav" preload="auto" onEnded={() => setIsPlayingAudio(false)} />
            
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
          animate={{
            y: [0, -10, 0],
            rotate: [0, -5, 5, -5, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        >
          🎁
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button className="video-close-btn" onClick={() => setShowVideoModal(false)}>
                <X size={24} />
              </button>

              <div className="video-tabs">
                {surpriseVideos.map((vid) => (
                  <button
                    key={vid.id}
                    className={`video-tab-btn ${activeVideoId === vid.id ? 'active' : ''}`}
                    onClick={() => setActiveVideoId(vid.id)}
                  >
                    {vid.tabLabel}
                  </button>
                ))}
              </div>

              <div className="video-body">
                <div className="video-header">
                  <h2 className="video-title">{activeVideo.title}</h2>
                  <p className="video-subtitle">{activeVideo.subtitle}</p>
                </div>

                <div className="video-wrapper">
                  <iframe
                    src={activeVideo.embedUrl}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="sweet-card">
                  <p className="sweet-text" style={{ textAlign: 'center' }}>
                    “ {activeVideo.sweetText} ”
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
