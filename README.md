# 🏦 Générateur de QR Code EPC

Application web 100% frontend pour générer des QR codes conformes aux standards **European Payments Council (EPC)** pour les virements SEPA.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![No Backend](https://img.shields.io/badge/Backend-None-green.svg)]()
[![Privacy First](https://img.shields.io/badge/Privacy-100%25-success.svg)]()

## 🎯 Fonctionnalités

- ✅ Génération de QR codes EPC conformes (Version 002)
- ✅ Validation IBAN en temps réel (algorithme modulo 97)
- ✅ Support de tous les pays de l'Espace Économique Européen
- ✅ Téléchargement du QR code en PNG
- ✅ Copie du QR code dans le presse-papier
- ✅ Historique local des QR codes générés
- ✅ Mode sombre / clair
- ✅ Interface responsive (mobile-friendly)
- ✅ **100% frontend** - aucune donnée n'est envoyée à un serveur

## 🚀 Démarrage Rapide

### Installation

1. **Clonez ou téléchargez le projet**
```bash
git clone https://github.com/votre-username/epc-qr-generator.git
cd epc-qr-generator
```

2. **Structure des fichiers requise**
```
epc-qr-generator/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── epcGenerator.js
│   ├── ibanValidator.js
│   ├── storage.js
│   └── darkMode.js
├── .gitignore
└── README.md
```

3. **Ouvrez dans votre navigateur**

### Option 1 : Utilisation directe

Ouvrez simplement `index.html` dans votre navigateur (double-clic).

### Option 2 : Serveur local (recommandé pour le développement)

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx serve

# Avec PHP
php -S localhost:8000
```

Puis ouvrez http://localhost:8000 dans votre navigateur.

### Option 3 : Déploiement

**GitHub Pages**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/epc-qr-generator.git
git push -u origin main
# Activez GitHub Pages dans Settings > Pages
```

**Netlify Drop**
- Glissez-déposez le dossier sur [netlify.com/drop](https://app.netlify.com/drop)

**Vercel**
```bash
npm i -g vercel
vercel
```

## 📋 Utilisation

1. **Remplissez le formulaire** avec les informations du virement :
   - Nom du bénéficiaire (obligatoire, max 70 caractères)
   - IBAN (obligatoire, validé en temps réel)
   - Montant en EUR (optionnel)
   - Communication / Référence (optionnel, max 140 caractères)

2. **Cliquez sur "Générer le QR Code"**

3. **Scannez le QR code** avec votre application bancaire compatible EPC

4. **Téléchargez ou copiez** le QR code généré

## 🏗️ Architecture

```
epc-qr-generator/
├── index.html              # Page principale
├── css/
│   └── styles.css          # Styles personnalisés (optionnel)
├── js/
│   ├── app.js              # Logique principale de l'application
│   ├── epcGenerator.js     # Génération du format EPC
│   ├── ibanValidator.js    # Validation IBAN (ISO 13616)
│   ├── qrRenderer.js       # Rendu du QR code
│   ├── storage.js          # Gestion de l'historique localStorage
│   └── darkMode.js         # Gestion du mode sombre
└── README.md
```

## 🔧 Technologies Utilisées

- **HTML5** - Structure sémantique
- **Tailwind CSS** - Framework CSS (via CDN)
- **JavaScript ES6+** - Modules natifs
- **QRCode.js** - Génération de QR codes (via CDN)
- **localStorage API** - Persistance de l'historique

## 📦 Dépendances

Toutes les dépendances sont chargées via CDN (aucune installation npm requise) :

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- QRCode.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
```

## 🔒 Format EPC QR Code

Les QR codes générés respectent la spécification **EPC QR Code Version 002** :

```
BCD                           # Service Tag
002                           # Version
1                             # Character set (UTF-8)
SCT                           # Identification (SEPA Credit Transfer)
[BIC]                         # BIC du bénéficiaire (optionnel)
[Nom du bénéficiaire]         # Max 70 caractères
[IBAN]                        # IBAN du bénéficiaire
EUR[Montant]                  # Ex: EUR123.45 (optionnel)
[Code purpose]                # Optionnel (vide)
[Référence structurée]        # Optionnel (vide)
[Référence non structurée]    # Max 140 caractères
[Infos bénéficiaire]          # Optionnel (vide)
```

### Exemple

```
BCD
002
1
SCT

Wikimedia Foerdergesellschaft
DE33100205000001194700
EUR123.45


Donation pour Wikipedia

```

## ✅ Validation IBAN

L'application valide les IBAN selon la norme **ISO 13616** :

1. ✅ Vérification du format (2 lettres pays + 2 chiffres contrôle + compte)
2. ✅ Vérification de la longueur selon le pays
3. ✅ Calcul de la somme de contrôle (algorithme modulo 97)
4. ✅ Support de 32 pays de l'EEE

### Pays supportés

🇦🇹 Autriche • 🇧🇪 Belgique • 🇧🇬 Bulgarie • 🇭🇷 Croatie • 🇨🇾 Chypre • 🇨🇿 Tchéquie • 🇩🇰 Danemark • 🇪🇪 Estonie • 🇫🇮 Finlande • 🇫🇷 France • 🇩🇪 Allemagne • 🇬🇷 Grèce • 🇭🇺 Hongrie • 🇮🇸 Islande • 🇮🇪 Irlande • 🇮🇹 Italie • 🇱🇻 Lettonie • 🇱🇮 Liechtenstein • 🇱🇹 Lituanie • 🇱🇺 Luxembourg • 🇲🇹 Malte • 🇳🇱 Pays-Bas • 🇳🇴 Norvège • 🇵🇱 Pologne • 🇵🇹 Portugal • 🇷🇴 Roumanie • 🇸🇰 Slovaquie • 🇸🇮 Slovénie • 🇪🇸 Espagne • 🇸🇪 Suède • 🇨🇭 Suisse

## 💾 Stockage Local

L'application utilise le **localStorage** du navigateur pour :

- 💾 **Historique** : Les 10 derniers QR codes générés
- 🌓 **Préférence de thème** : Mode sombre/clair
- 🔒 **Vie privée** : Toutes les données restent sur votre appareil

### Accéder à l'historique

Cliquez sur le bouton **"📋 Historique"** dans l'interface pour afficher vos QR codes récents.

### Effacer les données

```javascript
// Dans la console du navigateur
localStorage.clear();
```

Ou utilisez le bouton "Effacer l'historique" dans l'interface.

## 🎨 Mode Sombre

Basculez entre les thèmes clair et sombre avec le bouton toggle en haut à droite de l'interface.

La préférence est automatiquement sauvegardée et restaurée lors de votre prochaine visite.

## 🔐 Sécurité & Vie Privée

- ✅ **Aucune donnée envoyée** : Tout s'exécute dans votre navigateur
- ✅ **Pas de cookies** : Utilisation uniquement de localStorage
- ✅ **Pas de tracking** : Aucun analytics ou service tiers
- ✅ **Open source** : Code auditable publiquement
- ✅ **HTTPS recommandé** : Pour le déploiement en production

## 🧪 Tests

### Tests manuels recommandés

```bash
# IBAN valides
BE68 5390 0754 7034   # Belgique
FR14 2004 1010 0505 0001 3M02 606   # France
DE89 3704 0044 0532 0130 00   # Allemagne

# IBAN invalides (mauvaise somme de contrôle)
BE68 5390 0754 7035
FR14 2004 1010 0505 0001 3M02 607

# Montants limites
0.01 EUR              # Minimum
999999999.99 EUR      # Maximum

# Caractères spéciaux
Tester émojis, accents, caractères spéciaux dans la communication
```

### Test avec applications bancaires

Testez les QR codes générés avec :
- 📱 Applications bancaires belges (BNP Paribas, ING, KBC, Belfius)
- 📱 Applications bancaires françaises (Boursorama, N26, Revolut)
- 📱 Applications bancaires allemandes (Sparkasse, Deutsche Bank)

## 🐛 Résolution de problèmes

### Le QR code ne se génère pas
- Vérifiez que JavaScript est activé dans votre navigateur
- Vérifiez que l'IBAN est valide et bien formaté
- Ouvrez la console (F12) pour voir les erreurs

### L'application bancaire ne reconnaît pas le QR code
- Assurez-vous que votre banque supporte les QR codes EPC
- Vérifiez que le montant ne dépasse pas 999999999.99 EUR
- Certaines banques limitent les montants via QR code

### L'historique ne se sauvegarde pas
- Vérifiez que le localStorage n'est pas désactivé
- Le mode navigation privée peut empêcher le stockage
- Vérifiez l'espace de stockage disponible

## 📚 Ressources

- [EPC QR Code Guidelines](https://en.wikipedia.org/wiki/EPC_QR_code)
- [ISO 13616 - IBAN Standard](https://www.iso.org/standard/81090.html)
- [SEPA Credit Transfer](https://www.europeanpaymentscouncil.eu/what-we-do/sepa-credit-transfer)
- [Bibliothèque py-epc-qr (inspiration Python)](https://github.com/timueh/py-epc-qr)

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Committez vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

### Idées de contributions

- [ ] Export en SVG
- [ ] Support du BIC optionnel
- [ ] Import depuis fichier CSV
- [ ] PWA (Progressive Web App)
- [ ] Tests automatisés
- [ ] Support multidevises (si extension standard EPC)
- [ ] Traductions (EN, NL, DE)
- [ ] Customisation des couleurs du QR code

## 📄 Licence

MIT License - Voir le fichier [LICENSE](LICENSE)

## ⚠️ Disclaimers

**1er Disclaimer** : L'auteur de ce code n'a aucune affiliation avec le European Payments Council (EPC). Vous êtes libre d'utiliser ce code, mais toute utilisation est à vos propres risques, notamment commerciaux.

**2ème Disclaimer** : Actuellement, les spécifications EPC sont implémentées uniquement pour les virements bancaires SEPA basés sur IBAN dans l'Espace Économique Européen (EEE).

**3ème Disclaimer** : Bien que l'application génère des QR codes conformes au standard EPC, testez toujours avec votre application bancaire réelle avant utilisation en production.

## 🙏 Remerciements

- Inspiré du projet [py-epc-qr](https://github.com/timueh/py-epc-qr) de Tillmann Mühlpfordt
- QR Code generation par [QRCode.js](https://github.com/davidshimjs/qrcodejs)
- Styling par [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

Pour toute question ou problème :
- Ouvrez une [issue sur GitHub](https://github.com/votre-username/epc-qr-generator/issues)
- Consultez la section [Résolution de problèmes](#-résolution-de-problèmes)

---

**Made with ❤️ for SEPA payments**

*Générez des QR codes EPC en toute simplicité, rapidité et confidentialité !*