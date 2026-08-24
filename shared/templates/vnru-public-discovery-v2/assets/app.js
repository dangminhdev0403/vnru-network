
(()=>{
  const body=document.body;
  document.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===body.dataset.page)a.classList.add('active')});
  document.querySelectorAll('[data-filter-group]').forEach(group=>{
    const buttons=[...group.querySelectorAll('[data-filter]')];
    const target=document.querySelector(group.dataset.target||'');
    if(!target) return;
    const items=[...target.querySelectorAll('[data-type]')];
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      buttons.forEach(b=>b.classList.toggle('active',b===btn));
      const type=btn.dataset.filter;
      items.forEach(item=>item.classList.toggle('is-hidden',type!=='all'&&item.dataset.type!==type));
    }));
  });
  document.querySelectorAll('form[data-search-form]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const input=form.querySelector('input[type="search"],input[type="text"]');
      const q=(input?.value||'').trim();
      const dest=form.dataset.searchForm||'search.html';
      location.href=q?`${dest}?q=${encodeURIComponent(q)}`:dest;
    });
  });
  const params=new URLSearchParams(location.search);
  const q=params.get('q');
  if(q){
    document.querySelectorAll('[data-query-output]').forEach(el=>el.textContent=q);
    document.querySelectorAll('[data-query-input]').forEach(el=>el.value=q);
  }
  document.querySelectorAll('[data-tabset]').forEach(tabset=>{
    const tabs=[...tabset.querySelectorAll('[data-tab]')];
    const panels=[...document.querySelectorAll('[data-tab-panel]')];
    tabs.forEach(tab=>tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.classList.toggle('active',t===tab));
      panels.forEach(p=>p.classList.toggle('is-hidden',p.dataset.tabPanel!==tab.dataset.tab));
    }));
  });
})();
