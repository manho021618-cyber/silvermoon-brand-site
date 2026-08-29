const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');

function closeMenu() {
  document.body.classList.remove('nav-open');
  if (menuButton) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.sr-only').textContent = '메뉴 열기';
  }
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.querySelector('.sr-only').textContent = isOpen ? '메뉴 닫기' : '메뉴 열기';
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const filterButtons = document.querySelectorAll('[data-filter]');
const catalogCards = document.querySelectorAll('[data-category]');
const catalogEmpty = document.querySelector('[data-catalog-empty]');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    catalogCards.forEach((card) => {
      const isVisible = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (catalogEmpty) catalogEmpty.hidden = visibleCount !== 0;
  });
});

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  const params = new URLSearchParams(window.location.search);
  const productNames = {
    'luna-tray': '루나 스틸 트레이',
    'orbit-lamp': '오비트 테이블 램프',
    'field-kettle': '필드 스틸 케틀'
  };
  if (productNames[params.get('product')]) {
    contactForm.elements.topic.value = '제품 및 입고';
    contactForm.elements.message.value = `${productNames[params.get('product')]}의 입고 일정과 상세 정보가 궁금합니다.`;
  }

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const formData = new FormData(contactForm);
    const subject = `[실버문 문의] ${formData.get('topic')}`;
    const body = `이름: ${formData.get('name')}\n이메일: ${formData.get('email')}\n\n${formData.get('message')}`;
    const status = contactForm.querySelector('[data-form-status]');
    status.textContent = '이메일 앱을 여는 중입니다. 열리지 않으면 hello@silvermoon.kr로 보내주세요.';
    window.location.href = `mailto:hello@silvermoon.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
