// Language-aware labels for the shared UI; no account or course state here.
window.DTSSharedUI = {
  translate(locale) {
    const ko = locale === 'ko';
    const summary = document.querySelector('.topbar-more > summary');
    if (summary) {
      const label = ko ? '추가 설정' : 'More settings';
      summary.textContent = ko ? '추가 설정' : 'More';
      summary.setAttribute('aria-label', label);
      summary.title = label;
    }
  },
  enhance(locale) {
    this.translate(locale);
    this.addContextHelp(locale);
    const icons = {teacher: 'school', student: 'person', it: 'terminal', administrator: 'corporate_fare'};
    document.querySelectorAll('#stakeholder-pills button[data-pill]').forEach(button => {
      if (!button.querySelector('.ui-control-label')) {
        const label = document.createElement('span');
        label.className = 'ui-control-label';
        label.textContent = button.textContent.trim();
        const icon = document.createElement('span');
        icon.className = 'material-symbols-outlined';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = icons[button.dataset.pill];
        button.replaceChildren(icon, label);
      }
      button.setAttribute('aria-label', button.querySelector('.ui-control-label').textContent);
      button.setAttribute('aria-pressed', String(button.classList.contains('token-active')));
    });
    document.querySelectorAll('#stakeholder-pills button, #map-dock button, #density-toggle-btn, #map-focus-btn, #map-mode-btn').forEach(button => {
      const label = button.title || button.getAttribute('aria-label');
      if (!label) return;
      button.dataset.uiTooltip = label;
      button.setAttribute('aria-label', label);
      button.removeAttribute('title');
    });
    // A tooltip opened on pointerdown keeps the pre-click text; refresh it now
    // that the button's label has changed (stale "목록으로 보기", R8-R11).
    this.refreshTooltip?.();
    if (this.initialized) return;
    this.initialized = true;
    const tooltip = document.createElement('div');
    tooltip.id = 'dts-ui-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.hidden = true;
    document.body.append(tooltip);
    let active;
    const hide = () => {
      if (active) {
        const ids = (active.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== tooltip.id);
        if (ids.length) active.setAttribute('aria-describedby', ids.join(' '));
        else active.removeAttribute('aria-describedby');
      }
      active = null;
      tooltip.hidden = true;
    };
    const show = button => {
      hide();
      active = button;
      tooltip.textContent = button.dataset.uiTooltip;
      tooltip.hidden = false;
      button.setAttribute('aria-describedby', [button.getAttribute('aria-describedby'), tooltip.id].filter(Boolean).join(' '));
      const box = button.getBoundingClientRect();
      const tip = tooltip.getBoundingClientRect();
      tooltip.style.left = `${Math.max(12, Math.min(innerWidth - tip.width - 12, box.left + (box.width - tip.width) / 2))}px`;
      tooltip.style.top = `${Math.max(12, Math.min(innerHeight - tip.height - 12, box.top >= tip.height + 20 ? box.top - tip.height - 8 : box.bottom + 8))}px`;
    };
    this.refreshTooltip = () => { if (active && !tooltip.hidden) tooltip.textContent = active.dataset.uiTooltip; };
    const target = event => event.target.closest?.('[data-ui-tooltip]');
    document.addEventListener('pointerover', event => { const button = target(event); if (button) show(button); });
    document.addEventListener('pointerout', event => { if (active && !active.contains(event.relatedTarget)) hide(); });
    document.addEventListener('focusin', event => { const button = target(event); if (button) show(button); else hide(); });
    document.addEventListener('focusout', hide);
    // Touch keeps the normal action and exposes the same description until the next tap.
    document.addEventListener('pointerdown', event => { const button = target(event); if (button) show(button); else hide(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
    window.addEventListener('resize', hide);
    document.addEventListener('scroll', hide, true);
  },
  addContextHelp(locale) {
    const ko = locale === 'ko';
    const items = [
      {key:'map', anchors:'.network-stage', inside:true,
        title:ko?'맵 읽는 법':'How to read the map',
        body:ko?'점을 선택하면 쟁점의 내용을 읽을 수 있어요. 선은 사례에 설정된 관계를 나타내며, 영향의 크기나 인과관계를 확정하는 표시는 아니에요. 작은 배지는 AI·나·동료처럼 사례 설명이 아닌 곳에서 나온 내용을 표시해요. 배지가 없으면 사례 설명에서 나온 쟁점이에요.':'Select a point to read an issue. Lines show relationships configured in the case, not proven causation or impact size. Small badges mark content from AI, you, or a peer; nodes without a badge come from the case brief.'},
      {key:'evidence', anchors:'.reflection-citations > legend',
        title:ko?'근거는 어떻게 고르나요?':'How do I choose evidence?',
        body:ko?'내 선택의 이유를 설명하는 데 도움이 되는 쟁점을 고르세요. 선택한 쟁점이 답변의 근거로 연결됩니다. 많이 고르는 것보다, 그 쟁점이 내 주장과 어떻게 연결되는지 쓰는 것이 중요해요.':'Choose issues that help explain your decision. Selected issues are linked to your response as evidence. Explain how they support your reasoning; selecting more is not the goal.'},
      {key:'metrics', anchors:'.ux-rubric-details > summary',
        title:ko?'이 지표는 점수인가요?':'Are these indicators grades?',
        body:ko?'아니요. 설계를 돌아보도록 돕는 참고 지표이며 성적이나 학습 능력 평가가 아닙니다. 숫자에 마우스를 올리거나 키보드로 선택하면 해당 지표의 설명을 볼 수 있어요. 숫자만으로 좋은 설계인지 판단하지 마세요.':'No. These are reflective design indicators, not grades or assessments of learning ability. Hover over a number or focus it with the keyboard for its explanation. Do not judge design quality from the numbers alone.'}
    ];
    for (const item of items) document.querySelectorAll(item.anchors).forEach(anchor => {
      let help = item.inside ? anchor.querySelector(':scope > details[data-context-help]') : item.before ? anchor.previousElementSibling : anchor.nextElementSibling;
      if (!help?.matches(`details[data-context-help="${item.key}"]`)) {
        help = document.createElement('details');
        help.className = 'dts-context-help';
        help.dataset.contextHelp = item.key;
        const summary = document.createElement('summary');
        const icon = document.createElement('span');
        icon.className = 'material-symbols-outlined';
        icon.setAttribute('aria-hidden','true');icon.textContent = 'info';
        summary.append(icon, document.createElement('span'));
        help.append(summary, document.createElement('p'));
        help.addEventListener('keydown', event => {
          if(event.key==='Escape' && help.open) { event.stopPropagation();help.open=false;summary.focus(); }
        });
        if(item.inside)anchor.append(help);else if(item.before)anchor.before(help);else anchor.after(help);
      }
      help.querySelector('summary > span:last-child').textContent = item.title;
      help.querySelector('p').textContent = item.body;
    });
  }
};
