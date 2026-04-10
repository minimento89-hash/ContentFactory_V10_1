/**
 * Content Factory V10.1 — Agent Intelligence Core
 * The central event bus and state engine for Bug Hunter, Fixer, Cipher, and Olivia.
 */

const AgentCore = (() => {
    // 1. Initial State Definition
    const defaultState = {
        health: 100,
        lastUpdate: Date.now(),
        isAwaitingFix: false,
        logs: [],
        user: {
            name: 'Il Capo',
            status: 'Owner',
            avatar: 'AC',
            bio: 'Master Orchestrator of the Content Factory.'
        },
        tasks: [], // Inter-agent task queue
        sentiment: {
            hypeScore: 98.4,
            engagement: 12800,
            mood: 'optimistic'
        },
        agents: {
            cipher: {
                name: 'Cipher',
                status: 'ACTIVE',
                operationalState: 'ONLINE',
                tag: 'SECURE',
                color: '#ffd700',
                icon: 'ph-shield-check',
                projects: ['Encryption V3', 'Dify Firewall'],
                systemPrompt: 'Monitor system security, block unauthorized access, and manage encryption protocols.'
            },
            bug_hunter: {
                name: 'Bug Hunter',
                status: 'BUG DETECTED',
                operationalState: 'READY',
                tag: 'QA',
                color: '#f59e0b',
                icon: 'ph-bug-beetle',
                projects: ['DOM Audit', 'JS Leak Test'],
                systemPrompt: 'Proactively scan for UI errors, memory leaks, and broken interaction logic.'
            },
            fixer: {
                name: 'Fixer',
                status: 'STANDBY',
                operationalState: 'READY',
                tag: 'READY',
                color: '#10b981',
                icon: 'ph-wrench',
                projects: ['Layout Fix', 'CSS Cleanup'],
                systemPrompt: 'Deploy automatic patches for detected bugs and optimize platform performance.'
            },
            olivia: {
                name: 'Olivia',
                status: 'GLOBAL_RESEARCH',
                operationalState: 'ONLINE',
                tag: 'CREATIVE',
                color: '#ec4899',
                icon: 'ph-paint-brush-broad',
                projects: ['Quantum UI', 'Dify Frontend'],
                systemPrompt: 'Design high-fidelity interfaces, analyze trends, and generate creative brand assets.',
                connected: ['Internet', 'AI Video', 'AI Image', 'Canvas']
            },
            provola: {
                name: 'Provola',
                status: 'EXPERIMENTING',
                operationalState: 'ONLINE',
                tag: 'SOCIAL_LAB',
                color: '#FFB000',
                icon: 'ph-flask',
                projects: ['Neural Heuristics', 'Hype Engineering'],
                systemPrompt: 'Experimental laboratory for advanced creative heuristics.'
            },
            disperazione: {
                name: 'Disperazione',
                status: 'WAITING_FOR_TASK',
                operationalState: 'ONLINE',
                tag: 'RESEARCHER',
                color: '#06b6d4',
                icon: 'ph-magnifying-glass',
                projects: ['Web Scraper', 'Trend Analysis'],
                systemPrompt: 'Search the internet for data, find resources (API keys, themes), and report to other agents.'
            }
        }
    };

    // 2. Load State from Persistence with V10.1 Fallback (Schema Integrity)
    const savedState = JSON.parse(localStorage.getItem('agent_core_state')) || {};
    
    // Deep merge function to ensure new properties exist
    const mergeState = (target, source) => {
        const merged = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                merged[key] = mergeState(target[key] || {}, source[key]);
            } else {
                merged[key] = source[key];
            }
        }
        return merged;
    };

    let state = mergeState(defaultState, savedState);
    localStorage.setItem('agent_core_state', JSON.stringify(state));

    // ── In-Memory Indexes ──────────────────────────────────────────────
    // Mirror the role of DB indexes: O(1) lookups on fields used in
    // WHERE-like searches (findIndex, filter), JOIN-like delegation
    // queries (from/to), and ORDER BY-like groupings (day, event).
    const _indexes = {
        tasks:    { byId: {}, byStatus: {}, byFrom: {}, byTo: {} },
        logs:     { byEvent: {} },
        calendar: { byDay: {} }
    };

    /** Add a value to a multi-map index (key → Set of items). */
    const _addToIndex = (map, key, item) => {
        if (key === undefined || key === null) return;
        if (!map[key]) map[key] = new Set();
        map[key].add(item);
    };

    /** Remove a value from a multi-map index. */
    const _removeFromIndex = (map, key, item) => {
        if (map[key]) {
            map[key].delete(item);
            if (map[key].size === 0) delete map[key];
        }
    };

    /** Build all task indexes from scratch (used on init & sync). */
    const _rebuildTaskIndexes = () => {
        _indexes.tasks = { byId: {}, byStatus: {}, byFrom: {}, byTo: {} };
        (state.tasks || []).forEach(t => _indexTask(t));
    };

    /** Index a single task across every task index. */
    const _indexTask = (task) => {
        _indexes.tasks.byId[task.id] = task;
        _addToIndex(_indexes.tasks.byStatus, task.status, task);
        _addToIndex(_indexes.tasks.byFrom, task.from, task);
        _addToIndex(_indexes.tasks.byTo, task.to, task);
    };

    /** Build log indexes from scratch. */
    const _rebuildLogIndexes = () => {
        _indexes.logs = { byEvent: {} };
        (state.logs || []).forEach(l => _addToIndex(_indexes.logs.byEvent, l.event, l));
    };

    /** Build calendar indexes from scratch. */
    const _rebuildCalendarIndexes = () => {
        _indexes.calendar = { byDay: {} };
        (state.calendar || []).forEach(e => _addToIndex(_indexes.calendar.byDay, e.day, e));
    };

    // Populate indexes from the loaded state
    _rebuildTaskIndexes();
    _rebuildLogIndexes();
    _rebuildCalendarIndexes();

    // 3. Event Bus
    const listeners = {};

    const broadcast = (event, data, fromSync = false) => {
        // Internal listeners
        if (listeners[event]) {
            listeners[event].forEach(callback => callback(data));
        }
        // Browser-level event bus for external modules
        const customEvent = new CustomEvent(`agent:${event}`, { detail: { ...data, state } });
        window.dispatchEvent(customEvent);
        
        // Log significant events
        if (['bugFound', 'fixComplete', 'provisioningComplete'].includes(event)) {
            const logEntry = { timestamp: new Date().toISOString(), event, ...data };
            // Remove oldest log from index when exceeding cap
            if (state.logs.length >= 50) {
                const removed = state.logs.shift();
                _removeFromIndex(_indexes.logs.byEvent, removed.event, removed);
            }
            state.logs.push(logEntry);
            _addToIndex(_indexes.logs.byEvent, event, logEntry);
            saveState();
        }

        // Real-time Push (Avoid infinite loops)
        if (!fromSync && window.SyncEngine) {
            window.SyncEngine.push({ event, data, state });
        }
    };

    const listen = (event, callback) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
    };

    const saveState = () => {
        state.lastUpdate = Date.now();
        localStorage.setItem('agent_core_state', JSON.stringify(state));
    };

    // 4. Core Actions
    const updateAgent = (id, updates) => {
        if (state.agents[id]) {
            state.agents[id] = { ...state.agents[id], ...updates };
            broadcast('stateUpdate', { agent: id, updates });
            saveState();
        }
    };

    const renameAgent = (id, newName) => {
        if (state.agents[id]) {
            const oldName = state.agents[id].name;
            state.agents[id].name = newName;
            broadcast('agentRenamed', { id, oldName, newName });
            saveState();
        }
    };

    const triggerBug = (message) => {
        state.health = Math.max(0, state.health - 5);
        state.isAwaitingFix = true;
        updateAgent('hunter', { status: 'BUG DETECTED', tag: 'ALERT' });
        broadcast('bugFound', { message, severity: 'HIGH' });
        saveState();
    };

    const resolveBugs = () => {
        state.health = 100;
        state.isAwaitingFix = false;
        updateAgent('fixer', { status: 'PATCHING...', tag: 'BUSY' });
        
        setTimeout(() => {
            updateAgent('hunter', { status: 'SCANNING', tag: 'CLEAN' });
            updateAgent('fixer', { status: 'STANDBY', tag: 'READY' });
            broadcast('fixComplete', { message: 'All systems operational.' });
            saveState();
        }, 3000);
    };

    // 5. Deep Audit Logic
    const auditDOM = () => {
        if (state.isAwaitingFix) return;
        updateAgent('hunter', { status: 'AUDITING DOM...', tag: 'BUSY' });
        const issues = [];
        
        document.querySelectorAll('a').forEach(a => {
            if (a.getAttribute('href') === '#' || a.getAttribute('href') === '') {
                issues.push(`Link morto: "${a.innerText.trim() || 'Link senza nome'}"`);
            }
        });

        document.querySelectorAll('button').forEach(btn => {
            if (!btn.onclick && (btn.innerText.toLowerCase().includes('soon') || btn.innerText.trim() === '')) {
                issues.push(`Pulsante incompleto: "${btn.innerText.trim() || 'Senza label'}"`);
            }
        });

        if (issues.length > 0) {
            triggerBug(issues[0]);
            broadcast('auditReport', { issues });
        } else {
            updateAgent('hunter', { status: 'SCANNING', tag: 'CLEAN' });
        }
    };

    const auditLayout = () => {
        if (document.documentElement.scrollWidth > window.innerWidth) {
            triggerBug("Overflow rilevato: Il layout supera i limiti orizzontali.");
        }
    };

    // 6. Creative Provisioning & Scheduling
    const provisionStudio = (designName) => {
        broadcast('provisioningStart', { design: designName });
        setTimeout(() => {
            const projectUrl = `studio/project-${Date.now()}.html`;
            broadcast('provisioningComplete', { url: projectUrl });
        }, 3000);
    };

    const scheduleEvent = (day, title, type = 'ev-code') => {
        const event = { day, title, type, id: Date.now() };
        if (!state.calendar) state.calendar = [];
        state.calendar.push(event);
        _addToIndex(_indexes.calendar.byDay, day, event);
        broadcast('eventScheduled', { event });
        saveState();
    };

    return {
        state,
        broadcast,
        listen,
        updateAgent,
        renameAgent,
        triggerBug,
        resolveBugs,
        auditDOM,
        auditLayout,
        provisionStudio,
        scheduleEvent,
        
        // --- Task Delegation ---
        delegateTask: (fromId, toId, title, payload) => {
            const taskId = 'task_' + Date.now();
            const newTask = {
                id: taskId, from: fromId, to: toId, title, payload,
                status: 'PENDING', timestamp: new Date().toISOString()
            };
            state.tasks.push(newTask);
            _indexTask(newTask);
            saveState();
            broadcast('taskNew', newTask);
            console.log(`[AgentCore] Task: ${fromId} -> ${toId}: ${title}`);
            return taskId;
        },

        completeTask: (taskId, result) => {
            const task = _indexes.tasks.byId[taskId];
            if (task) {
                _removeFromIndex(_indexes.tasks.byStatus, task.status, task);
                task.status = 'COMPLETED';
                task.result = result;
                _addToIndex(_indexes.tasks.byStatus, 'COMPLETED', task);
                saveState();
                broadcast('taskCompleted', task);
            }
        },

        // --- Sentiment Simulation ---
        generateSentimentUpdate: () => {
            if(!state.sentiment) state.sentiment = { hypeScore: 98.4, engagement: 12800, mood: 'opt' };
            state.sentiment.hypeScore += (Math.random() - 0.4) * 0.2;
            state.sentiment.engagement += Math.floor(Math.random() * 20);
            saveState();
            broadcast('sentimentUpdate', state.sentiment);
        },

        getReport: () => JSON.stringify(state.logs, null, 2),

        // --- Indexed Query Helpers ───────────────────────────────────
        /** O(1) task lookup by id  (equiv. WHERE id = ?) */
        getTaskById: (taskId) => _indexes.tasks.byId[taskId] || null,

        /** O(1) tasks by status    (equiv. WHERE status = ?) */
        getTasksByStatus: (status) => [...(_indexes.tasks.byStatus[status] || [])],

        /** O(1) tasks sent by agent (equiv. WHERE from = ? / JOIN) */
        getTasksFrom: (agentId) => [...(_indexes.tasks.byFrom[agentId] || [])],

        /** O(1) tasks received by agent (equiv. WHERE to = ? / JOIN) */
        getTasksTo: (agentId) => [...(_indexes.tasks.byTo[agentId] || [])],

        /** O(1) logs filtered by event type (equiv. WHERE event = ?) */
        getLogsByEvent: (eventName) => [...(_indexes.logs.byEvent[eventName] || [])],

        /** O(1) calendar events by day (equiv. WHERE day = ? / ORDER BY day) */
        getEventsByDay: (day) => [...(_indexes.calendar.byDay[day] || [])]
    };
})();

// Auto-Pulse
setInterval(() => { if(window.AgentCore) AgentCore.generateSentimentUpdate(); }, 8000);

// Auto-Launch
if (typeof window !== 'undefined') {
    window.AgentCore = AgentCore;
    
    // Initialize Sync Engine
    if (window.SyncEngine) {
        window.SyncEngine.init((payload) => {
            const { event, data, state: remoteState } = payload;
            console.log(`[AgentCore] External Sync: ${event}`);
            
            // Sync local state copy
            state = { ...remoteState };
            // Rebuild indexes after full state replacement
            _rebuildTaskIndexes();
            _rebuildLogIndexes();
            _rebuildCalendarIndexes();
            
            // Re-broadcast internally without re-pushing to sync
            broadcast(event, data, true);
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            AgentCore.auditDOM();
            AgentCore.auditLayout();
        }, 3000);
    });
}
