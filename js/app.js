import EPCGenerator from './epcGenerator.js';
import IBANValidator from './ibanValidator.js';
import QRHistory from './storage.js';
import DarkMode from './darkMode.js';
import { t, getLang, setLang, translatePage } from './i18n.js';

/**
 * Application principale de génération de QR codes EPC
 */
class EPCQRApp {
    constructor() {
        this.epcGenerator = new EPCGenerator();
        this.ibanValidator = new IBANValidator();
        this.qrHistory = new QRHistory();
        this.darkMode = new DarkMode();
        this.currentQR = null;
        this.qrStylingInstance = null;
        this.logoDataUrl = null;
        this.styleDefaults = {};

        this.initializeElements();
        this.attachEventListeners();
        this.applyDarkMode();
        this.saveStyleDefaults();
        this.initLanguage();
        this.loadPresets();
    }

    /**
     * Sauvegarde les valeurs par défaut des styles
     */
    saveStyleDefaults() {
        this.styleDefaults = {
            pixelShape: 'square',
            pixelColor: '#000000',
            bgColor: '#ffffff',
            cornersStyle: 'square',
            cornersFrameColor: '#000000',
            cornersDotColor: '#000000',
            logoSize: 25,
            logoShape: 'square',
            logoFit: 'deform',
            textInfoEnabled: false,
            textFontFamily: 'Arial, sans-serif',
            textFontSize: 16,
            textColor: '#000000',
            qrResolution: 600,
        };
    }

