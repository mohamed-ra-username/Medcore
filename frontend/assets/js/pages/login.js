import {
  handleLogin,
  handleRegister,
  toggleView,
  switchTab,
  switchTabByName,
  selectRole,
  togglePass,
  checkStrength
} from '../ui/auth-controller.js';
import { toggleLang, applyLang } from '../services/translation.js';

// Bind to window for HTML and template event handlers
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.toggleView = toggleView;
window.switchTab = switchTab;
window.switchTabByName = switchTabByName;
window.selectRole = selectRole;
window.togglePass = togglePass;
window.checkStrength = checkStrength;
window.toggleLang = toggleLang;

// Initialize language settings on login page load
applyLang();
