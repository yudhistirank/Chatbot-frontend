const chatbox = document.getElementById("chatbox");

async function sendMessage() {
  const textarea = document.getElementById("message");
  const message = textarea.value.trim();
  if (!message) return;

  appendMessage("user", message);
  textarea.value = "";

  appendMessage("bot", "Mengetik...");

  const res = await fetch("https://your-backend-url/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  // Hapus "Mengetik..." dan tambahkan balasan sebenarnya
  const botMessages = document.querySelectorAll(".bot");
  botMessages[botMessages.length - 1].remove();
  appendMessage("bot", data.response);
}

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.className = role;
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}
