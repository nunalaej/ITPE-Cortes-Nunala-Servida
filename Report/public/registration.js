const form = document.getElementById('registrationForm');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
  };

  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok && result.success) {
      msg.style.color = 'green';
      msg.textContent = '✅ Registration successful!';
      form.reset();
    } else {
      throw new Error(result.error || 'Registration failed');
    }
  } catch (err) {
    msg.style.color = 'red';
    msg.textContent = `❌ ${err.message}`;
  }
});
