import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/sampleData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Metadata registry for all 17 monuments
const METADATA = {
  'taj-mahal': {
    sceneType: 'equirectangular_360',
    panoramaUrl: '/images/panoramas/taj-mahal-360.jpg',
    standardPhotoUrl: '/images/monuments/taj-mahal.jpg',
    sourceMetadata: {
      author: 'Arul Prakasam T',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Taj_Mahal_360%C2%B0_View.jpg',
      originalDimensions: { width: 2048, height: 1024 },
      verificationStatus: 'verified_genuine_360',
    },
    hotspots: [
      { id: 'tm-hs-1', title: 'Lotus Dome Apex & Finial', description: 'Gilded bronze finial combining traditional Persian spearheads with the indigenous Hindu trident motif.', yaw: 0, pitch: 28, x: 50, y: 22, type: 'info' },
      { id: 'tm-hs-2', title: 'Pietra Dura Floral Parchin Kari', description: 'Precious jade, jasper, and carnelian inlaid into white Makrana marble plinths.', yaw: -25, pitch: 2, x: 42, y: 64, type: 'info' }
    ]
  },
  'shaniwar-wada': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/shaniwar-wada.jpg',
    thumbnailUrl: '/images/monuments/shaniwar-wada.jpg',
    sourceMetadata: {
      author: 'Aakash Gautam (Wiki Loves Monuments)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_entrance_of_Shaniwar_Wada..JPG',
      camera: 'Nikon D3100 DSLR',
      originalDimensions: { width: 4608, height: 3072 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'sw-spot-1', title: 'Elephant Spikes (Hatti-Kille)', description: 'Heavy forged iron spikes placed at eye-level of charging elephants to prevent wooden door battering.', yaw: 12, pitch: 5, x: 48, y: 76, type: 'info' },
      { id: 'sw-spot-2', title: 'Nagarkhana (Drum House)', description: 'Wooden canopied pavilion above the archway where ceremonial shehnai and drums announced the Peshwa\'s arrival.', yaw: 0, pitch: 20, x: 48, y: 42, type: 'info' },
      { id: 'sw-spot-3', title: 'Machicolated Granite Bastions', description: 'Twin semi-circular stone bastions engineered with narrow vertical arrow-slits to sweep approaching forces.', yaw: -30, pitch: 0, x: 24, y: 62, type: 'info' }
    ]
  },
  'aga-khan-palace': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/aga-khan-palace.jpg',
    thumbnailUrl: '/images/monuments/aga-khan-palace.jpg',
    sourceMetadata: {
      author: 'Maskaravivek (Wikimedia Commons)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Aga_Khan_Palace_Pune_2.jpg',
      originalDimensions: { width: 4032, height: 3024 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'ak-spot-1', title: 'Italianate Arches & Loggias', description: 'Five-tiered European-influenced arches designed to facilitate cross-ventilation during Deccan summers.', yaw: 0, pitch: 10, x: 45, y: 55, type: 'info' },
      { id: 'ak-spot-2', title: 'Gandhi National Memorial Suite', description: 'The inner wing where Mahatma Gandhi, Kasturba Gandhi, and Mahadev Desai were interned following the Quit India movement in 1942.', yaw: -20, pitch: 0, x: 25, y: 65, type: 'info' }
    ]
  },
  'khajuraho': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/khajuraho.jpg',
    thumbnailUrl: '/images/monuments/khajuraho.jpg',
    sourceMetadata: {
      author: 'Taru23 (Wiki Loves Monuments 2018)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Kandariya_Mahadeva_Temple,_Khajuraho,_Madhya_Pradesh.jpg',
      originalDimensions: { width: 4872, height: 3456 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'kj-hs-1', title: 'Nagara Shikhara Tower', description: 'Towering 31-meter sandstone spire composed of 84 miniature replica shikharas symbolizing Mount Kailash.', yaw: 0, pitch: 20, x: 57, y: 35, type: 'info' },
      { id: 'kj-hs-2', title: 'Sculpted Ambulatory Friezes', description: 'Over 800 intricately carved sandstone sculptures depicting celestial nymphs, deities, and courtly celebrations.', yaw: -15, pitch: -5, x: 52, y: 72, type: 'info' }
    ]
  },
  'qutub-minar': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/qutub-minar.jpg',
    thumbnailUrl: '/images/monuments/qutub-minar.jpg',
    sourceMetadata: {
      author: 'A.Savin (Wikimedia Commons)',
      license: 'Free Art License / CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Qutub_Minar_in_New_Delhi_03-2016_img3.jpg',
      originalDimensions: { width: 2755, height: 3673 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'qm-hs-1', title: 'Fluted Sandstone Balconies', description: 'Cantilevered balconies supported by stalactite corbeling with intricate naskh Arabic inscriptions.', yaw: 0, pitch: 20, x: 60, y: 40, type: 'info' },
      { id: 'qm-hs-2', title: 'Quwwat-ul-Islam Archways', description: 'Screen of corbelled red sandstone arches constructed under Qutb-ud-din Aibak in 1192 CE.', yaw: -30, pitch: -10, x: 30, y: 70, type: 'info' }
    ]
  },
  'red-fort': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/red-fort.jpg',
    thumbnailUrl: '/images/monuments/red-fort.jpg',
    sourceMetadata: {
      author: 'Anurag Agnihotri (Wikimedia Commons)',
      license: 'CC BY 2.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Red_Fort,_Delhi.jpg',
      originalDimensions: { width: 4242, height: 1949 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'rf-hs-1', title: 'Lahori Gate Chhatris', description: 'Octagonal twin bastions crowned with white marble chhatris framing the ceremonial western gate.', yaw: 0, pitch: 15, x: 50, y: 35, type: 'info' }
    ]
  },
  'amer-fort': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/amer-fort.jpg',
    thumbnailUrl: '/images/monuments/amer-fort.jpg',
    sourceMetadata: {
      author: 'Fivespot (Wikimedia Commons)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Amber_Fort_wide_angle_panorama_from_the_road.jpg',
      originalDimensions: { width: 6605, height: 3505 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'af-hs-1', title: 'Sheesh Mahal Pavilion', description: 'Hall of Mirrors with imported Belgian convex glass mosaics reflecting single candleflames into thousands of stars.', yaw: 0, pitch: 10, x: 55, y: 45, type: 'info' }
    ]
  },
  'hawa-mahal': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/hawa-mahal.jpg',
    thumbnailUrl: '/images/monuments/hawa-mahal.jpg',
    sourceMetadata: {
      author: 'Vikas Choudhary (Wikimedia Commons)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hawa_Mahal_2011.jpg',
      originalDimensions: { width: 3756, height: 3236 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'hm-hs-1', title: '953 Jharokha Windows', description: 'Latticework casements engineered with the Venturi effect to circulate cool air throughout royal quarters.', yaw: 0, pitch: 15, x: 50, y: 50, type: 'info' }
    ]
  },
  'konark-sun-temple': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/konark-sun-temple.jpg',
    thumbnailUrl: '/images/monuments/konark-sun-temple.jpg',
    sourceMetadata: {
      author: 'G-u-t (Wikimedia Commons)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Konark_Sun_Temple,_Odisha.jpg',
      originalDimensions: { width: 3888, height: 2592 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'kst-hs-1', title: '24-Spoked Sun Chariot Wheels', description: 'Architectural sundials carved from chlorite stone capable of calculating precise time to the minute.', yaw: 0, pitch: 5, x: 50, y: 65, type: 'info' }
    ]
  },
  'victoria-memorial': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/victoria-memorial.jpg',
    thumbnailUrl: '/images/monuments/victoria-memorial.jpg',
    sourceMetadata: {
      author: 'Avrajyoti Mitra (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Victoria_Memorial_hall_with_reflection,_Kolkata.jpg',
      originalDimensions: { width: 12725, height: 5694 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'vm-hs-1', title: 'Central Dome & Angel of Victory', description: 'Indo-Saracenic central dome capped by a 16-foot bronze Angel of Victory rotating on ball bearings.', yaw: 0, pitch: 20, x: 50, y: 35, type: 'info' }
    ]
  },
  'hampi-virupaksha': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/hampi-virupaksha.jpg',
    thumbnailUrl: '/images/monuments/hampi-virupaksha.jpg',
    sourceMetadata: {
      author: 'Dey.sandip (Wikimedia Commons)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Virupaksha_temple_Hampi.jpg',
      originalDimensions: { width: 2244, height: 1225 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'hp-hs-1', title: 'East Gopuram Entrance', description: 'Nine-tiered pyramidal gateway tower towering 50 meters above the Tungabhadra basin.', yaw: 0, pitch: 15, x: 75, y: 50, type: 'info' }
    ]
  },
  'brihadisvara-temple': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/brihadisvara-temple.jpg',
    thumbnailUrl: '/images/monuments/brihadisvara-temple.jpg',
    sourceMetadata: {
      author: 'Nagesh Jayaraman (Wikimedia Commons)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Brihadisvara_Temple_Thanjavur.jpg',
      originalDimensions: { width: 5849, height: 3655 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'bt-hs-1', title: 'Monolithic Kumbam Capstone', description: '80-tonne single granite block hoisted to the 66-meter apex along a 6-kilometer inclined ramp.', yaw: 0, pitch: 25, x: 52, y: 30, type: 'info' }
    ]
  },
  'meenakshi-temple': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/meenakshi-temple.jpg',
    thumbnailUrl: '/images/monuments/meenakshi-temple.jpg',
    sourceMetadata: {
      author: 'Bernard Gagnon (Wikimedia Commons)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Madurai_Meenakshi_Amman_temple_South_Tower.jpg',
      originalDimensions: { width: 2112, height: 2593 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'mt-hs-1', title: 'Polychrome Stucco Sculptures', description: 'Over 1,500 brightly painted mythological figures repainted every 12 years in the traditional Ashtabandhana ritual.', yaw: 0, pitch: 10, x: 50, y: 45, type: 'info' }
    ]
  },
  'sanchi-stupa': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/sanchi-stupa.jpg',
    thumbnailUrl: '/images/monuments/sanchi-stupa.jpg',
    sourceMetadata: {
      author: 'Biswarup Ganguly (Wikimedia Commons)',
      license: 'CC BY 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Great_Stupa_at_Sanchi_01.jpg',
      originalDimensions: { width: 4953, height: 3302 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'ss-hs-1', title: 'Carved Northern Torana', description: 'Intricately carved sandstone gateway architraves narrating Jataka tales of the Buddha\'s previous lives.', yaw: 0, pitch: 10, x: 48, y: 55, type: 'info' }
    ]
  },
  'charminar': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/charminar.jpg',
    thumbnailUrl: '/images/monuments/charminar.jpg',
    sourceMetadata: {
      author: 'Masa-p (Wikimedia Commons)',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Charminar_Hyderabad_1.jpg',
      originalDimensions: { width: 2174, height: 3071 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'cm-hs-1', title: '48.7-meter Stucco Minarets', description: 'Four spiralling minarets with double balconies framing the 16th-century Qutb Shahi mosque on the top floor.', yaw: 0, pitch: 20, x: 50, y: 40, type: 'info' }
    ]
  },
  'ellora-caves': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/ellora-caves.jpg',
    thumbnailUrl: '/images/monuments/ellora-caves.jpg',
    sourceMetadata: {
      author: 'Sanjay Tiwari (Wikimedia Commons)',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kailasa_temple_at_Ellora_caves.jpg',
      originalDimensions: { width: 5126, height: 2883 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'ec-hs-1', title: 'Top-Down Basalt Excavation', description: 'Over 200,000 tonnes of volcanic rock carved with chisels and hammers without scaffoldings under Rashtrakuta rule.', yaw: 0, pitch: 10, x: 55, y: 55, type: 'info' }
    ]
  },
  'gateway-of-india': {
    sceneType: 'standard_photo',
    standardPhotoUrl: '/images/monuments/gateway-of-india.jpg',
    thumbnailUrl: '/images/monuments/gateway-of-india.jpg',
    sourceMetadata: {
      author: 'A.Savin (Wikimedia Commons)',
      license: 'Free Art License / CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gateway_of_India_-_Mumbai.jpg',
      originalDimensions: { width: 3585, height: 3585 },
      verificationStatus: 'verified_authentic_photo',
    },
    hotspots: [
      { id: 'goi-hs-1', title: 'Yellow Basalt Triumphal Arch', description: 'Indo-Saracenic basalt archway designed by George Wittet blending 16th-century Gujarati architecture with Roman triumphalism.', yaw: 0, pitch: 10, x: 50, y: 50, type: 'info' }
    ]
  }
};

