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

  // ---------- Targeting surcharge filter ----------
  if (typeof TargetingSurcharge !== 'undefined') {
    const surchargeFilters = document.querySelectorAll('[data-surcharge-filter]');
    const surchargeRows = document.querySelectorAll('.surcharge__row[data-surcharge-cat]');
    const surchargeGrades = document.getElementById('surchargeGrades');

    function applySurchargeFilter(filterId) {
      const id = filterId || 'all';
      surchargeFilters.forEach((btn) => {
        const on = btn.getAttribute('data-surcharge-filter') === id;
        btn.classList.toggle('surcharge__filter--active', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      surchargeRows.forEach((row) => {
        const cat = row.getAttribute('data-surcharge-cat');
        const visible = TargetingSurcharge.isRowVisible(id, cat);
        row.hidden = !visible;
        row.classList.toggle('surcharge__row--hidden', !visible);
      });
      if (surchargeGrades) {
        const show = TargetingSurcharge.shouldShowRegionGrades(id);
        surchargeGrades.hidden = !show;
      }
    }

    surchargeFilters.forEach((btn) => {
      btn.addEventListener('click', () => {
        applySurchargeFilter(btn.getAttribute('data-surcharge-filter'));
      });
    });

    applySurchargeFilter('time');
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
        heroThumb.alt = slide.title + ' AI TV CF 예시 영상 썸네일';
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
        escapeHtml(s.title) +
        ' — 15초 AI TV CF 제작 사례" width="640" height="360" loading="lazy">' +
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
    let calcProduct = 'kt';
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
    const productLabel = document.getElementById('calcProductLabel');
    const unitLabel = document.getElementById('calcUnitLabel');
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

      // 3사: 눈금·슬라이더 시작을 200만부터 (짧은 라벨 — 모바일에서 끝 눈금 잘림 방지)
      const ticks = document.getElementById('calcTicks');
      if (ticks) {
        const labels =
          min >= 200
            ? ['200만', '300만', '400만', '500만']
            : ['100만', '200만', '300만', '400만', '500만'];
        ticks.innerHTML = labels.map((t) => '<span>' + t + '</span>').join('');
        ticks.classList.toggle('ad-calc__ticks--from-200', min >= 200);
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
      if (productLabel) productLabel.textContent = result.productLabel;
      if (unitLabel) unitLabel.textContent = result.unitLabel;
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
})();