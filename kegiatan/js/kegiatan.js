document.addEventListener('DOMContentLoaded',()=>{const CONFIG={beritaSekolah:{title:'Berita Sekolah',subtitle:'Informasi dan berita terkini dari SMPN 7 Mengwi',badge:'SMPN 7 Mengwi',dataFile:'./db/beritasekolah-data.json',igAccount:'smpn7mengwi'},beritaOsis:{title:'Berita Osis',subtitle:'Kumpulan kegiatan dan event terbaru dari OSIS SPENSI di SMPN 7 Mengwi',badge:'OSIS SPENSI',dataFile:'./db/beritaosis-data.json',igAccount:'osisspensi_'}};const params=new URLSearchParams(window.location.search);let currentType=params.get('type')==='beritaOsis'?'beritaOsis':'beritaSekolah';const heroTitle=document.getElementById('hero-title');const heroSubtitle=document.getElementById('hero-subtitle');const heroBadge=document.getElementById('hero-badge-text');const listContainer=document.getElementById('kegiatan-list');const tabBeritaOsis=document.getElementById('tab-beritaosis');const tabBeritaSekolah=document.getElementById('tab-beritasekolah');tabBeritaOsis.addEventListener('click',()=>switchTab('beritaOsis'));tabBeritaSekolah.addEventListener('click',()=>switchTab('beritaSekolah'));function switchTab(type){if(type===currentType)return;currentType=type;const url=new URL(window.location);url.searchParams.set('type',type);window.history.pushState({},'',url);tabBeritaOsis.classList.toggle('active',type==='beritaOsis');tabBeritaSekolah.classList.toggle('active',type==='beritaSekolah');document.title=`${CONFIG[type].title} - OSIS SPENSI`;listContainer.style.opacity='0';listContainer.style.transform='translateY(20px)';setTimeout(()=>{updateHero(type);loadData(type)},300)}
function updateHero(type){const config=CONFIG[type];heroTitle.textContent=config.title;heroSubtitle.textContent=config.subtitle;heroBadge.textContent=config.badge}
function loadData(type){const config=CONFIG[type];try{let data=null;if(type==='beritaSekolah'){data=typeof DATA_BERITA_SEKOLAH!=='undefined'?DATA_BERITA_SEKOLAH:null}else{data=typeof DATA_BERITA_OSIS!=='undefined'?DATA_BERITA_OSIS:null}
if(!data)throw new Error('Data is undefined. Make sure data scripts are loaded.');renderItems(data,config.igAccount)}catch(err){console.error('Error loading data:',err);renderEmpty()}}
function renderItems(items,igAccount){if(!items||items.length===0){renderEmpty();return}
listContainer.innerHTML=items.map((item,index)=>{const dateFormatted=formatDate(item.date);const embedUrl=getEmbedUrl(item.reelsUrl||item.link);const isReverse=index%2!==0;return `
                <div class="kegiatan-item ${isReverse ? 'reverse' : ''}" data-index="${index}">
                    <div class="kegiatan-media-col">
                        <div class="skeleton-loader" id="skeleton-${index}"></div>
                        <div class="iframe-placeholder" data-embed-url="${embedUrl}" data-skeleton="skeleton-${index}"></div>
                        <div class="kegiatan-nickname">${dateFormatted}</div>
                    </div>
                    <div class="kegiatan-info-col">
                        <div class="kegiatan-role-label">@${igAccount}</div>
                        <h3 class="kegiatan-name-large">${escapeHtml(item.title)}</h3>
                        
                        <div class="kegiatan-caption-box">
                            <div class="kegiatan-caption-header">Caption Instagram</div>
                            <div class="kegiatan-caption-body">"${escapeHtml(item.caption)}"</div>
                        </div>

                        <a href="${escapeHtml(item.reelsUrl || item.link)}" target="_blank" class="kegiatan-ig-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            Lihat di Instagram
                        </a>
                    </div>
                </div>
            `}).join('');requestAnimationFrame(()=>{listContainer.style.transition='all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';listContainer.style.opacity='1';listContainer.style.transform='translateY(0)'});setupCtaBackground(items);setupScrollReveal();setupLazyLoading()}
function renderEmpty(){listContainer.innerHTML=`
            <div class="kegiatan-empty">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <h3>Belum Ada Data</h3>
                <p>Data kegiatan belum tersedia. Silakan tambahkan data ke file JSON.</p>
            </div>
        `;listContainer.style.opacity='1';listContainer.style.transform='translateY(0)'}
function getEmbedUrl(reelsUrl){if(!reelsUrl)return'';let url=reelsUrl.trim();if(!url.endsWith('/'))url+='/';return url+'embed/'}
function setupLazyLoading(){const placeholders=document.querySelectorAll('.iframe-placeholder');const observer=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){const placeholder=entry.target;const embedUrl=placeholder.getAttribute('data-embed-url');const skeletonId=placeholder.getAttribute('data-skeleton');if(embedUrl&&embedUrl!=='undefined/embed/'){const iframe=document.createElement('iframe');iframe.src=embedUrl;iframe.setAttribute('allowtransparency','true');iframe.setAttribute('allow','encrypted-media');iframe.setAttribute('loading','lazy');iframe.setAttribute('scrolling','no');iframe.style.width='100%';iframe.style.height='100%';iframe.style.border='none';iframe.style.position='absolute';iframe.style.top='0';iframe.style.left='0';iframe.style.overflow='hidden';iframe.addEventListener('load',()=>{const skeleton=document.getElementById(skeletonId);if(skeleton)skeleton.classList.add('loaded');});placeholder.parentElement.style.position='relative';placeholder.replaceWith(iframe)}
observer.unobserve(entry.target)}})},{rootMargin:'200px 0px',threshold:0.01});placeholders.forEach(p=>observer.observe(p))}
function setupScrollReveal(){const items=document.querySelectorAll('.kegiatan-item');const observer=new IntersectionObserver((entries)=>{entries.forEach((entry,idx)=>{if(entry.isIntersecting){const delay=idx*100;setTimeout(()=>{entry.target.classList.add('visible')},delay);observer.unobserve(entry.target)}})},{threshold:0.1,rootMargin:'0px 0px -50px 0px'});items.forEach(item=>observer.observe(item))}
function setupCtaBackground(items){const ctaBgGrid=document.getElementById('cta-bg-grid');if(!ctaBgGrid)return;const top4=[{link:"https://www.instagram.com/reel/DYmqRpEOwhE/"},{link:"https://www.instagram.com/reel/DYi4AhMunu5/"},{link:"https://www.instagram.com/reel/DX9oGDIua2o/"},{link:"https://www.instagram.com/reel/DUc8r2dkdoN/"}];ctaBgGrid.innerHTML=top4.map(item=>{const embedUrl=getEmbedUrl(item.reelsUrl||item.link);if(!embedUrl)return'<div class="cta-bg-item fallback"></div>';return `
                <div class="cta-bg-item">
                    <iframe src="${embedUrl}" allowtransparency="true" scrolling="no" frameborder="0" loading="lazy"></iframe>
                </div>
            `}).join('')}
function formatDate(dateStr){if(!dateStr)return'';const months=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];const date=new Date(dateStr);return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`}
function escapeHtml(str){if(!str)return'';const div=document.createElement('div');div.textContent=str;return div.innerHTML}
window.addEventListener('popstate',()=>{const params=new URLSearchParams(window.location.search);const type=params.get('type')==='beritaSekolah'?'beritaSekolah':'beritaOsis';if(type!==currentType){currentType=type;tabBeritaOsis.classList.toggle('active',type==='beritaOsis');tabBeritaSekolah.classList.toggle('active',type==='beritaSekolah');updateHero(type);loadData(type)}});updateHero(currentType);tabBeritaOsis.classList.toggle('active',currentType==='beritaOsis');tabBeritaSekolah.classList.toggle('active',currentType==='beritaSekolah');document.title=`${CONFIG[currentType].title} - OSIS SPENSI`;loadData(currentType)})
