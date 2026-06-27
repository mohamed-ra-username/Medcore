let notificationsCount = 0

function updateBadge() {
  notifDot.textContent=notificationsCount
  if (notificationsCount <= 0) {
    if (notifDot) notifDot.hidden = true;
  }
  else {
    if (notifDot) notifDot.hidden = false;
  }

}
function markNotifRead(notif) {
  notif.removeAttribute("onclick");
  notif.classList.replace("unread", "read");
  notificationsCount--
  updateBadge()
}


function loadDummyNotifications() {
  Medcore.state.notifications = ["You've got a new insurance scam!", "Patient died! :("];
  notificationsCount = Medcore.state.notifications.length;
  updateBadge()
}

function loadNotifications() {
  const notifContainer = document.getElementById("notifications-list");
  if (!notifContainer) return;
  notifContainer.innerHTML = Medcore.state.notifications.map(notification =>
    `<label class="unread" onclick="markNotifRead(this)">\
    <b>*</b> ${notification}\
    </label>`
  ).join("<br>");
}

function clearNotifs() {
  notifDot.hidden = true;
  const notifsList = document.getElementById('notifications-list');
  notificationsCount = 0;
  Medcore.state.notifications = [];
  notifsList.innerHTML = "<small>No notifications.</small>";
}
