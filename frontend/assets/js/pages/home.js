// import page modules
import { initUI, goPage, viewPatient, setStatus, openReview, toggleEditMode } from '../ui/main-script.js';
import { toggleLang } from '../services/translation.js';
import { openModal, closeModal, saveModalData, updatePatient, deletePatient } from '../ui/modal-handling.js';
import { syncData } from '../services/sync-service.js';
import { logout } from '../core/api-client.js';
import { clearNotifs, removeNotification, markNotifRead } from '../ui/notifications.js';
import { showToast } from '../core/utils.js';

// Bind to window for HTML and template onclick handlers
window.toggleLang = toggleLang;
window.clearNotifs = clearNotifs;
window.logout = logout;
window.goPage = goPage;
window.toggleEditMode = toggleEditMode;
window.openModal = openModal;
window.closeModal = closeModal;
window.saveModalData = saveModalData;
window.deletePatient = deletePatient;
window.updatePatient = updatePatient;
window.viewPatient = viewPatient;
window.setStatus = setStatus;
window.openReview = openReview;
window.removeNotification = removeNotification;
window.markNotifRead = markNotifRead;
window.showToast = showToast

// Initialize components sequentially to eliminate race conditions
const run = async () => {
  await initUI();
  syncData();
};

run();
