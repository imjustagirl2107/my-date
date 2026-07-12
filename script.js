const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const success = document.getElementById('success');
const heartsLayer = document.getElementById('heartsLayer');

let answered = false;

function moveNoButton() {
  if (answered) return;

  if (!noBtn.classList.contains('fleeing')) {
    const rect = noBtn.getBoundingClientRect();
    noBtn.style.width = rect.width + 'px';
    noBtn.classList.add('fleeing');
    noBtn.style.left = rect.left + 'px';
    noBtn.style.top = rect.top + 'px';
  }

  const margin = 16;
  const rect = noBtn.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - margin;
  const maxY = window.innerHeight - rect.height - margin;

  const newX = Math.max(margin, Math.random() * maxX);
  const newY = Math.max(margin, Math.random() * maxY);

  noBtn.style.left = `${newX}px`;
  noBtn.style.top = `${newY}px`;
}

noBtn.addEventListener('mouseenter', moveNoButton);

noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveNoButton();
});

noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

yesBtn.addEventListener('click', () => {
  if (answered) return;
  answered = true;

  noBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  noBtn.style.opacity = '0';
  noBtn.style.transform = 'scale(0.6)';
  setTimeout(() => {
    noBtn.style.display = 'none';
  }, 300);

  success.classList.add('show');
  launchHearts();
});

function launchHearts() {
  const heartEmojis = ['❤️', '💗', '💕', '💖'];
  const total = 24;

  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.className = 'heart';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

      const startX = Math.random() * window.innerWidth;
      const drift = (Math.random() - 0.5) * 200;
      const rotate = (Math.random() - 0.5) * 60;
      const size = 16 + Math.random() * 18;
      const duration = 2.6 + Math.random() * 1.6;

      heart.style.left = `${startX}px`;
      heart.style.fontSize = `${size}px`;
      heart.style.setProperty('--drift', `${drift}px`);
      heart.style.setProperty('--rotate', `${rotate}deg`);
      heart.style.animationDuration = `${duration}s`;

      heartsLayer.appendChild(heart);

      heart.addEventListener('animationend', () => heart.remove());
    }, i * 90);
  }
}
