const noNotificationsText = "<small>No notifications.</small>";

const notificationTemplate = function (item) {
  return `<span>
  <label class="${item.isRead ? "read-notification" : "unread-notification"}" onclick="markNotifRead(this)">
  <b>*</b>
  ${item.text}
  </label>
  <button onclick="removeNotification(this.parentElement)">x</button>
  </span>
  `;
}

export const notificationsStore = {
  list: [], // list of strings
  asHTML() {
    return this.list.map(notificationTemplate).join("");
  },
  get readCount() {
    return this.list.filter(item => item.isRead).length;
  },
  get unreadCount() {
    return this.list.filter(item => !item.isRead).length;
  },
}

export function updateBadge() {
  const notifDot = document.getElementById("notif-dot");
  if (!notifDot) return;
  notifDot.textContent = notificationsStore.unreadCount;
  notifDot.hidden = notificationsStore.unreadCount <= 0;
}

export function markNotifRead(notif) {
  notif.removeAttribute("onclick");
  notif.classList.replace("unread-notification", "read-notification");

  const cleanText = notif.lastChild.textContent.trim();

  const item = notificationsStore.list.find(notif => notif.text === cleanText);
  if (item) {
    item.isRead = true;
    cacheNotifications();
    updateBadge(); // Keep badge in sync when an item is read
  }
}

export function loadDummyNotifications() {
  const stored = localStorage.getItem("notifications");
  if (!stored) {
    const tempList = [
      { isRead: false, text: "You've got a new insurance scam!" },
      { isRead: false, text: "Patient died! :(" }
    ];
    notificationsStore.list = tempList;
    cacheNotifications();
  } else {
    notificationsStore.list = JSON.parse(stored);
  }
  updateBadge();
}

export function cacheNotifications() {
  localStorage.setItem("notifications", JSON.stringify(notificationsStore.list));
}

export function loadNotifications() {
  const notifContainer = document.getElementById("notifications-list");
  if (!notifContainer) return;
  notifContainer.innerHTML = notificationsStore.list.length ? notificationsStore.asHTML() : noNotificationsText;
}

export function removeNotification(target) {
  if (!target) return;

  // 1. Get the container dynamically from the target itself
  const container = target.parentElement;

  // 2. Find and remove the item from your data array using text content
  const cleanText = target.querySelector('label').lastChild.textContent.trim();
  const index = notificationsStore.list.findIndex(item => item.text === cleanText);

  if (index !== -1) {
    notificationsStore.list.splice(index, 1);
    cacheNotifications();
    updateBadge();
  }

  // 3. Delete the element from the DOM
  target.remove();

  // 4. Use the dynamic container to show the fallback text if empty
  if (notificationsStore.list.length === 0 && container) {
    container.innerHTML = noNotificationsText;
  }
}

export function clearNotifs() {
  localStorage.removeItem("notifications");
  notificationsStore.list.length = 0;
  const notifsList = document.getElementById('notifications-list');
  if (notifsList) {
    notifsList.innerHTML = noNotificationsText;
  }
  updateBadge();
}
