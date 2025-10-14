import EPCGenerator from './epcGenerator.js';
import IBANValidator from './ibanValidator.js';
import QRHistory from './storage.js';
import DarkMode from './darkMode.js';

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

        this.initializeElements();
        this.attachEventListeners();
        this.applyDarkMode();
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
        this.historyBtn = document.getElementById('historyBtn');

        // Modal historique
        this.historyModal = document.getElementById('historyModal');
        this.historyContent = document.getElementById('historyContent');
        this.closeHistoryBtn = document.getElementById('closeHistoryBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.historyClearSection = document.getElementById('historyClearSection');
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
          ✓ IBAN valide (${validation.country})
        </span>
      `;
            this.ibanInput.classList.remove('border-red-300', 'dark:border-red-600');
            this.ibanInput.classList.add('border-green-300', 'dark:border-green-600');
        } else {
            this.ibanFeedback.innerHTML = `
        <span class="text-red-600 dark:text-red-400 text-sm">
          ✗ ${validation.error}
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
            // Récupération des données
            const data = {
                beneficiary: this.beneficiaryInput.value,
                iban: this.ibanInput.value,
                amount: this.amountInput.value,
                remittance: this.remittanceInput.value
            };

            // Validation IBAN finale
            const ibanValidation = this.ibanValidator.validate(data.iban);
            if (!ibanValidation.valid) {
                alert(`❌ ${ibanValidation.error}`);
                return;
            }

            // Génération de la chaîne EPC
            const epcString = this.epcGenerator.generate(data);

            // Sauvegarde dans l'historique
            this.qrHistory.save({
                epcString,
                formData: data
            });

            // Affichage du QR Code
            this.renderQRCode(epcString, data);

        } catch (error) {
            alert(`❌ Erreur : ${error.message}`);
        }
    }

    /**
     * Affiche le QR code
     */
    renderQRCode(epcString, data) {
        // Vide le conteneur
        this.qrcodeDiv.innerHTML = '';

        // Génère le QR code
        new QRCode(this.qrcodeDiv, {
            text: epcString,
            width: 300,
            height: 300,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });

        // Affiche les informations
        this.displayBeneficiary.textContent = data.beneficiary;
        this.displayIban.textContent = this.ibanValidator.format(data.iban);
        this.displayAmount.textContent = data.amount ? `${parseFloat(data.amount).toFixed(2)} EUR` : 'Montant libre';

        if (data.remittance) {
            this.displayRemittance.textContent = data.remittance;
            this.displayRemittanceContainer.classList.remove('hidden');
        } else {
            this.displayRemittanceContainer.classList.add('hidden');
        }

        // Sauvegarde les données
        this.currentQR = { epcString, data };

        // Affiche la zone de résultat
        this.qrResult.classList.remove('hidden');
        this.qrResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Télécharge le QR code en PNG
     */
    downloadQRCode() {
        const canvas = this.qrcodeDiv.querySelector('canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            link.download = `qr-epc-${timestamp}.png`;
            link.href = url;
            link.click();
        }
    }

    /**
     * Copie le QR code dans le presse-papier
     */
    async copyQRCode() {
        try {
            const canvas = this.qrcodeDiv.querySelector('canvas');
            if (!canvas) return;

            const blob = await new Promise(resolve => canvas.toBlob(resolve));
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);

            // Feedback visuel
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = '✓ Copié !';
            this.copyBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            this.copyBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700');

            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                this.copyBtn.classList.add('bg-gray-600', 'hover:bg-gray-700');
            }, 2000);
        } catch (error) {
            alert('❌ Impossible de copier l\'image. Utilisez le bouton Télécharger.');
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
          Aucun QR code dans l'historique
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
                ${item.formData.amount ? `${parseFloat(item.formData.amount).toFixed(2)} EUR` : 'Libre'}
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

        // Attache les événements de clic
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

        // Remplit le formulaire
        this.beneficiaryInput.value = item.formData.beneficiary;
        this.ibanInput.value = item.formData.iban;
        this.amountInput.value = item.formData.amount || '';
        this.remittanceInput.value = item.formData.remittance || '';

        // Met à jour les compteurs
        this.beneficiaryCount.textContent = item.formData.beneficiary.length;
        this.remittanceCount.textContent = (item.formData.remittance || '').length;

        // Régénère le QR code
        this.renderQRCode(item.epcString, item.formData);

        // Ferme le modal
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
        if (confirm('⚠️ Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
            this.qrHistory.clear();
            this.showHistory(); // Rafraîchit l'affichage
        }
    }
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    new EPCQRApp();
});