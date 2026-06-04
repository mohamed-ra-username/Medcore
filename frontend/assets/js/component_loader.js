/**
 * ==========================================
 * 🔴 COMPONENT LOADER
 * ==========================================
 * Dynamically loads HTML snippets into the page.
 */

async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Could not load ${componentPath}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        console.info(`✅ Component loaded: ${elementId}`);
    } catch (error) {
        console.error(`❌ Error loading component ${elementId}:`, error);
    }
}

// Create a promise that resolves when all core components are injected
window.componentsLoaded = (async () => {
    // Load components in parallel
    await Promise.all([
        loadComponent('topbar-placeholder', 'components/topbar.html'),
        loadComponent('sidebar-placeholder', 'components/sidebar.html'),
        loadComponent('modals-placeholder', 'components/modals.html')
    ]);
    console.info("🏛️ All UI components initialized.");
})();
