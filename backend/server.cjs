const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Load images from JSON
const getImages = () => {
  if (fs.existsSync('images.json')) {
    return JSON.parse(fs.readFileSync('images.json'));
  }
  return [];
};

// Save images to JSON
const saveImages = (images) => {
  fs.writeFileSync('images.json', JSON.stringify(images, null, 2));
};

// Routes
app.get('/images', (req, res) => {
  res.json(getImages());
});

app.post('/upload', upload.single('image'), (req, res) => {
  const { name } = req.body;
  const image = {
    id: Date.now().toString(),
    url: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    name,
    timestamp: new Date().toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  const images = getImages();
  images.unshift(image);
  saveImages(images);
  res.json(image);
});

app.delete('/images/:id', (req, res) => {
  const { id } = req.params;
  const images = getImages();
  const image = images.find(img => img.id === id);
  if (image) {
    // Delete file
    const filePath = path.join(__dirname, 'uploads', path.basename(image.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    const newImages = images.filter(img => img.id !== id);
    saveImages(newImages);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});