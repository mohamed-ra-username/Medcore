/**
 * ==========================================
 * 🛠️ UTILITY LIBRARY
 * ==========================================
 * Shared logic for formatting and common tasks.
 */

const Utils = {
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

    formatNumber: (num) => Utils.numberFormatter.format(num),

    initials: (name) => {
        if (!name) return "??";
        return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    },

    // Standard date fixer for the UI
    formatDate: (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString(Utils.locale, { month: 'short', day: 'numeric' });
    }
};

/**
 * ==========================================
 * 🔔 TOAST NOTIFICATION SYSTEM
 * ==========================================
 */
function showToast(message, type = "success") {
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