    /**
     * Initialise les références aux éléments DOM
     */
    initializeElements() {
        // Formulaire
        this.form = document.getElementById('epcForm');
        this.beneficiaryInput = document.getElementById('beneficiary');
        this.ibanInput = document.getElementById('iban');
        this.amountInput = document.getElementById('amount');
        this.remittanceInput = document.getElementById('remittance');

        // Compteurs de caractères
        this.beneficiaryCount = document.getElementById('beneficiaryCount');
        this.remittanceCount = document.getElementById('remittanceCount');

        // Feedback IBAN
        this.ibanFeedback = document.getElementById('ibanFeedback');

        // Sections
        this.formSection = document.getElementById('formSection');
        this.qrResult = document.getElementById('qrResult');
        this.qrcodeDiv = document.getElementById('qrcode');
        this.qrcodeWrapper = document.getElementById('qrcodeWrapper');
        this.qrCodeBg = document.getElementById('qrCodeBg');

        // Affichage des données
        this.displayBeneficiary = document.getElementById('displayBeneficiary');
        this.displayIban = document.getElementById('displayIban');
        this.displayAmount = document.getElementById('displayAmount');
        this.displayRemittance = document.getElementById('displayRemittance');
        this.displayRemittanceContainer = document.getElementById('displayRemittanceContainer');

        // Boutons
        this.downloadBtn = document.getElementById('downloadBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.newQrBtn = document.getElementById('newQrBtn');
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.langSelect = document.getElementById('langSelect');
        this.historyBtn = document.getElementById('historyBtn');

        // Modal historique
        this.historyModal = document.getElementById('historyModal');
        this.historyContent = document.getElementById('historyContent');
        this.closeHistoryBtn = document.getElementById('closeHistoryBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.historyClearSection = document.getElementById('historyClearSection');

        // --- Personnalisation QR Code ---
        this.logoFileInput = document.getElementById('logoFileInput');
        this.logoRemoveBtn = document.getElementById('logoRemoveBtn');
        this.logoShapeRadios = document.querySelectorAll('input[name="logoShape"]');
        this.logoFitRadios = document.querySelectorAll('input[name="logoFit"]');
        this.logoSizeSlider = document.getElementById('logoSizeSlider');
        this.logoSizeValue = document.getElementById('logoSizeValue');

        this.pixelShapeSelect = document.getElementById('pixelShapeSelect');
        this.pixelColorInput = document.getElementById('pixelColorInput');
        this.pixelColorText = document.getElementById('pixelColorText');

        this.bgColorInput = document.getElementById('bgColorInput');
        this.bgColorText = document.getElementById('bgColorText');

        this.cornersStyleSelect = document.getElementById('cornersStyleSelect');
        this.cornersFrameColorInput = document.getElementById('cornersFrameColorInput');
        this.cornersFrameColorText = document.getElementById('cornersFrameColorText');
        this.cornersDotColorInput = document.getElementById('cornersDotColorInput');
        this.cornersDotColorText = document.getElementById('cornersDotColorText');

        this.resetStylesBtn = document.getElementById('resetStylesBtn');
        this.customizationAccordion = document.getElementById('customizationAccordion');

        // --- Infos Transaction ---
        this.textInfoToggle = document.getElementById('textInfoToggle');
        this.textFontSelect = document.getElementById('textFontSelect');
        this.textFontSizeSlider = document.getElementById('textFontSizeSlider');
        this.textFontSizeValue = document.getElementById('textFontSizeValue');
        this.textColorInput = document.getElementById('textColorInput');
        this.textColorText = document.getElementById('textColorText');
        this.qrTextAbove = document.getElementById('qrTextAbove');
        this.qrTextBelow = document.getElementById('qrTextBelow');
        this.qrResolutionSelect = document.getElementById('qrResolutionSelect');

        // Presets
        this.presetNameInput = document.getElementById('presetNameInput');
        this.savePresetBtn = document.getElementById('savePresetBtn');
        this.presetSelect = document.getElementById('presetSelect');
        this.deletePresetBtn = document.getElementById('deletePresetBtn');
    }

    /**
     * Attache les événements aux éléments
     */
    attachEventListeners() {
        // Soumission formulaire
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateQRCode();
        });

        // Réinitialisation formulaire
        this.form.addEventListener('reset', () => {
            this.resetForm();
        });

        // Compteurs de caractères
        this.beneficiaryInput.addEventListener('input', () => {
            this.beneficiaryCount.textContent = this.beneficiaryInput.value.length;
        });

        this.remittanceInput.addEventListener('input', () => {
            this.remittanceCount.textContent = this.remittanceInput.value.length;
        });

        // Validation IBAN en temps réel
        this.ibanInput.addEventListener('input', () => {
            this.validateIbanRealtime();
        });

        // Formatage IBAN au blur
        this.ibanInput.addEventListener('blur', () => {
            if (this.ibanInput.value) {
                this.ibanInput.value = this.ibanValidator.format(this.ibanInput.value);
            }
        });

        // Actions QR Code
        this.downloadBtn.addEventListener('click', () => this.downloadQRCode());
        this.copyBtn.addEventListener('click', () => this.copyQRCode());
        this.newQrBtn.addEventListener('click', () => this.resetApp());

        // Mode sombre
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        // Langue
        this.langSelect.addEventListener('change', () => {
            setLang(this.langSelect.value);
            this.onLanguageChange();
        });

        // Historique
        this.historyBtn.addEventListener('click', () => this.showHistory());
        this.closeHistoryBtn.addEventListener('click', () => this.hideHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Fermer modal en cliquant à l'extérieur
        this.historyModal.addEventListener('click', (e) => {
            if (e.target === this.historyModal) {
                this.hideHistory();
            }
        });

        // --- Personnalisation QR Code ---

        // Logo upload
        this.logoFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.logoDataUrl = event.target.result;
                    this.updateQRCode();
                };
                reader.readAsDataURL(file);
            }
        });

        // Logo remove
        this.logoRemoveBtn.addEventListener('click', () => {
            this.logoDataUrl = null;
            this.logoFileInput.value = '';
            this.updateQRCode();
        });

        // Logo shape
        this.logoShapeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateQRCode();
            });
        });

        // Logo fit
        this.logoFitRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateQRCode();
            });
        });

        // Logo size slider
        this.logoSizeSlider.addEventListener('input', () => {
            this.logoSizeValue.textContent = this.logoSizeSlider.value;
            this.updateQRCode();
        });

        // Pixel shape
        this.pixelShapeSelect.addEventListener('change', () => {
            this.updateQRCode();
        });

        // Pixel color - sync input+text
        this.pixelColorInput.addEventListener('input', () => {
            this.pixelColorText.value = this.pixelColorInput.value;
            this.updateQRCode();
        });
        this.pixelColorText.addEventListener('input', () => {
            const val = this.pixelColorText.value;
            if (/^#[0-9a-f]{6}$/i.test(val)) {
                this.pixelColorInput.value = val;
                this.updateQRCode();
            }
        });

        // BG color - sync input+text
        this.bgColorInput.addEventListener('input', () => {
            this.bgColorText.value = this.bgColorInput.value;
            this.updateQRCode();
            this.updateQRBackground();
        });
        this.bgColorText.addEventListener('input', () => {
            const val = this.bgColorText.value;
            if (/^#[0-9a-f]{6}$/i.test(val)) {
                this.bgColorInput.value = val;
                this.updateQRCode();
                this.updateQRBackground();
            }
        });

        // Corners style
        this.cornersStyleSelect.addEventListener('change', () => {
            this.updateQRCode();
        });

        // Corners frame color - sync input+text
        this.cornersFrameColorInput.addEventListener('input', () => {
            this.cornersFrameColorText.value = this.cornersFrameColorInput.value;
            this.updateQRCode();
        });
        this.cornersFrameColorText.addEventListener('input', () => {
            const val = this.cornersFrameColorText.value;
            if (/^#[0-9a-f]{6}$/i.test(val)) {
                this.cornersFrameColorInput.value = val;
                this.updateQRCode();
            }
        });

        // Corners dot color - sync input+text
        this.cornersDotColorInput.addEventListener('input', () => {
            this.cornersDotColorText.value = this.cornersDotColorInput.value;
            this.updateQRCode();
        });
        this.cornersDotColorText.addEventListener('input', () => {
            const val = this.cornersDotColorText.value;
            if (/^#[0-9a-f]{6}$/i.test(val)) {
                this.cornersDotColorInput.value = val;
                this.updateQRCode();
            }
        });

        // --- Infos Transaction events ---
        this.textInfoToggle.addEventListener('change', () => {
            this.updateTransactionDisplay();
        });

        this.textFontSelect.addEventListener('change', () => {
            this.updateTransactionDisplay();
        });

        this.textFontSizeSlider.addEventListener('input', () => {
            this.textFontSizeValue.textContent = this.textFontSizeSlider.value;
            this.updateTransactionDisplay();
        });

        this.textColorInput.addEventListener('input', () => {
            this.textColorText.value = this.textColorInput.value;
            this.updateTransactionDisplay();
        });
        this.textColorText.addEventListener('input', () => {
            const val = this.textColorText.value;
            if (/^#[0-9a-f]{6}$/i.test(val)) {
                this.textColorInput.value = val;
                this.updateTransactionDisplay();
            }
        });

        // Reset styles
        this.resetStylesBtn.addEventListener('click', () => {
            this.resetStyles();
        });

        // QR Resolution change (re-render at new size)
        this.qrResolutionSelect.addEventListener('change', () => {
            this.rerenderQRCode();
        });

        // Presets
        this.savePresetBtn.addEventListener('click', () => this.savePreset());
        this.presetSelect.addEventListener('change', () => this.loadPreset());
        this.deletePresetBtn.addEventListener('click', () => this.deletePreset());
    }

    /**
     * Récupère les options de style actuelles
     */
    getStyleOptions() {
        const logoSize = parseInt(this.logoSizeSlider?.value || '25');

        return {
            image: this.logoDataUrl,
            imageOptions: {
                crossOrigin: 'anonymous',
                margin: Math.round(10 - (logoSize - 10) * 0.2),
                imageSize: logoSize / 100,
                hideBackgroundDots: true
            },
            dotsOptions: {
                color: this.pixelColorInput?.value || '#000000',
                type: this.pixelShapeSelect?.value || 'square'
            },
            cornersSquareOptions: {
                color: this.cornersFrameColorInput?.value || '#000000',
                type: this.cornersStyleSelect?.value || 'square'
            },
            cornersDotOptions: {
                color: this.cornersDotColorInput?.value || '#000000',
                type: this.cornersStyleSelect?.value || 'square'
            },
            backgroundOptions: {
                color: this.bgColorInput?.value || '#ffffff'
            }
        };
    }

    /**
     * Traite le logo selon les options de forme et d'ajustement
     */
    async processLogo() {
        if (!this.logoDataUrl) return null;

        try {
            const logoFit = document.querySelector('input[name="logoFit"]:checked')?.value || 'deform';
            const logoShape = document.querySelector('input[name="logoShape"]:checked')?.value || 'square';

            let image = this.logoDataUrl;

            // Étape 1: Mise à l'échelle dans un canvas carré (sauf mode Original)
            if (logoShape !== 'original') {
                if (logoFit === 'deform') {
                    image = await this.deformImage(image);
                } else { // crop / recadrer
                    image = await this.fitContain(image);
                }
            }
            // Mode Original: on garde l'image brute (pas de forme forcée)

            // Étape 2: Forme ronde
            if (logoShape === 'round') {
                image = await this.cropToCircle(image);
            }

            return image;
        } catch (error) {
            console.error('Logo processing failed:', error);
            return null; // Return null to render QR without logo
        }
    }

    /**
     * Ajuste une image pour couvrir un carré sans déformation (object-fit: cover)
     */
    fitCover(dataUrl) {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const size = 600;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        return new Promise((resolve) => {
            img.onload = () => {
                const sRatio = Math.max(size / img.width, size / img.height);
                const dx = (size - img.width * sRatio) / 2;
                const dy = (size - img.height * sRatio) / 2;
                ctx.drawImage(img, dx, dy, img.width * sRatio, img.height * sRatio);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve(dataUrl);
            img.src = dataUrl;
        });
    }

    /**
     * Ajuste l'image pour tenir dans le carré sans déformation
     * (object-fit: contain) en respectant l'axe choisi
     */
    fitContain(dataUrl) {
        const img = new Image();
        return new Promise((resolve) => {
            img.onload = () => {
                const size = Math.max(img.width, img.height);
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                const scale = Math.min(size / img.width, size / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                const dx = (size - w) / 2;
                const dy = (size - h) / 2;
                ctx.drawImage(img, dx, dy, w, h);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve(dataUrl);
            img.src = dataUrl;
        });
    }

    /**
     * Découpe une image en cercle sur un canvas
     */
    cropToCircle(dataUrl) {
        const img = new Image();
        return new Promise((resolve) => {
            img.onload = () => {
                const size = Math.max(img.width, img.height);
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.save();
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, 0, 0, size, size);
                ctx.restore();
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve(dataUrl);
            img.src = dataUrl;
        });
    }

    /**
     * Déforme l'image pour remplir un carré (stretch)
     */
    deformImage(dataUrl) {
        const img = new Image();
        return new Promise((resolve) => {
            img.onload = () => {
                const size = Math.max(img.width, img.height);
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, size, size);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve(dataUrl);
            img.src = dataUrl;
        });
    }

    /**
     * Construit le texte des infos de transaction
     */
    getTransactionTextLines() {
        if (!this.currentQR) return [];
        const data = this.currentQR.data;
        const lines = [
            `${data.beneficiary}`,
            `${this.ibanValidator.format(data.iban)}`
        ];
        if (data.amount) {
            lines.push(`${parseFloat(data.amount).toFixed(2)} EUR`);
        }
        if (data.remittance) {
            lines.push(`${data.remittance}`);
        }
        return lines;
    }

    /**
     * Affiche les détails de la transaction dans les éléments display
     */
    displayTransactionDetails(data) {
        if (!data) return;
        this.displayBeneficiary.textContent = data.beneficiary;
        this.displayIban.textContent = this.ibanValidator.format(data.iban);
        this.displayAmount.textContent = data.amount ? `${parseFloat(data.amount).toFixed(2)} EUR` : t('result.amountFree');
        if (data.remittance) {
            this.displayRemittance.textContent = data.remittance;
            this.displayRemittanceContainer.classList.remove('hidden');
        } else {
            this.displayRemittanceContainer.classList.add('hidden');
        }
    }

    /**
     * Met à jour l'affichage du texte des infos transaction
     */
    updateTransactionDisplay() {
        const show = this.textInfoToggle?.checked || false;
        const position = 'below';
        const fontFamily = this.textFontSelect?.value || 'Arial, sans-serif';
        const fontSize = parseInt(this.textFontSizeSlider?.value || '16');
        const color = this.textColorInput?.value || '#000000';

        const lines = this.getTransactionTextLines();
        const html = lines.map(line => `<div>${this.escapeHtml(line)}</div>`).join('');

        const style = `font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${color}; overflow-wrap: break-word; word-wrap: break-word;`;

        // Cache les deux conteneurs
        this.qrTextAbove.classList.add('hidden');
        this.qrTextBelow.classList.add('hidden');
        this.qrTextAbove.innerHTML = '';
        this.qrTextBelow.innerHTML = '';

        if (!show || lines.length === 0) return;

        const container = position === 'above' ? this.qrTextAbove : this.qrTextBelow;
        container.innerHTML = html;
        container.style.cssText = style;
        container.classList.remove('hidden');
    }

    /**
     * Met à jour le fond du QR code et du texte selon la couleur choisie
     */
    updateQRBackground() {
        const bgColor = this.bgColorInput?.value || '#ffffff';
        if (this.qrCodeBg) {
            this.qrCodeBg.style.background = bgColor;
        }
    }

    /**
     * Échappe les caractères HTML
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Crée un canvas combiné QR + texte pour téléchargement/copie
     */
    getCombinedCanvas() {
        const canvas = this.qrcodeDiv.querySelector('canvas');
        if (!canvas) return null;

        const show = this.textInfoToggle?.checked || false;
        if (!show) return canvas;

        const position = 'below';
        const fontFamily = this.textFontSelect?.value || 'Arial, sans-serif';
        const fontSize = parseInt(this.textFontSizeSlider?.value || '16');
        const color = this.textColorInput?.value || '#000000';

        const lines = this.getTransactionTextLines();
        if (lines.length === 0) return canvas;

        const padding = 14;
        const lineHeight = fontSize * 1.4;

        // Mesure la largeur disponible et wrap les lignes
        const tempCtx = document.createElement('canvas').getContext('2d');
        tempCtx.font = `${fontSize}px ${fontFamily}`;
        const maxTextWidth = canvas.width - padding * 2;

        const wrappedLines = [];
        lines.forEach(line => {
            if (tempCtx.measureText(line).width <= maxTextWidth) {
                wrappedLines.push(line);
            } else {
                const words = line.split(' ');
                let currentLine = '';
                for (const word of words) {
                    const testLine = currentLine ? currentLine + ' ' + word : word;
                    if (tempCtx.measureText(testLine).width <= maxTextWidth) {
                        currentLine = testLine;
                    } else {
                        if (currentLine) wrappedLines.push(currentLine);
                        currentLine = word;
                    }
                }
                if (currentLine) wrappedLines.push(currentLine);
            }
        });

        const totalLines = wrappedLines.length;
        const textBlockHeight = totalLines * lineHeight + padding * 2;

        const combinedCanvas = document.createElement('canvas');
        const ctx = combinedCanvas.getContext('2d');
        combinedCanvas.width = canvas.width;
        combinedCanvas.height = canvas.height + textBlockHeight;

        const qrY = position === 'above' ? textBlockHeight : 0;
        const textY = position === 'above' ? padding + fontSize : canvas.height + padding + fontSize;

        // Fond blanc
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

        // Dessine le QR code
        ctx.drawImage(canvas, 0, qrY);

        // Dessine le texte wrapé
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'left';
        ctx.fillStyle = color;

        wrappedLines.forEach((line, i) => {
            ctx.fillText(line, padding, textY + i * lineHeight);
        });

        return combinedCanvas;
    }

    /**
     * Applique le mode sombre au chargement
     */
    applyDarkMode() {
        this.darkMode.apply();
    }

    /**
     * Bascule le mode sombre
     */
    toggleDarkMode() {
        this.darkMode.toggle();
    }

    /**
     * Valide l'IBAN en temps réel
     */
    validateIbanRealtime() {
        const iban = this.ibanInput.value;

        if (iban.length < 15) {
            this.ibanFeedback.innerHTML = '';
            this.ibanInput.classList.remove('border-green-300', 'dark:border-green-600', 'border-red-300', 'dark:border-red-600');
            return;
        }

        const validation = this.ibanValidator.validate(iban);

        if (validation.valid) {
            this.ibanFeedback.innerHTML = `
        <span class="text-green-600 dark:text-green-400 text-sm flex items-center">
          ${t('iban.valid', { country: validation.country })}
        </span>
      `;
            this.ibanInput.classList.remove('border-red-300', 'dark:border-red-600');
            this.ibanInput.classList.add('border-green-300', 'dark:border-green-600');
        } else {
            this.ibanFeedback.innerHTML = `
        <span class="text-red-600 dark:text-red-400 text-sm">
          ${t('iban.invalid', { error: validation.error })}
        </span>
      `;
            this.ibanInput.classList.remove('border-green-300', 'dark:border-green-600');
            this.ibanInput.classList.add('border-red-300', 'dark:border-red-600');
        }
    }

    /**
     * Génère le QR code
     */
    generateQRCode() {
        try {
            const data = {
                beneficiary: this.beneficiaryInput.value,
                iban: this.ibanInput.value,
                amount: this.amountInput.value,
                remittance: this.remittanceInput.value
            };

            const ibanValidation = this.ibanValidator.validate(data.iban);
            if (!ibanValidation.valid) {
                alert(`❌ ${ibanValidation.error}`);
                return;
            }

            const epcString = this.epcGenerator.generate(data);

            this.qrHistory.save({
                epcString,
                formData: data
            });

            this.renderQRCode(epcString, data);

        } catch (error) {
            alert(t('error.generic', { message: error.message }));
        }
    }

    /**
     * Affiche le QR code avec qr-code-styling
     */
    async renderQRCode(epcString, data) {
        this.qrcodeDiv.innerHTML = '';

        const styleOptions = this.getStyleOptions();
        const image = await this.processLogo();

        const qrSize = this.getQrSize();
        const options = {
            width: qrSize,
            height: qrSize,
            data: epcString,
            image: image,
            dotsOptions: styleOptions.dotsOptions,
            cornersSquareOptions: styleOptions.cornersSquareOptions,
            cornersDotOptions: styleOptions.cornersDotOptions,
            backgroundOptions: styleOptions.backgroundOptions,
            imageOptions: styleOptions.imageOptions
        };

        this.qrStylingInstance = new QRCodeStyling(options);
        this.qrStylingInstance.append(this.qrcodeDiv);

        this.displayTransactionDetails(data);

        this.currentQR = { epcString, data };

        // Met à jour l'affichage du texte
        this.updateTransactionDisplay();

        this.qrResult.classList.remove('hidden');
        this.qrResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        this.updateQRBackground();
    }

    /**
     * Met à jour le QR code existant avec les nouveaux styles
     */
    async updateQRCode() {
        if (!this.qrStylingInstance || !this.currentQR) return;

        try {
            const styleOptions = this.getStyleOptions();
            const image = await this.processLogo();

            this.qrStylingInstance.update({
                image: image,
                dotsOptions: styleOptions.dotsOptions,
                cornersSquareOptions: styleOptions.cornersSquareOptions,
                cornersDotOptions: styleOptions.cornersDotOptions,
                backgroundOptions: styleOptions.backgroundOptions,
                imageOptions: styleOptions.imageOptions
            });
        } catch (error) {
            console.error('QR update failed, retrying without logo:', error);
            // Fallback: render without logo
            this.logoDataUrl = null;
            const styleOptions = this.getStyleOptions();
            this.qrStylingInstance.update({
                image: null,
                dotsOptions: styleOptions.dotsOptions,
                cornersSquareOptions: styleOptions.cornersSquareOptions,
                cornersDotOptions: styleOptions.cornersDotOptions,
                backgroundOptions: styleOptions.backgroundOptions,
                imageOptions: styleOptions.imageOptions
            });
        }
    }

    /**
     * Retourne la taille du QR code en pixels selon le choix utilisateur
     */
    getQrSize() {
        return parseInt(this.qrResolutionSelect?.value || '300');
    }

    /**
     * Re-render le QR code avec la même data mais une nouvelle taille/résolution
     */
    rerenderQRCode() {
        if (!this.currentQR) return;
        this.renderQRCode(this.currentQR.epcString, this.currentQR.data);
    }

    /**
     * Charge les presets depuis le localStorage
     */
    loadPresets() {
        try {
            const stored = localStorage.getItem('epcQrPresets');
            this.presets = stored ? JSON.parse(stored) : {};
        } catch {
            this.presets = {};
        }
        this.populatePresetSelect();
    }

    /**
     * Sauvegarde les presets dans le localStorage
     */
    storePresets() {
        try {
            localStorage.setItem('epcQrPresets', JSON.stringify(this.presets));
        } catch {
            // localStorage plein ou désactivé — silencieux
        }
        this.populatePresetSelect();
    }

    /**
     * Remplit le select avec les presets disponibles
     */
    populatePresetSelect() {
        const currentValue = this.presetSelect.value;
        this.presetSelect.innerHTML = '<option value="">Presets...</option>';
        Object.keys(this.presets).sort().forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            this.presetSelect.appendChild(option);
        });
        // Restaure la sélection si le preset existe encore
        if (currentValue && this.presets[currentValue]) {
            this.presetSelect.value = currentValue;
        }
    }

    /**
     * Lit toutes les valeurs actuelles des contrôles
     */
    readCurrentStyles() {
        const logoShape = document.querySelector('input[name="logoShape"]:checked');
        const logoFit = document.querySelector('input[name="logoFit"]:checked');
        return {
            pixelShape: this.pixelShapeSelect?.value || 'square',
            pixelColor: this.pixelColorInput?.value || '#000000',
            bgColor: this.bgColorInput?.value || '#ffffff',
            cornersStyle: this.cornersStyleSelect?.value || 'square',
            cornersFrameColor: this.cornersFrameColorInput?.value || '#000000',
            cornersDotColor: this.cornersDotColorInput?.value || '#000000',
            logoSize: parseInt(this.logoSizeSlider?.value || '25'),
            logoShape: logoShape?.value || 'square',
            logoFit: logoFit?.value || 'deform',
            logoDataUrl: this.logoDataUrl,
            textInfoEnabled: this.textInfoToggle?.checked || false,
            textInfoPosition: 'below',
            textFontFamily: this.textFontSelect?.value || 'Arial, sans-serif',
            textFontSize: parseInt(this.textFontSizeSlider?.value || '16'),
            textColor: this.textColorInput?.value || '#000000',
            qrResolution: parseInt(this.qrResolutionSelect?.value || '300')
        };
    }

    /**
     * Applique des styles à tous les contrôles
     */
    applyStyles(styles) {
        if (!styles) return;

        this.pixelShapeSelect.value = styles.pixelShape || this.styleDefaults.pixelShape;
        this.pixelColorInput.value = styles.pixelColor || this.styleDefaults.pixelColor;
        this.pixelColorText.value = styles.pixelColor || this.styleDefaults.pixelColor;
        this.bgColorInput.value = styles.bgColor || this.styleDefaults.bgColor;
        this.bgColorText.value = styles.bgColor || this.styleDefaults.bgColor;
        this.cornersStyleSelect.value = styles.cornersStyle || this.styleDefaults.cornersStyle;
        this.cornersFrameColorInput.value = styles.cornersFrameColor || this.styleDefaults.cornersFrameColor;
        this.cornersFrameColorText.value = styles.cornersFrameColor || this.styleDefaults.cornersFrameColor;
        this.cornersDotColorInput.value = styles.cornersDotColor || this.styleDefaults.cornersDotColor;
        this.cornersDotColorText.value = styles.cornersDotColor || this.styleDefaults.cornersDotColor;
        this.logoSizeSlider.value = styles.logoSize || this.styleDefaults.logoSize;
        this.logoSizeValue.textContent = styles.logoSize || this.styleDefaults.logoSize;

        this.logoShapeRadios.forEach(radio => {
            radio.checked = radio.value === (styles.logoShape || this.styleDefaults.logoShape);
        });
        this.logoFitRadios.forEach(radio => {
            radio.checked = radio.value === (styles.logoFit || this.styleDefaults.logoFit);
        });

        this.textInfoToggle.checked = styles.textInfoEnabled ?? this.styleDefaults.textInfoEnabled;
        this.textFontSelect.value = styles.textFontFamily || this.styleDefaults.textFontFamily;
        this.textFontSizeSlider.value = styles.textFontSize || this.styleDefaults.textFontSize;
        this.textFontSizeValue.textContent = styles.textFontSize || this.styleDefaults.textFontSize;
        this.textColorInput.value = styles.textColor || this.styleDefaults.textColor;
        this.textColorText.value = styles.textColor || this.styleDefaults.textColor;

        this.qrResolutionSelect.value = String(styles.qrResolution || this.styleDefaults.qrResolution);

        // Restore logo from preset
        if (styles.logoDataUrl !== undefined) {
            this.logoDataUrl = styles.logoDataUrl;
            if (!this.logoDataUrl) {
                this.logoFileInput.value = '';
            }
        }

        // Update UI
        this.rerenderQRCode();
        this.updateTransactionDisplay();
        this.updateQRBackground();
    }

    /**
     * Sauvegarde le preset courant
     */
    savePreset() {
        const name = this.presetNameInput.value.trim();
        if (!name) {
            alert(t('presets.noName'));
            return;
        }
        if (name.length > 50) {
            alert(t('presets.nameTooLong'));
            return;
        }
        this.presets[name] = this.readCurrentStyles();
        this.storePresets();
        this.presetSelect.value = name;
        this.presetNameInput.value = '';
        // Feedback visuel
        const btn = this.savePresetBtn;
        btn.textContent = '✓';
        setTimeout(() => { btn.textContent = '💾'; }, 1500);
    }

    /**
     * Charge le preset sélectionné
     */
    loadPreset() {
        const name = this.presetSelect.value;
        if (!name) return;
        if (!this.presets[name]) {
            alert(t('presets.notFound'));
            this.populatePresetSelect();
            return;
        }
        this.applyStyles(this.presets[name]);
    }

    /**
     * Supprime le preset sélectionné
     */
    deletePreset() {
        const name = this.presetSelect.value;
        if (!name) return;
        if (!confirm(t('presets.confirmDelete', { name }))) return;
        delete this.presets[name];
        this.storePresets();
        this.presetSelect.value = '';
    }

    /**
     * Initialise la langue (détection + applique)
     */
    initLanguage() {
        const lang = getLang();
        if (this.langSelect) {
            this.langSelect.value = lang;
        }
        translatePage();
        // Traduire les options des selects qui ont data-i18n
        document.querySelectorAll('select[data-i18n] option[data-i18n]').forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (key) option.textContent = t(key);
        });
    }

    /**
     * Appelé quand la langue change
     */
    onLanguageChange() {
        translatePage();
        // Re-traduire les options dynamiques des selects
        document.querySelectorAll('select[data-i18n] option[data-i18n]').forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (key) option.textContent = t(key);
        });
        // Met à jour l'affichage des textes dynamiques
        this.updateTransactionDisplay();
        if (this.currentQR) {
            this.displayTransactionDetails(this.currentQR.data);
        }
    }

    /**
     * Réinitialise les styles aux valeurs par défaut
     */
    resetStyles() {
        this.pixelShapeSelect.value = this.styleDefaults.pixelShape;
        this.pixelColorInput.value = this.styleDefaults.pixelColor;
        this.pixelColorText.value = this.styleDefaults.pixelColor;
        this.bgColorInput.value = this.styleDefaults.bgColor;
        this.bgColorText.value = this.styleDefaults.bgColor;
        this.cornersStyleSelect.value = this.styleDefaults.cornersStyle;
        this.cornersFrameColorInput.value = this.styleDefaults.cornersFrameColor;
        this.cornersFrameColorText.value = this.styleDefaults.cornersFrameColor;
        this.cornersDotColorInput.value = this.styleDefaults.cornersDotColor;
        this.cornersDotColorText.value = this.styleDefaults.cornersDotColor;
        this.logoSizeSlider.value = this.styleDefaults.logoSize;
        this.logoSizeValue.textContent = this.styleDefaults.logoSize;
        this.logoDataUrl = null;
        this.logoFileInput.value = '';

        this.logoShapeRadios.forEach(radio => {
            radio.checked = radio.value === this.styleDefaults.logoShape;
        });

        this.logoFitRadios.forEach(radio => {
            radio.checked = radio.value === this.styleDefaults.logoFit;
        });

        // Reset text info
        this.textInfoToggle.checked = this.styleDefaults.textInfoEnabled;
        this.textFontSelect.value = this.styleDefaults.textFontFamily;
        this.textFontSizeSlider.value = this.styleDefaults.textFontSize;
        this.textFontSizeValue.textContent = this.styleDefaults.textFontSize;
        this.textColorInput.value = this.styleDefaults.textColor;
        this.textColorText.value = this.styleDefaults.textColor;

        this.qrResolutionSelect.value = this.styleDefaults.qrResolution;
        this.rerenderQRCode();
        this.updateTransactionDisplay();
        this.updateQRBackground();
    }

    /**
     * Télécharge le QR code en PNG
     */
    downloadQRCode() {
        if (!this.qrStylingInstance) return;

        const show = this.textInfoToggle?.checked || false;

        if (show) {
            // Texte actif: utiliser le canvas combiné
            const combinedCanvas = this.getCombinedCanvas();
            if (!combinedCanvas) return;

            const link = document.createElement('a');
            link.download = 'qr-epc.png';
            link.href = combinedCanvas.toDataURL('image/png');
            link.click();
        } else {
            // Pas de texte: utiliser le download natif de la lib
            this.qrStylingInstance.download({
                name: 'qr-epc',
                extension: 'png'
            });
        }
    }

    /**
     * Copie le QR code dans le presse-papier
     */
    async copyQRCode() {
        try {
            const show = this.textInfoToggle?.checked || false;
            let canvas;

            if (show) {
                canvas = this.getCombinedCanvas();
            } else {
                canvas = this.qrcodeDiv.querySelector('canvas');
            }

            if (!canvas) return;

            const blob = await new Promise(resolve => canvas.toBlob(resolve));
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);

            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = t('action.copied');
            this.copyBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            this.copyBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700');

            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                this.copyBtn.classList.add('bg-gray-600', 'hover:bg-gray-700');
            }, 2000);
        } catch (error) {
            alert(t('action.copyError'));
        }
    }

    /**
     * Réinitialise le formulaire
     */
    resetForm() {
        this.beneficiaryCount.textContent = '0';
        this.remittanceCount.textContent = '0';
        this.ibanFeedback.innerHTML = '';
        this.ibanInput.classList.remove('border-green-300', 'dark:border-green-600', 'border-red-300', 'dark:border-red-600');
    }

    /**
     * Réinitialise l'application
     */
    resetApp() {
        this.form.reset();
        this.resetForm();
        this.qrResult.classList.add('hidden');
        this.currentQR = null;
        this.qrStylingInstance = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Affiche le modal d'historique
     */
    showHistory() {
        const history = this.qrHistory.getAll();

        if (history.length === 0) {
            this.historyContent.innerHTML = `
        <p class="text-center text-gray-500 dark:text-gray-400 py-8">
          ${t('history.empty')}
        </p>
      `;
            this.historyClearSection.classList.add('hidden');
        } else {
            this.renderHistory(history);
            this.historyClearSection.classList.remove('hidden');
        }

        this.historyModal.classList.remove('hidden');
        this.historyModal.classList.add('flex');
    }

    /**
     * Affiche la liste de l'historique
     */
    renderHistory(history) {
        this.historyContent.innerHTML = history.map((item, index) => {
            const date = new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
        <div 
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer mb-3"
          data-index="${index}"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 dark:text-white">
                ${item.formData.beneficiary}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                ${this.ibanValidator.format(item.formData.iban)}
              </p>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900 dark:text-white">
                ${item.formData.amount ? `${parseFloat(item.formData.amount).toFixed(2)} EUR` : t('history.free')}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                ${formattedDate}
              </p>
            </div>
          </div>
          ${item.formData.remittance ? `
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              💬 ${item.formData.remittance}
            </p>
          ` : ''}
        </div>
      `;
        }).join('');

        this.historyContent.querySelectorAll('[data-index]').forEach(element => {
            element.addEventListener('click', () => {
                const index = parseInt(element.dataset.index);
                this.loadFromHistory(index);
            });
        });
    }

    /**
     * Charge un QR code depuis l'historique
     */
    loadFromHistory(index) {
        const item = this.qrHistory.getByIndex(index);
        if (!item) return;

        this.beneficiaryInput.value = item.formData.beneficiary;
        this.ibanInput.value = item.formData.iban;
        this.amountInput.value = item.formData.amount || '';
        this.remittanceInput.value = item.formData.remittance || '';

        this.beneficiaryCount.textContent = item.formData.beneficiary.length;
        this.remittanceCount.textContent = (item.formData.remittance || '').length;

        this.renderQRCode(item.epcString, item.formData);

        this.hideHistory();
    }

    /**
     * Cache le modal d'historique
     */
    hideHistory() {
        this.historyModal.classList.add('hidden');
        this.historyModal.classList.remove('flex');
    }

    /**
     * Efface l'historique
     */
    clearHistory() {
        if (confirm(t('history.confirmClear'))) {
            this.qrHistory.clear();
            this.showHistory();
        }
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    new EPCQRApp();
});
