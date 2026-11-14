const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve public monument images if accessed directly
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")));

// Import or define monuments data
const monuments = [
  {
    id: "m-taj-mahal",
    slug: "taj-mahal",
    name: "Taj Mahal",
    vernacularName: "ताज महल",
    region: "Northern India",
    state: "Uttar Pradesh",
    district: "Agra",
    coordinates: { lat: 27.1751, lng: 78.0421 },
    category: "Palaces & Mansions",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1632 - 1653 CE",
    builder: "Emperor Shah Jahan",
    coverImage: "/images/monuments/taj-mahal.jpg",
    featured: true
  },
  {
    id: "m-qutub-minar",
    slug: "qutub-minar",
    name: "Qutub Minar Complex",
    vernacularName: "क़ुतुब मीनार",
    region: "Northern India",
    state: "Delhi",
    district: "South Delhi",
    coordinates: { lat: 28.5244, lng: 77.1855 },
    category: "Forts & Citadels",
    period: "Medieval & Sultanate (12th - 16th Century)",
    yearBuilt: "1199 - 1220 CE",
    builder: "Qutb-ud-din Aibak",
    coverImage: "/images/monuments/qutub-minar.jpg",
    featured: true
  },
  {
    id: "m-red-fort",
    slug: "red-fort",
    name: "Red Fort (Lal Qila)",
    vernacularName: "लाल क़िला",
    region: "Northern India",
    state: "Delhi",
    district: "Central Delhi",
    coordinates: { lat: 28.6562, lng: 77.2410 },
    category: "Forts & Citadels",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1638 - 1648 CE",
    builder: "Emperor Shah Jahan",
    coverImage: "/images/monuments/red-fort.jpg",
    featured: true
  },
  {
    id: "m-amer-fort",
    slug: "amer-fort",
    name: "Amer Fort & Palace",
    vernacularName: "आमेर क़िला",
    region: "Western India",
    state: "Rajasthan",
    district: "Jaipur",
    coordinates: { lat: 26.9855, lng: 75.8513 },
    category: "Forts & Citadels",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1592 - 1620 CE",
    builder: "Raja Man Singh I",
    coverImage: "/images/monuments/amer-fort.jpg",
    featured: true
  },
  {
    id: "m-hawa-mahal",
    slug: "hawa-mahal",
    name: "Hawa Mahal",
    vernacularName: "हवा महल",
    region: "Western India",
    state: "Rajasthan",
    district: "Jaipur",
    coordinates: { lat: 26.9239, lng: 75.8267 },
    category: "Palaces & Mansions",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1799 CE",
    builder: "Maharaja Sawai Pratap Singh",
    coverImage: "/images/monuments/hawa-mahal.jpg",
    featured: false
  },
  {
    id: "m-konark-sun-temple",
    slug: "konark-sun-temple",
    name: "Sun Temple Konark",
    vernacularName: "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର",
    region: "Eastern India",
    state: "Odisha",
    district: "Puri",
    coordinates: { lat: 19.8876, lng: 86.0945 },
    category: "Sacred Temples & Shrines",
    period: "Medieval & Sultanate (12th - 16th Century)",
    yearBuilt: "1250 CE",
    builder: "King Narasimhadeva I",
    coverImage: "/images/monuments/konark-sun-temple.jpg",
    featured: true
  },
  {
    id: "m-victoria-memorial",
    slug: "victoria-memorial",
    name: "Victoria Memorial",
    vernacularName: "ভিক্টোরিয়া মেমোরিয়াল",
    region: "Eastern India",
    state: "West Bengal",
    district: "Kolkata",
    coordinates: { lat: 22.5448, lng: 88.3426 },
    category: "Museums & Archives",
    period: "Colonial & Modern Era (18th - 20th Century)",
    yearBuilt: "1906 - 1921 CE",
    builder: "Sir William Emerson",
    coverImage: "/images/monuments/victoria-memorial.jpg",
    featured: false
  },
  {
    id: "m-hampi-virupaksha",
    slug: "hampi-virupaksha",
    name: "Group of Monuments at Hampi",
    vernacularName: "ಹಂಪಿಯ ಸ್ಮಾರಕಗಳ ಗುಂಪು",
    region: "Southern India",
    state: "Karnataka",
    district: "Vijayanagara",
    coordinates: { lat: 15.3350, lng: 76.4600 },
    category: "Sacred Temples & Shrines",
    period: "Medieval & Sultanate (12th - 16th Century)",
    yearBuilt: "1336 - 1565 CE",
    builder: "Vijayanagara Rulers",
    coverImage: "/images/monuments/hampi-virupaksha.jpg",
    featured: true
  },
  {
    id: "m-brihadisvara-temple",
    slug: "brihadisvara-temple",
    name: "Brihadisvara Temple",
    vernacularName: "பெருவுடையார் கோயில்",
    region: "Southern India",
    state: "Tamil Nadu",
    district: "Thanjavur",
    coordinates: { lat: 10.7828, lng: 79.1318 },
    category: "Sacred Temples & Shrines",
    period: "Classical & Early Medieval (6th - 12th Century)",
    yearBuilt: "1003 - 1010 CE",
    builder: "Emperor Rajaraja Chola I",
    coverImage: "/images/monuments/brihadisvara-temple.jpg",
    featured: false
  },
  {
    id: "m-meenakshi-temple",
    slug: "meenakshi-temple",
    name: "Meenakshi Amman Temple",
    vernacularName: "மீனாட்சி அம்மன் கோயில்",
    region: "Southern India",
    state: "Tamil Nadu",
    district: "Madurai",
    coordinates: { lat: 9.9195, lng: 78.1193 },
    category: "Sacred Temples & Shrines",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1623 - 1655 CE",
    builder: "Thirumalai Nayak",
    coverImage: "/images/monuments/meenakshi-temple.jpg",
    featured: false
  },
  {
    id: "m-khajuraho",
    slug: "khajuraho",
    name: "Khajuraho Group of Monuments",
    vernacularName: "खजुराहो स्मारक समूह",
    region: "Central India",
    state: "Madhya Pradesh",
    district: "Chhatarpur",
    coordinates: { lat: 24.8318, lng: 79.9199 },
    category: "Sacred Temples & Shrines",
    period: "Classical & Early Medieval (6th - 12th Century)",
    yearBuilt: "950 - 1050 CE",
    builder: "Chandela Dynasty",
    coverImage: "/images/monuments/khajuraho.jpg",
    featured: true
  },
  {
    id: "m-sanchi-stupa",
    slug: "sanchi-stupa",
    name: "Great Stupa at Sanchi",
    vernacularName: "सांची का महान स्तूप",
    region: "Central India",
    state: "Madhya Pradesh",
    district: "Raisen",
    coordinates: { lat: 23.4793, lng: 77.7397 },
    category: "Rock-Cut Caves & Temples",
    period: "Ancient (Prior to 6th Century CE)",
    yearBuilt: "c. 260 BCE",
    builder: "Emperor Ashoka",
    coverImage: "/images/monuments/sanchi-stupa.jpg",
    featured: false
  },
  {
    id: "m-charminar",
    slug: "charminar",
    name: "Charminar",
    vernacularName: "चारमीनार / چارمینار",
    region: "Southern India",
    state: "Telangana",
    district: "Hyderabad",
    coordinates: { lat: 17.3616, lng: 78.4747 },
    category: "Colonial & Civic Heritage",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1591 CE",
    builder: "Muhammad Quli Qutb Shah",
    coverImage: "/images/monuments/charminar.jpg",
    featured: false
  },
  {
    id: "m-ellora-caves",
    slug: "ellora-caves",
    name: "Kailasa Temple at Ellora Caves",
    vernacularName: "वेरूळ लेणी (कैलास मंदिर)",
    region: "Western India",
    state: "Maharashtra",
    district: "Chhatrapati Sambhajinagar",
    coordinates: { lat: 20.0268, lng: 75.1780 },
    category: "Rock-Cut Caves & Temples",
    period: "Classical & Early Medieval (6th - 12th Century)",
    yearBuilt: "c. 756 - 773 CE",
    builder: "Rashtrakuta King Krishna I",
    coverImage: "/images/monuments/ellora-caves.jpg",
    featured: true
  },
  {
    id: "m-gateway-of-india",
    slug: "gateway-of-india",
    name: "Gateway of India",
    vernacularName: "गेटवे ऑफ इंडिया",
    region: "Western India",
    state: "Maharashtra",
    district: "Mumbai City",
    coordinates: { lat: 18.9220, lng: 72.8347 },
    category: "Colonial & Civic Heritage",
    period: "Colonial & Modern Era (18th - 20th Century)",
    yearBuilt: "1911 - 1924 CE",
    builder: "George Wittet",
    coverImage: "/images/monuments/gateway-of-india.jpg",
    featured: false
  },
  {
    id: "m-shaniwar-wada",
    slug: "shaniwar-wada",
    name: "Shaniwar Wada",
    vernacularName: "शनिवार वाडा",
    region: "Western India",
    state: "Maharashtra",
    district: "Pune",
    coordinates: { lat: 18.5196, lng: 73.8553 },
    category: "Palaces & Mansions",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1732 CE",
    builder: "Peshwa Baji Rao I",
    coverImage: "/images/monuments/shaniwar-wada.jpg",
    featured: true
  },
  {
    id: "m-aga-khan-palace",
    slug: "aga-khan-palace",
    name: "Aga Khan Palace",
    vernacularName: "आगा खान पॅलेस",
    region: "Western India",
    state: "Maharashtra",
    district: "Pune",
    coordinates: { lat: 18.5524, lng: 73.9016 },
    category: "Palaces & Mansions",
    period: "Colonial & Modern Era (18th - 20th Century)",
    yearBuilt: "1892 CE",
    builder: "Sultan Muhammed Shah Aga Khan III",
    coverImage: "/images/monuments/aga-khan-palace.jpg",
    featured: false
  }
];

