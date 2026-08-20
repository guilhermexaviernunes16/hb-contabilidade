/**
 * HB Contabilidade - Modern Interactive Script
 * Author: Google Antigravity
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHubSearchAndTabs();
  initSimulator();
  initFaqAccordion();
  initWhatsAppWidget();
  initContactForm();
  initScrollSpy();
  initScrollReveal();
  updateCurrentYear();
});

/* ==========================================================================
   0. SCROLL REVEAL & COUNTER ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-fade');
  
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Counter animation if present
        const counter = entry.target.querySelector('[data-counter]');
        if (counter && !counter.dataset.animated) {
          counter.dataset.animated = "true";
          animateCounter(counter, parseInt(counter.dataset.counter, 10) || 15);
        }
        
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
  let current = 0;
  const increment = target / 25;
  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = `+${target}`;
      clearInterval(interval);
    } else {
      el.textContent = `+${Math.ceil(current)}`;
    }
  }, 40);
}

/* ==========================================================================
   1. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('menu-icon');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
      menu.classList.remove('hidden');
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      menu.classList.add('hidden');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // Close when clicking nav links
  const links = menu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    });
  });
}

/* ==========================================================================
   2. MEGA HUB - LIVE SEARCH & CATEGORY FILTERING
   ========================================================================== */
function initHubSearchAndTabs() {
  const searchInput = document.getElementById('hub-search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const tabButtons = document.querySelectorAll('.hub-tab-btn');
  const cards = document.querySelectorAll('.hub-card');
  const noResults = document.getElementById('no-results');

  let currentCategory = 'all';

  function filterCards() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    cards.forEach(card => {
      const categoryMatch = (currentCategory === 'all') || card.dataset.category.includes(currentCategory);
      const title = card.querySelector('.hub-card-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.hub-card-desc')?.textContent.toLowerCase() || '';
      const keywords = card.dataset.keywords || '';

      const textMatch = query === '' || 
        title.includes(query) || 
        desc.includes(query) || 
        keywords.toLowerCase().includes(query);

      if (categoryMatch && textMatch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    }

    if (clearBtn) {
      if (query.length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }
  }

  // Category Tab switching
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category || 'all';
      filterCards();
    });
  });

  // Search input events
  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterCards();
      searchInput.focus();
    });
  }
}

/* ==========================================================================
   3. SIMULATOR OF HONORÁRIOS & PROPOSTA CONTÁBIL
   ========================================================================== */
