/**
 * Gestion de l'historique dans localStorage
 */
class QRHistory {
    constructor() {
        this.storageKey = 'epc_qr_history';
        this.maxItems = 10;
    }

    /**
     * Sauvegarde un QR code dans l'historique
     * @param {Object} qrData - Données du QR code
     */
    save(qrData) {
        const history = this.getAll();

        // Ajoute le nouvel élément au début
        history.unshift({
            ...qrData,
            timestamp: new Date().toISOString()
        });

        // Garde seulement les N derniers
        const trimmedHistory = history.slice(0, this.maxItems);

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(trimmedHistory));
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde dans localStorage:', error);
            return false;
        }
    }

    /**
     * Récupère tout l'historique
     * @returns {Array} Liste des QR codes
     */
    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erreur lors de la lecture de localStorage:', error);
            return [];
        }
    }

    /**
     * Efface tout l'historique
     */
    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'effacement de localStorage:', error);
            return false;
        }
    }

    /**
     * Récupère un élément spécifique par index
     * @param {number} index - Index de l'élément
     * @returns {Object|null} Élément ou null
     */
    getByIndex(index) {
        const history = this.getAll();
        return history[index] || null;
    }
}

export default QRHistory;