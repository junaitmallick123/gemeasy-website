const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (toggle) toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const form = document.querySelector('#contactForm');
if (form) form.addEventListener('submit', e => { e.preventDefault(); form.querySelector('.form-status').textContent = 'Thank you. Your form is ready to be connected to your preferred inbox or CRM.'; form.reset(); });