// Now process sampleData.ts and inject sceneType, standardPhotoUrl, sourceMetadata, and hotspots
for (const [slug, data] of Object.entries(METADATA)) {
  const slugRegex = new RegExp(`slug:\\s*["']${slug}["'][\\s\\S]*?tourScenes:\\s*\\[([\\s\\S]*?)\\]\\s*,\\s*model3d:`, 'g');
  const match = slugRegex.exec(content);
  if (!match) {
    console.warn(`Could not find tourScenes block for ${slug}`);
    continue;
  }

  const rawSceneBlock = match[1];
  
  // Extract existing name and historicalNotes
  const nameMatch = rawSceneBlock.match(/name:\s*["']([^"']+)["']/);
  const notesMatch = rawSceneBlock.match(/historicalNotes:\s*["']([^"']+)["']/);
  const idMatch = rawSceneBlock.match(/id:\s*["']([^"']+)["']/);

  const sceneId = idMatch ? idMatch[1] : `scene-${slug}`;
  const sceneName = nameMatch ? nameMatch[1] : 'Architectural View';
  const historicalNotes = notesMatch ? notesMatch[1] : 'Preserved architectural heritage site.';

  const newScene = `      {
        id: "${sceneId}",
        name: "${sceneName}",
        sceneType: "${data.sceneType}",
        panoramaUrl: ${data.panoramaUrl ? `"${data.panoramaUrl}"` : 'undefined'},
        standardPhotoUrl: "${data.standardPhotoUrl}",
        thumbnailUrl: "${data.standardPhotoUrl}",
        initialYaw: 0,
        initialPitch: 0,
        historicalNotes: "${historicalNotes.replace(/"/g, '\\"')}",
        sourceMetadata: ${JSON.stringify(data.sourceMetadata, null, 10).replace(/\n/g, '\n        ')},
        hotspots: ${JSON.stringify(data.hotspots, null, 10).replace(/\n/g, '\n        ')}
      }`;

  const oldFullBlock = `tourScenes: [${rawSceneBlock}]`;
  const newFullBlock = `tourScenes: [\n${newScene}\n    ]`;

  content = content.replace(oldFullBlock, newFullBlock);
  console.log(`Updated tourScenes for ${slug} -> ${data.sceneType}`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\nSuccessfully updated sampleData.ts with authentic metadata and scene classifications!');
