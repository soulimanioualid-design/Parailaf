const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, getDocs } = require('firebase/firestore');
const config = require('./firebase-applet-config.json');
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  await setDoc(doc(db, 'products', 'capteur-fsl2-plus-unite'), {
    image: '/assets/images/freestyle_libre2_single_1788260930453.jpg',
    gallery: ['/assets/images/freestyle_libre2_single_1788260930453.jpg']
  }, { merge: true });

  const snap = await getDocs(collection(db, 'products'));
  const prods = [];
  snap.forEach(d => {
    if (d.id !== 'parailaf_catalog_v1') {
       prods.push(d.data());
    }
  });
  
  prods.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  
  const catalogProds = prods.map(p => {
    const slimGallery = (p.gallery || []).filter(img => {
      return !img.startsWith('data:image/') || img.length < 45000;
    });
    let img = p.image;
    if (img && img.startsWith('data:image/') && img.length > 45000) {
      img = ''; 
    }
    return {
      ...p,
      image: img,
      gallery: slimGallery.length > 0 ? slimGallery : (img ? [img] : [])
    };
  });

  await setDoc(doc(db, 'products', 'parailaf_catalog_v1'), {
    products: catalogProds,
    lastUpdated: new Date().toISOString()
  });
  console.log('Fixed product and synced catalog.');
}
run().then(() => process.exit(0)).catch(console.error);