function initSimulator() {
  const fatSlider = document.getElementById('faturamento-slider');
  const fatLabel = document.getElementById('faturamento-label');
  const funcSlider = document.getElementById('funcionarios-slider');
  const funcLabel = document.getElementById('funcionarios-label');
  const planName = document.getElementById('sim-plan-name');
  const planDesc = document.getElementById('sim-plan-desc');
  const submitBtn = document.getElementById('btn-enviar-simulacao');

  if (!fatSlider || !funcSlider || !submitBtn) return;

  const faturamentoMap = {
    1: 'Até R$ 30 mil/mês',
    2: 'De R$ 30 mil a R$ 50 mil/mês',
    3: 'De R$ 50 mil a R$ 100 mil/mês',
    4: 'De R$ 100 mil a R$ 200 mil/mês',
    5: 'Acima de R$ 200 mil/mês'
  };

  const funcionariosMap = {
    0: 'Apenas Sócios (0 CLT)',
    1: '1 a 3 Funcionários',
    2: '4 a 8 Funcionários',
    3: '9 a 15 Funcionários',
    4: 'Mais de 15 Funcionários'
  };

  function updatePlan() {
    const fatVal = parseInt(fatSlider.value, 10);
    const funcVal = parseInt(funcSlider.value, 10);

    fatLabel.textContent = faturamentoMap[fatVal];
    funcLabel.textContent = funcionariosMap[funcVal];

    if (fatVal <= 2 && funcVal <= 1) {
      planName.textContent = 'Plano HB Prime Essencial';
      planDesc.textContent = 'Contabilidade digital simplificada, apuração do Simples Nacional, entrega de obrigações e suporte via WhatsApp.';
    } else if (fatVal <= 4 && funcVal <= 3) {
      planName.textContent = 'Plano HB Estratégico Plus';
      planDesc.textContent = 'Gestão fiscal avançada, departamento pessoal eSocial completo, conciliação de XMLs e reuniões de diagnóstico periódicas.';
    } else {
      planName.textContent = 'Plano HB Enterprise & Lucro Real';
      planDesc.textContent = 'Consultoria tributária de alta performance, BPO financeiro integrado, relatórios executivos de DRE e suporte dedicado.';
    }
  }

  fatSlider.addEventListener('input', updatePlan);
  funcSlider.addEventListener('input', updatePlan);

  submitBtn.addEventListener('click', () => {
    const tipo = document.querySelector('input[name="sim_tipo"]:checked')?.value || 'abertura';
    const atividade = document.querySelector('input[name="sim_atividade"]:checked')?.value || 'Serviços';
    const faturamento = faturamentoMap[fatSlider.value];
    const funcionarios = funcionariosMap[funcSlider.value];
    const plano = planName.textContent;

    const tipoTxt = tipo === 'abertura' ? 'Abrir Nova Empresa' : (tipo === 'migracao' ? 'Migrar de Contabilidade' : 'Suporte MEI');

    const msg = `Olá, HB Contabilidade! Fiz uma simulação de proposta no site:\n\n` +
      `📌 *Momento:* ${tipoTxt}\n` +
      `🏢 *Segmento:* ${atividade}\n` +
      `💰 *Faturamento Estimado:* ${faturamento}\n` +
      `👥 *Colaboradores:* ${funcionarios}\n` +
      `⭐ *Plano Recomendado:* ${plano}\n\n` +
      `Gostaria de receber mais detalhes e valores da proposta!`;

    const waUrl = `https://wa.me/5531988906655?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  });

  updatePlan();
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other items
      items.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-toggle');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. FLOATING WHATSAPP INTERACTIVE WIDGET
   ========================================================================== */
function initWhatsAppWidget() {
  const toggleBtn = document.getElementById('toggle-whatsapp-btn');
  const popup = document.getElementById('whatsapp-popup');
  const closeBtn = document.getElementById('close-whatsapp-popup');

  if (!toggleBtn || !popup) return;

  toggleBtn.addEventListener('click', () => {
    popup.classList.toggle('hidden');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.classList.add('hidden');
    });
  }

  // Close popup if clicked outside
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && !toggleBtn.contains(e.target) && !popup.classList.contains('hidden')) {
      popup.classList.add('hidden');
    }
  });
}

/* ==========================================================================
   6. CONTACT FORM INTERACTION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim();
    const phone = document.getElementById('contact-phone')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const subject = document.getElementById('contact-subject')?.value || 'Contato pelo Site';
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !phone || !email) {
      if (feedback) {
        feedback.className = 'p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs text-center';
        feedback.textContent = 'Por favor, preencha todos os campos obrigatórios (*).';
        feedback.classList.remove('hidden');
      }
      return;
    }

    if (feedback) {
      feedback.className = 'p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs text-center';
      feedback.textContent = 'Mensagem enviada com sucesso! Redirecionando para o WhatsApp do nosso especialista...';
      feedback.classList.remove('hidden');
    }

    const waText = `Olá! Meu nome é *${name}*.\n` +
      `📧 *E-mail:* ${email}\n` +
      `📞 *Telefone:* ${phone}\n` +
      `🎯 *Assunto:* ${subject}\n` +
      (message ? `📝 *Mensagem:* ${message}\n` : '') +
      `\nGostaria de receber atendimento da HB Contabilidade.`;

    const waUrl = `https://wa.me/5531988906655?text=${encodeURIComponent(waText)}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      form.reset();
    }, 1200);
  });
}

/* ==========================================================================
   7. SCROLL SPY & ACTIVE NAV LINKS
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   8. FOOTER CURRENT YEAR
   ========================================================================== */
function updateCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
