const form = document.getElementById('loginForm');
const msg  = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';

  const data = {
    email: form.email.value.trim(),
    password: form.password.value,
  };

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok && result.success) {
      msg.style.color = 'green';
      msg.textContent = '✅ Login successful! Redirecting...';

      setTimeout(() => {
        window.location.href = '/home.html';
      }, 1000);
    } else {
      throw new Error(result.error || 'Login failed');
    }
  } catch (err) {
    msg.style.color = 'red';
    msg.textContent = '❌ ${err.message}';
  }
});