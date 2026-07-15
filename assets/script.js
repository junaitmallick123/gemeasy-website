const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (toggle) toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open); });

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const form = document.querySelector('#contactForm');
if (form) form.addEventListener('submit', e => { e.preventDefault(); form.querySelector('.form-status').textContent = 'Thank you. Your form is ready to be connected to your preferred inbox or CRM.'; form.reset(); });

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
