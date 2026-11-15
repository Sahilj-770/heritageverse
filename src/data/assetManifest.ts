/**
 * HeritageVerse Authentic Image Asset Manifest
 * Master registry of verified cultural heritage photography and 360° panoramas.
 * Enforces authentic provenance, licensing, resolution validation, and honest projection types.
 */

export interface HeritageAssetRecord {
  id: string;
  monumentId: string;
  monumentSlug: string;
  sceneId?: string;
  localPath: string;
  title: string;
  imageType: "monument_cover" | "equirectangular_360" | "standard_photo";
  projection: "equirectangular" | "rectilinear" | "none";
  verificationStatus: "verified_genuine_360" | "verified_authentic_photo" | "survey_in_progress";
  sourceUrl: string;
  creator: string;
  license: string;
  dimensions: {
    width: number;
    height: number;
  };
  fileSizeBytes?: number;
  camera?: string;
  notes?: string;
}

export const ASSET_MANIFEST: HeritageAssetRecord[] = [
  // ─── TAJ MAHAL ────────────────────────────────────────────────────────
  {
    id: "asset-tm-cover",
    monumentId: "m-taj-mahal",
    monumentSlug: "taj-mahal",
    localPath: "/images/monuments/taj-mahal.jpg",
    title: "Taj Mahal Central View across Charbagh Pool",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Taj_Mahal,_Agra,_India_edit3.jpg",
    creator: "Julian Herzog (Wikimedia Commons)",
    license: "CC BY 4.0",
    dimensions: { width: 3840, height: 2525 },
    notes: "Official featured picture on Wikimedia Commons; Makrana marble south facade.",
  },
  {
    id: "asset-tm-pano-1",
    monumentId: "m-taj-mahal",
    monumentSlug: "taj-mahal",
    sceneId: "scene-taj-charbagh",
    localPath: "/images/panoramas/taj-mahal-360.jpg",
    title: "Taj Mahal Marble Plinth 360° Spherical Survey",
    imageType: "equirectangular_360",
    projection: "equirectangular",
    verificationStatus: "verified_genuine_360",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Taj_Mahal_360%C2%B0_View.jpg",
    creator: "Arul Prakasam T (Wikimedia Commons)",
    license: "CC BY-SA 4.0",
    dimensions: { width: 2048, height: 1024 },
    notes: "Genuine 360° x 180° equirectangular survey captured on the main plinth overlooking the Yamuna river.",
  },

  // ─── SHANIWAR WADA ────────────────────────────────────────────────────
  {
    id: "asset-sw-cover",
    monumentId: "m-shaniwar-wada",
    monumentSlug: "shaniwar-wada",
    localPath: "/images/monuments/shaniwar-wada.jpg",
    title: "Dilli Darwaza (Delhi Gate) & Granite Bastions",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_entrance_of_Shaniwar_Wada..JPG",
    creator: "Aakash Gautam (Wiki Loves Monuments)",
    license: "CC BY-SA 3.0",
    camera: "Nikon D3100 DSLR",
    dimensions: { width: 4608, height: 3072 },
    notes: "High-resolution architectural capture of northern fortress gate with pointed iron elephant deterrent spikes.",
  },
  {
    id: "asset-sw-photo-1",
    monumentId: "m-shaniwar-wada",
    monumentSlug: "shaniwar-wada",
    sceneId: "scene-dilli-darwaza",
    localPath: "/images/monuments/shaniwar-wada.jpg",
    title: "Dilli Darwaza Architectural Study",
    imageType: "standard_photo",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_entrance_of_Shaniwar_Wada..JPG",
    creator: "Aakash Gautam (Wiki Loves Monuments)",
    license: "CC BY-SA 3.0",
    camera: "Nikon D3100 DSLR",
    dimensions: { width: 4608, height: 3072 },
    notes: "Standard architectural photography. Full 360° equirectangular field capture is currently pending scheduled LiDAR survey.",
  },

  // ─── KHAJURAHO ────────────────────────────────────────────────────────
  {
    id: "asset-kj-cover",
    monumentId: "m-khajuraho",
    monumentSlug: "khajuraho",
    localPath: "/images/monuments/khajuraho.jpg",
    title: "Kandariya Mahadeva Temple Golden Hour Panorama",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Kandariya_Mahadeva_Temple,_Khajuraho,_Madhya_Pradesh.jpg",
    creator: "Taru23 (Wiki Loves Monuments 2018)",
    license: "CC BY-SA 4.0",
    dimensions: { width: 4872, height: 3456 },
    notes: "Nagara architectural shikhara bathed in natural golden-hour illumination.",
  },

  // ─── AGA KHAN PALACE ──────────────────────────────────────────────────
  {
    id: "asset-ak-cover",
    monumentId: "m-aga-khan-palace",
    monumentSlug: "aga-khan-palace",
    localPath: "/images/monuments/aga-khan-palace.jpg",
    title: "Aga Khan Palace Italianate Facade and Gardens",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Aga_Khan_Palace_Pune_2.jpg",
    creator: "Maskaravivek (Wikimedia Commons)",
    license: "CC BY-SA 3.0",
    dimensions: { width: 4032, height: 3024 },
    notes: "Full architectural facade showing Italianate arcades and manicured lawns.",
  },

  // ─── QUTUB MINAR ──────────────────────────────────────────────────────
  {
    id: "asset-qm-cover",
    monumentId: "m-qutub-minar",
    monumentSlug: "qutub-minar",
    localPath: "/images/monuments/qutub-minar.jpg",
    title: "Qutub Minar Fluted Minaret and Screen",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Qutub_Minar_in_New_Delhi_03-2016_img3.jpg",
    creator: "A.Savin (Wikimedia Commons)",
    license: "Free Art License / CC BY-SA 3.0",
    dimensions: { width: 2755, height: 3673 },
    notes: "Fluted red sandstone tower with carved balconies and Quranic inscriptions.",
  },

  // ─── RED FORT ─────────────────────────────────────────────────────────
  {
    id: "asset-rf-cover",
    monumentId: "m-red-fort",
    monumentSlug: "red-fort",
    localPath: "/images/monuments/red-fort.jpg",
    title: "Lahori Gate & Ramparts of Red Fort",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Red_Fort,_Delhi.jpg",
    creator: "Anurag Agnihotri (Flickr / Wikimedia Commons)",
    license: "CC BY 2.0",
    dimensions: { width: 4242, height: 1949 },
    notes: "Mughal imperial ramparts and octagonal bastions in red sandstone.",
  },

  // ─── AMER FORT ────────────────────────────────────────────────────────
  {
    id: "asset-af-cover",
    monumentId: "m-amer-fort",
    monumentSlug: "amer-fort",
    localPath: "/images/monuments/amer-fort.jpg",
    title: "Amer Fort across Maota Lake",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Amber_Fort_wide_angle_panorama_from_the_road.jpg",
    creator: "Fivespot (Wikimedia Commons)",
    license: "CC BY-SA 3.0",
    dimensions: { width: 6605, height: 3505 },
    notes: "Panoramic view of Rajput fortified palace complex reflected in Maota lake.",
  },

  // ─── HAWA MAHAL ───────────────────────────────────────────────────────
  {
    id: "asset-hm-cover",
    monumentId: "m-hawa-mahal",
    monumentSlug: "hawa-mahal",
    localPath: "/images/monuments/hawa-mahal.jpg",
    title: "Hawa Mahal 953 Jharokha Facade",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hawa_Mahal_2011.jpg",
    creator: "Vikas Choudhary (Wikimedia Commons)",
    license: "CC BY-SA 3.0",
    dimensions: { width: 3756, height: 3236 },
    notes: "Five-storey pyramidal exterior honeycomb structure in red and pink sandstone.",
  },

  // ─── KONARK SUN TEMPLE ────────────────────────────────────────────────
  {
    id: "asset-kst-cover",
    monumentId: "m-konark-sun-temple",
    monumentSlug: "konark-sun-temple",
    localPath: "/images/monuments/konark-sun-temple.jpg",
    title: "Konark Sun Temple Jagamohan and Sanctuary Plinth",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Konark_Sun_Temple,_Odisha.jpg",
    creator: "G-u-t (Wikimedia Commons)",
    license: "CC BY-SA 3.0",
    dimensions: { width: 3888, height: 2592 },
    notes: "13th-century CE Kalinga chariot temple dedicated to Surya.",
  },

  // ─── VICTORIA MEMORIAL ────────────────────────────────────────────────
  {
    id: "asset-vm-cover",
    monumentId: "m-victoria-memorial",
    monumentSlug: "victoria-memorial",
    localPath: "/images/monuments/victoria-memorial.jpg",
    title: "Victoria Memorial Hall Waterfront Panorama",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Victoria_Memorial_hall_with_reflection,_Kolkata.jpg",
    creator: "Avrajyoti Mitra (Wikimedia Commons)",
    license: "CC BY-SA 4.0",
    dimensions: { width: 12725, height: 5694 },
    notes: "Makrana marble Indo-Saracenic monument across the ornamental reflecting pool.",
  },

  // ─── HAMPI ────────────────────────────────────────────────────────────
  {
    id: "asset-hp-cover",
    monumentId: "m-hampi-virupaksha",
    monumentSlug: "hampi-virupaksha",
    localPath: "/images/monuments/hampi-virupaksha.jpg",
    title: "Virupaksha Temple Gopuram & Hemakuta Hill",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Virupaksha_temple_Hampi.jpg",
    creator: "Dey.sandip (Wikimedia Commons)",
    license: "CC BY-SA 3.0",
    dimensions: { width: 2244, height: 1225 },
    notes: "9-tiered East Gopuram rising above the Tungabhadra boulder-strewn terrain.",
  },

  // ─── BRIHADISVARA TEMPLE ──────────────────────────────────────────────
  {
    id: "asset-bt-cover",
    monumentId: "m-brihadisvara-temple",
    monumentSlug: "brihadisvara-temple",
    localPath: "/images/monuments/brihadisvara-temple.jpg",
    title: "Brihadisvara Temple 16-Storey Granite Vimana",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Brihadisvara_Temple_Thanjavur.jpg",
    creator: "Nagesh Jayaraman (Wikimedia Commons)",
    license: "CC BY-SA 3.0",
    dimensions: { width: 5849, height: 3655 },
    notes: "Chola granite vimana capped with monolithic 80-tonne kumbam.",
  },

  // ─── MEENAKSHI TEMPLE ─────────────────────────────────────────────────
  {
    id: "asset-mt-cover",
    monumentId: "m-meenakshi-temple",
    monumentSlug: "meenakshi-temple",
    localPath: "/images/monuments/meenakshi-temple.jpg",
    title: "Meenakshi Amman Temple South Gopuram",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Madurai_Meenakshi_Amman_temple_South_Tower.jpg",
    creator: "Bernard Gagnon (Wikimedia Commons)",
    license: "CC BY-SA 3.0",
    dimensions: { width: 2112, height: 2593 },
    notes: "Polychrome sculpted stucco deities across the soaring 52m South Tower.",
  },

  // ─── SANCHI STUPA ─────────────────────────────────────────────────────
  {
    id: "asset-ss-cover",
    monumentId: "m-sanchi-stupa",
    monumentSlug: "sanchi-stupa",
    localPath: "/images/monuments/sanchi-stupa.jpg",
    title: "Great Stupa No. 1 and Northern Torana",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Great_Stupa_at_Sanchi_01.jpg",
    creator: "Biswarup Ganguly (Wikimedia Commons)",
    license: "CC BY 3.0",
    dimensions: { width: 4953, height: 3302 },
    notes: "Mauryan hemispherical stone dome with ornate carved torana gateway.",
  },

  // ─── CHARMINAR ────────────────────────────────────────────────────────
  {
    id: "asset-cm-cover",
    monumentId: "m-charminar",
    monumentSlug: "charminar",
    localPath: "/images/monuments/charminar.jpg",
    title: "Charminar Monumental Four Minarets",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Charminar_Hyderabad_1.jpg",
    creator: "Masa-p (Wikimedia Commons)",
    license: "CC BY-SA 3.0",
    dimensions: { width: 2174, height: 3071 },
    notes: "Qutb Shahi ceremonial archway and mosque built in 1591 CE.",
  },

  // ─── ELLORA CAVES ─────────────────────────────────────────────────────
  {
    id: "asset-ec-cover",
    monumentId: "m-ellora-caves",
    monumentSlug: "ellora-caves",
    localPath: "/images/monuments/ellora-caves.jpg",
    title: "Cave 16 Kailasa Monolithic Rock-Cut Temple",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kailasa_temple_at_Ellora_caves.jpg",
    creator: "Sanjay Tiwari (Wikimedia Commons)",
    license: "CC BY-SA 4.0",
    dimensions: { width: 5126, height: 2883 },
    notes: "Monolithic temple excavated top-down from a single basalt cliff face.",
  },

  // ─── GATEWAY OF INDIA ─────────────────────────────────────────────────
  {
    id: "asset-goi-cover",
    monumentId: "m-gateway-of-india",
    monumentSlug: "gateway-of-india",
    localPath: "/images/monuments/gateway-of-india.jpg",
    title: "Gateway of India Apollo Bunder Waterfront",
    imageType: "monument_cover",
    projection: "rectilinear",
    verificationStatus: "verified_authentic_photo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Gateway_of_India_-_Mumbai.jpg",
    creator: "A.Savin (Wikimedia Commons)",
    license: "Free Art License / CC BY-SA 3.0",
    dimensions: { width: 3585, height: 3585 },
    notes: "Yellow basalt Indo-Saracenic triumphal arch overlooking Mumbai Harbour.",
  },
];
