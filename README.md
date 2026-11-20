# Rosalya — site codé à la main

Site vitrine de Rosalya (projet scolaire), en HTML, CSS et JavaScript, sans framework ni WordPress.

## Pages
- `index.html` : accueil
- `boutique.html` : tous les soins, filtres par catégorie (`?cat=iconiques|cremes|serums|soins-specifiques`) et tri
- `produit.html?p=<slug>` : fiche produit (13 produits)
- `a-propos.html` : histoire, vision, FAQ
- `contact.html` : formulaire (démonstration, aucun envoi)
- `panier.html` : panier (localStorage, paiement désactivé)

## Fichiers
- `assets/js/produits.js` : catalogue (noms, actifs, prix, textes) — c'est ici qu'on modifie un produit
- `assets/js/main.js` : en-tête, pied de page, panier, grilles, animations
- `assets/css/style.css` : styles (couleurs dans `:root`)
- `assets/img/` : photos en WebP
- `assets/fonts/Ginger.ttf` : police du logo

## Aperçu local
Le site est statique : n'importe quel petit serveur suffit, par exemple

```
php -S localhost:8090
```
