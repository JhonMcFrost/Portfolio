// Shared page chrome: loader, mobile toggle, sidebar, footer, project + cert dialogs.
(function () {
  'use strict';

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isProjects = page === 'projects.html';
  const isCertificates = page === 'certificates.html';
  const isHome = !isProjects && !isCertificates;
  const base = isHome ? '' : 'index.html';

  const NAV_ICONS = {
    about: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    experience: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 12h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    skills: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 15,9 22,9 17,14 19,22 12,18 5,22 7,14 2,9 9,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    projects: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h18v18H3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9h6v6H9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    education: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m22 10-10-5L2 10l10 5 10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m6 12 5 2.5 5-2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22.5V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    achievements: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875S11.25 2.34 11.25 3.375s-.84 1.875-1.875 1.875S7.5 4.41 7.5 3.375zM3.75 6.75a.75.75 0 0 0-.75.75v6c0 3.314 2.686 6 6 6s6-2.686 6-6v-6a.75.75 0 0 0-.75-.75h-10.5zM15 12.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/></svg>',
    certificates: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="9" r="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m9 14.5-2 7 5-3 5 3-2-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    contact: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  const CONTACT_ICONS = {
    linkedin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="2" y="9" width="4" height="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    github: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" stroke-width="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2"/></svg>',
    facebook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  const loaderMarkup = '<div id="page-loader" class="page-loader" role="status" aria-live="polite" aria-label="Loading portfolio"><svg class="loader-svg" x="0px" y="0px" viewBox="0 0 50 31.25" height="31.25" width="50" preserveAspectRatio="xMidYMid meet"><path class="loader-track" stroke-width="4" fill="none" pathLength="100" d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"/><path class="loader-car" stroke-width="4" fill="none" pathLength="100" d="M0.625 21.5 h10.25 l3.75 -5.875 l7.375 15 l9.75 -30 l7.375 20.875 v0 h10.25"/></svg></div>';

  const toggleMarkup = '<button class="mobile-toggle fixed left-4 top-4 z-50 flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-md bg-indigo-700 transition-colors hover:bg-indigo-800 lg:hidden" aria-label="Toggle sidebar"><span class="h-0.5 w-5 bg-white transition-all"></span><span class="h-0.5 w-5 bg-white transition-all"></span><span class="h-0.5 w-5 bg-white transition-all"></span></button>';

  const projectModalMarkup = '<dialog id="projectModal" aria-labelledby="projectModalTitle" class="m-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm open:flex open:flex-col"><div class="flex items-center justify-between gap-4 border-b border-slate-100 p-4 sm:p-5"><h5 class="modal-title m-0 text-lg font-semibold text-slate-900" id="projectModalTitle">Project</h5><button type="button" data-dialog-close class="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="p-4 sm:p-5"><div class="mb-4 overflow-hidden rounded-xl bg-slate-100"><img id="projectModalImage" class="project-modal-image hidden block max-h-[300px] w-full object-cover" alt="Project preview" /></div><p id="projectModalDescription" class="mb-3 leading-relaxed text-slate-600"></p><div id="projectModalLanguages" class="project-modal-languages mb-4 flex flex-wrap gap-2"></div><div class="project-modal-actions flex flex-wrap gap-2.5"><a id="projectModalRepo" class="project-modal-btn hidden inline-flex items-center gap-2 rounded-full bg-indigo-700 px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-800" href="#" target="_blank" rel="noopener noreferrer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Repository</span></a><a id="projectModalLive" class="project-modal-btn hidden inline-flex items-center gap-2 rounded-full bg-indigo-700 px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-indigo-800" href="#" target="_blank" rel="noopener noreferrer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M14 3h7v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 3l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 14v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Live Site</span></a></div></div></dialog>';

  const certModalMarkup = '<dialog id="certModal" aria-labelledby="certModalTitle" class="m-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm open:flex open:flex-col"><div class="flex items-center justify-between gap-4 border-b border-slate-100 p-4 sm:p-5"><h5 class="m-0 text-lg font-semibold text-slate-900" id="certModalTitle">Certificate</h5><button type="button" data-dialog-close class="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="p-4 sm:p-5"><div class="mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-4"><img id="certModalImage" class="max-h-[420px] w-auto object-contain" alt="Certificate" /></div><iframe id="certModalPdf" class="hidden mb-4 h-[420px] w-full rounded-xl border-0 bg-slate-100" title="Certificate PDF"></iframe><p id="certModalIssuer" class="mb-2 text-sm font-medium text-indigo-700"></p><p id="certModalDesc" class="mb-3 text-sm leading-relaxed text-slate-600"></p></div></div></dialog>';

  function navLink(href, title, label, icon, active) {
    const activeCls = active ? ' bg-indigo-50 text-indigo-700 lg:border-l-indigo-700' : '';
    return '<li><a class="nav-link flex items-center justify-start gap-4 border-b border-slate-100 px-6 py-5 text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 lg:flex-col lg:justify-center lg:gap-1.5 lg:border-b-0 lg:border-l-4 lg:border-l-transparent lg:px-0 lg:py-4 lg:hover:border-l-indigo-700' + activeCls + '" href="' + href + '" title="' + title + '">' + NAV_ICONS[icon] + '<span class="nav-text block lg:hidden">' + label + '</span></a></li>';
  }

  let nav = '';
  nav += navLink(isHome ? '#about' : base + '#about', 'About', 'About', 'about', false);
  nav += navLink(isHome ? '#experience' : base + '#experience', 'Experiences', 'Experiences', 'experience', false);
  nav += navLink('certificates.html', 'Certificates', 'Certificates', 'certificates', isCertificates);
  nav += navLink(isHome ? '#skills' : base + '#skills', 'Skills', 'Skills', 'skills', false);
  nav += navLink('projects.html', 'Projects', 'Projects', 'projects', isProjects);
  nav += navLink(isHome ? '#education' : base + '#education', 'Education', 'Education', 'education', false);
  nav += navLink(isHome ? '#notable-achievements' : base + '#notable-achievements', 'Achievements', 'Achievements', 'achievements', false);
  nav += navLink(isHome ? '#contact' : base + '#contact', 'Contact', 'Contact', 'contact', false);

  let contacts = '';
  contacts += '<a id="contact-linkedin" class="contact-icon flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:scale-110 hover:bg-indigo-50 hover:text-indigo-700" href="https://" title="LinkedIn" target="_blank">' + CONTACT_ICONS.linkedin + '</a>';
  contacts += '<a id="contact-github" class="contact-icon flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:scale-110 hover:bg-indigo-50 hover:text-indigo-700" href="https://" title="GitHub" target="_blank">' + CONTACT_ICONS.github + '</a>';
  contacts += '<a id="contact-instagram" class="contact-icon flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:scale-110 hover:bg-indigo-50 hover:text-indigo-700" href="https://" title="Instagram" target="_blank">' + CONTACT_ICONS.instagram + '</a>';
  contacts += '<a id="contact-facebook" class="contact-icon flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:scale-110 hover:bg-indigo-50 hover:text-indigo-700" href="https://" title="Facebook" target="_blank">' + CONTACT_ICONS.facebook + '</a>';

  const footerMarkup = '<footer id="footer" class="py-6 text-center text-slate-500"><div class="mb-4 flex items-center justify-center gap-3">' + contacts + '</div><p class="m-0 text-sm">© <span id="footer-year">2025</span> <span id="footer-name">Your Name</span></p></footer>';

  const sidebarMarkup = '<aside class="sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:w-20"><a href="index.html" class="sidebar-brand flex items-center justify-center border-b border-slate-200 py-5" title="Jhon Mcneil Magtibay" aria-label="Home"><span class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-700 font-display text-base font-bold text-white shadow-md shadow-indigo-200">JM</span></a><nav class="sidebar-nav flex-1 overflow-y-auto py-6"><ul class="m-0 list-none p-0">' + nav + '</ul></nav></aside>';

  const backToTopMarkup = '<button type="button" class="back-to-top" aria-label="Back to top"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19V5m-6 6 6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';

  // Inject shared chrome
  const loaderRoot = document.getElementById('loader-root');
  if (loaderRoot) loaderRoot.appendChild(el(loaderMarkup));
  document.body.appendChild(el(toggleMarkup));
  document.body.appendChild(el(backToTopMarkup));
  const sidebarRoot = document.getElementById('sidebar-root');
  if (sidebarRoot) sidebarRoot.appendChild(el(sidebarMarkup));
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) {
    modalRoot.appendChild(el(projectModalMarkup));
    modalRoot.appendChild(el(certModalMarkup));
  }
  const footerRoot = document.getElementById('footer-root');
  if (footerRoot) footerRoot.appendChild(el(footerMarkup));

  // Sidebar mobile behavior
  function setupSidebar() {
    const toggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });

    // Close sidebar after any nav link is clicked on mobile
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 1024) sidebar.classList.remove('open');
      });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) sidebar.classList.remove('open');
    });
  }

  // Smooth scroll to anchor when arriving from another page (e.g. index.html#about)
  function setupHashScroll() {
    if (!window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = document.getElementById(id);
    if (target) {
      window.setTimeout(function () {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }

  // Back to top floating button
  function setupBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    const onScroll = function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function init() {
    setupSidebar();
    setupHashScroll();
    setupBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();