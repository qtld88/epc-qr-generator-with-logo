/**
 * Gestion du mode sombre
 */
class DarkMode {
    constructor() {
        this.storageKey = 'darkMode';
        this.isDark = this.loadPreference();
    }

    /**
     * Charge la préférence depuis localStorage
     * @returns {boolean} État du mode sombre
     */
    loadPreference() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved === 'true';
        } catch (error) {
            console.error('Erreur lors du chargement de la préférence:', error);
            return false;
        }
    }

    /**
     * Sauvegarde la préférence dans localStorage
     */
    savePreference() {
        try {
            localStorage.setItem(this.storageKey, this.isDark.toString());
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la préférence:', error);
        }
    }

    /**
     * Active le mode sombre
     */
    enable() {
        this.isDark = true;
        document.documentElement.classList.add('dark');
        this.savePreference();
    }

    /**
     * Désactive le mode sombre
     */
    disable() {
        this.isDark = false;
        document.documentElement.classList.remove('dark');
        this.savePreference();
    }

    /**
     * Bascule entre mode sombre et clair
     */
    toggle() {
        if (this.isDark) {
            this.disable();
        } else {
            this.enable();
        }
    }

    /**
     * Applique le mode actuel
     */
    apply() {
        if (this.isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    /**
     * Retourne l'état actuel
     * @returns {boolean} État du mode sombre
     */
    isEnabled() {
        return this.isDark;
    }
}

// Export par défaut
export default DarkMode;