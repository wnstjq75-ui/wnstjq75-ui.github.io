(function () {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const closeNav = () => {
    navMenu.classList.remove('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '메뉴 열기');
    document.body.classList.remove('nav-open');
  };

  const openNav = () => {
    navMenu.classList.add('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', '메뉴 닫기');
    document.body.classList.add('nav-open');
  };

  let navScrollTicking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (navScrollTicking) return;
      navScrollTicking = true;
      requestAnimationFrame(() => {
        nav.classList.toggle('nav--scrolled', window.scrollY > 20);
        navScrollTicking = false;
      });
    },
    { passive: true }
  );

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('nav__menu--open');
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('nav__menu--open') &&
      !nav.contains(e.target)
    ) {
      closeNav();
    }
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));

  const targetingTabs = document.querySelectorAll('.targeting-tab');
  const targetingPanels = document.querySelectorAll('.targeting-content');

  targetingTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      if (!target) return;

      targetingTabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle('targeting-tab--active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      targetingPanels.forEach((panel) => {
        const isActive = panel.dataset.panel === target;
        panel.classList.toggle('targeting-content--active', isActive);
        panel.hidden = !isActive;
      });
    });
  });

  // Keep every targeting visual aligned to the natural height of the first GEO panel.
  const targetingPanel = document.getElementById('targetingPanel');
  const targetingGeoVisual = targetingPanel?.querySelector('[data-panel="geo"] .targeting-geo');

  const syncTargetingVisualHeight = () => {
    if (!targetingPanel || !targetingGeoVisual) return;
    if (window.matchMedia('(max-width: 768px)').matches) {
      targetingPanel.style.removeProperty('--targeting-geo-height');
      return;
    }

    const geoHeight = Math.ceil(targetingGeoVisual.getBoundingClientRect().height);
    if (geoHeight > 0) {
      targetingPanel.style.setProperty('--targeting-geo-height', `${geoHeight}px`);
    }
  };

  syncTargetingVisualHeight();
  window.addEventListener('resize', syncTargetingVisualHeight, { passive: true });
  if ('ResizeObserver' in window && targetingGeoVisual) {
    new ResizeObserver(syncTargetingVisualHeight).observe(targetingGeoVisual);
  }

  const kpiValues = document.querySelectorAll('.kpi__value');
  const animateValue = (el) => {
    const text = el.textContent;
    const hasPercent = text.includes('%');
    const hasK = text.includes('K');
    const hasDay = text.includes('일');

    if (hasDay) return;

    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;

    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;

      if (hasPercent) {
        el.textContent = current.toFixed(1) + '%';
      } else if (hasK) {
        el.textContent = current.toFixed(1) + 'K';
      } else {
        el.textContent = Math.round(current).toLocaleString();
      }

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const kpiObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          kpiObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  kpiValues.forEach((el) => kpiObserver.observe(el));

  // ---------- Hero showcase carousel (integrated frame UI) ----------
  if (typeof HeroCarousel !== 'undefined') {
    let heroIndex = 0;

    const heroThumb = document.getElementById('heroThumb');
    const heroPlay = document.getElementById('heroPlay');
    const heroMediaCategory = document.getElementById('heroMediaCategory');
    const heroMediaTitle = document.getElementById('heroMediaTitle');
    const heroMediaDesc = document.getElementById('heroMediaDesc');
    const heroMedia = document.getElementById('heroMedia');
    const heroSlideIndex = document.getElementById('heroSlideIndex');
    const heroSlideTotal = document.getElementById('heroSlideTotal');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');

    if (heroSlideTotal) {
      heroSlideTotal.textContent = String(HeroCarousel.slideCount()).padStart(2, '0');
    }

    function renderHeroSlide(index) {
      const n = HeroCarousel.slideCount();
      heroIndex = ((index % n) + n) % n;
      const slide = HeroCarousel.getSlide(heroIndex);

      if (heroThumb) {
        heroThumb.src = 'https://img.youtube.com/vi/' + slide.youtubeId + '/maxresdefault.jpg';
        heroThumb.alt = (slide.brand || slide.title) + ' 15초 TV광고 제작 사례';
        heroThumb.onerror = function () {
          this.onerror = null;
          this.src = slide.thumb;
        };
      }
      if (heroPlay) {
        heroPlay.href = slide.href;
        heroPlay.setAttribute('aria-label', slide.title + ' YouTube에서 보기');
      }
      if (heroMediaCategory) {
        heroMediaCategory.textContent = slide.category || '';
        heroMediaCategory.hidden = !slide.category;
      }
      if (heroMediaTitle) heroMediaTitle.textContent = slide.brand || slide.title;
      if (heroMediaDesc) heroMediaDesc.textContent = slide.desc;
      if (heroMedia) heroMedia.setAttribute('data-slide-index', String(heroIndex));
      if (heroSlideIndex) {
        heroSlideIndex.textContent = String(heroIndex + 1).padStart(2, '0');
      }
    }

    if (heroPrev) {
      heroPrev.addEventListener('click', () => {
        heroIndex = HeroCarousel.prevIndex(heroIndex);
        renderHeroSlide(heroIndex);
      });
    }
    if (heroNext) {
      heroNext.addEventListener('click', () => {
        heroIndex = HeroCarousel.nextIndex(heroIndex);
        renderHeroSlide(heroIndex);
      });
    }

    renderHeroSlide(0);

    // ---------- Portfolio carousel: infinite loop (no hard jump, no page index) ----------
    const portfolioTrack = document.getElementById('portfolioTrack');
    const portfolioPrev = document.getElementById('portfolioPrev');
    const portfolioNext = document.getElementById('portfolioNext');
    const portfolioCount = HeroCarousel.slideCount();
    // pos is absolute index on tripled track; starts in middle copy
    let portfolioPos = portfolioCount;
    let portfolioBusy = false;
    let portfolioStep = 0;

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function portfolioCardHtml(i) {
      const s = HeroCarousel.getSlide(i);
      return (
        '<a class="video-card card--media portfolio-carousel__card" href="' +
        escapeHtml(s.href) +
        '" target="_blank" rel="noopener noreferrer" aria-label="' +
        escapeHtml(s.title) +
        ' YouTube에서 보기" data-portfolio-index="' +
        i +
        '">' +
        '<div class="video-card__thumb">' +
        '<img src="' +
        escapeHtml(s.thumb) +
        '" alt="' +
        escapeHtml(s.brand || s.title) +
        ' 15초 TV광고 제작 사례" width="640" height="360" loading="lazy">' +
        '<div class="video-card__overlay"><span class="video-card__play" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></div>' +
        '<span class="video-card__duration">15초</span>' +
        '</div>' +
        '<div class="video-card__body">' +
        '<h3>' +
        escapeHtml(s.title) +
        '</h3>' +
        '<p>' +
        escapeHtml(s.desc) +
        '</p>' +
        '<div class="video-card__meta">' +
        '<span>🎬 AI TV CF</span><span>📺 IPTV 송출</span><span>⏱ 15초</span>' +
        '</div>' +
        '<span class="video-card__link">YouTube에서 보기 →</span>' +
        '</div></a>'
      );
    }

    function buildPortfolioCards() {
      if (!portfolioTrack) return;
      const n = portfolioCount;
      const html = [];
      // Triple the list so we can loop seamlessly both directions
      for (let copy = 0; copy < 3; copy++) {
        for (let i = 0; i < n; i++) {
          html.push(portfolioCardHtml(i));
        }
      }
      portfolioTrack.innerHTML = html.join('');
    }

    function portfolioVisibleCount() {
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 960) return 2;
      return 3;
    }

    function layoutPortfolioCards() {
      if (!portfolioTrack) return;
      const viewport = portfolioTrack.parentElement;
      if (!viewport) return;
      const cards = portfolioTrack.querySelectorAll('.portfolio-carousel__card');
      if (!cards.length) return;

      const vis = portfolioVisibleCount();
      const gap = 20;
      const cardW = (viewport.clientWidth - gap * (vis - 1)) / vis;
      cards.forEach((card) => {
        card.style.flex = '0 0 ' + cardW + 'px';
        card.style.width = cardW + 'px';
      });
      portfolioStep = cardW + gap;
      setPortfolioTransform(false);
    }

    function setPortfolioTransform(animate) {
      if (!portfolioTrack) return;
      portfolioTrack.style.transition = animate
        ? 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
        : 'none';
      portfolioTrack.style.transform =
        'translateX(' + -portfolioPos * portfolioStep + 'px)';
    }

    function normalizePortfolioPos() {
      const n = portfolioCount;
      if (n <= 0) return;
      // Keep pos inside the middle copy [n, 2n)
      if (portfolioPos >= 2 * n) {
        portfolioPos -= n;
        setPortfolioTransform(false);
      } else if (portfolioPos < n) {
        portfolioPos += n;
        setPortfolioTransform(false);
      }
    }

    function portfolioGo(delta) {
      if (!portfolioTrack || portfolioBusy || portfolioCount <= 0) return;
      portfolioBusy = true;
      portfolioPos += delta;
      setPortfolioTransform(true);
      // Fallback if transitionend is skipped (tab hidden / reduced motion)
      window.setTimeout(() => {
        if (!portfolioBusy) return;
        normalizePortfolioPos();
        portfolioBusy = false;
      }, 480);
    }

    buildPortfolioCards();
    portfolioPos = portfolioCount;
    // layout after paint so widths are correct
    requestAnimationFrame(() => {
      layoutPortfolioCards();
    });

    if (portfolioTrack) {
      portfolioTrack.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return;
        normalizePortfolioPos();
        // force reflow so next animate works after transition:none
        void portfolioTrack.offsetHeight;
        portfolioBusy = false;
      });
    }

    if (portfolioPrev) {
      portfolioPrev.addEventListener('click', () => portfolioGo(-1));
    }
    if (portfolioNext) {
      portfolioNext.addEventListener('click', () => portfolioGo(1));
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        layoutPortfolioCards();
        portfolioBusy = false;
      }, 120);
    });
  }

  // ---------- Pricing budget calculator ----------
  if (typeof BudgetCalculator !== 'undefined') {
    let calcProduct = 'all3';
    let calcBudget = BudgetCalculator.DEFAULT_MANWON;
    let calcTerm = BudgetCalculator.DEFAULT_TERM_MONTHS;
    const calcSurcharge = {
      region: null, // 'S' | 'A' | 'B' | null
      time: false,
      channel: false,
      audience: false,
    };

    const budgetInput = document.getElementById('calcBudget');
    const budgetLabel = document.getElementById('calcBudgetLabel');
    const termInput = document.getElementById('calcTerm');
    const termLabel = document.getElementById('calcTermLabel');
    const metaBudget = document.getElementById('calcMetaBudget');
    const metaTerm = document.getElementById('calcMetaTerm');
    const exposuresEl = document.getElementById('calcExposures');
    const totalExposuresEl = document.getElementById('calcTotalExposures');
    const totalSub = document.getElementById('calcTotalSub');
    const resultSub = document.getElementById('calcResultSub');
    const surchargeLine = document.getElementById('calcSurchargeLine');
    const surchargeTotalEl = document.getElementById('calcSurchargeTotal');
    const surchargeNoteEl = document.getElementById('calcSurchargeNote');
    const resultNum = document.querySelector('.ad-calc__result-num');
    const calcBonus = document.getElementById('calcBonus');
    const calcBonusText = document.getElementById('calcBonusText');
    const tabs = document.querySelectorAll('.ad-calc__tab');
    const regionBtns = document.querySelectorAll('[data-calc-region]');
    const surchargeBtns = document.querySelectorAll('[data-calc-surcharge]');

    function setSliderFill(input) {
      if (!input) return;
      const min = Number(input.min);
      const max = Number(input.max);
      const val = Number(input.value);
      const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
      input.style.setProperty('--calc-pct', pct + '%');
    }

    function updateSliderFill() {
      setSliderFill(budgetInput);
      setSliderFill(termInput);
    }

    function syncSliderBounds() {
      if (!budgetInput) return;
      const min = BudgetCalculator.minManwonForProduct(calcProduct);
      budgetInput.min = String(min);
      budgetInput.setAttribute('aria-valuemin', String(min));

      const ticks = document.getElementById('calcTicks');
      if (ticks) {
        const labels = [
          { text: '100만', position: '0%' },
          { text: '300만', position: '22.222%' },
          { text: '500만', position: '44.444%' },
          { text: '700만', position: '66.667%' },
          { text: '1,000만', position: '100%' },
        ];
        ticks.innerHTML = labels
          .map((tick) => '<span style="--tick-pct:' + tick.position + '">' + tick.text + '</span>')
          .join('');
        ticks.classList.remove('ad-calc__ticks--from-200');
      }
    }

    function renderCalculator() {
      const result = BudgetCalculator.calculateExposures(calcBudget, calcProduct, calcTerm);
      calcBudget = result.budgetManwon;
      calcTerm = result.termMonths;

      const surchargeRate = BudgetCalculator.sumSurchargeRate(calcSurcharge);
      const monthlyExposures = BudgetCalculator.applySurchargeRate(
        result.exposures,
        surchargeRate
      );
      const totalExposures = monthlyExposures * result.termMonths;
      const surchargeParts = BudgetCalculator.describeSurcharge(calcSurcharge);
      const surchargePct = BudgetCalculator.formatSurchargePct(surchargeRate);
      const surchargeCopy =
        surchargeRate > 0
          ? '할증 ' + surchargePct + (surchargeParts.length ? ' · ' + surchargeParts.join(' + ') : '')
          : '할증 미적용 · 기본 단가 기준';

      syncSliderBounds();

      if (budgetInput) {
        budgetInput.value = String(result.budgetManwon);
        budgetInput.setAttribute('aria-valuenow', String(result.budgetManwon));
      }
      if (budgetLabel) {
        budgetLabel.textContent = BudgetCalculator.formatManwon(result.budgetManwon, calcProduct);
      }
      if (termInput) {
        termInput.value = String(result.termMonths);
        termInput.setAttribute('aria-valuenow', String(result.termMonths));
      }
      if (termLabel) {
        termLabel.textContent = BudgetCalculator.formatTermMonths(result.termMonths);
      }
      if (metaBudget) {
        metaBudget.textContent = BudgetCalculator.formatManwon(result.budgetManwon, calcProduct);
      }
      if (metaTerm) {
        metaTerm.textContent = BudgetCalculator.formatTermMonths(result.termMonths);
      }
      if (resultSub) {
        resultSub.textContent =
          result.productLabel +
          ' · 월 ' +
          BudgetCalculator.formatManwon(result.budgetManwon, calcProduct) +
          ' · ' +
          BudgetCalculator.formatTermMonths(result.termMonths);
      }
      if (totalSub) {
        totalSub.textContent =
          BudgetCalculator.formatTermMonths(result.termMonths) +
          ' · 총 ' +
          result.totalBudgetManwon.toLocaleString('ko-KR') +
          '만원';
      }
      if (surchargeLine) surchargeLine.textContent = surchargeCopy;
      if (surchargeTotalEl) surchargeTotalEl.textContent = surchargePct;
      if (surchargeNoteEl) surchargeNoteEl.textContent = surchargeCopy;
      if (calcBonus) {
        const hasBonus = !!result.bonus;
        calcBonus.hidden = !hasBonus;
        if (hasBonus && calcBonusText) calcBonusText.textContent = result.bonus;
      }
      if (resultNum) resultNum.classList.add('is-updating');
      if (totalExposuresEl) {
        totalExposuresEl.textContent = BudgetCalculator.formatExposures(totalExposures);
      }
      if (exposuresEl) {
        exposuresEl.textContent = BudgetCalculator.formatExposures(monthlyExposures);
      }
      window.requestAnimationFrame(() => {
        if (resultNum) resultNum.classList.remove('is-updating');
      });
      updateSliderFill();
    }

    regionBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-calc-region');
        calcSurcharge.region = id ? id : null;
        regionBtns.forEach((b) => {
          const on = b === btn;
          b.classList.toggle('calc-surcharge__chip--active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        renderCalculator();
      });
    });

    surchargeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-calc-surcharge');
        if (!key || !(key in calcSurcharge) || key === 'region') return;
        calcSurcharge[key] = !calcSurcharge[key];
        btn.classList.toggle('calc-surcharge__chip--active', calcSurcharge[key]);
        btn.setAttribute('aria-pressed', calcSurcharge[key] ? 'true' : 'false');
        renderCalculator();
      });
    });

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const id = tab.getAttribute('data-calc-product');
        if (!id) return;
        calcProduct = id;
        tabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle('ad-calc__tab--active', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        // clamp budget to product min (e.g. 3사 → 200만)
        calcBudget = BudgetCalculator.clampBudgetManwon(calcBudget, calcProduct);
        renderCalculator();
      });
    });

    if (budgetInput) {
      budgetInput.addEventListener('input', () => {
        calcBudget = BudgetCalculator.clampBudgetManwon(budgetInput.value, calcProduct);
        renderCalculator();
      });
    }

    if (termInput) {
      termInput.addEventListener('input', () => {
        calcTerm = BudgetCalculator.clampTermMonths(termInput.value);
        renderCalculator();
      });
    }

    renderCalculator();
  }

  // ---------- IPTV advertising inquiry form ----------
  const inquiryForm = document.getElementById('inquiryForm');
  const inquiryPhone = document.getElementById('inquiryPhone');
  const inquiryStatus = document.getElementById('inquiryStatus');
  const inquirySteps = inquiryForm
    ? Array.from(inquiryForm.querySelectorAll('[data-inquiry-step]'))
    : [];
  const inquiryPrev = document.getElementById('inquiryPrev');
  const inquiryNext = document.getElementById('inquiryNext');
  const inquirySubmit = document.getElementById('inquirySubmit');
  const inquiryProgress = document.getElementById('inquiryProgress');
  const inquiryProgressFill = document.getElementById('inquiryProgressFill');
  const inquiryStepCount = document.getElementById('inquiryStepCount');
  const inquiryActions = document.getElementById('inquiryActions');
  const inquirySuccess = document.getElementById('inquirySuccess');
  const inquiryRestart = document.getElementById('inquiryRestart');
  const inquiryFallback = document.getElementById('inquiryFallback');
  const inquiryRetry = document.getElementById('inquiryRetry');
  const inquiryMailFallback = document.getElementById('inquiryMailFallback');
  const inquiryTopbar = inquiryForm?.querySelector('.inquiry-wizard__topbar');
  const inquiryMediaInputs = inquiryForm
    ? Array.from(inquiryForm.querySelectorAll('input[name="희망 매체"]'))
    : [];
  let inquiryStep = 0;
  let inquirySending = false;

  if (inquiryPhone) {
    inquiryPhone.addEventListener('input', () => {
      const digits = inquiryPhone.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length <= 3) {
        inquiryPhone.value = digits;
      } else if (digits.length <= 7) {
        inquiryPhone.value = digits.replace(/(\d{3})(\d+)/, '$1-$2');
      } else {
        inquiryPhone.value = digits.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
      }
    });
  }

  const renderInquiryStep = (shouldFocus = false) => {
    if (!inquirySteps.length) return;

    inquirySteps.forEach((step, index) => {
      const isCurrent = index === inquiryStep;
      step.hidden = !isCurrent;
      step.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');
    });

    const currentNumber = inquiryStep + 1;
    const total = inquirySteps.length;
    if (inquiryPrev) inquiryPrev.hidden = inquiryStep === 0;
    if (inquiryNext) inquiryNext.hidden = inquiryStep === total - 1;
    if (inquirySubmit) inquirySubmit.hidden = inquiryStep !== total - 1;
    if (inquiryProgress) inquiryProgress.setAttribute('aria-valuenow', String(currentNumber));
    if (inquiryProgressFill) inquiryProgressFill.style.width = `${(currentNumber / total) * 100}%`;
    if (inquiryStepCount) {
      inquiryStepCount.textContent = `${String(currentNumber).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }
    if (inquiryStatus) {
      inquiryStatus.textContent = '';
      inquiryStatus.className = 'inquiry-form__status';
    }
    if (inquiryFallback) inquiryFallback.hidden = true;

    if (shouldFocus) {
      const focusTarget = inquirySteps[inquiryStep].querySelector('input, textarea, button');
      focusTarget?.focus({ preventScroll: true });
    }
  };

  const validateInquiryStep = () => {
    const currentPanel = inquirySteps[inquiryStep];
    if (!currentPanel) return true;

    const invalidField = Array.from(
      currentPanel.querySelectorAll('input, textarea, select')
    ).find((field) => !field.checkValidity());

    if (invalidField) {
      invalidField.reportValidity();
      invalidField.focus({ preventScroll: true });
      return false;
    }

    if (currentPanel.querySelector('input[name="희망 매체"]')) {
      const checkedMedia = inquiryForm.querySelectorAll('input[name="희망 매체"]:checked');
      if (!checkedMedia.length) {
        inquiryStatus.textContent = '희망 매체를 한 가지 이상 선택해 주세요.';
        inquiryStatus.className = 'inquiry-form__status inquiry-form__status--error';
        inquiryForm.querySelector('input[name="희망 매체"]')?.focus({ preventScroll: true });
        return false;
      }
    }

    return true;
  };

  if (inquiryNext) {
    inquiryNext.addEventListener('click', () => {
      if (!validateInquiryStep()) return;
      inquiryStep = Math.min(inquiryStep + 1, inquirySteps.length - 1);
      renderInquiryStep(true);
    });
  }

  if (inquiryPrev) {
    inquiryPrev.addEventListener('click', () => {
      inquiryStep = Math.max(inquiryStep - 1, 0);
      renderInquiryStep(true);
    });
  }

  inquiryMediaInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      if (input.value === '협의 필요') {
        inquiryMediaInputs.forEach((media) => {
          if (media !== input) media.checked = false;
        });
      } else {
        const fallbackMedia = inquiryMediaInputs.find((media) => media.value === '협의 필요');
        if (fallbackMedia) fallbackMedia.checked = false;
      }
    });
  });

  if (inquiryForm && inquiryStatus) {
    const showInquirySuccess = () => {
      inquirySteps.forEach((step) => { step.hidden = true; });
      if (inquiryTopbar) inquiryTopbar.hidden = true;
      if (inquiryActions) inquiryActions.hidden = true;
      if (inquiryFallback) inquiryFallback.hidden = true;
      inquiryStatus.textContent = '';
      if (inquirySuccess) inquirySuccess.hidden = false;
    };

    const waitForInquiryRetry = (ms) => new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });

    const buildInquiryPayload = () => {
      const payload = {};
      new FormData(inquiryForm).forEach((value, key) => {
        if (!(key in payload)) payload[key] = value;
      });

      const checkedMedia = Array.from(
        inquiryForm.querySelectorAll('input[name="희망 매체"]:checked')
      );
      const checkedTargeting = Array.from(
        inquiryForm.querySelectorAll('input[name="희망 타겟팅"]:checked')
      );
      const monthlyBudget = inquiryForm.querySelector('input[name="월 예산"]');

      payload['희망 매체'] = checkedMedia.map((input) => input.value).join(', ');
      payload['희망 타겟팅'] = checkedTargeting.length
        ? checkedTargeting.map((input) => input.value).join(', ')
        : '선택 안 함';
      payload['월 예산'] = `${monthlyBudget.value}만원`;
      payload['접수 페이지'] = `${window.location.origin}${window.location.pathname}#contact`;
      return payload;
    };

    const buildInquiryMailto = (payload) => {
      const excludedKeys = new Set(['access_key', 'subject', 'from_name', 'botcheck']);
      const lines = Object.entries(payload)
        .filter(([key]) => !excludedKeys.has(key))
        .map(([key, value]) => `${key}: ${value || '-'}`);
      const subject = payload.subject || '[IPTV 광고 상담] 홈페이지 신규 문의';
      return `mailto:mkt@openxgroup.co.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    };

    const sendInquiryWithRetry = async (payload) => {
      const retryDelays = [0, 1200, 2800];
      let lastError;

      for (let attempt = 0; attempt < retryDelays.length; attempt += 1) {
        if (retryDelays[attempt]) await waitForInquiryRetry(retryDelays[attempt]);
        if (attempt > 0) {
          inquiryStatus.textContent = `전송 서버에 다시 연결하고 있습니다. (${attempt + 1}/${retryDelays.length})`;
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 10000);
        try {
          const response = await fetch(inquiryForm.action, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok || result.success !== true) {
            throw new Error(result.message || `전송 서버 오류 (${response.status})`);
          }
          return result;
        } catch (error) {
          lastError = error;
        } finally {
          window.clearTimeout(timeoutId);
        }
      }

      throw lastError || new Error('전송 서버에 연결할 수 없습니다.');
    };

    const finishInquirySending = () => {
      inquirySending = false;
      if (inquirySubmit) inquirySubmit.disabled = false;
      inquiryForm.classList.remove('is-submitting');
    };

    const showInquiryFallback = (payload) => {
      finishInquirySending();
      inquiryStatus.textContent = '현재 전송 서버가 응답하지 않습니다. 잠시 후 다시 시도하거나 이메일로 보내주세요.';
      inquiryStatus.className = 'inquiry-form__status inquiry-form__status--error';
      if (inquiryMailFallback) inquiryMailFallback.href = buildInquiryMailto(payload);
      if (inquiryFallback) inquiryFallback.hidden = false;
    };

    inquiryForm.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || event.target.tagName === 'TEXTAREA') return;
      event.preventDefault();
      if (inquiryStep === inquirySteps.length - 1) {
        inquirySubmit?.click();
      } else {
        inquiryNext?.click();
      }
    });

    inquiryForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (inquiryStep !== inquirySteps.length - 1) {
        if (validateInquiryStep()) {
          inquiryStep = Math.min(inquiryStep + 1, inquirySteps.length - 1);
          renderInquiryStep(true);
        }
        return;
      }

      if (!validateInquiryStep()) return;

      if (inquirySending) return;

      const checkedMedia = Array.from(
        inquiryForm.querySelectorAll('input[name="희망 매체"]:checked')
      );

      if (!checkedMedia.length) {
        inquiryStep = inquirySteps.findIndex((step) =>
          step.querySelector('input[name="희망 매체"]')
        );
        if (inquiryStep < 0) inquiryStep = inquirySteps.length - 1;
        renderInquiryStep();
        inquiryStatus.textContent = '희망 매체를 한 가지 이상 선택해 주세요.';
        inquiryStatus.className = 'inquiry-form__status inquiry-form__status--error';
        inquiryForm.querySelector('input[name="희망 매체"]')?.focus({ preventScroll: true });
        return;
      }

      const payload = buildInquiryPayload();
      inquirySending = true;
      inquirySubmit.disabled = true;
      inquiryForm.classList.add('is-submitting');
      if (inquiryFallback) inquiryFallback.hidden = true;
      inquiryStatus.textContent = '상담 신청을 전송하고 있습니다.';
      inquiryStatus.className = 'inquiry-form__status';

      try {
        await sendInquiryWithRetry(payload);
        finishInquirySending();
        showInquirySuccess();
      } catch (error) {
        showInquiryFallback(payload);
      }
    });

    inquiryRetry?.addEventListener('click', () => {
      if (inquirySending) return;
      inquiryForm.requestSubmit();
    });

    inquiryRestart?.addEventListener('click', () => {
      inquiryForm.reset();
      const fallbackMedia = inquiryForm.querySelector('input[value="협의 필요"]');
      if (fallbackMedia) fallbackMedia.checked = true;
      inquiryStep = 0;
      inquirySuccess.hidden = true;
      if (inquiryFallback) inquiryFallback.hidden = true;
      if (inquiryTopbar) inquiryTopbar.hidden = false;
      if (inquiryActions) inquiryActions.hidden = false;
      renderInquiryStep(true);
    });

    const submitted = new URLSearchParams(window.location.search).get('submitted') === '1';
    if (submitted) {
      showInquirySuccess();
      window.history.replaceState(null, '', `${window.location.pathname}#contact`);
    } else {
      renderInquiryStep();
    }

    window.addEventListener('pageshow', () => {
      inquirySending = false;
      if (inquirySubmit) inquirySubmit.disabled = false;
      inquiryForm.classList.remove('is-submitting');
    });
  }
})();
