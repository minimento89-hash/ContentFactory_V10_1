/**
 * Content Factory V10.1 — Content Engine
 * Gestisce i template "Liquid Content" e la logica di generazione assistita.
 */

class ContentEngine {
    constructor() {
        this.templates = {
            linkedin: {
                name: 'LinkedIn Post',
                icon: 'ph ph-linkedin-logo',
                system: 'Sei un esperto di Personal Branding su LinkedIn. Genera un post professionale, educativo e coinvolgente. Usa un gancio forte nelle prime due righe, usa elenchi puntati per la leggibilità e termina con una Call to Action e 3-5 hashtag rilevanti.'
            },
            twitter: {
                name: 'X (Twitter) Thread',
                icon: 'ph ph-twitter-logo',
                system: 'Sei un esperto di X (Twitter). Genera un thread di 3-5 post. Il primo post deve avere un gancio virale. Ogni post deve essere sotto i 280 caratteri. Usa un tono diretto e provocatorio.'
            },
            article: {
                name: 'SEO Article',
                icon: 'ph ph-article',
                system: 'Sei un copywriter SEO senior. Genera un articolo strutturato in HTML (usa H2, H3, p). Deve includere un\'introduzione accattivante, tre sezioni principali di approfondimento e una conclusione con riassunto.'
            },
            video: {
                name: 'Video Script',
                icon: 'ph ph-video-camera',
                system: 'Sei un creatore di contenuti per Reels e Shorts. Genera uno script diviso in: [SCENA] (descrizione visiva) e [VOICE OVER] (testo da leggere). Il ritmo deve essere veloce, massimo 60 secondi totali.'
            }
        };
    }

    getAvailableTemplates() {
        return Object.keys(this.templates).map(key => ({
            id: key,
            ...this.templates[key]
        }));
    }

    async generate(type, topic, context = '') {
        const template = this.templates[type];
        if (!template) throw new Error("Template non trovato.");

        const prompt = `Argomento: ${topic}\n\n[CONTESTO AGGIUNTIVO]\n${context}`;
        
        if (window.Gemini) {
            return await window.Gemini.ask(prompt, template.system);
        } else {
            throw new Error("Gemini Engine non inizializzato.");
        }
    }
}

// Global instance
window.ContentEngine = new ContentEngine();
