const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (toggle) toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const form = document.querySelector('#contactForm');
const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
  const validatePhone = showError => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    const complete = phoneInput.value.length === 10;
    phoneInput.setCustomValidity(complete || phoneInput.value.length === 0 ? '' : 'Please enter exactly 10 digits.');
    phoneInput.closest('label').classList.toggle('has-phone-error', showError && !complete && phoneInput.value.length > 0);
    return complete;
  };
  phoneInput.addEventListener('input', () => validatePhone(false));
  phoneInput.addEventListener('blur', () => validatePhone(true));
  phoneInput.addEventListener('invalid', () => {
    validatePhone(true);
    if (!phoneInput.value) phoneInput.setCustomValidity('Please enter your 10-digit phone number.');
  });
}

if (form) form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const originalButton = button.innerHTML;
  const honeypot = form.querySelector('[name="_gotcha"]');
  if (honeypot && honeypot.value) return;
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  button.innerHTML = 'Sending Enquiry <span>…</span>';
  status.className = 'form-status is-sending';
  status.textContent = 'Please wait while we securely send your enquiry.';
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message = data && Array.isArray(data.errors) ? data.errors.map(error => error.message).join(' ') : '';
      throw new Error(message || 'Submission could not be completed.');
    }
    form.reset();
    status.className = 'form-status is-success';
    status.textContent = 'Thank you. Your enquiry has been sent to the GemEasy team successfully.';
  } catch (error) {
    status.className = 'form-status is-error';
    status.textContent = 'We could not send your enquiry right now. Your details are still here—please try again or contact us on WhatsApp.';
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
    button.innerHTML = originalButton;
  }
});

const reviewTrack = document.querySelector('.review-track');
if (reviewTrack) {
  const cards = [...reviewTrack.children];
  const dots = document.querySelector('.review-dots');
  let page = 0;
  const perPage = () => window.innerWidth < 650 ? 1 : window.innerWidth < 950 ? 2 : 3;
  const pages = () => Math.ceil(cards.length / perPage());
  const drawDots = () => { dots.innerHTML = ''; for (let i=0;i<pages();i++){ const d=document.createElement('span'); d.className=i===page?'active':''; dots.appendChild(d); } };
  const move = () => { if(page>=pages()) page=0; reviewTrack.style.transform=`translateX(-${page*100}%)`; drawDots(); };
  document.querySelector('.review-next').addEventListener('click',()=>{page=(page+1)%pages();move();});
  document.querySelector('.review-prev').addEventListener('click',()=>{page=(page-1+pages())%pages();move();});
  window.addEventListener('resize',()=>{page=0;move();});
  drawDots();
  setInterval(()=>{page=(page+1)%pages();move();},6500);
}
