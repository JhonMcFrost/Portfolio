// Smooth scrolling for sidebar anchor links
function setupNavBehavior(){
  document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Close sidebar on mobile after click
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
      }
    });
  });
  
  // Mobile toggle functionality
  const mobileToggle = document.querySelector('.mobile-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768 && 
          !sidebar.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && sidebar) {
      sidebar.classList.remove('open');
    }
  });
}

// Render helpers
function el(tag, cls, text){ const e = document.createElement(tag); if(cls) e.className = cls; if(text!==undefined) e.textContent = text; return e; }

async function loadData(){
  try{
    const res = await fetch('data.json', {cache: 'no-store'});
    if(!res.ok) throw new Error('Failed to load data.json');
    const data = await res.json();

    // Header
  document.getElementById('name').textContent = data.name || '';
  document.getElementById('title').textContent = data.title || '';
  // avatar removed from markup — if present, set src, otherwise ignore
  const avatar = document.querySelector('#header img.avatar');
  if(avatar && data.avatar) avatar.src = data.avatar;

    //Education
    const educationList = document.getElementById('education-list');
    educationList.innerHTML = '';
    (data.education||[]).forEach(edu => {
      const div = el('div','education-item mb-3 p-3');
      const degree = el('h3','h6 mb-1 fw-semibold', edu.degree || '');
      const institution = el('p','mb-1 text-muted', edu.institution || '');
      const year = el('p','mb-1 text-muted', edu.year || '');
      
      div.appendChild(degree); 
      div.appendChild(institution); 
      div.appendChild(year);
      
      // Add details if they exist
      if (edu.details) {
        const details = el('p','mb-0 education-details', edu.details);
        div.appendChild(details);
      }
      
      educationList.appendChild(div);
    });

    // Chips
    const chips = document.getElementById('chips');
    chips.innerHTML = '';
    (data.chips||[]).forEach(c => { const s = el('span','chip',c); chips.appendChild(s); });

    // About
    const aboutText = data.about || '';
    document.getElementById('about-text').innerHTML = aboutText.replace(/\n/g, '<br>');

    // Skills
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    (data.skills||[]).forEach(s => { const sp = el('span','skill',s); skillsList.appendChild(sp); });

    // Projects
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';
    (data.projects||[]).forEach(proj => {
      const col = el('div','col-12 col-md-6 col-lg-4');
      const card = document.createElement('div'); card.className = 'card project-card h-100';
      const body = document.createElement('div'); body.className = 'card-body';
      const row = document.createElement('div'); row.className = 'd-flex align-items-center mb-2';
      const svg = el('svg','me-2 icon-indigo'); svg.setAttribute('width','20'); svg.setAttribute('height','20'); svg.setAttribute('viewBox','0 0 24 24');
      svg.innerHTML = '<path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
      const h = el('h3','h6 mb-0 fw-semibold', proj.title||'');
      row.appendChild(svg); row.appendChild(h);
      const p = el('p','card-text text-muted', proj.description||'');
      body.appendChild(row); body.appendChild(p); 
      
      // Add programming language chips if they exist
      if (proj.languages && proj.languages.length > 0) {
        const langContainer = el('div', 'mt-2 d-flex flex-wrap gap-1');
        proj.languages.forEach(lang => {
          const langChip = el('span', 'project-lang-chip', lang);
          langContainer.appendChild(langChip);
        });
        body.appendChild(langContainer);
      }
      
      card.appendChild(body); col.appendChild(card); projectsGrid.appendChild(col);
    });

    // Contact
    const contactList = document.getElementById('contact-list'); contactList.innerHTML = '';
    const c = data.contact || {};
    if(c.email) contactList.appendChild(makeContactRow('M3 8l9 6 9-6', 'Email', c.email));
    if(c.linkedin) contactList.appendChild(makeContactRow('M21 8a7 7 0 1 0-14 0v7', 'LinkedIn', c.linkedin));
    if(c.github) contactList.appendChild(makeContactRow('M12 2C6.48 2 2 6.48 2 12a10 10 0 0 0 7 9.6c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.2 3 .9.1-.7.4-1.2.7-1.5-2.3-.3-4.7-1.1-4.7-5 0-1.1.4-2 .9-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.2 2.6 1a9 9 0 0 1 4.7 0c1.8-1.2 2.6-1 2.6-1 .5 1.4.2 2.4.1 2.7.5.7.9 1.6.9 2.7 0 3.9-2.4 4.7-4.7 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z', 'GitHub', c.github));
    if(c.facebook) contactList.appendChild(makeContactRow('M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z', 'Facebook', c.facebook));

    // Footer
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    document.getElementById('footer-name').textContent = data.name || '';

  }catch(err){
    console.error(err);
  }
}

function makeContactRow(path, label, value){
  const div = el('div','contact-row mb-2');
  const svg = el('svg','me-2 icon-indigo'); svg.setAttribute('width','18'); svg.setAttribute('height','18'); svg.setAttribute('viewBox','0 0 24 24'); svg.innerHTML = `<path d="${path}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const strong = el('strong','', label+': ');
  const span = el('span','ms-2', value);
  div.appendChild(svg); div.appendChild(strong); div.appendChild(span); return div;
}

document.addEventListener('DOMContentLoaded', () => { setupNavBehavior(); loadData(); });
