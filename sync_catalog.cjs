const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, getDocs } = require('firebase/firestore');
const config = require('./firebase-applet-config.json');
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
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
  console.log('Catalog synced.');
}
run().then(() => process.exit(0)).catch(console.error);