// In-memory submissions & reports
const submissions = [];
const reports = [];

// GET /api/monuments
app.get("/api/monuments", (req, res) => {
  const { region, state, category, q } = req.query;
  let result = [...monuments];

  if (region && region !== "All") {
    result = result.filter(m => m.region === region);
  }
  if (state && state !== "All") {
    result = result.filter(m => m.state.toLowerCase() === state.toLowerCase());
  }
  if (category && category !== "All") {
    result = result.filter(m => m.category === category);
  }
  if (q) {
    const term = q.toLowerCase();
    result = result.filter(m => 
      m.name.toLowerCase().includes(term) ||
      m.state.toLowerCase().includes(term) ||
      m.district.toLowerCase().includes(term)
    );
  }

  res.json({ total: result.length, data: result });
});

// GET /api/monuments/:slug
app.get("/api/monuments/:slug", (req, res) => {
  const monument = monuments.find(m => m.slug === req.params.slug);
  if (!monument) {
    return res.status(404).json({ error: "Monument not found" });
  }
  res.json({ data: monument });
});

// GET /api/stats
app.get("/api/stats", (req, res) => {
  const states = Array.from(new Set(monuments.map(m => m.state)));
  const regions = Array.from(new Set(monuments.map(m => m.region)));
  res.json({
    totalMonuments: monuments.length,
    statesCount: states.length,
    regionsCount: regions.length,
    statesList: states,
    regionsList: regions
  });
});

// POST /api/submissions
app.post("/api/submissions", (req, res) => {
  const sub = { id: "sub-" + Date.now(), ...req.body, createdAt: new Date().toISOString() };
  submissions.push(sub);
  res.status(201).json({ success: true, data: sub });
});

// POST /api/reports
app.post("/api/reports", (req, res) => {
  const rep = { id: "rep-" + Date.now(), ...req.body, createdAt: new Date().toISOString() };
  reports.push(rep);
  res.status(201).json({ success: true, data: rep });
});

app.listen(PORT, () => {
  console.log(`HeritageVerse Express Backend running on port ${PORT}`);
});
