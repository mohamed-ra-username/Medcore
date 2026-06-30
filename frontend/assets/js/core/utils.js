/**
 * ==========================================
 * 🛠️ UTILITY LIBRARY
 * ==========================================
 * Shared logic for formatting and common tasks.
 */

export const Utils = {
    // Single Source of Truth
    get locale() {
        return localStorage.getItem("locale") ?? "en-US";
    },

    // Derived from locale (e.g. "ar" or "en")
    get lang() {
        return this.locale.split('-')[0];
    },

    get numberFormatter() {
        return new Intl.NumberFormat(this.locale);
    },

    // Standard Formatter for numbers
    formatNumber: (val) => {
        if (val === undefined || val === null || val === "N/A" || val === "." || val === "") return "N/A";
        let num = parseFloat(val);
        return isNaN(num) ? "N/A" : Utils.numberFormatter.format(num);
    },

    initials: (name) => {
        if (!name || name === "N/A") return "??";
        return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    },

    // Standard date fixer for the UI
    formatDate: (dateStr) => {
        if (!dateStr || dateStr === "N/A") return "N/A";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString(Utils.locale, { month: 'long', day: 'numeric' });
    },

    // Get long localized date for headers (e.g. Monday, June 8, 2026)
    formatFullDate: (date = new Date()) => {
        return date.toLocaleDateString(Utils.locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Get localized time (e.g. 14:30)
    formatTime: (dateStr) => {
        if (!dateStr || dateStr === "N/A") return "N/A";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleTimeString(Utils.locale, { hour: '2-digit', minute: '2-digit', hour12: false });
    }
};

/**
(message, type{success,error,info,warn})
 Display toast notification
 */
export function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 1000; display: flex; flex-direction: column; gap: 10px;";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const colors = {
        success: "#1AAB8A",
        error: "#C62828",
        info: "#1B4F8A",
        warn: "#E65100"
    };

    toast.className = "toast-message";
    toast.style.cssText = `
        background: ${colors[type]};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease-out;
        cursor: pointer;
    `;
    toast.textContent = message;

    const remove = () => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    };

    toast.onclick = remove;
    container.appendChild(toast);
    setTimeout(remove, 4000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

export function debounce(func, delay = 150) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

/**
 * ==========================================
 * 🛡️ MICRO-FRAMEWORK CORE HELPERS
 * ==========================================
 */

export function escapeHTML(str) {
    if (typeof str !== "string") return str;
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
}

export function resolvePath(obj, path) {
    if (!path) return "";
    return path.split('.').reduce((acc, part) => {
        return acc !== undefined && acc !== null ? acc[part] : "";
    }, obj);
}

export class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.subscribers = {};
    }

    subscribe(key, callback) {
        if (!this.subscribers[key]) this.subscribers[key] = [];
        this.subscribers[key].push(callback);
        return () => {
            this.subscribers[key] = this.subscribers[key].filter(cb => cb !== callback);
        };
    }

    set(key, newValue) {
        this.state[key] = newValue;
        if (this.subscribers[key]) {
            this.subscribers[key].forEach(callback => callback(newValue));
        }
    }
}

const delegatedContainers = new WeakSet();

export function syncList(parentEl, list, {
    getKey = (item) => item.id,
    columns = [],
    rowAttrs = () => ({}),
    actions = {}
}) {
    if (!parentEl) return;

    const freshKeys = list.map(item => String(getKey(item)));

    // 1. Remove deleted rows in one pass
    Array.from(parentEl.children).forEach(child => {
        const key = child.dataset.key;
        if (key && !freshKeys.includes(key)) {
            child.remove();
        }
    });

    // 2. Off-screen layout staging (Document Fragment)
    const fragment = document.createDocumentFragment();

    // 3. Row Reconciliation (DOM Diffing)
    list.forEach(item => {
        const key = String(getKey(item));
        let row = parentEl.querySelector(`[data-key="${key}"]`);

        if (row) {
            // Row exists: Update individual cells if contents differ
            columns.forEach(col => {
                const cell = row.querySelector(`[data-col="${col.key || col.header}"]`);
                if (cell) {
                    const rawVal = col.render ? col.render(item) : resolvePath(item, col.key);
                    const freshContent = col.render ? rawVal : escapeHTML(rawVal);
                    
                    if (cell.innerHTML !== freshContent) {
                        cell.innerHTML = freshContent; // Surgical DOM edit!
                    }
                }
            });
        } else {
            // Row is new: Build element in memory
            const tr = document.createElement("tr");
            tr.setAttribute("data-key", key);
            
            const attrs = rowAttrs(item);
            Object.entries(attrs).forEach(([attr, val]) => tr.setAttribute(attr, val));

            tr.innerHTML = columns.map(col => {
                const rawVal = col.render ? col.render(item) : resolvePath(item, col.key);
                const freshContent = col.render ? rawVal : escapeHTML(rawVal);
                return `<td data-col="${col.key || col.header}">${freshContent}</td>`;
            }).join("");

            fragment.appendChild(tr);
        }
    });

    // Append all new rows in one single reflow
    if (fragment.children.length > 0) {
        parentEl.appendChild(fragment);
    }

    // 4. Event Delegation: Single click listener bound once
    if (!delegatedContainers.has(parentEl)) {
        delegatedContainers.add(parentEl);
        parentEl.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-action]");
            const row = e.target.closest("[data-key]");
            if (btn && row) {
                const action = btn.dataset.action;
                const id = row.dataset.key;
                if (actions[action]) {
                    actions[action](id, btn, row, e);
                }
            }
        });
    }
}
