const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
const $ = (sel, ctx=document) => ctx.querySelector(sel);

const menuBtn = $('.menu-btn');
const mobilePanel = $('.mobile-panel');
menuBtn?.addEventListener('click', () => {
  const open = mobilePanel.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(open));
  mobilePanel.setAttribute('aria-hidden', String(!open));
});
$$('.mobile-panel a').forEach(a => a.addEventListener('click', () => {
  mobilePanel.classList.remove('is-open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));

const filters = $$('.filter');
const cards = $$('.package-card');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  const f = btn.dataset.filter;
  cards.forEach(card => card.classList.toggle('is-hidden', f !== 'all' && card.dataset.category !== f));
}));
$$('[data-category-link]').forEach(card => card.addEventListener('click', e => {
  if (e.target.closest('a')) {
    const cat = card.dataset.categoryLink;
    const btn = $(`.filter[data-filter="${cat}"]`);
    if (btn) setTimeout(() => btn.click(), 350);
  }
}));

$$('.heart').forEach(btn => btn.addEventListener('click', () => {
  const saved = btn.textContent.trim() === '♥';
  btn.textContent = saved ? '♡' : '♥';
  btn.style.color = saved ? '' : '#e96f32';
}));

const modal = $('#bookingModal');
const packageSelect = $('#bookingPackage');
const guestInput = $('#bookingGuests');
const pickup = $('#pickupAddOn');
const totalEl = $('#bookingTotal');
const dateInput = $('#bookingDate');

function setMinDate(){
  if(!dateInput) return;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth()+1).padStart(2,'0');
  const d = String(now.getDate()).padStart(2,'0');
  dateInput.min = `${y}-${m}-${d}`;
}
setMinDate();

function money(n){ return `AED ${Number(n).toLocaleString('en-US')}`; }
function updateTotal(){
  if(!packageSelect || !guestInput || !totalEl) return;
  const base = Number(packageSelect.value || 0);
  const qty = Math.max(1, Number(guestInput.value || 1));
  const add = pickup?.checked ? 250 : 0;
  totalEl.textContent = money(base * qty + add);
}
[packageSelect,guestInput,pickup].forEach(el => el?.addEventListener('change', updateTotal));
guestInput?.addEventListener('input', updateTotal);

function openBooking(prefill){
  if(prefill && packageSelect){
    const option = [...packageSelect.options].find(o => o.textContent.toLowerCase().includes(prefill.toLowerCase()));
    if(option) packageSelect.value = option.value;
  }
  updateTotal();
  modal?.classList.add('is-open');
  modal?.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  setTimeout(()=>packageSelect?.focus(),50);
}
function closeBooking(){
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}
$$('[data-open-booking]').forEach(btn => btn.addEventListener('click',()=>openBooking()));
$$('[data-close-booking]').forEach(btn => btn.addEventListener('click',closeBooking));
window.addEventListener('keydown', e => { if(e.key==='Escape') closeBooking(); });

$$('[data-card-book]').forEach(btn => btn.addEventListener('click', () => {
  const card = btn.closest('.package-card');
  const name = card?.dataset.name || '';
  if(card && packageSelect){
    const price = card.dataset.price;
    const option = [...packageSelect.options].find(o => o.value === price && o.textContent.includes(name.split(' ')[0]));
    if(option) packageSelect.value = option.value;
  }
  openBooking();
}));

$('#bookingForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const selected = packageSelect.options[packageSelect.selectedIndex].text.split(' — ')[0];
  const date = dateInput.value || 'flexible date';
  const guests = guestInput.value || '1';
  const transfer = pickup.checked ? 'Yes' : 'No';
  const msg = `Hi, I would like to book ${selected}. Date: ${date}. Guests/units: ${guests}. Private transfer: ${transfer}. Estimated total: ${totalEl.textContent}. Please confirm availability.`;
  window.open(`https://wa.me/971542679820?text=${encodeURIComponent(msg)}`, '_blank');
});

// Lightweight hero search interactions.
$('[data-date-trigger]')?.addEventListener('click', () => openBooking());
$('[data-guests-trigger]')?.addEventListener('click', () => openBooking());
$('[data-select-target="experience"]')?.addEventListener('click', () => openBooking());

// Keep accordion behavior visually clean.
$$('.accordion details').forEach(detail => detail.addEventListener('toggle', () => {
  if(detail.open){
    $$('.accordion details').forEach(other => { if(other !== detail) other.open = false; });
  }
}));
