/**
 * Content Factory V10.1 — Studio Engine
 * Gestisce il caricamento dinamico dei widget e l'interfaccia modulare.
 */

class StudioManager {
    constructor() {
        this.grid = document.getElementById('studio-grid');
        this.widgets = [];
        this.init();
    }

    init() {
        console.log("StudioManager: Sistema V10.1 Inizializzato.");
        this.loadDefaultWidgets();
    }

    loadDefaultWidgets() {
        // Recuperiamo l'ordine salvato se presente
        const savedOrder = localStorage.getItem('cf_studio_layout');
        let widgetConfigs = [
            { id: 'agent-radar', title: 'Agent Radar', type: 'status', size: 'small' },
            { id: 'content-engine', title: 'Content Engine', type: 'generator', size: 'large' },
            { id: 'gemini-chat', title: 'Gemini Intelligence', type: 'chat', size: 'large' },
            { id: 'sentiment-hub', title: 'Sentiment Evolution', type: 'graph', size: 'medium' },
            { id: 'social-loop', title: 'Social Approval', type: 'timeline', size: 'medium' }
        ];

        if (savedOrder) {
            const orderIds = JSON.parse(savedOrder);
            widgetConfigs.sort((a, b) => orderIds.indexOf(a.id) - orderIds.indexOf(b.id));
        }

        // Puliamo i placeholder (Disabilitato per Mockup V10.1)
        // if (this.grid) this.grid.innerHTML = '';

        // widgetConfigs.forEach(w => this.createWidget(w));
    }

    createWidget(config) {
        const widgetEl = document.createElement('div');
        widgetEl.className = `widget-card ${config.size || 'medium'}`;
        widgetEl.id = `widget-${config.id}`;
        widgetEl.setAttribute('draggable', 'true');
        
        widgetEl.innerHTML = `
            <div class="widget-header">
                <span class="widget-title">${config.title}</span>
                <div class="widget-actions">
                    <i class="ph ph-dots-three-vertical"></i>
                </div>
            </div>
            <div class="widget-content" id="content-${config.id}">
                <div class="loading-shimmer">Caricamento...</div>
            </div>
        `;

        if (this.grid) {
            this.grid.appendChild(widgetEl);
        }
        
        this.widgets.push(config);
        this.initializeWidgetLogic(config.id);
    }

    initializeWidgetLogic(id) {
        if (id === 'agent-radar') {
            this.renderAgentRadar();
        } else if (id === 'gemini-chat') {
            this.renderGeminiChat();
        } else if (id === 'sentiment-hub') {
            this.renderSentimentWidget();
        } else if (id === 'social-loop') {
            this.renderSocialLoop();
        }
    }

    renderSentimentWidget() {
        const content = document.getElementById('content-sentiment-hub');
        if (!content) return;

        content.innerHTML = `
            <div class="sentiment-container">
                <div class="sentiment-score">88%</div>
                <div class="sentiment-label">Positive Sentiment</div>
                <div class="mini-graph">
                    <div class="bar" style="height: 40%"></div>
                    <div class="bar" style="height: 60%"></div>
                    <div class="bar" style="height: 50%"></div>
                    <div class="bar" style="height: 80%"></div>
                    <div class="bar" style="height: 70%"></div>
                    <div class="bar" style="height: 90%"></div>
                </div>
            </div>
            <style>
                .sentiment-container { text-align: center; padding-top: 10px; }
                .sentiment-score { font-family: 'Instrument Serif', serif; font-size: 3.5rem; color: #10b981; line-height: 1; }
                .sentiment-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-dim); margin-bottom: 20px; }
                .mini-graph { display: flex; align-items: flex-end; justify-content: center; gap: 4px; height: 60px; }
                .bar { width: 12px; background: var(--accent); border-radius: 2px; opacity: 0.3; transition: all 0.5s; }
                .bar:hover { opacity: 1; transform: scaleY(1.1); }
            </style>
        `;
    }

