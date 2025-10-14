/**
 * Générateur de chaîne EPC conforme aux spécifications
 * European Payments Council Quick Response Code v2
 */
class EPCGenerator {
    constructor() {
        this.version = '002';
        this.charset = '1'; // UTF-8
        this.identification = 'SCT'; // SEPA Credit Transfer
    }

    /**
     * Génère la chaîne EPC complète
     * @param {Object} data - Données du virement
     * @returns {string} Chaîne formatée pour QR code
     */
    generate(data) {
        const {
            beneficiary,
            iban,
            amount,
            remittance,
            bic = ''
        } = data;

        // Validation des champs obligatoires
        this.validate(data);

        // Construction ligne par ligne
        const lines = [
            'BCD',                                    // Service Tag
            this.version,                             // Version
            this.charset,                             // Character set
            this.identification,                      // Identification
            bic.toUpperCase(),                        // BIC (peut être vide)
            this.sanitize(beneficiary, 70),           // Beneficiary name
            this.formatIBAN(iban),                    // IBAN
            this.formatAmount(amount),                // Amount
            '',                                       // Purpose (vide)
            '',                                       // Structured reference (vide)
            this.sanitize(remittance, 140),           // Unstructured remittance
            ''                                        // Beneficiary to originator info
        ];

        return lines.join('\n');
    }

    /**
     * Valide les données d'entrée
     */
    validate(data) {
        if (!data.beneficiary || data.beneficiary.trim().length === 0) {
            throw new Error('Le nom du bénéficiaire est requis');
        }

        if (!data.iban) {
            throw new Error('L\'IBAN est requis');
        }

        if (data.amount !== undefined && data.amount !== null && data.amount !== '') {
            const amount = parseFloat(data.amount);
            if (isNaN(amount) || amount < 0.01 || amount > 999999999.99) {
                throw new Error('Le montant doit être entre 0.01 et 999999999.99');
            }
        }

        if (data.beneficiary.length > 70) {
            throw new Error('Le nom du bénéficiaire ne peut pas dépasser 70 caractères');
        }

        if (data.remittance && data.remittance.length > 140) {
            throw new Error('La communication ne peut pas dépasser 140 caractères');
        }
    }

    /**
     * Sanitize et tronque une chaîne
     */
    sanitize(text, maxLength) {
        if (!text) return '';
        // Remplace les caractères non autorisés
        const sanitized = text
            .trim()
            .replace(/[^\x20-\x7E]/g, '') // Garde uniquement ASCII imprimables
            .substring(0, maxLength);
        return sanitized;
    }

    /**
     * Formate l'IBAN (enlève espaces et met en majuscules)
     */
    formatIBAN(iban) {
        return iban.replace(/\s/g, '').toUpperCase();
    }

    /**
     * Formate le montant selon spécifications EPC
     */
    formatAmount(amount) {
        if (amount === undefined || amount === null || amount === '') {
            return '';
        }
        const numAmount = parseFloat(amount);
        return `EUR${numAmount.toFixed(2)}`;
    }
}

export default EPCGenerator;