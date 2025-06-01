const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";
  appendMessage("bot", "Mengetik...");

  try {
    const res = await fetch("https://chatbot-backend-production-66f6.up.railway.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    removeLastBotMessage();
    appendMessage("bot", data.response || "Maaf, tidak ada balasan.");
  } catch (err) {
    console.error(err);
    removeLastBotMessage();
    appendMessage("bot", "Terjadi kesalahan saat menghubungi server.");
  }
});

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", role);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLastBotMessage() {
  const messages = document.querySelectorAll(".bot");
  if (messages.length > 0) messages[messages.length - 1].remove();
}
