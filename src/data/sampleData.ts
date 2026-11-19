import { Monument, CommunitySubmission, ConservationReport } from "@/types/heritage";

export const SAMPLE_MONUMENTS: Monument[] = [
  {
    id: "m-taj-mahal",
    slug: "taj-mahal",
    name: "Taj Mahal",
    vernacularName: "ताज महल",
    shortDescription: "An immense white marble mausoleum commissioned in 1632 by Mughal Emperor Shah Jahan, universally admired as the jewel of Muslim art in India.",
    historicalBackground: "Commissioned in 1632 by the fifth Mughal Emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal. Built on the southern bank of the Yamuna River in Agra over twenty years, the complex encompasses 42 acres including an ornamental charbagh (four-fold) garden, a mosque, and a guest house. It was designated a UNESCO World Heritage Site in 1983.",
    architecturalStyle: "Mughal architecture synthesized with Persian, Islamic, and Ottoman architectural forms, renowned for its symmetrical ivory-white Makrana marble, fluted dome, and pietra dura gemstone inlays.",
    culturalSignificance: "The definitive symbol of India's classical architectural legacy, romantic devotion, and Islamic geometry, receiving worldwide academic and cultural study.",
    conservationStatus: "Requires Monitoring",
    sdgRelevance: "SDG 11.4 — Protection against atmospheric sulphur dioxide pollution from neighboring industrial belts (Taj Trapezium Zone monitoring) and soil subsidence along the dry Yamuna riverbed.",
    location: "Dharmapuri, Forest Colony, Tajganj, Agra",
    district: "Agra",
    state: "Uttar Pradesh",
    region: "Northern India",
    coordinates: {
      lat: 27.1751,
      lng: 78.0421,
    },
    category: "Palaces & Mansions",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1632 - 1653 CE",
    builder: "Emperor Shah Jahan (Chief Architect: Ustad Ahmad Lahori)",
    visitorInformation: {
      timings: "06:00 AM – 06:30 PM (Closed on Fridays)",
      entryFee: "₹50 (Indian Citizens), ₹1100 (Foreign Nationals), Additional ₹200 for Main Mausoleum",
      bestTimeToVisit: "October to March (Crisp morning mist and low humidity)",
      nearestTransit: "Agra Fort Railway Station (3 km), Agra Cantt (5.5 km), Kheria Airport (12 km)",
      verified: true,
    },
    featured: true,
    coverImage: "/images/monuments/taj-mahal.jpg",
    images: [
      {
        id: "img-tm-1",
        url: "/images/monuments/taj-mahal.jpg",
        caption: "Main white marble dome reflecting across the central Yamuna charbagh reflecting pool.",
        attribution: "Wikimedia Commons (David Castor / Open Archive)",
        license: "Public Domain"
      }
    ],
    tourScenes: [
      {
        id: "scene-taj-charbagh",
        name: "Central Charbagh & Reflecting Pool",
        sceneType: "equirectangular_360",
        panoramaUrl: "/images/panoramas/taj-mahal-360.jpg",
        standardPhotoUrl: "/images/monuments/taj-mahal.jpg",
        thumbnailUrl: "/images/monuments/taj-mahal.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "The classical Persian Paradise garden quadripartite layout dividing the grounds into four quadrants by water channels representing the four rivers of Paradise.",
        sourceMetadata: {
                  "author": "Arul Prakasam T",
                  "license": "CC BY-SA 4.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Taj_Mahal_360%C2%B0_View.jpg",
                  "originalDimensions": {
                            "width": 2048,
                            "height": 1024
                  },
                  "verificationStatus": "verified_genuine_360"
        },
        hotspots: [
                  {
                            "id": "tm-hs-1",
                            "title": "Lotus Dome Apex & Finial",
                            "description": "Gilded bronze finial combining traditional Persian spearheads with the indigenous Hindu trident motif.",
                            "yaw": 0,
                            "pitch": 28,
                            "x": 50,
                            "y": 22,
                            "type": "info"
                  },
                  {
                            "id": "tm-hs-2",
                            "title": "Pietra Dura Floral Parchin Kari",
                            "description": "Precious jade, jasper, and carnelian inlaid into white Makrana marble plinths.",
                            "yaw": -25,
                            "pitch": 2,
                            "x": 42,
                            "y": 64,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "available",
      format: "glb",
      surveyMethod: "High-Fidelity Architectural 3D Reconstruction & ASI Survey CAD",
      attribution: "HeritageVerse Digital Architecture Lab & UNESCO World Heritage Documentation"
    },
    sources: [
      {
        title: "The Complete Taj Mahal and the Riverfront Gardens of Agra",
        publisher: "Archaeological Survey of India & Thames & Hudson",
        url: "https://asi.nic.in"
      }
    ]
  },
  {
    id: "m-qutub-minar",
    slug: "qutub-minar",
    name: "Qutub Minar Complex",
    vernacularName: "क़ुतुब मीनार",
    shortDescription: "A 72.5-meter fluted red sandstone minaret established in 1199 CE, representing the dawn of Indo-Islamic Delhi Sultanate architecture.",
    historicalBackground: "Founded by Qutb-ud-din Aibak in 1199 CE to celebrate Muslim suzerainty in Delhi, and further elevated by his successor Shams-ud-din Iltutmish and later Firoz Shah Tughlaq. The complex also contains the 4th-century Gupta-era rust-resistant Iron Pillar of Chandragupta II and the Quwwat-ul-Islam Mosque.",
    architecturalStyle: "Indo-Islamic architectural style with projecting stone balconies supported by stalactite corbels and inscribed with ornate Kufic calligraphy.",
    culturalSignificance: "Illustrates the linguistic, metallurgical, and structural fusion between medieval Islamic masonry and indigenous artisan stone carving traditions.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Monitoring vertical tilt and masonry stress from metro tunnel vibrations and high regional urban density in South Delhi.",
    location: "Seth Sarai, Mehrauli, New Delhi",
    district: "South Delhi",
    state: "Delhi",
    region: "Northern India",
    coordinates: {
      lat: 28.5244,
      lng: 77.1855,
    },
    category: "Forts & Citadels",
    period: "Medieval & Sultanate (12th - 16th Century)",
    yearBuilt: "1199 - 1220 CE",
    builder: "Qutb-ud-din Aibak & Shams-ud-din Iltutmish",
    visitorInformation: {
      timings: "07:00 AM – 08:00 PM (Daily)",
      entryFee: "₹35 (Indian Citizens), ₹550 (Foreign Nationals)",
      bestTimeToVisit: "November to February; illuminated after dusk",
      nearestTransit: "Qutub Minar Metro Station (Yellow Line, 1.2 km)",
      verified: true,
    },
    featured: true,
    coverImage: "/images/monuments/qutub-minar.jpg",
    images: [
      {
        id: "img-qm-1",
        url: "/images/monuments/qutub-minar.jpg",
        caption: "Five-storey fluted red sandstone and white marble shaft towering over Mehrauli.",
        attribution: "Wikimedia Commons (User: Joydeep)",
        license: "CC-BY-SA 4.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-qutub-courtyard",
        name: "Quwwat-ul-Islam Mosque Courtyard",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/qutub-minar.jpg",
        thumbnailUrl: "/images/monuments/qutub-minar.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "Courtyard colonnades assembled from carved stone pillars showing both Islamic geometric arches and indigenous Indian decorative motifs.",
        sourceMetadata: {
                  "author": "A.Savin (Wikimedia Commons)",
                  "license": "Free Art License / CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Qutub_Minar_in_New_Delhi_03-2016_img3.jpg",
                  "originalDimensions": {
                            "width": 2755,
                            "height": 3673
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "qm-hs-1",
                            "title": "Fluted Sandstone Balconies",
                            "description": "Cantilevered balconies supported by stalactite corbeling with intricate naskh Arabic inscriptions.",
                            "yaw": 0,
                            "pitch": 20,
                            "x": 60,
                            "y": 40,
                            "type": "info"
                  },
                  {
                            "id": "qm-hs-2",
                            "title": "Quwwat-ul-Islam Archways",
                            "description": "Screen of corbelled red sandstone arches constructed under Qutb-ud-din Aibak in 1192 CE.",
                            "yaw": -30,
                            "pitch": -10,
                            "x": 30,
                            "y": 70,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      url: "/models/monuments/qutub-minar/exterior/qutub-minar-exterior.glb",
      status: "available",
      format: "glb",
      polyCount: "51,200 Triangles (High-Detail PBR)",
      surveyMethod: "Archaeological Survey of India (ASI) Measured CAD & Photogrammetry",
      attribution: "ASI Delhi Circle & HeritageVerse Digital Architecture Lab"
    },
    sources: [
      {
        title: "Qutb Complex Monuments and Conservation Dossier",
        publisher: "Archaeological Survey of India Delhi Circle",
        url: "https://asidelhicircle.bih.nic.in"
      }
    ]
  },
  {
    id: "m-red-fort",
    slug: "red-fort",
    name: "Red Fort (Lal Qila)",
    vernacularName: "लाल क़िला",
    shortDescription: "The monumental red sandstone palace fortress of the Mughal dynasty in Old Delhi, political center of Shahjahanabad.",
    historicalBackground: "Constructed by Emperor Shah Jahan between 1638 and 1648 when he decided to shift his imperial capital from Agra to Delhi (Shahjahanabad). The fort served as the formal residence of the Mughal emperors until 1857. It was here on August 15, 1947, that Prime Minister Jawaharlal Nehru hoisted India's first national flag, establishing an enduring civic ritual.",
    architecturalStyle: "High Mughal style incorporating Persian court design, marble pavilions (Diwan-i-Aam, Diwan-i-Khas), octagonal planning, and massive sandstone ramparts.",
    culturalSignificance: "The definitive symbol of Indian sovereignty and modern democratic celebrations, embodying four centuries of political transitions.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Protection of red sandstone against vehicular emissions and moisture decay from surrounding Chandni Chowk commercial hub.",
    location: "Netaji Subhash Marg, Lal Qila, Chandni Chowk, Old Delhi",
    district: "Central Delhi",
    state: "Delhi",
    region: "Northern India",
    coordinates: {
      lat: 28.6562,
      lng: 77.2410,
    },
    category: "Forts & Citadels",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1638 - 1648 CE",
    builder: "Emperor Shah Jahan (Architect: Ustad Ahmad Lahori)",
    visitorInformation: {
      timings: "09:30 AM – 04:30 PM (Closed on Mondays)",
      entryFee: "₹35 (Indian Citizens), ₹500 (Foreign Nationals)",
      bestTimeToVisit: "October to March; sound and light show in evening",
      nearestTransit: "Lal Qila Metro Station (Violet Line, 200m), Chandni Chowk Metro (1 km)",
      verified: true,
    },
    featured: true,
    coverImage: "/images/monuments/red-fort.jpg",
    images: [
      {
        id: "img-rf-1",
        url: "/images/monuments/red-fort.jpg",
        caption: "Lahori Gate monumental gateway with octagonal bastions and chhatri domes.",
        attribution: "Wikimedia Commons (Dennis Jarvis)",
        license: "CC-BY-SA 2.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-diwan-i-khas",
        name: "Diwan-i-Khas (Hall of Private Audiences)",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/red-fort.jpg",
        thumbnailUrl: "/images/monuments/red-fort.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "White marble pavilion where the Peacock Throne originally rested, inscribed with the famous Persian couplet: ",
        sourceMetadata: {
                  "author": "Anurag Agnihotri (Wikimedia Commons)",
                  "license": "CC BY 2.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Red_Fort,_Delhi.jpg",
                  "originalDimensions": {
                            "width": 4242,
                            "height": 1949
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "rf-hs-1",
                            "title": "Lahori Gate Chhatris",
                            "description": "Octagonal twin bastions crowned with white marble chhatris framing the ceremonial western gate.",
                            "yaw": 0,
                            "pitch": 15,
                            "x": 50,
                            "y": 35,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "The Red Fort: Monograph of Delhi's Imperial Seat",
        publisher: "Archaeological Survey of India",
        url: "https://asi.nic.in"
      }
    ]
  },
  {
    id: "m-amer-fort",
    slug: "amer-fort",
    name: "Amer Fort & Palace",
    vernacularName: "आमेर क़िला",
    shortDescription: "A magnificent Rajput hilltop fortress and palace complex constructed in yellow and pink sandstone overlooking Maota Lake.",
    historicalBackground: "Principal stronghold of the Kachwaha Rajputs, established in 1592 by Raja Man Singh I and expanded by Mirza Raja Jai Singh and Sawai Jai Singh II. Overlooking Maota Lake, the fortress served as the royal seat until the founding of the planned city of Jaipur in 1727. Designated a UNESCO World Heritage Site in 2013 under Hill Forts of Rajasthan.",
    architecturalStyle: "Rajput-Mughal architectural synthesis featuring pale yellow and pink sandstone, marble Sheesh Mahal (mirror palace), carved marble latticework, and defensive bastions.",
    culturalSignificance: "Pinnacle of medieval Rajasthani courtly lifestyle, defensive mountain water management, and decorative mural artwork.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Protection of delicate concave mirror glass in Sheesh Mahal against moisture and footfall abrasion.",
    location: "Devisinghpura, Amer, Jaipur",
    district: "Jaipur",
    state: "Rajasthan",
    region: "Western India",
    coordinates: {
      lat: 26.9855,
      lng: 75.8513,
    },
    category: "Forts & Citadels",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1592 - 1620 CE",
    builder: "Raja Man Singh I",
    visitorInformation: {
      timings: "08:00 AM – 05:30 PM, Evening: 06:30 PM – 09:15 PM",
      entryFee: "₹100 (Indian Citizens), ₹500 (Foreign Nationals)",
      bestTimeToVisit: "October to March (Comfortable daytime temperatures for climbing)",
      nearestTransit: "Jaipur Junction (12 km), Jaipur International Airport (21 km)",
      verified: true,
    },
    featured: true,
    coverImage: "/images/monuments/amer-fort.jpg",
    images: [
      {
        id: "img-af-1",
        url: "/images/monuments/amer-fort.jpg",
        caption: "Hilltop battlements and terraces overlooking Maota Lake and Kesar Kyari gardens.",
        attribution: "Wikimedia Commons (Flickr / Amber Fort)",
        license: "CC-BY 2.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-sheesh-mahal",
        name: "Sheesh Mahal (Hall of Mirrors)",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/amer-fort.jpg",
        thumbnailUrl: "/images/monuments/amer-fort.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "Chamber adorned with thousands of imported Belgian concave mirror inlays that reflect a single candle beam into a starscape across the ceiling.",
        sourceMetadata: {
                  "author": "Fivespot (Wikimedia Commons)",
                  "license": "CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Amber_Fort_wide_angle_panorama_from_the_road.jpg",
                  "originalDimensions": {
                            "width": 6605,
                            "height": 3505
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "af-hs-1",
                            "title": "Sheesh Mahal Pavilion",
                            "description": "Hall of Mirrors with imported Belgian convex glass mosaics reflecting single candleflames into thousands of stars.",
                            "yaw": 0,
                            "pitch": 10,
                            "x": 55,
                            "y": 45,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Hill Forts of Rajasthan UNESCO Nomination Dossier",
        publisher: "Government of Rajasthan Department of Archaeology and Museums",
        url: "https://artandculture.rajasthan.gov.in"
      }
    ]
  },
  {
    id: "m-hawa-mahal",
    slug: "hawa-mahal",
    name: "Hawa Mahal (Palace of Winds)",
    vernacularName: "हवा महल",
    shortDescription: "An iconic five-storey pyramidal facade with 953 carved sandstone jharokha casements, engineered for gentle breeze circulation.",
    historicalBackground: "Built in 1799 by Maharaja Sawai Pratap Singh, grandson of the founder of Jaipur. The structure was conceived as an extension of the City Palace so that royal women observed daily street life and royal processions along Badi Choupad without violating purdah modesty. Its honeycomb facade is angled so that crosswinds flow through small vents.",
    architecturalStyle: "Rajput architecture inspired by the crown of Lord Krishna, constructed in pink and red sandstone with delicate fluted domes and miniature fluted columns.",
    culturalSignificance: "The visual signature of Jaipur (The Pink City), demonstrating sophisticated indigenous passive cooling architecture without mechanical systems.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Monitoring micro-vibrations from surrounding high-density street traffic and conserving red sandstone facade plaster.",
    location: "Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Jaipur",
    district: "Jaipur",
    state: "Rajasthan",
    region: "Western India",
    coordinates: {
      lat: 26.9239,
      lng: 75.8267,
    },
    category: "Palaces & Mansions",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1799 CE",
    builder: "Maharaja Sawai Pratap Singh (Architect: Lal Chand Ustad)",
    visitorInformation: {
      timings: "09:00 AM – 05:00 PM (Daily)",
      entryFee: "₹50 (Indian Citizens), ₹200 (Foreign Nationals)",
      bestTimeToVisit: "Early morning when golden sunrise illuminates the eastern facade",
      nearestTransit: "Badi Chaupar Metro Station (200m), Jaipur Junction (5 km)",
      verified: true,
    },
    featured: false,
    coverImage: "/images/monuments/hawa-mahal.jpg",
    images: [
      {
        id: "img-hm-1",
        url: "/images/monuments/hawa-mahal.jpg",
        caption: "Pyramidal pink sandstone facade with 953 carved jharokha windows.",
        attribution: "Wikimedia Commons (Flickr User: Vandelizer)",
        license: "CC-BY 2.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-hawa-top",
        name: "Hawa Mandir Upper Terrace",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/hawa-mahal.jpg",
        thumbnailUrl: "/images/monuments/hawa-mahal.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "Fifth floor terrace overlooking the City Palace and Jantar Mantar observatory, capturing constant westerly mountain breezes.",
        sourceMetadata: {
                  "author": "Vikas Choudhary (Wikimedia Commons)",
                  "license": "CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hawa_Mahal_2011.jpg",
                  "originalDimensions": {
                            "width": 3756,
                            "height": 3236
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "hm-hs-1",
                            "title": "953 Jharokha Windows",
                            "description": "Latticework casements engineered with the Venturi effect to circulate cool air throughout royal quarters.",
                            "yaw": 0,
                            "pitch": 15,
                            "x": 50,
                            "y": 50,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Jaipur: The Built Heritage of a Historic City",
        publisher: "INTACH Rajasthan Chapter",
        url: "https://intach.org"
      }
    ]
  },
  {
    id: "m-konark-sun-temple",
    slug: "konark-sun-temple",
    name: "Sun Temple Konark",
    vernacularName: "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର",
    shortDescription: "A monumental 13th-century stone chariot dedicated to the Sun God Surya, featuring 24 intricately sculpted stone wheels.",
    historicalBackground: "Conceived as a colossal celestial chariot with twelve pairs of wheels pulled by seven galloping horses, commissioned in 1250 CE by King Narasimhadeva I of the Eastern Ganga Dynasty. Built of Khondalite and chlorite stone near the mouth of the Chandrabhaga River, the temple orientation was engineered so that dawn sunlight aligned directly through the sanctum portal.",
    architecturalStyle: "Kalinga architectural style at its peak, marked by monumental stone sculpting, erotic mithuna sculptures, musicians, and complex astronomical wheels.",
    culturalSignificance: "A UNESCO World Heritage landmark (1984) and masterwork of medieval Indian astronomical engineering and artistic sculpture.",
    conservationStatus: "Under Restoration",
    sdgRelevance: "SDG 11.4 — Safeguarding against maritime salt spray corrosion from the Bay of Bengal and internal structural sand filling stabilization by ASI.",
    location: "Konark, Puri District",
    district: "Puri",
    state: "Odisha",
    region: "Eastern India",
    coordinates: {
      lat: 19.8876,
      lng: 86.0945,
    },
    category: "Sacred Temples & Shrines",
    period: "Medieval & Sultanate (12th - 16th Century)",
    yearBuilt: "1250 CE",
    builder: "King Narasimhadeva I (Eastern Ganga Dynasty)",
    visitorInformation: {
      timings: "06:00 AM – 08:00 PM (Daily)",
      entryFee: "₹40 (Indian Citizens), ₹600 (Foreign Nationals)",
      bestTimeToVisit: "November to February; annual Konark Dance Festival in December",
      nearestTransit: "Puri Railway Station (35 km), Biju Patnaik International Airport Bhubaneswar (65 km)",
      verified: true,
    },
    featured: true,
    coverImage: "/images/monuments/konark-sun-temple.jpg",
    images: [
      {
        id: "img-kst-1",
        url: "/images/monuments/konark-sun-temple.jpg",
        caption: "Carved stone chariot wheel of Surya acting as an accurate sundial.",
        attribution: "Wikimedia Commons (User: G-u-t)",
        license: "CC-BY-SA 4.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-jagamohan-plinth",
        name: "Jagamohan Southern Chariot Wheel Plinth",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/konark-sun-temple.jpg",
        thumbnailUrl: "/images/monuments/konark-sun-temple.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "The 24 wheels symbolize the 24 fortnights of the solar year, with eight spokes representing the eight praharas (three-hour divisions) of the day.",
        sourceMetadata: {
                  "author": "G-u-t (Wikimedia Commons)",
                  "license": "CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Konark_Sun_Temple,_Odisha.jpg",
                  "originalDimensions": {
                            "width": 3888,
                            "height": 2592
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "kst-hs-1",
                            "title": "24-Spoked Sun Chariot Wheels",
                            "description": "Architectural sundials carved from chlorite stone capable of calculating precise time to the minute.",
                            "yaw": 0,
                            "pitch": 5,
                            "x": 50,
                            "y": 65,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Konark: The Sun Temple of Orissa",
        publisher: "Archaeological Survey of India Memoir Series",
        url: "https://asi.nic.in"
      }
    ]
  },
  {
    id: "m-victoria-memorial",
    slug: "victoria-memorial",
    name: "Victoria Memorial",
    vernacularName: "ভিক্টোরিয়া মেমোরিয়াল",
    shortDescription: "A grand white Makrana marble monument and national museum in Kolkata, bridging British colonial neoclassical and Mughal civic design.",
    historicalBackground: "Conceived by Lord Curzon, Viceroy of India, following the death of Queen Victoria in 1901, and completed in 1921. Funded entirely by Indian princes and the British government without taxing the public treasury. Today it serves as an autonomous national museum housing over 28,000 artifacts including Mughal miniatures and historic regional manuscripts.",
    architecturalStyle: "Indo-Saracenic revival blended with Neoclassical British Renaissance architecture, constructed entirely from Makrana marble (the same marble quarry as the Taj Mahal).",
    culturalSignificance: "Major cultural repository and civic green lungs in central Kolkata, illustrating the visual evolution of civic institutions in colonial India.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Safeguarding white marble against urban particulate matter and managing visitor capacity across 64 acres of heritage gardens.",
    location: "1, Queens Way, Maidan, Kolkata",
    district: "Kolkata",
    state: "West Bengal",
    region: "Eastern India",
    coordinates: {
      lat: 22.5448,
      lng: 88.3426,
    },
    category: "Museums & Archives",
    period: "Colonial & Modern Era (18th - 20th Century)",
    yearBuilt: "1906 - 1921 CE",
    builder: "Sir William Emerson (Consulting Architect) & Martin & Co. Builders",
    visitorInformation: {
      timings: "Gallery: 10:00 AM – 05:00 PM (Closed Mondays), Gardens: 05:30 AM – 06:00 PM",
      entryFee: "Museum: ₹50 (Indians), ₹500 (Foreigners); Garden: ₹20",
      bestTimeToVisit: "October to March (Pleasant winter afternoon garden walks)",
      nearestTransit: "Rabindra Sadan & Maidan Metro Stations (0.8 km), Howrah Railway Station (6 km)",
      verified: true,
    },
    featured: false,
    coverImage: "/images/monuments/victoria-memorial.jpg",
    images: [
      {
        id: "img-vm-1",
        url: "/images/monuments/victoria-memorial.jpg",
        caption: "White Makrana marble central dome and bronze Angel of Victory finial.",
        attribution: "Wikimedia Commons (User: Deepon)",
        license: "CC-BY-SA 4.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-queens-hall",
        name: "Queens Central Rotunda Hall",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/victoria-memorial.jpg",
        thumbnailUrl: "/images/monuments/victoria-memorial.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "Towering central hall under the 56-meter main dome decorated with historic canvas murals depicting Indian historical scenes.",
        sourceMetadata: {
                  "author": "Avrajyoti Mitra (Wikimedia Commons)",
                  "license": "CC BY-SA 4.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Victoria_Memorial_hall_with_reflection,_Kolkata.jpg",
                  "originalDimensions": {
                            "width": 12725,
                            "height": 5694
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "vm-hs-1",
                            "title": "Central Dome & Angel of Victory",
                            "description": "Indo-Saracenic central dome capped by a 16-foot bronze Angel of Victory rotating on ball bearings.",
                            "yaw": 0,
                            "pitch": 20,
                            "x": 50,
                            "y": 35,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Victoria Memorial Hall: The Heritage Building and Its Conservation",
        publisher: "Board of Trustees, Victoria Memorial Kolkata",
        url: "https://victoriamemorial-cal.org"
      }
    ]
  },
  {
    id: "m-hampi-virupaksha",
    slug: "hampi-virupaksha",
    name: "Group of Monuments at Hampi",
    vernacularName: "ಹಂಪಿಯ ಸ್ಮಾರಕಗಳ ಗುಂಪು",
    shortDescription: "The austere, grandiose capital of the 14th-century Vijayanagara Empire situated amidst dramatic granite boulder hills on the Tungabhadra River.",
    historicalBackground: "The seat of the Vijayanagara Empire from 1336 until its sacking in 1565. At its height, Hampi was one of the wealthiest and largest cosmopolitan cities in the world, visited by Portuguese, Persian, and Italian merchants. Spread over 41 square kilometers, it contains over 1,600 surviving monuments including temples, royal complexes, and hydraulic water conduits.",
    architecturalStyle: "Dravidian architecture in hard granite with pillared mandapas, sculpted yali (mythical beasts), stone chariot shrines, and massive monolithic carvings.",
    culturalSignificance: "UNESCO World Heritage Site (1986) representing the zenith of South Indian medieval urban planning and living temple worship.",
    conservationStatus: "Requires Monitoring",
    sdgRelevance: "SDG 11.4 — Mitigating seasonal Tungabhadra flood erosion, protecting boulder ridges against quarrying, and managing tourist vehicle impact.",
    location: "Hampi, Hosapete Taluk, Vijayanagara District",
    district: "Vijayanagara",
    state: "Karnataka",
    region: "Southern India",
    coordinates: {
      lat: 15.3350,
      lng: 76.4600,
    },
    category: "Sacred Temples & Shrines",
    period: "Medieval & Sultanate (12th - 16th Century)",
    yearBuilt: "1336 - 1565 CE",
    builder: "Harihara I, Bukka Raya I, & Emperor Krishnadevaraya",
    visitorInformation: {
      timings: "06:00 AM – 06:00 PM (Daily)",
      entryFee: "₹40 (Indian Citizens), ₹600 (Foreign Nationals) for Vittala Complex & Zenana Enclosure",
      bestTimeToVisit: "November to February; Hampi Utsav in January/February",
      nearestTransit: "Hosapete Junction Railway Station (13 km), Jindal Vijayanagar Airport (35 km)",
      verified: true,
    },
    featured: true,
    coverImage: "/images/monuments/hampi-virupaksha.jpg",
    images: [
      {
        id: "img-hp-1",
        url: "/images/monuments/hampi-virupaksha.jpg",
        caption: "Virupaksha Temple nine-tiered eastern gopuram overlooking the boulder terrain.",
        attribution: "Wikimedia Commons (User: Arian Zwegers)",
        license: "CC-BY 2.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-vittala-chariot",
        name: "Vittala Temple Stone Chariot Courtyard",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/hampi-virupaksha.jpg",
        thumbnailUrl: "/images/monuments/hampi-virupaksha.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "Shrine dedicated to Garuda carved from individual granite blocks with joints concealed by architectural bands, flanked by iconic stone wheels.",
        sourceMetadata: {
                  "author": "Dey.sandip (Wikimedia Commons)",
                  "license": "CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Virupaksha_temple_Hampi.jpg",
                  "originalDimensions": {
                            "width": 2244,
                            "height": 1225
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "hp-hs-1",
                            "title": "East Gopuram Entrance",
                            "description": "Nine-tiered pyramidal gateway tower towering 50 meters above the Tungabhadra basin.",
                            "yaw": 0,
                            "pitch": 15,
                            "x": 75,
                            "y": 50,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Hampi: Vijayanagara Architectural Survey",
        publisher: "Archaeological Survey of India & Hampi World Heritage Area Management Authority",
        url: "https://hampi.karnataka.gov.in"
      }
    ]
  },
  {
    id: "m-brihadisvara-temple",
    slug: "brihadisvara-temple",
    name: "Brihadisvara Temple (Big Temple)",
    vernacularName: "பெருவுடையார் கோயில்",
    shortDescription: "A monumental 11th-century granite temple built by Chola Emperor Rajaraja I, acclaimed as the pinnacle of Dravidian stone architecture.",
    historicalBackground: "Completed in 1010 CE by Emperor Rajaraja I of the Chola Dynasty to mark his imperial sovereignty. Built entirely of granite in a region with no local granite quarries (transported by rafts along the Cauvery River). Its 66-meter central tower (Vimana) is crowned by an octagonal 81-ton monolithic granite cupola hoisted via a 6-kilometer earthen ramp.",
    architecturalStyle: "Pure Dravidian stone architecture with towering Vimana, monumental Nandi pavilion, and intact 11th-century Chola fresco murals.",
    culturalSignificance: "UNESCO World Heritage Site (1987) under Great Living Chola Temples; an uninterrupted center of spiritual worship and classical Bharatanatyam dance for over 1,000 years.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Protection of delicate 11th-century vegetable-dye murals against interior moisture accumulation and lamp soot.",
    location: "Membalam Rd, Balaganapathy Nagar, Thanjavur",
    district: "Thanjavur",
    state: "Tamil Nadu",
    region: "Southern India",
    coordinates: {
      lat: 10.7828,
      lng: 79.1318,
    },
    category: "Sacred Temples & Shrines",
    period: "Classical & Early Medieval (6th - 12th Century)",
    yearBuilt: "1003 - 1010 CE",
    builder: "Emperor Rajaraja Chola I (Chief Architect: Kunjara Mallan Raja Rama)",
    visitorInformation: {
      timings: "06:00 AM – 12:30 PM, 04:00 PM – 08:30 PM (Daily)",
      entryFee: "Free Entry (Protected National Monument)",
      bestTimeToVisit: "November to February; Maha Shivaratri celebrations",
      nearestTransit: "Thanjavur Junction (1.5 km), Tiruchirappalli International Airport (58 km)",
      verified: true,
    },
    featured: false,
    coverImage: "/images/monuments/brihadisvara-temple.jpg",
    images: [
      {
        id: "img-bt-1",
        url: "/images/monuments/brihadisvara-temple.jpg",
        caption: "Towering 66-meter granite Vimana illuminated against the Thanjavur night sky.",
        attribution: "Wikimedia Commons (User: Jean-Pierre Dalbéra)",
        license: "CC-BY 2.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-nandi-pavilion",
        name: "Monolithic Nandi Mandapa & Outer Courtyard",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/brihadisvara-temple.jpg",
        thumbnailUrl: "/images/monuments/brihadisvara-temple.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "One of the largest monolithic Nandi statues in India, measuring 6 meters long and 3.7 meters high, carved from a single block of black granite.",
        sourceMetadata: {
                  "author": "Nagesh Jayaraman (Wikimedia Commons)",
                  "license": "CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Brihadisvara_Temple_Thanjavur.jpg",
                  "originalDimensions": {
                            "width": 5849,
                            "height": 3655
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "bt-hs-1",
                            "title": "Monolithic Kumbam Capstone",
                            "description": "80-tonne single granite block hoisted to the 66-meter apex along a 6-kilometer inclined ramp.",
                            "yaw": 0,
                            "pitch": 25,
                            "x": 52,
                            "y": 30,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "The Great Chola Temples: Thanjavur, Gangaikondacholapuram, Darasuram",
        publisher: "Archaeological Survey of India Chennai Circle",
        url: "https://asi.nic.in"
      }
    ]
  },
  {
    id: "m-meenakshi-temple",
    slug: "meenakshi-temple",
    name: "Meenakshi Amman Temple",
    vernacularName: "மீனாட்சி அம்மன் கோயில்",
    shortDescription: "A historic 14-gopuram temple complex in Madurai dating back 2,500 years, celebrated for its Hall of Thousand Pillars and towering polychrome sculptures.",
    historicalBackground: "Mentioned in early Tamil Sangam literature (6th century BCE), with the majority of the current colossal structure rebuilt by King Thirumalai Nayak between 1623 and 1655 following medieval sacks. The complex houses two principal sanctums dedicated to Goddess Meenakshi (Parvati) and Sundareswarar (Shiva), covering 14 acres surrounded by massive concentric granite walls.",
    architecturalStyle: "Late Dravidian Nayak architecture celebrated for monumental polychrome gopurams (gateway towers) covered in thousands of stucco mythological deities.",
    culturalSignificance: "The heart of ancient Madurai urban geometry, living Tamil spiritual traditions, and the epicenter of the grand annual Chithirai festival.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Safe biological pest management and scientific re-pigmentation of over 33,000 stucco figures without toxic modern paints.",
    location: "Madurai Main, Madurai",
    district: "Madurai",
    state: "Tamil Nadu",
    region: "Southern India",
    coordinates: {
      lat: 9.9195,
      lng: 78.1193,
    },
    category: "Sacred Temples & Shrines",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "Reconstructed 1623 - 1655 CE (Origins c. 6th Century BCE)",
    builder: "Thirumalai Nayak (Nayak Dynasty)",
    visitorInformation: {
      timings: "05:00 AM – 12:30 PM, 04:00 PM – 10:00 PM (Daily)",
      entryFee: "Free Entry (Temple Museum: ₹50)",
      bestTimeToVisit: "October to March; April/May for Chithirai Festival",
      nearestTransit: "Madurai Junction (1.5 km), Madurai International Airport (12 km)",
      verified: true,
    },
    featured: false,
    coverImage: "/images/monuments/meenakshi-temple.jpg",
    images: [
      {
        id: "img-mt-1",
        url: "/images/monuments/meenakshi-temple.jpg",
        caption: "Polychrome southern gopuram reflecting in the Golden Lotus Sacred Tank.",
        attribution: "Wikimedia Commons (User: Bernard Gagnon)",
        license: "CC-BY-SA 3.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-thousand-pillars",
        name: "Aayiram Kaal Mandapam (Hall of Thousand Pillars)",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/meenakshi-temple.jpg",
        thumbnailUrl: "/images/monuments/meenakshi-temple.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "Built in 1569 by Ariyanatha Mudaliar, containing 985 carved stone pillars arranged along two straight axes portraying dragon-lions, warriors, and dancers.",
        sourceMetadata: {
                  "author": "Bernard Gagnon (Wikimedia Commons)",
                  "license": "CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Madurai_Meenakshi_Amman_temple_South_Tower.jpg",
                  "originalDimensions": {
                            "width": 2112,
                            "height": 2593
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "mt-hs-1",
                            "title": "Polychrome Stucco Sculptures",
                            "description": "Over 1,500 brightly painted mythological figures repainted every 12 years in the traditional Ashtabandhana ritual.",
                            "yaw": 0,
                            "pitch": 10,
                            "x": 50,
                            "y": 45,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Madurai: A City of Temples and Living Traditions",
        publisher: "Tamil Nadu State Archaeology Department",
        url: "https://www.tamilnadutourism.tn.gov.in"
      }
    ]
  },
  {
    id: "m-khajuraho",
    slug: "khajuraho",
    name: "Khajuraho Group of Monuments",
    vernacularName: "खजुराहो स्मारक समूह",
    shortDescription: "A world-renowned cluster of medieval Hindu and Jain nagara temples in Madhya Pradesh, famed for sublime architectural harmony and expressive erotic stone carvings.",
    historicalBackground: "Constructed between 950 and 1050 CE by the Chandela Dynasty rulers in the forested Vindhya plains. Out of 85 original temples, 25 survive today across three geographic groupings. Abandoned following the decline of the Chandelas in the 13th century, the temples were preserved by dense teak forests until documented by British surveyor T.S. Burt in 1838.",
    architecturalStyle: "Peak Nagara architectural style with graded mountain-like shikharas (spires) symbolizing Mount Kailash, built of sandstone fitted with mortise-and-tenon joints without mortar.",
    culturalSignificance: "UNESCO World Heritage Site (1986) presenting an unfiltered depiction of medieval Indian life, philosophy (Dharma, Artha, Kama, Moksha), and spiritual synthesis.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Protection against rainwater seepage between sandstone roof joints and bio-deterioration from algae growth during monsoon.",
    location: "Khajuraho, Chhatarpur District",
    district: "Chhatarpur",
    state: "Madhya Pradesh",
    region: "Central India",
    coordinates: {
      lat: 24.8318,
      lng: 79.9199,
    },
    category: "Sacred Temples & Shrines",
    period: "Classical & Early Medieval (6th - 12th Century)",
    yearBuilt: "950 - 1050 CE",
    builder: "Chandela Dynasty (Kings Yashovarman, Dhanga, & Vidyadhara)",
    visitorInformation: {
      timings: "06:00 AM – 06:00 PM (Western Group), Light & Sound: 06:30 PM (Winter)",
      entryFee: "₹40 (Indian Citizens), ₹600 (Foreign Nationals)",
      bestTimeToVisit: "October to March; annual Khajuraho Dance Festival in February",
      nearestTransit: "Khajuraho Railway Station (5 km), Khajuraho Civil Aerodrome (4 km)",
      verified: true,
    },
    featured: true,
    coverImage: "/images/monuments/khajuraho.jpg",
    images: [
      {
        id: "img-kj-1",
        url: "/images/monuments/khajuraho.jpg",
        caption: "Kandariya Mahadeva temple shikhara rising like a mountain range over the Western lawns.",
        attribution: "Wikimedia Commons (User: Marcin Białek)",
        license: "CC-BY-SA 3.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-kandariya-plinth",
        name: "Kandariya Mahadeva Outer Ambulatory Plinth",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/khajuraho.jpg",
        thumbnailUrl: "/images/monuments/khajuraho.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "The temple rises 31 meters high and displays 872 surviving sculptures depicting musicians, celestial dancers (apsaras), and warrior processions.",
        sourceMetadata: {
                  "author": "Taru23 (Wiki Loves Monuments 2018)",
                  "license": "CC BY-SA 4.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_Kandariya_Mahadeva_Temple,_Khajuraho,_Madhya_Pradesh.jpg",
                  "originalDimensions": {
                            "width": 4872,
                            "height": 3456
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "kj-hs-1",
                            "title": "Nagara Shikhara Tower",
                            "description": "Towering 31-meter sandstone spire composed of 84 miniature replica shikharas symbolizing Mount Kailash.",
                            "yaw": 0,
                            "pitch": 20,
                            "x": 57,
                            "y": 35,
                            "type": "info"
                  },
                  {
                            "id": "kj-hs-2",
                            "title": "Sculpted Ambulatory Friezes",
                            "description": "Over 800 intricately carved sandstone sculptures depicting celestial nymphs, deities, and courtly celebrations.",
                            "yaw": -15,
                            "pitch": -5,
                            "x": 52,
                            "y": 72,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Khajuraho: Temple Architecture and Iconography",
        publisher: "Archaeological Survey of India Bhopal Circle",
        url: "https://asi.nic.in"
      }
    ]
  },
  {
    id: "m-sanchi-stupa",
    slug: "sanchi-stupa",
    name: "Great Stupa at Sanchi",
    vernacularName: "सांची का महान स्तूप",
    shortDescription: "The oldest existing stone structure in India, commissioned by Emperor Ashoka in the 3rd century BCE with four celebrated carved torana gateways.",
    historicalBackground: "Commissioned by the Mauryan Emperor Ashoka in the 3rd century BCE to enshrine sacred relics of the Buddha. Later encased in stone and expanded during the Shunga and Satavahana dynasties (2nd - 1st century BCE), when the four monumental carved stone gateways (toranas) facing the four cardinal directions were erected.",
    architecturalStyle: "Ancient Buddhist stone architecture featuring a hemispherical dome (anda), square balustrade (harmika), and three-tiered parasol (chhatra).",
    culturalSignificance: "UNESCO World Heritage Site (1989) preserving the fundamental structural iconography of world Buddhist architecture and Ashokan peace edicts.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Protection of ancient carved sandstone balustrades and Ashokan polish against thermal shock and visitor wear.",
    location: "Sanchi Hill, Raisen District",
    district: "Raisen",
    state: "Madhya Pradesh",
    region: "Central India",
    coordinates: {
      lat: 23.4793,
      lng: 77.7397,
    },
    category: "Rock-Cut Caves & Temples",
    period: "Ancient (Prior to 6th Century CE)",
    yearBuilt: "c. 260 BCE - 1st Century CE",
    builder: "Emperor Ashoka the Great (Expanded by Shunga & Satavahana rulers)",
    visitorInformation: {
      timings: "06:30 AM – 06:30 PM (Daily)",
      entryFee: "₹40 (Indian Citizens), ₹600 (Foreign Nationals)",
      bestTimeToVisit: "November to March; pleasant hill walk with surrounding panoramic valley views",
      nearestTransit: "Sanchi Railway Station (1.5 km), Bhopal Junction (46 km)",
      verified: true,
    },
    featured: false,
    coverImage: "/images/monuments/sanchi-stupa.jpg",
    images: [
      {
        id: "img-ss-1",
        url: "/images/monuments/sanchi-stupa.jpg",
        caption: "Great Stupa No. 1 dome and intricately carved Southern Torana gateway.",
        attribution: "Wikimedia Commons (User: Biswarup Ganguly)",
        license: "CC-BY 3.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-sanchi-north-torana",
        name: "Northern Torana Gateway & Pradakshina Path",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/sanchi-stupa.jpg",
        thumbnailUrl: "/images/monuments/sanchi-stupa.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "The best-preserved torana at Sanchi, carved with Jataka tales, the miracle of Sravasti, and aniconic representations of Buddha (footprints, wheel, Bodhi tree).",
        sourceMetadata: {
                  "author": "Biswarup Ganguly (Wikimedia Commons)",
                  "license": "CC BY 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Great_Stupa_at_Sanchi_01.jpg",
                  "originalDimensions": {
                            "width": 4953,
                            "height": 3302
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "ss-hs-1",
                            "title": "Carved Northern Torana",
                            "description": "Intricately carved sandstone gateway architraves narrating Jataka tales of the Buddha's previous lives.",
                            "yaw": 0,
                            "pitch": 10,
                            "x": 48,
                            "y": 55,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "The Monuments of Sanchi",
        publisher: "Archaeological Survey of India & Government of India",
        url: "https://asi.nic.in"
      }
    ]
  },
  {
    id: "m-charminar",
    slug: "charminar",
    name: "Charminar & Hyderabad Citadel",
    vernacularName: "चारमीनार / چارمینار",
    shortDescription: "A triumphant 1591 CE Indo-Islamic square monument with four 56-meter stucco-adorned minarets, the historical centerpiece of Hyderabad.",
    historicalBackground: "Constructed in 1591 by Muhammad Quli Qutb Shah, the fifth ruler of the Qutb Shahi dynasty, to celebrate the eradication of a devastating plague and mark the founding of Hyderabad city. Centered at the intersection of primary trade routes linking the Golconda diamond mines with port towns on the Coromandel coast.",
    architecturalStyle: "Qutb Shahi Indo-Islamic architecture characterized by high pointed arches, intricate lime stucco plaster moldings, and four multi-tier minarets.",
    culturalSignificance: "The definitive cultural identity marker of the Deccan region, celebrated for communal harmony and vibrant bazaars (Laad Bazaar).",
    conservationStatus: "Requires Monitoring",
    sdgRelevance: "SDG 11.4 — Protection of delicate lime-mortar stucco carvings against high particulate traffic emissions and pedestrian congestion.",
    location: "Charminar Rd, Char Kaman, Ghansi Bazaar, Hyderabad",
    district: "Hyderabad",
    state: "Telangana",
    region: "Southern India",
    coordinates: {
      lat: 17.3616,
      lng: 78.4747,
    },
    category: "Colonial & Civic Heritage",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1591 CE",
    builder: "Sultan Muhammad Quli Qutb Shah",
    visitorInformation: {
      timings: "09:30 AM – 05:30 PM (Daily)",
      entryFee: "₹25 (Indian Citizens), ₹300 (Foreign Nationals)",
      bestTimeToVisit: "October to March; beautifully illuminated after 07:00 PM",
      nearestTransit: "Charminar Metro Station (Upcoming, 500m), Hyderabad Deccan Nampally (4 km)",
      verified: true,
    },
    featured: false,
    coverImage: "/images/monuments/charminar.jpg",
    images: [
      {
        id: "img-cm-1",
        url: "/images/monuments/charminar.jpg",
        caption: "Four grandiose minarets and pointed grand arches towering over the Old City bazaar.",
        attribution: "Wikimedia Commons (User: G.K. Rao)",
        license: "CC-BY-SA 4.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-charminar-first-floor",
        name: "First Floor Gallery & Open Arcade",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/charminar.jpg",
        thumbnailUrl: "/images/monuments/charminar.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "Overlooking the four historic cardinal gates (Char Kaman) through vaulted balconies carved in lime mortar and granite.",
        sourceMetadata: {
                  "author": "Masa-p (Wikimedia Commons)",
                  "license": "CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Charminar_Hyderabad_1.jpg",
                  "originalDimensions": {
                            "width": 2174,
                            "height": 3071
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "cm-hs-1",
                            "title": "48.7-meter Stucco Minarets",
                            "description": "Four spiralling minarets with double balconies framing the 16th-century Qutb Shahi mosque on the top floor.",
                            "yaw": 0,
                            "pitch": 20,
                            "x": 50,
                            "y": 40,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Charminar: Architecture, Context and Conservation Strategy",
        publisher: "Telangana Heritage Protection Department & ASI Hyderabad Circle",
        url: "https://heritage.telangana.gov.in"
      }
    ]
  },
  {
    id: "m-ellora-caves",
    slug: "ellora-caves",
    name: "Kailasa Temple at Ellora Caves",
    vernacularName: "वेरूळ लेणी (कैलास मंदिर)",
    shortDescription: "The world's largest monolithic rock-cut monument, carved top-down out of a single basalt cliff face in the 8th century CE.",
    historicalBackground: "Commissioned in the 8th century CE by Rashtrakuta King Krishna I (756–773 CE). Excavated top-down from a single basalt volcanic cliff face by master stone sculptors, removing over 200,000 tons of rock without modern machinery. Cave 16 represents the celestial abode of Shiva (Mount Kailash) and is part of a complex of 34 Buddhist, Hindu, and Jain caves spanning six centuries.",
    architecturalStyle: "Dravidian rock-cut monolithic temple engineering featuring multi-tiered vimanas, life-sized carved stone elephants, and intricate continuous Mahabharata and Ramayana sculptural panels.",
    culturalSignificance: "UNESCO World Heritage landmark (1983) and an unsurpassed miracle of ancient Indian civil engineering and sculptural audacity.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Protection against monsoon rainwater drainage seepage into volcanic basalt strata and micro-fracture stabilization.",
    location: "Ellora, Chhatrapati Sambhajinagar District",
    district: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    region: "Western India",
    coordinates: {
      lat: 20.0268,
      lng: 75.1780,
    },
    category: "Rock-Cut Caves & Temples",
    period: "Classical & Early Medieval (6th - 12th Century)",
    yearBuilt: "c. 756 - 773 CE",
    builder: "Rashtrakuta Dynasty (King Krishna I)",
    visitorInformation: {
      timings: "06:00 AM – 06:00 PM (Closed on Tuesdays)",
      entryFee: "₹40 (Indian Citizens), ₹600 (Foreign Nationals)",
      bestTimeToVisit: "November to March; monsoon season showcases roaring waterfalls off the basalt cliffs",
      nearestTransit: "Chhatrapati Sambhajinagar Railway Station (28 km), Airport (35 km)",
      verified: true,
    },
    featured: true,
    coverImage: "/images/monuments/ellora-caves.jpg",
    images: [
      {
        id: "img-ec-1",
        url: "/images/monuments/ellora-caves.jpg",
        caption: "Monolithic Kailasa temple complex carved from top-down within a sheer basalt trench.",
        attribution: "Wikimedia Commons (User: Pratheepps)",
        license: "CC-BY-SA 4.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-kailasa-courtyard",
        name: "Main Monolithic Courtyard & Elephant Plinth",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/ellora-caves.jpg",
        thumbnailUrl: "/images/monuments/ellora-caves.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "The central shrine stands 33 meters high inside an excavated pit measuring 82 meters long by 46 meters wide.",
        sourceMetadata: {
                  "author": "Sanjay Tiwari (Wikimedia Commons)",
                  "license": "CC BY-SA 4.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kailasa_temple_at_Ellora_caves.jpg",
                  "originalDimensions": {
                            "width": 5126,
                            "height": 2883
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "ec-hs-1",
                            "title": "Top-Down Basalt Excavation",
                            "description": "Over 200,000 tonnes of volcanic rock carved with chisels and hammers without scaffoldings under Rashtrakuta rule.",
                            "yaw": 0,
                            "pitch": 10,
                            "x": 55,
                            "y": 55,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Ellora: Monolithic Cave Temples of Ancient India",
        publisher: "Archaeological Survey of India Aurangabad Circle",
        url: "https://asi.nic.in"
      }
    ]
  },
  {
    id: "m-gateway-of-india",
    slug: "gateway-of-india",
    name: "Gateway of India",
    vernacularName: "गेटवे ऑफ इंडिया",
    shortDescription: "A monumental 26-meter basalt triumphal arch erected on the Mumbai waterfront to commemorate the 1911 royal visit of King George V.",
    historicalBackground: "Built to commemorate the landing of King George V and Queen Mary in Bombay in December 1911. Completed in 1924 under the governorship of Sir George Sydenham Clarke. Fittingly, on February 28, 1948, the last British regiment (First Battalion of the Somerset Light Infantry) marched out through this arch, signaling the final termination of British rule in India.",
    architecturalStyle: "Indo-Saracenic triumphal arch blending 16th-century Gujarati Muslim motifs with traditional Roman triumphal design, carved from yellow basalt and reinforced concrete.",
    culturalSignificance: "The foremost historical gateway and civic civic gathering space of modern Mumbai, standing as the ceremonial maritime entrance to India.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Protection against Arabian Sea tidal salt crystallization and maritime air salinity on historic yellow basalt masonry.",
    location: "Apollo Bunder, Colaba, Mumbai",
    district: "Mumbai City",
    state: "Maharashtra",
    region: "Western India",
    coordinates: {
      lat: 18.9220,
      lng: 72.8347,
    },
    category: "Colonial & Civic Heritage",
    period: "Colonial & Modern Era (18th - 20th Century)",
    yearBuilt: "1911 - 1924 CE",
    builder: "George Wittet (Architect) & Gammon India Contractors",
    visitorInformation: {
      timings: "Open 24 Hours (Daily)",
      entryFee: "Free Public Access",
      bestTimeToVisit: "November to February; sunrise and sunset harbor breezes",
      nearestTransit: "Churchgate Station (2.5 km), Chhatrapati Shivaji Maharaj Terminus (2.8 km)",
      verified: true,
    },
    featured: false,
    coverImage: "/images/monuments/gateway-of-india.jpg",
    images: [
      {
        id: "img-goi-1",
        url: "/images/monuments/gateway-of-india.jpg",
        caption: "Yellow basalt triumphal arch overlooking the Arabian Sea harbor at Apollo Bunder.",
        attribution: "Wikimedia Commons (User: A.Savin)",
        license: "Free Art License"
      }
    ],
    tourScenes: [
      {
        id: "scene-gateway-promenade",
        name: "Apollo Bunder Waterfront Promenade",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/gateway-of-india.jpg",
        thumbnailUrl: "/images/monuments/gateway-of-india.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "Facing the harbor where ferry boats depart for the Elephanta Island UNESCO rock-cut caves.",
        sourceMetadata: {
                  "author": "A.Savin (Wikimedia Commons)",
                  "license": "Free Art License / CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Gateway_of_India_-_Mumbai.jpg",
                  "originalDimensions": {
                            "width": 3585,
                            "height": 3585
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "goi-hs-1",
                            "title": "Yellow Basalt Triumphal Arch",
                            "description": "Indo-Saracenic basalt archway designed by George Wittet blending 16th-century Gujarati architecture with Roman triumphalism.",
                            "yaw": 0,
                            "pitch": 10,
                            "x": 50,
                            "y": 50,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Bombay Gothic and Indo-Saracenic Civic Architecture",
        publisher: "Mumbai Heritage Conservation Committee",
        url: "https://portal.mcgm.gov.in"
      }
    ]
  },
  {
    id: "m-shaniwar-wada",
    slug: "shaniwar-wada",
    name: "Shaniwar Wada",
    vernacularName: "शनिवार वाडा",
    shortDescription: "The fortified seat of the Peshwa rulers of the Maratha Empire, established in 1732 CE with massive granite fortification ramparts and Dilli Darwaza.",
    historicalBackground: "Commissioned by Peshwa Baji Rao I in 1730 and completed in 1732, Shaniwar Wada served as the principal seat of the Maratha confederacy until 1818. The complex originally contained a seven-storey palace complex, courtly halls, and ornamental fountain gardens. A devastating fire in 1828 raged for seven days, destroying the timber superstructure but leaving the monumental granite fortification walls, Dilli Darwaza, and bastions standing intact.",
    architecturalStyle: "Maratha Palace-Fort architecture blending military stone fortifications with indigenous wooden post-and-beam construction and ornamental arches.",
    culturalSignificance: "Symbolizes the zenith of Maratha political governance and municipal identity in Pune. It serves as an epicenter of regional historical memory.",
    conservationStatus: "Requires Monitoring",
    sdgRelevance: "SDG 11.4 — Protection against urban encroachment, rainwater percolation into stone masonry, and high footfall micro-abrasions in historic Pune.",
    location: "Shaniwar Peth, Pune City",
    district: "Pune",
    state: "Maharashtra",
    region: "Western India",
    coordinates: {
      lat: 18.5196,
      lng: 73.8553,
    },
    category: "Palaces & Mansions",
    period: "Mughal & Maratha Empires (16th - 18th Century)",
    yearBuilt: "1732 CE",
    builder: "Peshwa Baji Rao I",
    visitorInformation: {
      timings: "09:30 AM – 05:30 PM (Daily)",
      entryFee: "₹25 (Indian Citizens), ₹300 (Foreign Nationals)",
      bestTimeToVisit: "October to March (Pleasant weather; evening light and sound shows)",
      nearestTransit: "Pune Railway Station (2.5 km), Swargate Bus Stand (3.2 km)",
      verified: true,
    },
    featured: true,
    coverImage: "/images/monuments/shaniwar-wada.jpg",
    images: [
      {
        id: "img-sw-1",
        url: "/images/monuments/shaniwar-wada.jpg",
        caption: "Dilli Darwaza (Delhi Gate) exterior bastions with pointed iron elephant spikes.",
        attribution: "Wikimedia Commons (User: Niraj / Cultural Archive)",
        license: "CC-BY-SA 4.0"
      }
    ],
    tourScenes: [
      {
        id: "scene-dilli-darwaza",
        name: "Dilli Darwaza (Delhi Gate)",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/shaniwar-wada.jpg",
        thumbnailUrl: "/images/monuments/shaniwar-wada.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "The massive northern portal oriented toward Delhi, fitted with 72 sharp steel spikes to deter armored war elephants.",
        sourceMetadata: {
                  "author": "Aakash Gautam (Wiki Loves Monuments)",
                  "license": "CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_entrance_of_Shaniwar_Wada..JPG",
                  "camera": "Nikon D3100 DSLR",
                  "originalDimensions": {
                            "width": 4608,
                            "height": 3072
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "sw-spot-1",
                            "title": "Elephant Spikes (Hatti-Kille)",
                            "description": "Heavy forged iron spikes placed at eye-level of charging elephants to prevent wooden door battering.",
                            "yaw": 12,
                            "pitch": 5,
                            "x": 48,
                            "y": 76,
                            "type": "info"
                  },
                  {
                            "id": "sw-spot-2",
                            "title": "Nagarkhana (Drum House)",
                            "description": "Wooden canopied pavilion above the archway where ceremonial shehnai and drums announced the Peshwa's arrival.",
                            "yaw": 0,
                            "pitch": 20,
                            "x": 48,
                            "y": 42,
                            "type": "info"
                  },
                  {
                            "id": "sw-spot-3",
                            "title": "Machicolated Granite Bastions",
                            "description": "Twin semi-circular stone bastions engineered with narrow vertical arrow-slits to sweep approaching forces.",
                            "yaw": -30,
                            "pitch": 0,
                            "x": 24,
                            "y": 62,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Peshwas of Pune: Archival Records of the Bombay Presidency",
        publisher: "Maharashtra State Archives",
        url: "https://cultural.maharashtra.gov.in"
      }
    ]
  },
  {
    id: "m-aga-khan-palace",
    slug: "aga-khan-palace",
    name: "Aga Khan Palace",
    vernacularName: "आगा खान पॅलेस",
    shortDescription: "A graceful Italianate palace constructed in 1892 as famine relief, pivotal to India's freedom struggle during the 1942 Quit India movement.",
    historicalBackground: "Built in 1892 by Sultan Muhammed Shah Aga Khan III to generate employment for drought-afflicted populations in the Deccan region. The estate spans 19 acres with Italianate arches and landscaped gardens. It served as a British prison for Mahatma Gandhi, Kasturba Gandhi, and Mahadev Desai following the 1942 Quit India resolution.",
    architecturalStyle: "Indo-Saracenic revival with prominent Italianate arcades, grand sweeping colonnades, and sprawling terraced lawns.",
    culturalSignificance: "National Memorial housing the samadhis (cenotaphs) of Kasturba Gandhi and Mahadev Desai, and the ash urns of Mahatma Gandhi.",
    conservationStatus: "Good",
    sdgRelevance: "SDG 11.4 — Maintenance of historic lime plaster, garden ecosystem, and historical archives within an expanding modern metropolis.",
    location: "Kalyani Nagar, Pune",
    district: "Pune",
    state: "Maharashtra",
    region: "Western India",
    coordinates: {
      lat: 18.5524,
      lng: 73.9016,
    },
    category: "Palaces & Mansions",
    period: "Colonial & Modern Era (18th - 20th Century)",
    yearBuilt: "1892 CE",
    builder: "Sultan Muhammed Shah Aga Khan III",
    visitorInformation: {
      timings: "09:00 AM – 05:30 PM (Daily)",
      entryFee: "₹25 (Indians), ₹300 (Foreigners)",
      bestTimeToVisit: "Throughout the year; morning hours offer quiet garden walks",
      nearestTransit: "Pune Airport (3.5 km), Kalyani Nagar Metro Station (0.8 km)",
      verified: true,
    },
    featured: false,
    coverImage: "/images/monuments/aga-khan-palace.jpg",
    images: [
      {
        id: "img-ak-1",
        url: "/images/monuments/aga-khan-palace.jpg",
        caption: "Colonnaded corridor and arched gallery of the central palace wing.",
        attribution: "Wikimedia Commons (Archaeological Documentation Project)",
        license: "Public Domain"
      }
    ],
    tourScenes: [
      {
        id: "scene-aga-khan-lawn",
        name: "Main Palace Portico & Grounds",
        sceneType: "standard_photo",
        panoramaUrl: undefined,
        standardPhotoUrl: "/images/monuments/aga-khan-palace.jpg",
        thumbnailUrl: "/images/monuments/aga-khan-palace.jpg",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "Wide exterior colonnade designed to shade visitors and retain cool indoor temperatures through classical air circulation shafts.",
        sourceMetadata: {
                  "author": "Maskaravivek (Wikimedia Commons)",
                  "license": "CC BY-SA 3.0",
                  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aga_Khan_Palace_Pune_2.jpg",
                  "originalDimensions": {
                            "width": 4032,
                            "height": 3024
                  },
                  "verificationStatus": "verified_authentic_photo"
        },
        hotspots: [
                  {
                            "id": "ak-spot-1",
                            "title": "Italianate Arches & Loggias",
                            "description": "Five-tiered European-influenced arches designed to facilitate cross-ventilation during Deccan summers.",
                            "yaw": 0,
                            "pitch": 10,
                            "x": 45,
                            "y": 55,
                            "type": "info"
                  },
                  {
                            "id": "ak-spot-2",
                            "title": "Gandhi National Memorial Suite",
                            "description": "The inner wing where Mahatma Gandhi, Kasturba Gandhi, and Mahadev Desai were interned following the Quit India movement in 1942.",
                            "yaw": -20,
                            "pitch": 0,
                            "x": 25,
                            "y": 65,
                            "type": "info"
                  }
        ]
      }
    ],
    model3d: {
      status: "in_preparation",
      format: "glb",
      surveyMethod: "Terrestrial LiDAR & High-Density Drone Photogrammetry",
      attribution: "Archaeological Survey of India (ASI) Western Circle & Pune Municipal Heritage Cell"
    },
    sources: [
      {
        title: "Gandhi Smarak Samiti Official Documentation",
        publisher: "Aga Khan Palace Trust",
        url: "https://gandhimuseum.org"
      }
    ]
  }
];

export const SAMPLE_COMMUNITY_SUBMISSIONS: CommunitySubmission[] = [
  {
    id: "sub-1",
    userId: "usr-aaditya",
    userName: "Aaditya Joshi",
    userRole: "contributor",
    monumentId: "m-taj-mahal",
    monumentName: "Taj Mahal",
    type: "oral_history",
    title: "The wooden well foundation system beneath the Yamuna",
    content: "During civil engineering lectures at Roorkee, we studied how the entire weight of the Taj Mahal rests upon a series of deep ebony wood cased wells sunk into the riverbed mud. The timber requires continuous moisture from the Yamuna to prevent dry rot.",
    status: "approved",
    createdAt: "2026-10-15T10:30:00Z"
  },
  {
    id: "sub-2",
    userId: "usr-sneha",
    userName: "Sneha Kulkarni",
    userRole: "contributor",
    monumentId: "m-hampi-virupaksha",
    monumentName: "Group of Monuments at Hampi",
    type: "photograph",
    title: "Dawn mist rising over the Tungabhadra granite boulders",
    content: "Captured at 06:15 AM from Matanga Hill. The morning rays hit the Virupaksha gopuram first while the ancient bazaar columns remain in purple shadow.",
    mediaUrl: "/images/monuments/hampi-virupaksha.jpg",
    mediaAttribution: "Sneha Kulkarni / HeritageVerse Community",
    status: "approved",
    createdAt: "2026-10-22T14:15:00Z"
  },
  {
    id: "sub-3",
    userId: "usr-rohit",
    userName: "Rohit Deshmukh",
    userRole: "visitor",
    monumentId: "m-konark-sun-temple",
    monumentName: "Sun Temple Konark",
    type: "correction",
    title: "Correction regarding sundial hour calculation",
    content: "The local ASI certified guides demonstrate that each of the 8 major spokes represents 3 hours, and the minor beads mark exact 15-minute intervals between the spokes.",
    status: "approved",
    createdAt: "2026-11-02T09:40:00Z"
  }
];

export const SAMPLE_CONSERVATION_REPORTS: ConservationReport[] = [
  {
    id: "rep-1",
    userId: "usr-vikram",
    userName: "Vikram Patil",
    monumentId: "m-taj-mahal",
    monumentName: "Taj Mahal",
    category: "pollution",
    severity: "medium",
    areaLocation: "North-western Marble Minaret Base",
    description: "Yellowing observed on lower plinth marble panels likely caused by airborne particulate soot during winter temperature inversions. Multani mitti clay pack treatment recommended for quarterly cleaning.",
    dateObserved: "2026-10-28",
    status: "investigating",
    adminNotes: "Forwarded to ASI Chemical Conservation Branch Agra Circle for clay poultice cycle.",
    createdAt: "2026-10-28T16:00:00Z"
  },
  {
    id: "rep-2",
    userId: "usr-priya",
    userName: "Priya Ranade",
    monumentId: "m-charminar",
    monumentName: "Charminar & Hyderabad Citadel",
    category: "vandalism",
    severity: "high",
    areaLocation: "South-western Minaret Spiral Staircase Arch",
    description: "Marker graffiti observed on historic lime plaster along staircase landing 2. Immediate non-destructive poultice cleaning requested.",
    dateObserved: "2026-11-05",
    status: "pending",
    createdAt: "2026-11-05T11:20:00Z"
  }
];
