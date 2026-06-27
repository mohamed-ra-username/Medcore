/**
 * ==========================================
 * 🔐 AUTH CONTROLLER
 * ==========================================
 * Handles Login, Registration, and UI View Toggling.
 */

function logout() {
    // localStorage.removeItem("token");
    // localStorage.removeItem("role");
    // localStorage.removeItem("permissions");


    setTimeout(() => {
      window.location.href = "login.html";
    }, 0);
    showToast("Successfully logged out")
}

async function handleLogin() {
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-pass").value;

  if (!email || !email.includes("@")) { showErr("err-login-email", "login-email"); return; }
  else clearErr("err-login-email", "login-email");

  if (!pass) { showErr("err-login-pass", "login-pass"); return; }
  else clearErr("err-login-pass", "login-pass");


  const btn = document.getElementById("btn-login");
  btn.classList.add("loading");

  const response = await POSTRequest("/auth/login/", { email, password: pass });

  btn.classList.remove("loading");

  if (response && response.success) {
    // Correctly unwrap the data from the standard envelope
    const authData = response.data;

    console.log("Login successful. Storing session...");
    localStorage.setItem("token", authData.token);
    localStorage.setItem("role", authData.role);
    localStorage.setItem("permissions", JSON.stringify(authData.permissions));

    showSuccess();
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1500);
  } else {
    alert(response?.error || "Login Failed");
  }
}

async function handleRegister() {
  const email = document.getElementById("reg-email").value;
  const pass = document.getElementById("reg-pass").value;
  const terms = document.getElementById("terms-check").checked;

  if (!email || !email.includes("@")) { showErr("err-reg-email", "reg-email"); return; }
  else clearErr("err-reg-email", "reg-email");

  if (!pass || pass.length < 8) { showErr("err-reg-pass", "reg-pass"); return; }
  else clearErr("err-reg-pass", "reg-pass");

  if (!terms) {
    alert(Utils.lang === "ar" ? "يجب الموافقة على الشروط أولاً" : "Please accept the terms first");
    return;
  }


  const btn = document.getElementById("btn-register");
  btn.classList.add("loading");

  const response = await POSTRequest("/auth/register/", {
    email,
    password: pass,
    role: document.querySelector('input[name="role"]:checked')?.value || "user",
    name: document.getElementById("reg-fname").value + " " + document.getElementById("reg-lname").value
  });

  btn.classList.remove("loading");

  if (response && response.success) {
    showSuccess();
    setTimeout(() => {
      toggleView('login');
      const successSc = document.getElementById("success-screen");
      if (successSc) successSc.classList.remove("show");
      const loginView = document.getElementById("view-login");
      if (loginView) loginView.style.display = "block";
    }, 3000);
  } else {
    alert(response?.error || "Registration Failed");
  }
}

/* ── UI HELPERS ── */

function toggleView(view) {
  const isLogin = view === "login";
  const viewLogin = document.getElementById("view-login");
  const viewRegister = document.getElementById("view-register");

  if (viewLogin) viewLogin.style.display = isLogin ? "block" : "none";
  if (viewRegister) viewRegister.style.display = isLogin ? "none" : "block";

  // Update tabs if they exist
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  if (tabLogin && tabRegister) {
    tabLogin.classList.toggle("active", isLogin);
    tabRegister.classList.toggle("active", !isLogin);
  }
}

function switchTab(tab, btn) {
  toggleView(tab);
}

function switchTabByName(tab) {
  toggleView(tab);
}

function showErr(errId, inputId) {
  const errEl = document.getElementById(errId);
  const inputEl = document.getElementById(inputId);
  if (errEl) errEl.classList.add("show");
  if (inputEl) inputEl.classList.add("error");
}

function clearErr(errId, inputId) {
  const errEl = document.getElementById(errId);
  const inputEl = document.getElementById(inputId);
  if (errEl) errEl.classList.remove("show");
  if (inputEl) inputEl.classList.remove("error");
}

function showSuccess() {
  const viewLogin = document.getElementById("view-login");
  const viewRegister = document.getElementById("view-register");
  if (viewLogin) viewLogin.style.display = "none";
  if (viewRegister) viewRegister.style.display = "none";

  const sc = document.getElementById("success-screen");
  if (sc) {
    sc.classList.add("show");
    const pb = document.getElementById("progress-bar");
    if (pb) setTimeout(() => { pb.style.width = "100%"; }, 50);
  }
}

function selectRole(card) {
  document.querySelectorAll(".role-card").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected");
  const radio = card.querySelector("input");
  if (radio) radio.checked = true;
}

function togglePass(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (inp) inp.type = inp.type === "password" ? "text" : "password";
}

function checkStrength(val) {
  let score = -1;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const colors = ["#e53935", "#E65100", "#F9A825", "#1AAB8A"];
  const segs = document.querySelectorAll(".strength-seg");
  segs.forEach((s, i) => s.style.background = (i <= score) ? colors[score] : "var(--border)");
}
