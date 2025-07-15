const messagesDiv = document.getElementById('messages');
const form = document.getElementById('input-form');
const userInput = document.getElementById('user-input');

const logFileName = `chat_log_${new Date().toISOString().slice(0,10)}.json`;
const chatLog = [];

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userText = userInput.value.trim();
  if (!userText) return;

  appendMessage('User', userText);
  chatLog.push({ role: 'user', content: userText });

  userInput.value = '';

  const assistantText = await mockGpt4oResponse(userText);
  appendMessage('GPT-4o', assistantText);
  chatLog.push({ role: 'assistant', content: assistantText });

  localStorage.setItem(logFileName, JSON.stringify(chatLog));
});

function appendMessage(sender, text) {
  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = `<span class="${sender === 'User' ? 'user' : 'assistant'}">${sender}:</span> ${text}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function mockGpt4oResponse(userText) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Echo: ${userText}`);
    }, 1000);
  });
}