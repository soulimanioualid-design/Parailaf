const fs = require('fs');
let code = fs.readFileSync('src/context/CartContext.tsx', 'utf8');

code = code.replace(
  `updatedList.forEach(p => {
      setDoc(doc(db, 'products', p.id), { sortOrder: p.sortOrder }, { merge: true })
        .catch(err => console.error("Erreur lors de la mise à jour de l'ordre pour", p.id, err));
    });`,
  `const batch = writeBatch(db);
    updatedList.forEach(p => {
      batch.set(doc(db, 'products', p.id), { sortOrder: p.sortOrder }, { merge: true });
    });
    batch.commit().catch(err => console.error("Erreur lors de la mise à jour de l'ordre:", err));`
);

fs.writeFileSync('src/context/CartContext.tsx', code);
