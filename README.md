# 🏦 EPC QR Generator

100% frontend web application to generate QR codes compliant with **European Payments Council (EPC)** standards for SEPA transfers.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![No Backend](https://img.shields.io/badge/Backend-None-green.svg)]()
[![Privacy First](https://img.shields.io/badge/Privacy-100%25-success.svg)]()

## 🎯 Features

- ✅ Generation of compliant EPC QR codes (Version 002)
- ✅ Real-time IBAN validation (modulo 97 algorithm)
- ✅ Support for all European Economic Area countries
- ✅ **Custom logo** — Upload your logo (PNG/JPG), choose shape (square/round/original), size (10-40%) and fit (stretched/cropped)
- ✅ **Full QR code customization** — Pixel shape (square/rounded/dots), colors, finder patterns (square/rounded/circle), background color
- ✅ **Information text** — Display transfer details below the QR code, with choice of font and color
- ✅ **Style presets** — Save, load and delete your customization configurations
- ✅ **Internationalization** — Interface available in 🇫🇷 French, 🇬🇧 English, 🇩🇪 German, 🇪🇸 Spanish, 🇮🇹 Italian, 🇳🇱 Dutch
- ✅ **High-resolution export** — Choose the exported QR code resolution (300px, 600px, 900px, 1200px)
- ✅ Download QR code as PNG
- ✅ Copy QR code to clipboard
- ✅ Local history of generated QR codes
- ✅ Dark / Light mode
- ✅ Responsive interface (mobile-friendly)
- ✅ **100% frontend** — no data is sent to any server

## 🚀 Quick Start

### Installation

1. **Clone or download the project**
```bash
git clone https://github.com/your-username/epc-qr-generator.git
cd epc-qr-generator
```

2. **Required file structure**
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

3. **Open in your browser**

### Option 1: Direct usage

Simply open `index.html` in your browser (double-click).

### Option 2: Local server (recommended for development)

```bash
# With Python 3
python -m http.server 8000

# With Node.js
npx serve

# With PHP
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

### Option 3: Deployment

**GitHub Pages**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/epc-qr-generator.git
git push -u origin main
# Enable GitHub Pages in Settings > Pages
```

**Netlify Drop**
- Drag and drop the folder onto [netlify.com/drop](https://app.netlify.com/drop)

**Vercel**
```bash
npm i -g vercel
vercel
```

## 📋 Usage

1. **Fill in the form** with the transfer details:
   - Recipient name (required, max 70 characters)
   - IBAN (required, validated in real time)
   - Amount in EUR (optional)
   - Communication / Reference (optional, max 140 characters)

2. **Click "Generate QR Code"**

3. **Scan the QR code** with your EPC-compatible banking app

4. **Download or copy** the generated QR code

## 🏗️ Architecture

```
epc-qr-generator/
├── index.html              # Main page
├── css/
│   └── styles.css          # Custom styles
├── js/
│   ├── app.js              # Main application logic
│   ├── epcGenerator.js     # EPC format generation
│   ├── i18n.js             # Internationalization (6 languages)
│   ├── ibanValidator.js    # IBAN validation (ISO 13616)
│   ├── qrRenderer.js       # QR code rendering
│   ├── storage.js          # localStorage history management
│   └── darkMode.js         # Dark mode management
└── README.md
```

## 🔧 Technologies Used

- **HTML5** — Semantic structure
- **Tailwind CSS** — CSS framework (via CDN)
- **JavaScript ES6+** — Native modules
- **QR Code Styling** (v1.9.2) — Stylized QR code generation with logo (via CDN)
- **localStorage API** — History persistence

## 📦 Dependencies

All dependencies are loaded via CDN (no npm installation required):

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- QR Code Styling (for styled QR codes with logo) -->
<script src="https://cdn.jsdelivr.net/npm/qr-code-styling@1.9.2/lib/qr-code-styling.min.js"></script>
```

## 🔒 EPC QR Code Format

The generated QR codes comply with the **EPC QR Code Version 002** specification:

```
BCD                           # Service Tag
002                           # Version
1                             # Character set (UTF-8)
SCT                           # Identification (SEPA Credit Transfer)
[BIC]                         # Recipient BIC (optional)
[Recipient name]              # Max 70 characters
[IBAN]                        # Recipient IBAN
EUR[Amount]                   # E.g. EUR123.45 (optional)
[Purpose code]                # Optional (blank)
[Structured reference]        # Optional (blank)
[Unstructured reference]      # Max 140 characters
[Recipient info]              # Optional (blank)
```

### Example

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

## ✅ IBAN Validation

The application validates IBANs according to the **ISO 13616** standard:

1. ✅ Format check (2 country letters + 2 check digits + account number)
2. ✅ Length check by country
3. ✅ Checksum calculation (modulo 97 algorithm)
4. ✅ Support for 32 EEA countries

### Supported countries

🇦🇹 Austria • 🇧🇪 Belgium • 🇧🇬 Bulgaria • 🇭🇷 Croatia • 🇨🇾 Cyprus • 🇨🇿 Czech Republic • 🇩🇰 Denmark • 🇪🇪 Estonia • 🇫🇮 Finland • 🇫🇷 France • 🇩🇪 Germany • 🇬🇷 Greece • 🇭🇺 Hungary • 🇮🇸 Iceland • 🇮🇪 Ireland • 🇮🇹 Italy • 🇱🇻 Latvia • 🇱🇮 Liechtenstein • 🇱🇹 Lithuania • 🇱🇺 Luxembourg • 🇲🇹 Malta • 🇳🇱 Netherlands • 🇳🇴 Norway • 🇵🇱 Poland • 🇵🇹 Portugal • 🇷🇴 Romania • 🇸🇰 Slovakia • 🇸🇮 Slovenia • 🇪🇸 Spain • 🇸🇪 Sweden • 🇨🇭 Switzerland

## 💾 Local Storage

The application uses the browser **localStorage** for:

- 💾 **History**: The last 10 generated QR codes
- 🌓 **Theme preference**: Dark/Light mode
- 🔒 **Privacy**: All data stays on your device

### Accessing history

Click the **"📋 History"** button in the interface to view your recent QR codes.

### Clearing data

```javascript
// In the browser console
localStorage.clear();
```

Or use the "Clear history" button in the interface.

## 🎨 QR Code Customization

A customization panel lets you adapt the QR code appearance to your brand.

### Logo
- **Upload** — Import a PNG or JPG image
- **Shape** — Square, round, or original format
- **Size** — From 10% to 40% of the QR code size
- **Fit** — Stretched or cropped to fit

### Pixels and colors
- **Module shape** — Squares, rounded or dots
- **Module color** — Choose any color
- **Background color** — Customize the background

### Finder patterns
- **Style** — Squares, extra-rounded or circles
- **Frame color** and **center dot color**

### Transaction Info
Display transfer details below the QR code:
- Recipient, formatted IBAN, amount and communication
- Adjustable font, size and color
- Enable/disable as needed

### Export
- Choice of resolution: Standard (300px), High (600px), Very High (900px), Ultra (1200px)
- Download as PNG
- Direct copy to clipboard

### Presets
- **Save** — Save the current configuration under a name
- **Load** — Apply a saved preset
- **Delete** — Remove a preset

Presets are stored in your browser's localStorage.

## 🌐 Internationalization

The interface is available in 6 languages:

| Language        | Code |
|-----------------|------|
| 🇫🇷 French      | `fr` (default) |
| 🇬🇧 English     | `en` |
| 🇩🇪 German      | `de` |
| 🇪🇸 Spanish     | `es` |
| 🇮🇹 Italian     | `it` |
| 🇳🇱 Dutch       | `nl` |

The language is detected automatically via browser preferences, and can be changed at any time using the selector at the top of the page. The choice is saved for subsequent visits.

The translation system uses `data-i18n` attributes in the HTML for dynamic translation without page reload.

## 🎨 Dark Mode

Toggle between light and dark themes using the toggle button at the top right of the interface.

The preference is automatically saved and restored on your next visit.

## 🔐 Security & Privacy

- ✅ **No data sent**: Everything runs in your browser
- ✅ **No cookies**: Uses only localStorage
- ✅ **No tracking**: No analytics or third-party services
- ✅ **Open source**: Publicly auditable code
- ✅ **HTTPS recommended**: For production deployment

## 🧪 Testing

### Recommended manual tests

```bash
# Valid IBANs
BE68 5390 0754 7034   # Belgium
FR14 2004 1010 0505 0001 3M02 606   # France
DE89 3704 0044 0532 0130 00   # Germany

# Invalid IBANs (bad checksum)
BE68 5390 0754 7035
FR14 2004 1010 0505 0001 3M02 607

# Limit amounts
0.01 EUR              # Minimum
999999999.99 EUR      # Maximum

# Special characters
Test emojis, accents, special characters in the communication field
```

### Testing with banking apps

Test the generated QR codes with:
- 📱 Belgian banking apps (BNP Paribas, ING, KBC, Belfius)
- 📱 French banking apps (Boursorama, N26, Revolut)
- 📱 German banking apps (Sparkasse, Deutsche Bank)

## 🐛 Troubleshooting

### The QR code does not generate
- Check that JavaScript is enabled in your browser
- Verify the IBAN is valid and properly formatted
- Open the console (F12) to see errors

### The banking app does not recognize the QR code
- Make sure your bank supports EPC QR codes
- Verify that the amount does not exceed 999999999.99 EUR
- Some banks limit amounts via QR code

### History is not saving
- Check that localStorage is not disabled
- Private browsing mode may prevent storage
- Check available storage space

## 📚 Resources

- [EPC QR Code Guidelines](https://en.wikipedia.org/wiki/EPC_QR_code)
- [ISO 13616 - IBAN Standard](https://www.iso.org/standard/81090.html)
- [SEPA Credit Transfer](https://www.europeanpaymentscouncil.eu/what-we-do/sepa-credit-transfer)
- [py-epc-qr library (Python inspiration)](https://github.com/timueh/py-epc-qr)

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create a branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

### Ideas for Contributions

- [ ] SVG export
- [x] Translations (EN, NL, DE, ES, IT)
- [x] Full customization (colors, logo, presets)
- [ ] Import from CSV file
- [ ] PWA (Progressive Web App)
- [ ] Automated tests
- [ ] Multi-currency support (if EPC standard extension)

## 📄 License

MIT License — See the [LICENSE](LICENSE) file

## ⚠️ Disclaimers

**1st Disclaimer**: The author of this code has no affiliation with the European Payments Council (EPC). You are free to use this code, but any use is at your own risk, including commercial use.

**2nd Disclaimer**: Currently, the EPC specifications are implemented only for SEPA bank transfers based on IBAN in the European Economic Area (EEA).

**3rd Disclaimer**: Although the application generates QR codes compliant with the EPC standard, always test with your actual banking app before production use.

## 🙏 Acknowledgements

- Inspired by the [py-epc-qr](https://github.com/timueh/py-epc-qr) project by Tillmann Mühlpfordt
- QR Code generation by [QR Code Styling](https://github.com/kozakdenys/qr-code-styling)
- Styling by [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For any questions or issues:
- Open an [issue on GitHub](https://github.com/your-username/epc-qr-generator/issues)
- Check the [Troubleshooting](#-troubleshooting) section

---

**Made with ❤️ for SEPA payments**

*Generate EPC QR codes with simplicity, speed and privacy!*
