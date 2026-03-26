/**
 * Content Factory V10.1 — Firebase Core
 * Gestisce l'integrazione con Google Firebase per la persistenza dei dati.
 */

class FirebaseCore {
    constructor() {
        this.config = this.loadConfig();
        this.app = null;
        this.db = null;
        this.auth = null;
        this.isSimulated = true;

        if (this.config) {
            this.init();
        } else {
            console.warn("FirebaseCore: Nessuna configurazione trovata. Modalità simulata attiva.");
        }
    }

    loadConfig() {
        try {
            const stored = localStorage.getItem('v10_firebase_config');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    }

    init() {
        try {
            if (this.isSimulated && this.config) {
                // Inizializzazione Firebase (Compat Mode per semplicità CDN)
                firebase.initializeApp(this.config);
                this.db = firebase.firestore();
                this.isSimulated = false;
                console.log("FirebaseCore: Sistema LIVE Inizializzato.");
            }
        } catch (err) {
            console.error("FirebaseCore: Errore inizializzazione:", err);
            this.isSimulated = true;
        }
    }

    // Proxy per Firestore (Simulato vs Reale)
    async saveData(collection, docId, data) {
        if (this.isSimulated) {
            console.log(`[SIM] Salvataggio su ${collection}/${docId}:`, data);
            return true;
        }
        try {
            await this.db.collection(collection).doc(docId).set(data, { merge: true });
            return true;
        } catch (e) {
            console.error("Firebase Error:", e);
            return false;
        }
    }

    // Listener per Dati Real-time
    onUpdate(collection, docId, callback) {
        if (this.isSimulated) return;
        return this.db.collection(collection).doc(docId).onSnapshot(doc => {
            if (doc.exists) callback(doc.data());
        });
    }
}

// Global instance
window.Firebase = new FirebaseCore();
