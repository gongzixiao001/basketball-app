(() => {
  'use strict';
  const codes=['zh-CN','zh-TW','en','ja'],names=['scoreboard','teams','players','standings','recording','route'];
  let language='zh-CN',dictionary={},release=null,selectedScreen=0;
  const t=key=>dictionary[language]?.[key]??dictionary['zh-CN']?.[key]??key;
  const $=selector=>document.querySelector(selector);
  try{const requested=new URLSearchParams(location.search).get('lang'),saved=localStorage.getItem('courtside-site-language');language=codes.includes(requested)?requested:codes.includes(saved)?saved:'zh-CN';}catch{}
  const read=async path=>{const r=await fetch(path,{cache:'no-cache'});if(!r.ok)throw new Error('Content unavailable: '+path);return r.json();};
  function validRelease(data){
    if(data?.status!=='published'||!data.publishedAt||!data.version||!Number.isFinite(data.sizeBytes)||data.sizeBytes<=0)return false;
    try{const u=new URL(data.apkUrl);return u.protocol==='https:'&&u.hostname==='github.com'&&u.pathname.startsWith('/gongzixiao001/basketball-app/releases/download/')&&u.pathname.endsWith('.apk')&&Number.isFinite(Date.parse(data.publishedAt));}catch{return false;}
  }
  function renderRelease(){
    const available=validRelease(release);
    document.querySelectorAll('[data-apk-download]').forEach(button=>{button.setAttribute('aria-disabled',String(!available));if(available)button.href=release.apkUrl;else button.removeAttribute('href');button.querySelector('[data-download-label]').textContent=t(available?'downloadReady':'downloadPending');});
    document.querySelectorAll('[data-release-status]').forEach(el=>el.textContent=t(available?'publishedNote':el.classList.contains('download-micro')?'pendingShort':'pendingLong'));
    document.querySelectorAll('[data-apk-link]').forEach(link=>{if(available){link.href=release.apkUrl;link.removeAttribute('aria-disabled');}else{link.removeAttribute('href');link.setAttribute('aria-disabled','true');}});
    $('#releaseState').textContent=t(available?'publishedState':'pendingState');
    $('#releaseDate').textContent=available?new Intl.DateTimeFormat(language,{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(release.publishedAt)):t('notPublished');
    if(release){
      $('#releaseVersion').textContent='v'+release.version;
      $('#releaseSize').textContent=new Intl.NumberFormat(language,{maximumFractionDigits:2}).format(release.sizeBytes/1048576)+' MiB';
      $('#checksumValue').textContent=release.sha256||t('notAvailable');
    }
    $('#copyChecksum').disabled=!release?.sha256;
    $('#releasePlatform').textContent='Android 8.0+';
  }
  function renderGallery(){
    const image=$('#galleryImage');image.src='./assets/images/'+names[selectedScreen]+'.webp';image.alt=t('g'+selectedScreen+'Title');image.removeAttribute('width');image.removeAttribute('height');
    $('#galleryCaption').textContent=t('g'+selectedScreen+'Title');
    document.querySelectorAll('[data-screen]').forEach(button=>button.setAttribute('aria-pressed',String(+button.dataset.screen===selectedScreen)));
    if($('#lightbox').open){$('#lightboxTitle').textContent=t('g'+selectedScreen+'Title');$('#lightboxImage').alt=t('g'+selectedScreen+'Title');}
  }
  function setLanguage(code){
    if(!codes.includes(code))return;
    language=code;document.documentElement.lang=code;$('#language').value=code;
    document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
    document.querySelectorAll('[data-i18n-alt]').forEach(el=>el.alt=t(el.dataset.i18nAlt));
    $('#language').setAttribute('aria-label',t('language'));document.title=t('pageTitle');
    document.querySelector('meta[name=description]').content=t('metaDescription');
    document.querySelector('meta[property="og:title"]').content=t('pageTitle');
    document.querySelector('meta[property="og:description"]').content=t('metaDescription');
    try{localStorage.setItem('courtside-site-language',code);}catch{}
    renderGallery();renderRelease();
  }
  function openScreen(index){
    selectedScreen=index;renderGallery();const image=$('#lightboxImage');image.src='./assets/images/'+names[index]+'.webp';image.alt=t('g'+index+'Title');
    $('#lightboxTitle').textContent=t('g'+index+'Title');$('#lightbox').showModal();
  }
  $('#language').addEventListener('change',e=>setLanguage(e.target.value));
  document.querySelectorAll('[data-screen]').forEach(button=>button.addEventListener('click',()=>{selectedScreen=+button.dataset.screen;renderGallery();}));
  document.querySelectorAll('[data-open-screen]').forEach(button=>button.addEventListener('click',()=>openScreen(+button.dataset.openScreen)));
  $('#openGallery').addEventListener('click',()=>openScreen(selectedScreen));
  $('#closeLightbox').addEventListener('click',()=>$('#lightbox').close());
  $('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox')){const r=$('#lightbox').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#lightbox').close();}});
  document.querySelectorAll('[data-apk-download]').forEach(button=>button.addEventListener('click',e=>{if(button.getAttribute('aria-disabled')==='true')e.preventDefault();}));
  $('#copyChecksum').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(release.sha256);$('#copyStatus').textContent=t('copied');$('#copyChecksum').textContent=t('copied');}catch{$('#copyStatus').textContent=t('copyFailed');$('#copyChecksum').textContent=t('copyFailed');}});
  async function mountVideo(){
    try{const config=await read('./data/site.json');if(!config.video?.src)return;const url=new URL(config.video.src,location.href);if(!['https:','http:'].includes(url.protocol))return;
      const video=document.createElement('video');video.controls=true;video.preload='none';video.playsInline=true;video.src=url.href;video.setAttribute('aria-label',t('demoTitle'));if(config.video.poster)video.poster=config.video.poster;$('#videoMount').replaceWith(video);
    }catch{/* An empty video slot stays explicitly unavailable. */}
  }
  Promise.all([read('./data/i18n.json'),read('./data/release.json')]).then(([translations,data])=>{
    dictionary=translations;release=data;setLanguage(language);mountVideo();document.documentElement.dataset.ready='true';
    if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('enter');observer.unobserve(entry.target);}}),{threshold:.05});
      document.querySelectorAll('.feature-grid article,.record-note,.section-heading').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal','enter');observer.observe(el);}});
    }
  }).catch(()=>{document.documentElement.dataset.ready='error';$('#copyChecksum').disabled=true;});
})();
