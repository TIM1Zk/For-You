import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import quotesData from './data/quotes.json';
import { Camera, Trash2, Send, Clock, User, Loader2 } from 'lucide-react';
import { supabase } from './supabaseClient';

function App() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [normalDeck, setNormalDeck] = useState([]);
  const [specialDeck, setSpecialDeck] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [currentPage, setCurrentPage] = useState('home');

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
    const deck = isSpecial ? specialDeck : normalDeck;
    const filtered = quotesData.filter(q => q.special === isSpecial);

    const currentDeck = deck.length > 0 ? deck : shuffleArray(filtered);
    const nextQuote = currentDeck[0];
    const remaining = currentDeck.slice(1);

    if (isSpecial) {
      setSpecialDeck(remaining);
    } else {
      setNormalDeck(remaining);
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
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error.message);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImage = async () => {
    if (!newImage || !imageName.trim()) return;
    setIsUploading(true);

    try {
      // Convert base64 to blob
      const res = await fetch(newImage);
      const blob = await res.blob();

      const fileExt = blob.type.split('/')[1] || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);

      const timestamp = new Date().toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Save to database
      const newImgRecord = {
        name: imageName,
        url: publicUrl,
        timestamp: timestamp
      };

      const { data: dbData, error: dbError } = await supabase
        .from('images')
        .insert([newImgRecord])
        .select()
        .single();

      if (dbError) throw dbError;

      setImages([dbData, ...images]);
      setNewImage(null);
      setImageName("");
      setShowUpload(false);
      triggerConfetti();

    } catch (error) {
      console.error("Error uploading image:", error.message);
      alert("เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ โปรดลองอีกครั้ง");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (id, url) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้?")) return;

    try {
      // Extract filename from URL
      const fileName = url.split('/').pop();

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('images')
        .delete()
        .match({ id });

      if (dbError) throw dbError;

      setImages(images.filter(img => img.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error.message);
      alert("เกิดข้อผิดพลาดในการลบรูปภาพ โปรดลองอีกครั้ง");
    }
  };


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
        {currentPage === 'home' && isVisible && !showUpload && (
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

            <button
              className="btn-upload-toggle"
              onClick={() => setShowUpload(true)}
            >
              <Camera size={18} /> อัพโหลดความน่ารัก
            </button>

            <button
              className="btn-gallery"
              onClick={() => setCurrentPage('gallery')}
            >
              ดู Gallery 🖼️
            </button>

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
          {/* Decorative Blobs for Gallery Background */}
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
                    >
                      <img src={img.url} alt={img.name} className="gallery-img" />
                      <div className="gallery-info">
                        <p className="img-name"><User size={12} /> {img.name}</p>
                        <p className="img-time"><Clock size={12} /> {img.timestamp}</p>
                        <button className="btn-delete" onClick={() => deleteImage(img.id, img.url)}>
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


      <footer className="app-footer">
        WITH LOVE • MADE BY TIM1Zk • 2026
      </footer>
    </div>
  );
}

export default App;
