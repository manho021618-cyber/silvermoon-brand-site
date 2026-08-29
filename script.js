const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');

function closeMenu() {
  document.body.classList.remove('nav-open');
  if (!menuButton) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = '메뉴 열기';
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
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const insightButtons = document.querySelectorAll('[data-insight]');
const insightCopy = document.querySelector('[data-insight-copy]');
const insightMessages = {
  objects: '흔하지 않은 형태와 쓰임을 가진 오브제만 선별합니다.',
  steel: '차갑고 단단한 물성이 생활 속에서 오래 빛나도록 고릅니다.'
};

function selectInsight(selected) {
  insightButtons.forEach((button) => {
    const isActive = button === selected;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  if (insightCopy) insightCopy.textContent = insightMessages[selected.dataset.insight];
}

insightButtons.forEach((button) => {
  button.addEventListener('click', () => selectInsight(button));
  button.addEventListener('mouseenter', () => selectInsight(button));
  button.addEventListener('focus', () => selectInsight(button));
});

const productGrids = document.querySelectorAll('[data-products-grid]');
const priceFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0
});

function createLink(url, label, className) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = className;
  link.setAttribute('aria-label', `${label} 새 탭에서 열기`);
  return link;
}

function createProductCard(product, index, layout) {
  const card = document.createElement('article');
  card.className = layout === 'catalog' ? 'shop-card' : 'product-card';

  const imageLink = createLink(product.url, `${product.name} 구매 페이지`, layout === 'catalog' ? 'shop-card-image' : 'product-image');
  const image = document.createElement('img');
  image.src = product.image;
  image.alt = product.name;
  image.loading = 'lazy';
  image.referrerPolicy = 'no-referrer';
  const number = document.createElement('span');
  number.className = layout === 'catalog' ? 'shop-card-number' : 'product-number';
  number.textContent = String(index + 1).padStart(2, '0');
  imageLink.append(image, number);

  const info = document.createElement('div');
  info.className = layout === 'catalog' ? 'shop-card-info' : 'product-meta';
  const copy = document.createElement('div');
  const kicker = document.createElement('p');
  kicker.className = layout === 'catalog' ? 'shop-card-kicker' : '';
  kicker.textContent = 'SMARTSTORE / SELECTED OBJECT';
  const title = document.createElement(layout === 'catalog' ? 'h2' : 'h3');
  title.textContent = product.name;
  copy.append(kicker, title);

  const purchase = document.createElement('div');
  purchase.className = layout === 'catalog' ? 'shop-card-purchase' : 'product-card-purchase';
  const price = document.createElement('strong');
  price.className = 'product-price';
  price.textContent = priceFormatter.format(product.price);
  const buyLink = createLink(product.url, `${product.name} 구매하기`, layout === 'catalog' ? 'buy-button' : 'text-link product-buy-link');
  buyLink.dataset.cartAdd = '';
  buyLink.dataset.name = product.name;
  buyLink.dataset.price = String(product.price);
  buyLink.dataset.url = product.url;
  buyLink.textContent = '장바구니 담기';
  const arrow = document.createElement('span');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = ' ↗';
  buyLink.append(arrow);
  purchase.append(price, buyLink);
  info.append(copy, purchase);
  card.append(imageLink, info);
  return card;
}

async function loadProducts() {
  if (!productGrids.length) return;
  try {
    const response = await fetch('products.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const products = await response.json();
    if (!Array.isArray(products)) throw new Error('제품 데이터 형식이 올바르지 않습니다.');

    document.querySelectorAll('[data-product-count]').forEach((count) => {
      count.textContent = String(products.length).padStart(2, '0');
    });
    productGrids.forEach((grid) => {
      const limit = Number.parseInt(grid.dataset.limit, 10);
      const visibleProducts = Number.isFinite(limit) ? products.slice(0, limit) : products;
      grid.replaceChildren(...visibleProducts.map((product, index) => createProductCard(product, index, grid.dataset.layout)));
    });
  } catch (error) {
    console.error('제품을 불러오지 못했습니다.', error);
    productGrids.forEach((grid) => {
      const message = document.createElement('p');
      message.className = 'product-loading product-load-error';
      message.setAttribute('role', 'alert');
      message.textContent = '제품 정보를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.';
      grid.replaceChildren(message);
    });
  }
}

loadProducts();

const homeStories = document.querySelector('[data-home-stories]');

function formatStoryDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue || '';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date).replace(/\. /g, '. ');
}

function createStoryCard(post, index) {
  const article = document.createElement('article');
  article.className = `story-card${index === 1 ? ' reveal--delay' : index === 2 ? ' reveal--long-delay' : ''}`;
  const target = post.url ? `story/${post.url}` : `story/post.html?id=${encodeURIComponent(post.id || '')}`;
  const link = document.createElement('a');
  link.className = 'story-card-link';
  link.href = target;
  const date = document.createElement('time');
  date.className = 'story-date';
  date.dateTime = post.date || '';
  date.textContent = formatStoryDate(post.date);
  const category = document.createElement('p');
  category.className = 'story-category';
  category.textContent = Array.isArray(post.tags) && post.tags.length ? post.tags[0] : 'JOURNAL';
  const title = document.createElement('h3');
  title.textContent = post.title || '(제목 없음)';
  const summary = document.createElement('p');
  summary.textContent = post.summary || '';
  link.append(date, category, title, summary);
  article.append(link);
  return article;
}

async function loadHomeStories() {
  if (!homeStories) return;
  try {
    const response = await fetch('story/posts.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const posts = await response.json();
    if (!Array.isArray(posts)) throw new Error('이야기 데이터 형식이 올바르지 않습니다.');
    const latestPosts = posts
      .slice()
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
      .slice(0, 3);
    homeStories.replaceChildren(...latestPosts.map(createStoryCard));
  } catch (error) {
    console.error('이야기를 불러오지 못했습니다.', error);
    const message = document.createElement('p');
    message.className = 'story-loading';
    message.setAttribute('role', 'alert');
    message.textContent = '최신 이야기를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.';
    homeStories.replaceChildren(message);
  }
}

loadHomeStories();

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
    const subject = `[SILVER MOON 문의] ${formData.get('topic')}`;
    const body = `이름: ${formData.get('name')}\n이메일: ${formData.get('email')}\n\n${formData.get('message')}`;
    const status = contactForm.querySelector('[data-form-status]');
    status.textContent = '이메일 앱을 여는 중입니다. 열리지 않으면 steelaura00@gmail.com로 보내주세요.';
    window.location.href = `mailto:steelaura00@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
