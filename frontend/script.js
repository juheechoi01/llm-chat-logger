const messagesDiv = document.getElementById('messages');
const form = document.getElementById('input-form');
const userInput = document.getElementById('user-input');
const usernameInput = document.getElementById('username');
const startButton = document.getElementById('start-chat');
const chatInterface = document.getElementById('chat-interface');

let username = '';
let chatLog = [];
let logFileName = '';

startButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (!username) {
    alert('Please enter your name');
    return;
  }
  document.getElementById('user-info').style.display = 'none';
  chatInterface.style.display = 'block';
  logFileName = `chat_log_${username}_${new Date().toISOString().slice(0,10)}.json`;
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userText = userInput.value.trim();
  if (!userText) return;

  appendMessage(username, userText);
  chatLog.push({ role: 'user', content: userText });
  userInput.value = '';

  const assistantText = await getGpt4oResponse(chatLog);
  appendMessage('GPT-4o', assistantText);
  chatLog.push({ role: 'assistant', content: assistantText });
  localStorage.setItem(logFileName, JSON.stringify(chatLog));
});

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = `<span class="${sender === username ? 'user' : 'assistant'}">${sender}:</span> ${text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function getGpt4oResponse(messages) {
  const response = await fetch('https://YOUR_RENDER_URL.onrender.com/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      messages
    })
  });

  const data = await response.json();
  return data.reply;
}