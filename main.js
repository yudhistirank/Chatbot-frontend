const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const deleteBtn = document.getElementById("delete-history");
const backendURL = "https://chatbot-backend-production-66f6.up.railway.app";

// Dapatkan sessionId
let sessionId = localStorage.getItem("sessionId");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("sessionId", sessionId);
}

// Tampilkan riwayat saat pertama kali load
window.onload = async () => {
  try {
    const res = await fetch(`${backendURL}/api/history/${sessionId}`);
    if (!res.ok) throw new Error("Gagal load history");
    const history = await res.json();
    history.forEach(item => appendMessage(item.role, item.message));
  } catch (err) {
    console.error("Load history error:", err);
  }
};

let typingMessage = null; // Menyimpan referensi elemen "Mengetik..."

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  // Tambahkan "Mengetik..." dan simpan referensinya
  typingMessage = appendMessage("bot", "Mengetik...");

  try {
    const res = await fetch(`${backendURL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!res.ok) throw new Error("Response not OK");

    const data = await res.json();
    removeTypingMessage();
    appendMessage("bot", data.response);
    speak(data.response);
  } catch (err) {
    removeTypingMessage();
    appendMessage("bot", "❌ Error: tidak dapat terhubung.");
    console.error("Fetch error:", err);
  }
});

deleteBtn.addEventListener("click", async () => {
  try {
    await fetch(`${backendURL}/api/history/${sessionId}`, { method: "DELETE" });
    chatBox.innerHTML = "";
  } catch (err) {
    console.error("Delete history error:", err);
  }
});

function appendMessage(role, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", role);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // penting agar bisa remove nanti
}

function removeTypingMessage() {
  if (typingMessage) {
    typingMessage.remove();
    typingMessage = null;
  }
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "id-ID";
  synth.speak(utter);
}

document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light");
});
