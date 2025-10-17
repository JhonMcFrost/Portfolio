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

// Contact Form Handler
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const successAlert = document.getElementById('contact-success');
  const errorAlert = document.getElementById('contact-error');
  const btnText = form.querySelector('.btn-text');
  const btnLoading = form.querySelector('.btn-loading');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading state
    btnText.classList.add('d-none');
    btnLoading.classList.remove('d-none');
    successAlert.classList.add('d-none');
    errorAlert.classList.add('d-none');
    
    // Get form data
    const formData = new FormData(form);
    
    try {
      // Using FormSubmit.co service - it will send an email to your address
      const response = await fetch(`https://formsubmit.co/${window.portfolioEmail}`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        successAlert.classList.remove('d-none');
        form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      errorAlert.classList.remove('d-none');
    }
    
    // Reset button state
    btnText.classList.remove('d-none');
    btnLoading.classList.add('d-none');
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
      
      // Make the entire card clickable if repository exists
      let card;
      if (proj.repository) {
        card = document.createElement('a');
        card.href = proj.repository;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = 'card project-card h-100 text-decoration-none';
        card.style.cursor = 'pointer';
      } else {
        card = document.createElement('div');
        card.className = 'card project-card h-100';
      }
      
      const body = document.createElement('div'); 
      body.className = 'card-body';
      const row = document.createElement('div'); 
      row.className = 'd-flex align-items-center mb-2';
      const svg = el('svg','me-2 icon-indigo'); 
      svg.setAttribute('width','20'); 
      svg.setAttribute('height','20'); 
      svg.setAttribute('viewBox','0 0 24 24');
      svg.innerHTML = '<path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
      const h = el('h3','h6 mb-0 fw-semibold', proj.title||'');
      row.appendChild(svg); 
      row.appendChild(h);
      const p = el('p','card-text text-muted', proj.description||'');
      body.appendChild(row); 
      body.appendChild(p); 
      
      // Add programming language chips if they exist
      if (proj.languages && proj.languages.length > 0) {
        const langContainer = el('div', 'mt-2 d-flex flex-wrap gap-1');
        proj.languages.forEach(lang => {
          const langChip = el('span', 'project-lang-chip', lang);
          langContainer.appendChild(langChip);
        });
        body.appendChild(langContainer);
      }
      
      card.appendChild(body); 
      col.appendChild(card); 
      projectsGrid.appendChild(col);
    });

    // Notable Achievements
    const notableAchievementsList = document.getElementById('notable-achievements-list');
    notableAchievementsList.innerHTML = '';
    (data['notable achievements']||[]).forEach(achievement => {
      const div = el('div','notable-achievement-item mb-3 p-3');
      const title = el('h3','h6 mb-1 fw-semibold', achievement.title||'');
      const description = el('p','mb-1 text-muted', achievement.description||'');
      const year = el('p','mb-0 achievement-year', achievement.year||'');
      div.appendChild(title);
      div.appendChild(description);
      div.appendChild(year);
      notableAchievementsList.appendChild(div);
    });

    // Sidebar Contact Icons
    const c = data.contact || {};
    if(c.linkedin) {
      const linkedinLink = document.getElementById('contact-linkedin');
      linkedinLink.href = `https://${c.linkedin}`;
    }
    if(c.github) {
      const githubLink = document.getElementById('contact-github');
      githubLink.href = `https://${c.github}`;
    }
    if(c.instagram) {
      const instagramLink = document.getElementById('contact-instagram');
      instagramLink.href = `https://${c.instagram}`;
    }
    if(c.facebook) {
      const facebookLink = document.getElementById('contact-facebook');
      facebookLink.href = `https://${c.facebook}`;
    }
    
    // Store email for contact form
    window.portfolioEmail = c.email;

    // Footer
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    document.getElementById('footer-name').textContent = data.name || '';

  }catch(err){
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => { setupNavBehavior(); setupContactForm(); loadData(); });
