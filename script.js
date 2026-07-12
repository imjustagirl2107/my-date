const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const confirmBtn = document.getElementById('confirmBtn');
const heartsLayer = document.getElementById('heartsLayer');
const screens = document.querySelectorAll('.screen');
const dots = document.querySelectorAll('.dot');
const continueButtons = document.querySelectorAll('[data-next]');

const placeSelect = document.getElementById('placeSelect');
const otherPlaceField = document.getElementById('otherPlaceField');
const otherPlaceInput = document.getElementById('otherPlaceInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const successDetails = document.getElementById('successDetails');

let answered = false;
let currentStep = 0;

function goToStep(step) {
  currentStep = step;

  screens.forEach((screen) => {
    screen.classList.toggle('active', Number(screen.dataset.screen) === step);
  });

  dots.forEach((dot) => {
    const dotIndex = Number(dot.dataset.dot);
    dot.classList.toggle('active', dotIndex === step);
    dot.classList.toggle('done', dotIndex < step);
  });

  if (step === screens.length - 1) {
    launchHearts();
  }
}

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
  goToStep(1);
});

placeSelect.addEventListener('change', () => {
  const isOther = placeSelect.value === '__other__';
  otherPlaceField.hidden = !isOther;
  otherPlaceInput.required = isOther;
});

continueButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    goToStep(currentStep + 1);
  });
});

confirmBtn.addEventListener('click', () => {
  if (!dateInput.value || !timeInput.value) {
    dateInput.reportValidity();
    timeInput.reportValidity();
    return;
  }

  const place = placeSelect.value === '__other__'
    ? (otherPlaceInput.value.trim() || 'our special place')
    : placeSelect.value;

  const dateObj = new Date(`${dateInput.value}T00:00:00`);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const [hours, minutes] = timeInput.value.split(':');
  const timeObj = new Date();
  timeObj.setHours(Number(hours), Number(minutes));
  const formattedTime = timeObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });

  successDetails.textContent = `${place}, ${formattedDate} at ${formattedTime}.`;

  goToStep(3);
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
