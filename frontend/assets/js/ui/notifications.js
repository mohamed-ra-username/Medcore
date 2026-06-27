const noNotificationsText = "<small>No notifications.</small>";

let notificationTemplate = function (item) {
  // FIXED: Changed 'this.parent' to 'this.parentElement'
  return `<span>
  <label class="${item.isRead ? "read" : "unread"}" onclick="markNotifRead(this)">
  <b>*</b>
  ${item.text}
  </label>
  <button onclick="removeNotification(this.parentElement)">x</button>
  </span>
  `;
}

const notificationsStore = {
  list: [],
  asHTML() {
    return this.list.map(notificationTemplate).join("");
  },
  get readCount() {
    return this.list.filter(item => item.isRead).length;
  },
  get unreadCount() {
    return this.list.filter(item => !item.isRead).length;
  },
  storeToStorage() {
    localStorage.setItem("notifications", JSON.stringify(this.list));
  }
}

function updateBadge() {
  if (typeof notifDot === "undefined" || !notifDot) return;
  notifDot.textContent = notificationsStore.unreadCount;
  notifDot.hidden = notificationsStore.unreadCount <= 0;
}

function markNotifRead(notif) {
  notif.removeAttribute("onclick");
  notif.classList.replace("unread", "read");

  const cleanText = notif.lastChild.textContent.trim();

  const item = notificationsStore.list.find(notif => notif.text === cleanText);
  if (item) {
    item.isRead = true;
    notificationsStore.storeToStorage();
    updateBadge(); // Keep badge in sync when an item is read
  }
}

function loadDummyNotifications() {
  const stored = localStorage.getItem("notifications");
  if (!stored) {
    const tempList = [
      { isRead: false, text: "You've got a new insurance scam!" },
      { isRead: false, text: "Patient died! :(" }
    ];
    notificationsStore.list = tempList;
    notificationsStore.storeToStorage();
  } else {
    notificationsStore.list = JSON.parse(stored);
  }
  updateBadge();
}

function loadNotifications() {
  const notifContainer = document.getElementById("notifications-list");
  if (!notifContainer) return;
  notifContainer.innerHTML = notificationsStore.list.length ? notificationsStore.asHTML() : noNotificationsText;
}

function removeNotification(target) {
  if (!target) return;

  // 1. Get the container dynamically from the target itself
  const container = target.parentElement;

  // 2. Find and remove the item from your data array using text content
  const cleanText = target.querySelector('label').lastChild.textContent.trim();
  const index = notificationsStore.list.findIndex(item => item.text === cleanText);

  if (index !== -1) {
    notificationsStore.list.splice(index, 1);
    notificationsStore.storeToStorage();
    updateBadge();
  }

  // 3. Delete the element from the DOM
  target.remove();

  // 4. Use the dynamic container to show the fallback text if empty
  if (notificationsStore.list.length === 0 && container) {
    container.innerHTML = noNotificationsText;
  }
}


function clearNotifs() {
  localStorage.removeItem("notifications");
  notificationsStore.list.length = 0;
  const notifsList = document.getElementById('notifications-list');
  if (notifsList) {
    notifsList.innerHTML = noNotificationsText;
  }
  updateBadge();
}
