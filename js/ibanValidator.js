/**
 * Validation IBAN selon ISO 13616
 */
class IBANValidator {
    constructor() {
        // Longueurs IBAN par pays (Espace Économique Européen)
        this.ibanLengths = {
            'AD': 24, 'AT': 20, 'BE': 16, 'BG': 22, 'CH': 21,
            'CY': 28, 'CZ': 24, 'DE': 22, 'DK': 18, 'EE': 20,
            'ES': 24, 'FI': 18, 'FR': 27, 'GB': 22, 'GI': 23,
            'GR': 27, 'HR': 21, 'HU': 28, 'IE': 22, 'IS': 26,
            'IT': 27, 'LI': 21, 'LT': 20, 'LU': 20, 'LV': 21,
            'MC': 27, 'MT': 31, 'NL': 18, 'NO': 15, 'PL': 28,
            'PT': 25, 'RO': 24, 'SE': 24, 'SI': 19, 'SK': 24,
            'SM': 27, 'VA': 22
        };
    }

    /**
     * Valide un IBAN selon l'algorithme modulo 97
     * @param {string} iban - IBAN à valider
     * @returns {Object} Résultat de la validation
     */
    validate(iban) {
        // Enlève espaces et met en majuscules
        const cleanIban = iban.replace(/\s/g, '').toUpperCase();

        // Vérifie le format de base
        if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleanIban)) {
            return {
                valid: false,
                error: 'Format IBAN invalide'
            };
        }

        // Vérifie la longueur selon le pays
        const countryCode = cleanIban.substring(0, 2);
        const expectedLength = this.ibanLengths[countryCode];

        if (!expectedLength) {
            return {
                valid: false,
                error: `Code pays ${countryCode} non supporté dans l'EEE`
            };
        }

        if (cleanIban.length !== expectedLength) {
            return {
                valid: false,
                error: `Longueur incorrecte pour ${countryCode} (attendu: ${expectedLength}, reçu: ${cleanIban.length})`
            };
        }

        // Algorithme modulo 97
        const rearranged = cleanIban.substring(4) + cleanIban.substring(0, 4);
        const numericString = this.toNumericString(rearranged);
        const remainder = this.mod97(numericString);

        if (remainder !== 1) {
            return {
                valid: false,
                error: 'Somme de contrôle invalide'
            };
        }

        return {
            valid: true,
            country: countryCode
        };
    }

    /**
     * Convertit lettres en chiffres (A=10, B=11, etc.)
     * @param {string} str - Chaîne à convertir
     * @returns {string} Chaîne numérique
     */
    toNumericString(str) {
        return str.replace(/[A-Z]/g, char => char.charCodeAt(0) - 55);
    }

    /**
     * Calcul modulo 97 pour grandes chaînes
     * @param {string} str - Chaîne numérique
     * @returns {number} Reste de la division par 97
     */
    mod97(str) {
        let remainder = 0;
        for (let i = 0; i < str.length; i++) {
            remainder = (remainder * 10 + parseInt(str[i])) % 97;
        }
        return remainder;
    }

    /**
     * Formate l'IBAN avec espaces tous les 4 caractères
     * @param {string} iban - IBAN à formatter
     * @returns {string} IBAN formaté
     */
    format(iban) {
        const clean = iban.replace(/\s/g, '').toUpperCase();
        return clean.match(/.{1,4}/g)?.join(' ') || clean;
    }
}

export default IBANValidator;