    renderSocialLoop() {
        const content = document.getElementById('content-social-loop');
        if (!content) return;

        content.innerHTML = `
            <div class="timeline">
                <div class="tl-item">
                    <div class="tl-time">10:45</div>
                    <div class="tl-content">Post Instagram Programmato</div>
                </div>
                <div class="tl-item active">
                    <div class="tl-time">11:30</div>
                    <div class="tl-content">Analisi Trend TikTok...</div>
                </div>
                <div class="tl-item">
                    <div class="tl-time">14:00</div>
                    <div class="tl-content">Approvazione Chief Editor</div>
                </div>
            </div>
            <style>
                .timeline { display: flex; flex-direction: column; gap: 15px; padding: 10px; }
                .tl-item { display: flex; gap: 15px; font-size: 0.8rem; color: var(--text-dim); position: relative; padding-left: 15px; }
                .tl-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: -15px; width: 1px; background: var(--glass-border); }
                .tl-item:last-child::before { display: none; }
                .tl-item::after { content: ''; position: absolute; left: -3px; top: 5px; width: 7px; height: 7px; border-radius: 50%; background: var(--glass-border); }
                .tl-item.active { color: var(--text); }
                .tl-item.active::after { background: var(--accent); box-shadow: 0 0 10px var(--accent); }
                .tl-time { font-family: monospace; font-weight: 700; color: var(--accent); }
            </style>
        `;
    }

    renderGeminiChat() {
        const content = document.getElementById('content-gemini-chat');
        if (!content) return;

        content.innerHTML = `
            <div class="chat-container">
                <div class="chat-messages" id="chat-messages">
                    <div class="msg ai">Sistemi pronti. Come posso aiutarti oggi, Capo?</div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Invia un comando...">
                    <button id="send-btn"><i class="ph-fill ph-paper-plane-right"></i></button>
                </div>
            </div>
            <style>
                .chat-container { display: flex; flex-direction: column; height: 100%; gap: 12px; }
                .chat-messages {
                    flex: 1; overflow-y: auto; padding: 10px;
                    display: flex; flex-direction: column; gap: 8px;
                    font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 8px; background: rgba(0,0,0,0.1);
                }
                .msg { padding: 10px 14px; border-radius: 12px; max-width: 85%; line-height: 1.4; }
                .msg.ai { background: rgba(232, 197, 71, 0.15); color: var(--text); align-self: flex-start; border-bottom-left-radius: 2px; border: 1px solid rgba(232, 197, 71, 0.2); }
                .msg.user { background: var(--glass-heavy); color: var(--text); align-self: flex-end; border-bottom-right-radius: 2px; }
                .chat-input-area { display: flex; gap: 8px; }
                #chat-input {
                    flex: 1; background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border);
                    border-radius: 8px; padding: 10px 16px; color: var(--text); font-size: 0.8rem;
                }
                #send-btn {
                    width: 40px; height: 40px; border-radius: 8px; background: var(--accent);
                    color: var(--bg); border: none; cursor: pointer; transition: 0.3s;
                }
                #send-btn:hover { transform: scale(1.05); box-shadow: 0 0 15px var(--accent-glow); }
            </style>
        `;

        // Event Listeners for Chat
        const input = document.getElementById('chat-input');
        const btn = document.getElementById('send-btn');
        const chatMessages = document.getElementById('chat-messages');

        const sendMessage = async () => {
            const text = input.value.trim();
            if (!text) return;

            // Render User Message
            this.addMessage(text, 'user');
            input.value = '';

            // Salvataggio su Firebase (se attivo)
            if (window.Firebase && !window.Firebase.isSimulated) {
                await window.Firebase.saveData('studio', 'chat_latest', {
                    text: text,
                    sender: 'user',
                    timestamp: Date.now()
                });
            }

            // Loading state
            const loadingMsg = this.addMessage('Analisi in corso...', 'ai');
            
            try {
                // Call Gemini via Global Instance
                const response = await window.Gemini.ask(text);
                loadingMsg.innerText = response;

                // Salva risposta AI
                if (window.Firebase && !window.Firebase.isSimulated) {
                    await window.Firebase.saveData('studio', 'chat_latest', {
                        text: response,
                        sender: 'ai',
                        timestamp: Date.now()
                    });
                }
            } catch (err) {
                loadingMsg.innerText = "Errore: " + err.message;
                loadingMsg.classList.add('msg-error');
            }
        };

        btn.onclick = sendMessage;
        input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

        // Listener per messaggi in arrivo (Real-time Sync)
        if (window.Firebase && !window.Firebase.isSimulated) {
            window.Firebase.onUpdate('studio', 'chat_latest', (data) => {
                // Per ora mostriamo solo l'ultimo se diverso dall'ultimo locale
                console.log("Firebase Update:", data);
            });
        }
    }

