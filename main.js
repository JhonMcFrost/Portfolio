// Google Drive data source. Point this at your Apps Script /exec web app URL.
// Leave as-is to fall back to the local data.json.
const DATA_URL = 'https://script.google.com/macros/s/AKfycbxlYBuqN9LP2Bt0FOjNQ09lCalpT1Q2qZAfLs8NbrVNta9KPmZCjFeR25thQ2sd84zv7g/exec';

// Normalize Google Drive share/view links into embeddable/downloadable URLs.
const toDriveUrl = (url, mode = 'view') => {
  const m = /[?&]id=([\w-]+)/.exec(String(url || '')) || /\/d\/([\w-]+)/.exec(String(url || ''));
  return m ? `https://drive.google.com/uc?export=${mode}&id=${m[1]}` : (url || '');
};

// Build a Google Drive embeddable preview URL (renders PDFs/images inline in an iframe).
const toDrivePreviewUrl = (url) => {
  const m = /[?&]id=([\w-]+)/.exec(String(url || '')) || /\/d\/([\w-]+)/.exec(String(url || ''));
  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : (url || '');
};

// Smooth scrolling for sidebar anchor links (same-page)
function setupNavBehavior(){
  document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Contact Form Handler
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const successAlert = document.getElementById('contact-success');
  const errorAlert = document.getElementById('contact-error');
  const btnText = form.querySelector('.btn-text');
  const btnLoading = form.querySelector('.btn-loading');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading state
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    successAlert.classList.add('hidden');
    errorAlert.classList.add('hidden');
    
    // Get form data
    const formData = new FormData(form);
    formData.append('_captcha', 'false');
    
    try {
      // Using FormSubmit.co AJAX service - it will send an email to your address
      const response = await fetch(`https://formsubmit.co/ajax/${window.portfolioEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      
      const result = await response.json();
      if (result.success === 'true') {
        successAlert.classList.remove('hidden');
        form.reset();
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      errorAlert.classList.remove('hidden');
    }
    
    // Reset button state
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
  });
}

// Render helpers
function el(tag, cls, text){ const e = document.createElement(tag); if(cls) e.className = cls; if(text!==undefined) e.textContent = text; return e; }
function ensureHttp(url){
  if(!url) return '';
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const LOADER_MIN_MS = 250;
const loaderStartTs = Date.now();

function hidePageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader || loader.classList.contains('is-hidden')) return;

  const elapsed = Date.now() - loaderStartTs;
  const wait = Math.max(0, LOADER_MIN_MS - elapsed);

  window.setTimeout(() => {
    loader.classList.add('is-hidden');
  }, wait);
}

// Get language icon (accurate logos)
function getLangIcon(lang) {
  const icons = {
    'JavaScript': '<svg width="14" height="14" viewBox="0 0 32 32"><rect width="32" height="32" fill="#f7df1e"/><path d="M16.4 22.4c.7 1.1 1.6 1.9 3.1 1.9 1.3 0 2.1-.7 2.1-1.6 0-1.1-.8-1.5-2.2-2.1l-.8-.3c-2.3-1-3.8-2.2-3.8-4.7 0-2.4 1.8-4.2 4.7-4.2 2 0 3.5.7 4.5 2.5l-2.5 1.6c-.5-.9-1.1-1.3-2-1.3-.9 0-1.5.6-1.5 1.3 0 .9.6 1.3 1.9 1.8l.8.3c2.7 1.2 4.2 2.3 4.2 5 0 2.8-2.2 4.4-5.2 4.4-2.9 0-4.8-1.4-5.7-3.2l2.4-1.4zm-7.7.2c.5.9 1 1.6 2.1 1.6 1.1 0 1.7-.4 1.7-2.1V12h3v10.2c0 3.4-2 5-4.9 5-2.6 0-4.1-1.4-4.9-3l2.5-1.6z" fill="#000"/></svg>',
    'TypeScript': '<svg width="14" height="14" viewBox="0 0 32 32"><rect width="32" height="32" rx="1.5" fill="#3178c6"/><path d="M18.245 21.261V23H11v-1.635h2.612v-6.552h-2.58v-1.647h7.214v1.647h-2.58v6.552h2.58zm5.228-8.413h-3.33v8.413h-1.958V12.848h-3.331V11h8.62v1.848z" fill="#fff"/></svg>',
    'Python': '<svg width="14" height="14" viewBox="0 0 32 32"><path d="M15.885 2.1c-7.1 0-6.651 3.07-6.651 3.07v3.19h6.752v1H6.545S2 8.8 2 16.005s4.013 6.912 4.013 6.912H8.33v-3.361s-.13-4.013 3.9-4.013h6.762s3.772.06 3.772-3.652V5.8s.572-3.712-6.842-3.712zm-3.732 2.144a1.214 1.214 0 1 1-1.183 1.244v-.02a1.214 1.214 0 0 1 1.214-1.214z" fill="#3776ab" transform="matrix(.84 0 0 .84 .023 .002)"/><path d="M16.085 29.91c7.1 0 6.651-3.08 6.651-3.08v-3.18h-6.751v-1h9.47S30 23.2 30 15.995s-4.013-6.912-4.013-6.912H23.67v3.361s.13 4.013-3.9 4.013h-6.765s-3.772-.06-3.772 3.652v6.171s-.572 3.712 6.842 3.712zm3.732-2.144a1.214 1.214 0 1 1 1.183-1.244v.03a1.214 1.214 0 0 1-1.214 1.214z" fill="#ffd43b" transform="matrix(.84 0 0 .84 .023 .002)"/></svg>',
    'Java': '<svg width="14" height="14" viewBox="0 0 32 32"><path d="M11.622 24.74s-1.23.748.855.962c2.51.32 3.847.267 6.625-.267a10.02 10.02 0 0 0 1.763.855c-6.25 2.672-14.16-.16-9.244-1.55zm-.8-3.473s-1.336 1.015.748 1.23c2.725.267 4.862.32 8.55-.427a3.26 3.26 0 0 0 1.282.801c-7.534 2.244-15.976.214-10.58-1.604z" fill="#5382a1"/><path d="M18.29 17.287c1.55 1.763-.427 3.366-.427 3.366s3.847-2.03 2.137-4.542c-1.604-2.35-2.778-3.473 3.794-7.427 0 0-10.366 2.617-5.504 8.603z" fill="#e76f00"/><path d="M25.94 26.18s.908.748-1.015 1.336c-3.58 1.07-15.014 1.39-18.22 0-1.122-.48 1.015-1.175 1.7-1.282.695-.16 1.07-.16 1.07-.16-1.23-.855-8.175 1.763-3.526 2.51 12.77 2.084 23.296-.908 19.983-2.404zM12.2 18.068s-5.77 1.39-2.03 1.87c1.55.214 4.7.16 7.534-.053 2.296-.214 4.6-.64 4.6-.64a8.56 8.56 0 0 0-1.39.748c-5.877 1.55-17.22.855-13.937-.748 2.778-1.336 5.076-1.175 5.076-1.175zm10.42 5.824c5.984-3.1 3.206-6.09 1.282-5.717-.48.107-.695.214-.695.214s.16-.32.534-.427c3.794-1.336 6.786 4.007-1.23 6.09 0 0 .053-.053.107-.16z" fill="#5382a1"/><path d="M18.93 1.55S21.82 4.43 16.09 8.97c-4.6 3.58-1.07 5.61-.053 7.96-2.617-2.403-4.542-4.542-3.26-6.518 1.87-2.996 7.053-4.435 6.16-9.9z" fill="#e76f00"/><path d="M12.84 30.81c5.717.374 14.5-.214 14.714-2.937 0 0-.427 1.07-4.7 1.87-4.862.908-10.848.8-14.4.214 0 0 .748.64 4.382.855z" fill="#5382a1"/></svg>',
    'HTML': '<svg width="14" height="14" viewBox="0 0 32 32"><path d="M6 28L4 3h24l-2 25-10 3-10-3z" fill="#e44f26"/><path d="M26 5H16v24.5l8-2.5 2-22z" fill="#f1662a"/><path d="M9.5 17.5L8.5 8H24l-.5 3h-12l.5 3.5h11L22 24l-6 2-6-2-.5-5h3l.5 2.5 3 1 3-1 .5-4h-10z" fill="#ebebeb"/><path d="M16.5 23.5l3-1 .5-4H16v-3.5h7.5L23 24l-6.5 2v-2.5zM16 11.5h8l.5-3H16v3z" fill="#fff"/></svg>',
    'CSS': '<svg width="14" height="14" viewBox="0 0 32 32"><path d="M6 28L4 3h24l-2 25-10 3-10-3z" fill="#1572b6"/><path d="M26 5H16v24.5l8-2.5 2-22z" fill="#33a9dc"/><path d="M19.5 17.5h-7L12 14h8l.5-3H8.5l1 10H20l-.5 4-3.5 1-3.5-1-.25-2.5H9.5L10 27l6.5 2L23 27l1-10z" fill="#fff"/></svg>',
    'Node.js': '<svg width="14" height="14" viewBox="0 0 32 32"><path d="M16 2c-.3 0-.6.1-.8.2L3.7 8.9c-.5.3-.8.8-.8 1.4v11.5c0 .6.3 1.1.8 1.4l11.5 6.7c.2.1.5.2.8.2s.6-.1.8-.2l11.5-6.7c.5-.3.8-.8.8-1.4V10.3c0-.6-.3-1.1-.8-1.4L16.8 2.2c-.2-.1-.5-.2-.8-.2z" fill="#83cd29"/><path d="M16 2v28c.3 0 .6-.1.8-.2l11.5-6.7c.5-.3.8-.8.8-1.4V10.3c0-.6-.3-1.1-.8-1.4L16.8 2.2c-.2-.1-.5-.2-.8-.2z" fill="#5fa020"/></svg>',
    'Angular': '<svg width="14" height="14" viewBox="0 0 32 32"><path d="M16 2L3 7l2 17.5L16 30l11-5.5L29 7z" fill="#dd0031"/><path d="M16 2v28l11-5.5L29 7z" fill="#c3002f"/><path d="M16 5.5L8.5 23h3l1.5-3.5h6L20.5 23h3L16 5.5zm0 5.9l2.5 5.1h-5l2.5-5.1z" fill="#fff"/></svg>',
    'React': '<svg width="14" height="14" viewBox="0 0 32 32"><circle cx="16" cy="16" r="2.6" fill="#61dafb"/><ellipse cx="16" cy="16" rx="11" ry="4.2" stroke="#61dafb" stroke-width="1" fill="none"/><ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(60 16 16)" stroke="#61dafb" stroke-width="1" fill="none"/><ellipse cx="16" cy="16" rx="11" ry="4.2" transform="rotate(120 16 16)" stroke="#61dafb" stroke-width="1" fill="none"/></svg>',
    'Express': '<svg width="14" height="14" viewBox="0 0 32 32"><path d="M32 24.795c-1.164.296-1.884.013-2.53-.957l-4.594-6.356-.664-.88-5.365 7.257c-.613.873-1.256 1.253-2.4.944l6.87-9.222-6.396-8.33c1.1-.214 1.86-.105 2.535.88l4.765 6.435 4.8-6.4c.615-.873 1.276-1.205 2.38-.883l-2.48 3.288-3.36 4.375c-.4.5-.345.842.023 1.325L32 24.795zM.008 15.427l.562-2.764C2.1 7.193 8.37 4.92 12.694 8.3c2.527 1.988 3.155 4.8 3.03 7.95H1.48c-.214 5.67 3.867 9.092 9.07 7.346 1.825-.613 2.9-2.042 3.438-3.83.273-.896.725-1.036 1.567-.78-.43 2.236-1.4 4.104-3.45 5.273-3.063 1.75-7.435 1.184-9.735-1.248C1 21.6.434 19.812.18 17.9c-.04-.316-.12-.617-.18-.92q.008-.776.008-1.552zm1.498-.38h12.872c-.084-4.1-2.637-7.012-6.126-7.037-3.83-.03-6.58 2.813-6.746 7.037z"/></svg>',
    'MySQL': '<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.906 13.926c.052-1.044.128-2.087.172-3.131.02-.48.026-.966.013-1.448-.006-.358-.02-.716-.02-1.074 0-.6-.09-1.19-.147-1.786-.039-.387-.07-.776-.121-1.162-.055-.42-.132-.837-.196-1.255-.052-.339-.084-.682-.126-1.022-.044-.385-.104-.767-.156-1.15a10.9 10.9 0 0 0-.313-1.447c-.127-.427-.27-.85-.421-1.27a18.5 18.5 0 0 0-.62-1.378 8.2 8.2 0 0 0-.872-1.384 4.14 4.14 0 0 0-.54-.571c-.065-.052-.109-.03-.13.038-.093.283-.178.57-.25.86-.085.343-.165.687-.243 1.032-.085.38-.17.76-.245 1.142-.07.362-.127.728-.191 1.092-.05.292-.1.584-.139.876-.066.502-.138 1.002-.185 1.505-.043.458-.094.915-.125 1.373-.03.448-.072.895-.088 1.343-.012.342-.04.683-.04 1.025 0 .22.023.438.05.655.01.078.058.107.133.09.282-.06.567-.107.852-.16.993-.185 1.99-.357 2.988-.527l2.375-.423c.34-.06.681-.119 1.021-.182zM12.93 12.276c-.025.018-.04.036-.068.066-.082.084-.076.181.006.276.04.045.08.09.132.146.067-.07.12-.127.153-.164.063-.07.06-.127-.028-.188-.048-.032-.11-.077-.195-.136zM5.9 8.168a10.6 10.6 0 0 1-.129-.527c-.034-.16-.064-.32-.091-.481-.026-.15-.058-.301-.08-.451-.017-.128-.048-.255-.063-.383-.04-.332-.078-.666-.106-.999a17.9 17.9 0 0 1-.017-.68c-.002-.177-.006-.354.011-.531.006-.065-.01-.13-.11-.13-.022 0-.045.007-.098.022-.159.107-.297.245-.415.401a7.72 7.72 0 0 0-.86 1.237 17.4 17.4 0 0 0-1.026 2.13 16.8 16.8 0 0 0-.55 1.63c-.199.75-.36 1.513-.459 2.283-.01.08.005.117.093.083a12.9 12.9 0 0 1 .68-.24 7.06 7.06 0 0 1 1.393-.334c.332-.049.667-.086 1.001-.122.341-.037.683-.066 1.024-.107.14-.017.18-.055.172-.195a8.9 8.9 0 0 0-.17-1.23zm.218-1.838c.045-.23.102-.46.152-.69.05-.228.1-.456.16-.683.033-.12.097-.168.209-.139.08.021.167.036.255.077.088.043.171.017.242-.033.138-.1.132-.22.012-.326a8.8 8.8 0 0 0-.313-.262c-.064-.05-.126-.1-.19-.149-.06-.044-.114-.038-.162.018-.086.099-.126.23-.176.346-.046.115-.097.228-.142.344l-.027.067-.062-.047c-.116-.09-.223-.19-.327-.291-.065-.063-.133-.125-.191-.196a.31.31 0 0 0-.203-.113c-.067-.003-.09.03-.092.08a8.4 8.4 0 0 1-.187 1.286c-.03.16-.067.32-.096.48-.047.262-.077.49.149.66.073.05.16.084.249.127.073.035.127.032.185-.023.078-.089.154-.18.224-.272.07-.093.14-.187.212-.28zm7.9-4.325c.03-.096.051-.172.08-.24.117-.282.19-.582.27-.878a4.7 4.7 0 0 1 .166-.475c.033-.08.07-.16.098-.242.03-.086.052-.175.057-.264.005-.115-.025-.177-.14-.196-.112-.018-.217-.067-.296-.153a.75.75 0 0 1-.176-.311.85.85 0 0 0-.298-.397.35.35 0 0 0-.401-.005.9.9 0 0 0-.241.301 2.8 2.8 0 0 0-.17.402 4.4 4.4 0 0 0-.132.485c-.058.288-.105.58-.152.87-.04.247-.08.495-.103.744-.01.111.037.17.146.182.09.01.18.02.27.033.83.114 1.67.19 2.503.317.18.026.363.047.545.072.04.004.057-.01.065-.05.005-.096.01-.192.002-.288-.006-.09-.034-.11-.124-.137-.424-.12-.85-.23-1.275-.338l-.016-.004h.047c.016-.023.033-.045.048-.068z"/></svg>',
    'PostgreSQL': '<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.036 9.386c-.086-.029-.19-.06-.318-.09-.037 0-.08-.006-.137-.009-.115-.006-.247-.019-.386-.032-.128-.012-.27-.024-.416-.032-.327-.018-.683-.017-1.02.027a5.9 5.9 0 0 0-.79.162c-.433-.172-1.062-.32-1.965-.281-.818.038-1.518.24-2.063.537-.182-.11-.385-.195-.598-.26-.245-.075-.502-.096-.753-.108-.65-.03-1.322.13-1.895.439a3.7 3.7 0 0 0-1.061.785c-.465.492-.82 1.106-1.043 1.68-.098-.02-.197-.038-.3-.048-.629-.06-1.315.068-1.92.33-1.15.5-2.06 1.32-2.543 2.484-.376.907-.435 2.169-.077 3.326.352 1.134.984 1.948 1.66 2.526.355.304.72.55 1.079.757.338.195.676.35 1.009.466l.237.09.191.071.26.093a13.3 13.3 0 0 0 1.112.337c.575.15 1.177.258 1.78.322l.407.037.4.022.455.018.505.008.528 0 .425 0a13.4 13.4 0 0 0 1.208-.06c.18-.02.36-.047.54-.074.42-.065.84-.15 1.244-.256.203-.053.4-.104.596-.165l.263-.086.28-.101c.354-.13.704-.278 1.042-.447l.15-.087.195-.122c.019-.012.04-.028.042-.048l.048-.03.335-.227c.42-.29.786-.59 1.055-.845.27-.253.5-.532.627-.81.053-.118.084-.24.07-.362l.02-.02a3.05 3.05 0 0 0 .448-1.056c.032-.142.05-.28.047-.418.003-.196.006-.4 0-.596-.016-.53-.088-1.045-.287-1.51a3.8 3.8 0 0 0-.42-.693 4.14 4.14 0 0 0-.566-.6 5.17 5.17 0 0 0-.636-.456c-.203-.117-.403-.21-.594-.29.038-.187.069-.366.095-.528.104-.625.163-1.226.145-1.76-.015-.615.061-1.155-.003-1.574-.02-.136-.045-.258-.077-.372-.032-.12-.07-.229-.117-.33a4.13 4.13 0 0 0-.95-1.303.98.98 0 0 0-.028-.026l-.006.003c-.12-.113-.25-.234-.393-.343-.083-.063-.17-.123-.262-.178a2.4 2.4 0 0 0-.123-.066l-.038-.019-.016.011c-.206.13-.451.268-.708.431-.022.014-.033.027-.053.042l-.011.02c-.054.02-.108.043-.16.07a5.12 5.12 0 0 0-1.116-.274l-.035-.005zm2.06 1.286l.003 1.452c.015.46.012.924.036 1.39.019.39.077.777.14 1.162a11.4 11.4 0 0 1-.096.406c.542.183 1.05.292 1.05.292l.079.564a16.8 16.8 0 0 0-1.788-.587l.076-.39c.01-.05.017-.1.026-.149-.05.015-.1.03-.15.046a14.5 14.5 0 0 1-.69.184 1 1 0 0 1-.055.107c.015.013.024.028.039.041.26.242.38.57.42.893.002.024.005.049.006.074.012.126.007.25.01.363l-.006.046c-.046.959.114 1.784.047 2.54a5.95 5.95 0 0 1-.99 2.71c-.018.029-.032.046-.046.062.004.02.01.04.014.06.41.4.626.884.62 1.54-.003.32-.047.66-.12 1.02-.013.064-.027.13-.042.195-.135.59-.36 1.167-.54 1.717a4.23 4.23 0 0 0-.211.824c-.033.269-.03.552.015.824.008.045.011.09.014.134l.005.063.004.116v.09l-.006.07a5.7 5.7 0 0 1-.06.316c-.07.33-.217.65-.342.952l-.11.255c-.137.32-.262.65-.351.994a2.7 2.7 0 0 0-.09.405c-.006.052-.012.105-.012.157v.17l.016.15c.012.104.035.207.05.315.044.32.13.66.164 1.005.026.27.004.543-.03.81-.04.33-.139.638-.284.944-.068.145-.15.285-.235.42a4.9 4.9 0 0 1-.477.62l-.125.14-.098.098c-.41.415-.98.74-1.56.887a3.1 3.1 0 0 1-.775.108l-.48-.05c-.23-.024-.465-.05-.7-.025-.067.007-.132.02-.2.03l-.102.019-.12.02-.225.046c-.09.019-.18.04-.27.056-.153.028-.306.06-.46.078-.252.03-.513.05-.766.049h-.784l-.398-.014-.37-.05c-.245-.034-.493-.06-.738-.11-.253-.052-.51-.11-.76-.19-.235-.071-.467-.166-.687-.276l-.224-.112-.164-.09a4.8 4.8 0 0 1-.326-.22c-.23-.173-.42-.362-.578-.556-.02-.024-.044-.046-.065-.068l-.087-.1-.08-.1a3.4 3.4 0 0 1-.15-.223l-.066-.11-.058-.1-.11-.22a9.5 9.5 0 0 1-.332-.856c-.09-.281-.164-.571-.205-.86-.02-.15-.036-.3-.04-.45v-.51l.02-.51c.03-.35.07-.7.14-1.04.07-.338.16-.672.28-1l.066-.137.034-.068.025-.058a2.07 2.07 0 0 0-.023.003l.087.146c.014.021.05.09.073.122.04.062.078.124.12.186l.175.24.09.11.032.04.016.02a.78.78 0 0 1-.006-.14c.015-.43.02-.87.1-1.29l.06-.26-.06.04c.12-.41.21-.83.27-1.26l.026-.14.012-.06-.024.028c-.015.017-.03.035-.046.05.012-.08.023-.16.033-.24l.014-.12-.006.03c-.055.53-.13 1.06-.23 1.58l-.036.14.06-.12c.08-.16.15-.33.212-.5l.045-.13-.06.07c.03-.1.06-.2.08-.3l.02-.07v.013c.012-.03.022-.06.034-.09l.06-.16.07-.16c.012-.028.024-.057.037-.086l.045-.098.006-.014-.038.013-.006.003c.02-.048.044-.096.067-.143l.1-.188.105-.178.112-.167.121-.16.126-.15.135-.14.146-.127.094-.08.047-.038.107-.082.065-.05c.103-.07.21-.14.318-.2.018-.01.036-.02.055-.029z" fill="#336791"/><path d="M8.414 21.288l.135-.004c.015 0 .028.004.04.01.036.015.043.06.015.088-.03.034-.078.027-.11.001-.023-.02-.03-.055-.025-.085l.002-.005a.23.23 0 0 0-.057-.005zm.223-.055l.208-.024c.011.002.021.006.03.014.026.026.004.064-.027.065-.025.001-.047-.011-.062-.03-.014-.017-.018-.038-.028-.054l-.02-.007c-.035-.003-.07 0-.101-.006-.03-.005-.03-.035-.012-.05.018-.012.035-.02.05-.032.015-.01.03-.018.046-.027l-.016.02c-.02.02-.041.035-.056.057-.004.007-.01.012-.017.015zm.313.148l-.155-.033c.002-.012.003-.024.006-.036l.022-.07.04-.1c.007-.02.016-.037.027-.052.014-.02.032-.036.05-.05.012-.01.026-.017.04-.026l.025-.017.005.028c.002.012.004.026.005.039.012.1.012.2 0 .3l-.013.099v.028zm.06-.07v.117l-.033-.047.014-.031.02-.041z" fill="#336791"/><path d="M15.06 9.348c.082.005.162.016.24.033.077.017.154.024.23.04l.015.012c.11.05.215.107.315.17.012.008.024.016.035.026a3.8 3.8 0 0 1 .3.272c.118.12.228.248.33.382.022.028.042.057.062.085l.012.017.006.01c.08.127.147.26.204.4.05.118.096.24.135.362l.015.05.008.027c0 .004.003.008.004.012.023.09.04.18.052.272l.005.037c.012.092.019.185.022.278l.002.052v.058l-.006.19c-.016.25-.056.5-.12.74l-.02.075-.012.04a8.9 8.9 0 0 1-.158.518l-.017.046-.004.012-.175.412c-.063.137-.13.273-.2.406l-.012.022-.013.022c-.07.13-.14.26-.22.383a9.4 9.4 0 0 1-.254.375l-.026.034-.022.028c-.09.116-.184.23-.281.34l-.024.027-.025.026" fill="none" stroke="#fff" stroke-width=".7" stroke-linejoin="round" stroke-linecap="round"/><path d="M21.233 9.766c-.535-.137-1.09-.19-1.627-.013l.005.012c.203.01.4.04.593.088a3.9 3.9 0 0 1 .05.013l.022.006c.014.005.028.01.042.015.152.055.3.12.44.195" fill="none" stroke="#fff" stroke-width=".9" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    'Bootstrap': '<svg width="14" height="14" viewBox="0 0 32 32"><path d="M6 3h20a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z" fill="#563d7c"/><path d="M16.5 17.5h-3.5v-5h3.786a2.5 2.5 0 0 1 2.5 2.5v.286a2.214 2.214 0 0 1-2.786 2.214zm0 5.5h-3.5v-4h3.786a2 2 0 0 1 2 2v.286a1.714 1.714 0 0 1-2.286 1.714zM11 10v12h5.5a4.5 4.5 0 0 0 4.5-4.5v-.286A3.714 3.714 0 0 0 17.786 14 3.214 3.214 0 0 0 19 10.786V10.5A3.5 3.5 0 0 0 15.5 7H11v3z" fill="#fff"/></svg>',
    'Flutter': '<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.314 0 2.3 12l3.7 3.7L21.684.013 14.314 0zm.029 8.41-6.038 6.037L14.3 20.48l7.71-.006-7.666-12.064z" fill="#02569b"/></svg>',
    'JSON Server': '<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 5c0-.41.34-.75.75-.75H10a2 2 0 0 1 2 2V10a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3.75a2 2 0 0 1-2 2h-.25a.75.75 0 0 1-.75-.75v-.34A4 4 0 0 1 12 14a4 4 0 0 1-2-3.66V5.5A2.5 2.5 0 0 0 7.5 3H7a2 2 0 0 0-2 2 .75.75 0 0 1-1.5 0 3.5 3.5 0 0 1 3.5-3.5h.5A2.75 2.75 0 0 1 10.5 4v1.5A1.5 1.5 0 0 1 9 7Z" fill="#4338ca"/><path d="M15 9a2.75 2.75 0 0 1 2.75 2.75v1.5A1.5 1.5 0 0 1 16.25 15h-.25a2 2 0 0 1-2-2 2 2 0 0 0-2-2 2 2 0 0 0 2-2v-.25a.75.75 0 0 1 .75-.75H15Zm.75 6.5a2 2 0 0 1-2 2H13.5a.75.75 0 0 1 0-1.5h.25a.5.5 0 0 0 .5-.5v-.25A2.75 2.75 0 0 1 17 12.75h.5A3.5 3.5 0 0 1 21 16v1a2 2 0 0 1-2 2h-.5A2.75 2.75 0 0 1 15.75 16.25V15.5Z" fill="#4338ca"/></svg>',
    'OAuth2': '<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Zm3 3a1.5 1.5 0 0 1 1 2.62V17a1 1 0 1 1-2 0v-1.38A1.5 1.5 0 0 1 12 13Z" fill="#eb5424"/></svg>',
    'Nodejs': '<svg width="14" height="14" viewBox="0 0 32 32"><path d="M16 2c-.3 0-.6.1-.8.2L3.7 8.9c-.5.3-.8.8-.8 1.4v11.5c0 .6.3 1.1.8 1.4l11.5 6.7c.2.1.5.2.8.2s.6-.1.8-.2l11.5-6.7c.5-.3.8-.8.8-1.4V10.3c0-.6-.3-1.1-.8-1.4L16.8 2.2c-.2-.1-.5-.2-.8-.2z" fill="#83cd29"/><path d="M16 2v28c.3 0 .6-.1.8-.2l11.5-6.7c.5-.3.8-.8.8-1.4V10.3c0-.6-.3-1.1-.8-1.4L16.8 2.2c-.2-.1-.5-.2-.8-.2z" fill="#5fa020"/></svg>',
    'Spring Boot': '<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.205 16.392c-2.23 4.115-6.997 6.603-10.022 6.603-3.027 0-5.977-2.216-5.977-5.4 0-6.424 8.96-10.913 8.96-10.913s-3.903.835-6.04 3.993C4.004 14.51 5.34 18.3 8.28 20.41c3.476 2.075 7.32.39 8.158-1.914.84-2.304.263-4.362.263-4.362s1.58 1.107 1.503 2.258zm-2.233-8.888c-.648.007-1.233-.1-1.734-.215-1.24 2.502-3.09 4.973-4.78 6.66 1.082-3.664.02-7.698-.9-9.31C9.19 1.724 7.23.65 4.91 1.4c.24 3.413 0 6.18.278 8.282h.002c-.02-.417-.466-1.726-.585-2.11-.426-1.352-.583-2.857-.34-4.69-.787.483-1.316 1.387-1.657 2.406-.395 1.185-.576 2.77.024 6.228.133.766.263 1.6.277 2.645.025 1.898-.534 4.037-1.517 5.874.385.4.787.647 1.262.93.8-1.866 1.644-4.357 1.905-6.48 1.524 1.705 3.35 3.245 5.122 4.22.942.518 1.882.858 2.7.918.31-2.64 1.567-5.73 2.04-8.26.84.852 1.436 1.775 1.79 2.77.636-2.615.208-6.593-.423-8.783z" fill="#6db33f"/></svg>',
    'Responsive UI': '<svg width="14" height="14" viewBox="0 0 32 32"><rect x="2" y="4" width="18" height="14" rx="1" stroke="#4ecdc4" stroke-width="2" fill="none"/><rect x="12" y="20" width="14" height="10" rx="1" stroke="#4ecdc4" stroke-width="2" fill="none"/><circle cx="19" cy="28" r="1" fill="#4ecdc4"/></svg>',
    'React Native': '<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.001 11.57a1.34 1.34 0 1 1 0 2.681 1.34 1.34 0 0 1 0-2.68zm7.374 1.649c-.107.089-.219.177-.329.265l.549-.766c.01-.163.015-.324.015-.484 0-1.992-1.508-3.879-4.269-5.316-1.999-1.04-4.255-1.533-6.407-1.4-.144.009-.29.022-.437.04l.031-.861c.124-.013.251-.02.382-.023 6.643-.254 10.604 1.27 11.804 4.529.28.76.327 1.605.076 2.52-.1.364-.229.707-.386 1.026zm-7.029 7.198c.022.011.042.024.063.035.009.005.019.01.028.015l-.574-.06.498-.058-.015.068zm-5.409-9.18c.143-.05.289-.096.438-.135.386-.102.79-.16 1.208-.161h.112c2.131.006 4.274.494 6.195 1.411 1.05.5 1.93 1.139 2.602 1.877.159.174.295.353.407.531l.016-.028-.743.811c-.021-.024-.042-.049-.064-.073-.54-.595-1.802-1.299-2.886-1.802-2.051-1.02-4.225-1.571-6.391-1.432-.137.009-.274.02-.41.037l-3.3-.589c.491-.703 1.115-1.29 1.827-1.746.178-.113.354-.21.537-.303h.012l1.553.2zm-7.02 1.983c.563-2.5 2.338-5.045 5.139-6.912.02-.013.04-.026.06-.039l-.606.622-.743.811c-1.34 1.426-2.272 2.054-2.836 4.603-.088.406-.124.818-.107 1.232-.007.449.041.896.139 1.334l1.738 4.97a1.6 1.6 0 0 0 .216.402l.815-4.832c.164-.95.284-1.908.36-2.87 1.52-.1 3.316.021 5.092.703l4.352 3.8-.014.012a2.388 2.388 0 0 0-.035.002c.07-.03.146-.06.219-.062.061 0 .124.028.158.124.049.148.036.3-.036.44l-.02.04c-.09.18-.234.336-.4.471l-.06.043c-.19.139-.395.252-.635.32l-.038.013-1.932.285.667 2.392-3.022-2.634a.29.29 0 0 1-.051-.037l-4.124-1.71c-1.668.656-2.512-.312-2.512-.312l1.767-1.611-.318.165c-.123.064-.245.135-.359.213l1.061-1.221c.3-.3.631-.547.983-.724l.33-.142c.164-.07.373-.137.6-.19l1.316-.216-1.688-1.422c-.2-.069-.406-.137-.615-.137.295.109.583.237.861.383l-.019-.012c-.365.152-.78.228-1.223.266-.483.043-1.519-.041-1.792.568-.106.233-.061.535.338.619.125.029.77.05 1.238.077l-.173-.12-.088-.05c-.412-.232-.75-.569-1.098 1.33-.072.55-.087 1.106-.046 1.66l-5.498-.854c-1.086-2.268-1.702-4.271-1.702-6.006z" fill="#61dafb"/></svg>'
  };

  return icons[lang] || icons[lang.replace('.', '')] || null;
}

// --- Projects (shared card + modal) ---

function getModalEls() {
  return {
    dialog: document.getElementById('projectModal'),
    title: document.getElementById('projectModalTitle'),
    image: document.getElementById('projectModalImage'),
    desc: document.getElementById('projectModalDescription'),
    langs: document.getElementById('projectModalLanguages'),
    repo: document.getElementById('projectModalRepo'),
    live: document.getElementById('projectModalLive')
  };
}

function openProjectModal(project) {
  const m = getModalEls();
  if (!m.dialog || !project) return;

  if (m.title) m.title.textContent = project.title || 'Project';
  if (m.desc) m.desc.textContent = project.description || '';

  if (m.image) {
    if (project.image) {
      m.image.src = project.image;
      m.image.alt = `${project.title || 'Project'} preview`;
      m.image.classList.remove('hidden');
    } else {
      m.image.classList.add('hidden');
      m.image.removeAttribute('src');
    }
  }

  if (m.langs) {
    m.langs.innerHTML = '';
    (project.languages || []).forEach((lang) => {
      const langChip = document.createElement('span');
      langChip.className = 'project-lang-chip inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-800';
      const icon = getLangIcon(lang);
      if (icon) {
        langChip.innerHTML = icon + ' ' + lang;
      } else {
        langChip.textContent = lang;
      }
      m.langs.appendChild(langChip);
    });
  }

  const repoUrl = project.repository || '';
  const liveSiteUrl = project.deployment || project.live || '';

  if (m.repo) {
    if (repoUrl) {
      m.repo.href = ensureHttp(repoUrl);
      m.repo.classList.remove('hidden');
    } else {
      m.repo.classList.add('hidden');
      m.repo.removeAttribute('href');
    }
  }

  if (m.live) {
    if (liveSiteUrl) {
      m.live.href = ensureHttp(liveSiteUrl);
      m.live.classList.remove('hidden');
    } else {
      m.live.classList.add('hidden');
      m.live.removeAttribute('href');
    }
  }

  m.dialog.showModal();
}

function createProjectCard(proj) {
  const card = document.createElement('div');
  card.className = 'project-card group flex w-full flex-1 cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg';
  card.style.cursor = 'pointer';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');

  if (proj.image) {
    const imgContainer = document.createElement('div');
    imgContainer.className = 'project-image-container flex h-[160px] w-full items-center justify-center overflow-hidden bg-slate-100 lg:h-[190px]';
    const img = document.createElement('img');
    img.src = proj.image;
    img.alt = proj.title || 'Project image';
    img.loading = 'lazy';
    img.className = 'project-image h-full w-full object-cover transition-transform duration-300 group-hover:scale-105';
    imgContainer.appendChild(img);
    card.appendChild(imgContainer);
  }

  const body = document.createElement('div');
  body.className = 'card-body flex flex-1 flex-col p-4';
  const h = el('h3', 'mb-2 text-base font-semibold text-slate-900', proj.title || '');
  const p = el('p', 'text-sm leading-relaxed text-slate-500 line-clamp-2', proj.description || '');

  body.appendChild(h);
  body.appendChild(p);
  card.appendChild(body);

  card.addEventListener('click', () => openProjectModal(proj));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(proj);
    }
  });

  return card;
}

function renderProjectsGrid(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';
  (projects || []).forEach((proj) => {
    grid.appendChild(createProjectCard(proj));
  });
}

function renderCarousel(projects) {
  const carousel = document.getElementById('projects-carousel');
  if (!carousel) return;
  const track = document.getElementById('projects-carousel-track');
  if (!track) return;
  const list = projects || [];
  track.innerHTML = '';

  if (list.length === 0) {
    carousel.classList.add('hidden');
    return;
  }

  list.forEach((proj) => {
    const slide = document.createElement('div');
    slide.className = 'flex w-full shrink-0 snap-center px-2 sm:w-1/2 lg:w-1/3';
    const card = createProjectCard(proj);
    card.className += ' h-full';
    slide.appendChild(card);
    track.appendChild(slide);
  });

  const prevBtn = document.getElementById('projects-carousel-prev');
  const nextBtn = document.getElementById('projects-carousel-next');
  if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }));

  carousel.setAttribute('tabindex', '0');
  carousel.setAttribute('aria-label', 'Featured projects carousel');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }); }
    if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }); }
  });
}

// --- Certificates (shared card + lightbox) ---

function openCertModal(cert) {
  const dialog = document.getElementById('certModal');
  if (!dialog || !cert) return;

  const title = document.getElementById('certModalTitle');
  const image = document.getElementById('certModalImage');
  const pdf = document.getElementById('certModalPdf');
  const issuer = document.getElementById('certModalIssuer');
  const desc = document.getElementById('certModalDesc');

  if (title) title.textContent = cert.title || 'Certificate';
  if (issuer) issuer.textContent = [cert.issuer, cert.year].filter(Boolean).join(' â€¢ ');
  if (desc) desc.textContent = cert.description || '';

  if (pdf) {
    if (cert.previewUrl) {
      pdf.src = cert.previewUrl;
      pdf.classList.remove('hidden');
    } else {
      pdf.classList.add('hidden');
      pdf.removeAttribute('src');
    }
  }

  if (image) {
    if (cert.image && !cert.previewUrl) {
      image.src = cert.image;
      image.alt = cert.title || 'Certificate';
      image.classList.remove('hidden');
    } else {
      image.classList.add('hidden');
      image.removeAttribute('src');
    }
  }

  dialog.showModal();
}

function createCertificateCard(cert) {
  const item = document.createElement('div');
  item.className = 'group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg';
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');

  const imgWrap = document.createElement('div');
  imgWrap.className = 'flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-slate-100 p-4';
  if (cert.image) {
    const img = document.createElement('img');
    img.src = cert.image;
    img.alt = cert.title || 'Certificate';
    img.loading = 'lazy';
    img.className = 'h-full w-full object-contain transition-transform duration-300 group-hover:scale-105';
    imgWrap.appendChild(img);
  } else if (cert.credentialUrl) {
    imgWrap.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 3v5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 13h6M9 17h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    imgWrap.classList.add('text-slate-300');
  } else {
    imgWrap.innerHTML = '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="12" cy="9" r="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="m9 14.5-2 7 5-3 5 3-2-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    imgWrap.classList.add('text-slate-300');
  }
  item.appendChild(imgWrap);

  const body = document.createElement('div');
  body.className = 'flex flex-1 flex-col p-4';
  const h = el('h3', 'mb-1 text-base font-semibold text-slate-900', cert.title || '');
  const meta = el('p', 'mb-0 text-sm text-slate-500', [cert.issuer, cert.year].filter(Boolean).join(' â€¢ '));
  body.appendChild(h);
  body.appendChild(meta);
  item.appendChild(body);

  item.addEventListener('click', () => openCertModal(cert));
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCertModal(cert);
    }
  });

  return item;
}

function renderCertificates(certs) {
  const grid = document.getElementById('certificates-grid');
  if (!grid) return;
  grid.innerHTML = '';
  (certs || []).forEach((cert) => {
    grid.appendChild(createCertificateCard(cert));
  });
}

function renderCertificatesCarousel(certs) {
  const carousel = document.getElementById('certificates-carousel');
  if (!carousel) return;
  const track = document.getElementById('certificates-carousel-track');
  if (!track) return;
  const list = certs || [];
  track.innerHTML = '';

  if (list.length === 0) {
    carousel.classList.add('hidden');
    return;
  }

  list.forEach((cert) => {
    const slide = document.createElement('div');
    slide.className = 'flex w-full shrink-0 snap-center px-2 sm:w-1/2 lg:w-1/3';
    const card = createCertificateCard(cert);
    card.className += ' h-full';
    slide.appendChild(card);
    track.appendChild(slide);
  });

  const prevBtn = document.getElementById('certificates-carousel-prev');
  const nextBtn = document.getElementById('certificates-carousel-next');
  if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }));

  carousel.setAttribute('tabindex', '0');
  carousel.setAttribute('aria-label', 'Certificates carousel');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }); }
    if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }); }
  });
}

async function loadData(){
  try{
    let res = await fetch(DATA_URL);
    if (!res.ok) res = await fetch('data.json');
    if(!res.ok) throw new Error('Failed to load data.json');
    const data = await res.json();
    (data.projects || []).forEach(p => { p.image = toDriveUrl(p.image); });
    (data.certificates || []).forEach(c => {
      c.image = toDriveUrl(c.image);
      if (c.credentialUrl) {
        c.previewUrl = toDrivePreviewUrl(c.credentialUrl);
        c.credentialUrl = '';
      }
    });
    const c = data.contact || {};

    // Header (homepage hero)
    const nameEl = document.getElementById('name');
    const taglineEl = document.getElementById('tagline');
    const subtitleEl = document.getElementById('hero-subtitle');
    if (nameEl) nameEl.textContent = data.name || '';
    if (taglineEl) taglineEl.textContent = data.tagline || '';
    if (subtitleEl) subtitleEl.textContent = data.subtitle || '';

    //Education
    const educationList = document.getElementById('education-list');
    if (educationList) {
      educationList.innerHTML = '';
      (data.education||[]).forEach(edu => {
        const div = el('div','education-item mb-3 flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md');
        const content = document.createElement('div');
        content.className = 'flex-1';
        const degree = el('h3','mb-1 text-base font-semibold text-slate-900', edu.degree || '');
        const institution = el('p','mb-1 text-sm text-slate-500', edu.institution || '');
        const year = el('p','mb-1 text-sm text-slate-500', edu.year || '');
        
        content.appendChild(degree); 
        content.appendChild(institution); 
        content.appendChild(year);
        
        // Add details if they exist
        if (edu.details) {
          const details = el('p','mb-0 text-sm italic text-indigo-700', edu.details);
          content.appendChild(details);
        }

        div.appendChild(createSectionCard(SECTION_ICONS.education));
        div.appendChild(content);
        
        educationList.appendChild(div);
      });
    }

    // Chips
    const chips = document.getElementById('chips');
    if (chips) {
      chips.innerHTML = '';
      (data.chips||[]).forEach(c => { const s = el('span','chip inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs text-slate-700 transition-all hover:-translate-y-0.5 hover:border-indigo-400',c); chips.appendChild(s); });
    }

    // About
    const aboutEl = document.getElementById('about-text');
    if (aboutEl) {
      const aboutText = data.about || '';
      aboutEl.innerHTML = aboutText.replace(/\n/g, '<br>');
    }

    // Experience
    const experienceList = document.getElementById('experience-list');
    if (experienceList) {
      experienceList.innerHTML = '';
      (data.experiences || data.experience || []).forEach(exp => {
        const div = el('div', 'education-item mb-3 flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md');
        const content = document.createElement('div');
        content.className = 'flex-1';
        const position = el('h3', 'mb-1 text-base font-semibold text-slate-900', exp.position || exp.role || '');
        const company = el('p', 'mb-1 text-sm text-slate-500', exp.company || exp.organization || '');
        const duration = el('p', 'mb-1 text-sm italic text-indigo-700', exp.duration || exp.year || '');
        const description = el('p', 'mb-0 text-sm text-slate-500', exp.description || '');

        content.appendChild(position);
        content.appendChild(company);
        content.appendChild(duration);
        content.appendChild(description);

        div.appendChild(createSectionCard(SECTION_ICONS.experience));
        div.appendChild(content);
        experienceList.appendChild(div);
      });
    }

    // Skills
    const skillsList = document.getElementById('skills-list');
    if (skillsList) {
      skillsList.innerHTML = '';
      const skills = data.skills || [];
      const categorized = {
        Languages: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Java', 'Python'],
        Frameworks: ['Angular', 'React Native', 'Flutter', 'Nodejs', 'Spring Boot'],
        Database: ['MySQL', 'PostgreSQL']
      };

      const createSkillItem = (skillName) => {
        const item = document.createElement('div');
        item.className = 'flex flex-col items-center gap-1.5';
        item.setAttribute('title', skillName);
        item.setAttribute('aria-label', skillName);

        const icon = getLangIcon(skillName);
        if (icon) {
          const iconWrap = document.createElement('span');
          iconWrap.className = 'skills-grid-icon flex items-center justify-center';
          iconWrap.innerHTML = icon;
          item.appendChild(iconWrap);
        }

        const label = document.createElement('span');
        label.className = 'text-xs font-medium text-slate-700';
        label.textContent = skillName;
        item.appendChild(label);

        return item;
      };

      const gridWrap = document.createElement('div');
      gridWrap.className = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3';
      Object.keys(categorized).forEach((cat) => {
        const items = categorized[cat].filter((s) => skills.includes(s));
        if (items.length === 0) return;

        const card = el('div', 'flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm');
        const heading = el('h3', 'mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-700', cat);
        const row = document.createElement('div');
        row.className = 'flex flex-wrap gap-x-8 gap-y-4';
        items.forEach((skill) => row.appendChild(createSkillItem(skill)));

        card.appendChild(heading);
        card.appendChild(row);
        gridWrap.appendChild(card);
      });
      skillsList.appendChild(gridWrap);
    }

    // Projects (homepage carousel + full grid on the projects page)
    const allProjects = data.projects || [];
    const featured = allProjects.filter(p => p.featured);
    const carouselProjects = featured.length > 0 ? featured : allProjects.slice(0, 6);
    renderCarousel(carouselProjects);
    renderProjectsGrid(allProjects);

    // Certificates
    renderCertificates(data.certificates || []);
    renderCertificatesCarousel(data.certificates || []);

    // Notable Achievements
    const notableAchievementsList = document.getElementById('notable-achievements-list');
    if (notableAchievementsList) {
      notableAchievementsList.innerHTML = '';
      (data.notableAchievements || data['notable achievements'] || []).forEach(achievement => {
        const div = el('div','notable-achievement-item mb-3 flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md');
        const content = document.createElement('div');
        content.className = 'flex-1';
        const title = el('h3','mb-1 text-base font-semibold text-slate-900', achievement.title || '');
        const metaParts = [achievement.type, achievement.organization, achievement.year].filter(Boolean);
        const meta = el('p','mb-1 text-sm font-medium text-slate-700', metaParts.join(' â€¢ '));
        const description = el('p','mb-0 text-sm text-slate-500', achievement.description || '');
        content.appendChild(title);
        if (metaParts.length) content.appendChild(meta);
        content.appendChild(description);
        div.appendChild(createSectionCard(SECTION_ICONS.achievement));
        div.appendChild(content);
        notableAchievementsList.appendChild(div);
      });
    }

    // Sidebar Contact Icons
    if(c.linkedin) {
      const linkedinLink = document.getElementById('contact-linkedin');
      if (linkedinLink) linkedinLink.href = ensureHttp(c.linkedin);
    }
    if(c.github) {
      const githubLink = document.getElementById('contact-github');
      if (githubLink) githubLink.href = ensureHttp(c.github);
    }
    if(c.instagram) {
      const instagramLink = document.getElementById('contact-instagram');
      if (instagramLink) instagramLink.href = ensureHttp(c.instagram);
    }
    if(c.facebook) {
      const facebookLink = document.getElementById('contact-facebook');
      if (facebookLink) facebookLink.href = ensureHttp(c.facebook);
    }
    
    // Store email for contact form
    window.portfolioEmail = c.email;

    // Footer
    const footerYear = document.getElementById('footer-year');
    const footerName = document.getElementById('footer-name');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
    if (footerName) footerName.textContent = data.name || '';

  }catch(err){
    console.error(err);
  } finally {
    hidePageLoader();
  }
}

// Dialog close behavior for the native <dialog> modals (project + certificate)
function setupDialogs(){
  document.querySelectorAll('dialog').forEach(dialog => {
    const closeBtn = dialog.querySelector('[data-dialog-close]');
    if (closeBtn) closeBtn.addEventListener('click', () => dialog.close());

    // Close when clicking the backdrop
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  });
}

// --- Design helpers ---

const SECTION_ICONS = {
  education: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m22 10-10-5L2 10l10 5 10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m6 12 5 2.5 5-2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22.5V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  experience: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  achievement: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 21h8m-4-4v4M7 4h10v4a5 5 0 0 1-10 0V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 6H4a2 2 0 0 0 2 4h1M17 6h3a2 2 0 0 1-2 4h-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

function createSectionCard(icon) {
  const tile = document.createElement('div');
  tile.className = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700';
  tile.innerHTML = icon;
  return tile;
}

function setupReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  targets.forEach((t) => io.observe(t));
}

// Highlight the sidebar nav item for the section currently in view (homepage only)
function setupScrollSpy() {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const links = Array.from(document.querySelectorAll('a.nav-link[href^="#"]'));
  if (!sections.length || !links.length) return;

  const map = {};
  links.forEach((l) => { map[l.getAttribute('href').slice(1)] = l; });
  const ACTIVE = ['bg-indigo-50', 'text-indigo-700', 'lg:border-l-indigo-700'];
  let current = '';

  const onScroll = () => {
    const pos = window.scrollY + 160;
    let id = sections[0].id;
    for (const s of sections) {
      if (s.offsetTop <= pos) id = s.id;
    }
    if (id === current) return;
    current = id;
    links.forEach((l) => l.classList.remove(...ACTIVE));
    const link = map[id];
    if (link) link.classList.add(...ACTIVE);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) hidePageLoader();
});

document.addEventListener('DOMContentLoaded', () => { setupNavBehavior(); setupContactForm(); setupDialogs(); setupReveal(); setupScrollSpy(); loadData(); });