    addMessage(text, type) {
        const chatMessages = document.getElementById('chat-messages');
        const msg = document.createElement('div');
        msg.className = `msg ${type}`;
        msg.innerText = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msg;
    }

    renderAgentRadar() {
        const content = document.getElementById('content-agent-radar');
        if (!content) return;

        const agents = [
            { name: 'Director', icon: '🦁', status: 'online' },
            { name: 'Writer', icon: '✍️', status: 'online' },
            { name: 'Sound', icon: '🎵', status: 'idle' },
            { name: 'Critic', icon: '🧐', status: 'online' },
            { name: 'Analysis', icon: '📊', status: 'idle' },
            { name: 'Visual', icon: '🎨', status: 'online' },
            { name: 'Finance', icon: '💰', status: 'idle' },
            { name: 'System', icon: '💻', status: 'online' },
            { name: 'Cipher', icon: '🛡️', status: 'online' },
            { name: 'BugHunter', icon: '🐛', status: 'idle' },
            { name: 'Archetype', icon: '🎭', status: 'online' },
            { name: 'Orchestra', icon: '🎻', status: 'idle' }
        ];

        content.innerHTML = `
            <div class="agent-grid">
                ${agents.map(a => `
                    <div class="agent-node ${a.status}">
                        <div class="agent-avatar">${a.icon}</div>
                        <div class="agent-label">${a.name}</div>
                        <div class="status-pulse"></div>
                    </div>
                `).join('')}
            </div>
            <style>
                .agent-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                    margin-top: 10px;
                }
                .agent-node {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 10px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    position: relative;
                    transition: all 0.3s;
                }
                .agent-node:hover { background: rgba(255,255,255,0.05); transform: scale(1.05); }
                .agent-avatar { font-size: 1.2rem; margin-bottom: 4px; }
                .agent-label { font-size: 0.6rem; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
                .status-pulse {
                    position: absolute; top: 8px; right: 8px;
                    width: 6px; height: 6px; border-radius: 50%;
                }
                .agent-node.online .status-pulse { background: #10b981; box-shadow: 0 0 10px #10b981; animation: pulse-status 2s infinite; }
                .agent-node.idle .status-pulse { background: #64748b; opacity: 0.5; }
                @keyframes pulse-status {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
        `;
    }

    renderContentEngine() {
        const content = document.getElementById('content-content-engine');
        if (!content) return;

        const templates = window.ContentEngine.getAvailableTemplates();

        content.innerHTML = `
            <div class="ce-container">
                <div class="ce-controls">
                    <select id="ce-template-select">
                        ${templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                    </select>
                    <input type="text" id="ce-topic" placeholder="Di cosa vuoi parlare?">
                    <button id="ce-generate-btn"><i class="ph-bold ph-magic-wand"></i> Genera</button>
                </div>
                <div class="ce-output-wrapper">
                    <textarea id="ce-output" placeholder="Il contenuto apparirà qui..." readonly></textarea>
                    <div class="ce-actions">
                        <button id="ce-copy-btn" title="Copia Appunti"><i class="ph ph-copy"></i></button>
                        <button id="ce-save-btn" title="Salva Cloud"><i class="ph ph-cloud-arrow-up"></i></button>
                    </div>
                </div>
            </div>
            <style>
                .ce-container { display: flex; flex-direction: column; height: 100%; gap: 12px; }
                .ce-controls { display: flex; gap: 8px; }
                #ce-template-select {
                    background: var(--glass-heavy); border: 1px solid var(--glass-border);
                    color: var(--text); border-radius: 8px; padding: 0 10px; font-size: 0.8rem;
                }
                #ce-topic {
                    flex: 1; background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border);
                    border-radius: 8px; padding: 10px 16px; color: var(--text); font-size: 0.8rem;
                }
                #ce-generate-btn {
                    background: var(--accent); color: var(--bg); border: none; padding: 0 20px;
                    border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s;
                }
                #ce-generate-btn:hover { box-shadow: 0 0 15px var(--accent-glow); transform: translateY(-2px); }
                
                .ce-output-wrapper { flex: 1; position: relative; display: flex; flex-direction: column; }
                #ce-output {
                    flex: 1; background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border);
                    border-radius: 12px; padding: 15px; color: var(--text); font-family: inherit;
                    font-size: 0.85rem; resize: none; line-height: 1.5;
                }
                .ce-actions {
                    position: absolute; top: 10px; right: 10px; display: flex; gap: 8px;
                }
                .ce-actions button {
                    width: 32px; height: 32px; border-radius: 6px; background: var(--glass-heavy);
                    border: 1px solid var(--glass-border); color: var(--text); cursor: pointer; transition: 0.2s;
                }
                .ce-actions button:hover { background: var(--accent); color: var(--bg); border-color: var(--accent); }
            </style>
        `;

        const select = document.getElementById('ce-template-select');
        const topic = document.getElementById('ce-topic');
        const btn = document.getElementById('ce-generate-btn');
        const output = document.getElementById('ce-output');
        const copyBtn = document.getElementById('ce-copy-btn');
        const saveBtn = document.getElementById('ce-save-btn');

        btn.onclick = async () => {
            const topicText = topic.value.trim();
            if (!topicText) return;

            btn.disabled = true;
            btn.innerHTML = '<i class="ph ph-circle-notch animate-spin"></i>...';
            output.value = "Generazione in corso...";

            try {
                const result = await window.ContentEngine.generate(select.value, topicText);
                output.value = result;
            } catch (err) {
                output.value = "Errore: " + err.message;
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="ph-bold ph-magic-wand"></i> Genera';
            }
        };

        copyBtn.onclick = () => {
            navigator.clipboard.writeText(output.value);
            copyBtn.innerHTML = '<i class="ph ph-check"></i>';
            setTimeout(() => copyBtn.innerHTML = '<i class="ph ph-copy"></i>', 2000);
        };

        saveBtn.onclick = async () => {
            if (window.Firebase && !window.Firebase.isSimulated) {
                saveBtn.innerHTML = '<i class="ph ph-circle-notch animate-spin"></i>';
                await window.Firebase.saveData('content', 'latest', {
                    type: select.value,
                    topic: topic.value,
                    content: output.value,
                    timestamp: Date.now()
                });
                saveBtn.innerHTML = '<i class="ph ph-check"></i>';
                setTimeout(() => saveBtn.innerHTML = '<i class="ph ph-cloud-arrow-up"></i>', 2000);
            } else {
                alert("Firebase non collegato. Configuralo nelle Impostazioni.");
            }
        };
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    // Carichiamo la chiave API se presente
    const geminiKey = localStorage.getItem('cf_google_api_key');
    if (geminiKey && window.Gemini) {
        window.Gemini.setApiKey(geminiKey);
    }
    
    window.Studio = new StudioManager();
});
