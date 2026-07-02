const UNIT_CONFIG={inti:{type:"inti",short:"INTI",roman:"INTI",title:"Pengurus Inti OSIS",bannerFoto:"",},sekbid1:{type:"sekbid",short:"SEKBID I",roman:"I",title:"Pembinaan Ketakwaan Terhadap Tuhan Yang Maha Esa",bannerFoto:"",},sekbid2:{type:"sekbid",short:"SEKBID II",roman:"II",title:"Pembinaan Budi Pekerti Luhur Atau Akhlak Mulia",bannerFoto:"",},sekbid3:{type:"sekbid",short:"SEKBID III",roman:"III",title:"Pendidikan Pembinaan Kepribadian Unggul, Wawasan Kebangsaan Dan Bela Negara",bannerFoto:"",},sekbid4:{type:"sekbid",short:"SEKBID IV",roman:"IV",title:"Pembinaan Prestasi Akademik, Seni, Olah Raga Sesuai Dengan Bakat Dan Minat",bannerFoto:"",},sekbid5:{type:"sekbid",short:"SEKBID V",roman:"V",title:"Demokrasi HAM, Pendidikan Politik, Lingkungan Hidup, Kepekaan Dan Toleransi Sosial",bannerFoto:"",},sekbid6:{type:"sekbid",short:"SEKBID VI",roman:"VI",title:"Pembinaan Kreativitas, Ketrampilan Dan Kewirausahaan",bannerFoto:"",},sekbid7:{type:"sekbid",short:"SEKBID VII",roman:"VII",title:"Pembinaan Kualitas Jasmani, Kesehatan Dan Gizi, Yang Berbasis Gizi Yang Terdiverifikasi",bannerFoto:"",},sekbid8:{type:"sekbid",short:"SEKBID VIII",roman:"VIII",title:"Sastra Dan Budaya",bannerFoto:"",},sekbid9:{type:"sekbid",short:"SEKBID IX",roman:"IX",title:"Teknologi Informasi Dan Komunikasi",bannerFoto:"",},sekbid10:{type:"sekbid",short:"SEKBID X",roman:"X",title:"Komunikasi Dengan Berbahasa Inggris",bannerFoto:"",},mpk:{type:"mpk",short:"MPK",roman:"MPK",title:"Majelis Perwakilan Kelas",bannerFoto:"",},};const ROLE_CONFIG={inti:["Pembina","Ketua OSIS","Wakil Ketua OSIS","Sekretaris Umum","Sekretaris I","Bendahara Umum","Bendahara I",],sekbid:["Pembina Bidang","Anggota","Anggota","Anggota"],};function getUnitFromURL(){const params=new URLSearchParams(window.location.search);const unit=params.get("unit");return unit&&UNIT_CONFIG[unit]?unit:"sekbid1"}
function buildUnitStrip(){const currentUnit=getUnitFromURL();const isMpkMode=currentUnit==="mpk";const strip=document.getElementById("unit-strip");const stripWrapper=document.querySelector(".sk-unit-strip");if(isMpkMode){if(stripWrapper)stripWrapper.style.display="none";return}else{if(stripWrapper)stripWrapper.style.display="flex"}
strip.innerHTML="";Object.keys(UNIT_CONFIG).forEach((key)=>{if(key==="mpk")return;const cfg=UNIT_CONFIG[key];const btn=document.createElement("button");btn.className="sk-unit-btn";btn.dataset.unit=key;btn.textContent=cfg.short;btn.setAttribute("aria-label",`${cfg.short} - ${cfg.title}`);btn.addEventListener("click",()=>navigateTo(key));strip.appendChild(btn)})}
function setActiveStrip(unit){document.querySelectorAll(".sk-unit-btn").forEach((btn)=>{btn.classList.toggle("active",btn.dataset.unit===unit)});const activeBtn=document.querySelector(`.sk-unit-btn[data-unit="${unit}"]`);if(activeBtn){activeBtn.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center",})}}
function generateMembersHTML(unitId,type){const dataArr=DATA_PENGURUS[unitId];let html="";if(!dataArr||dataArr.length===0){return'<div style="text-align:center; padding: 50px;">Data pengurus sedang diperbarui.</div>'}
dataArr.forEach((member,index)=>{const isReverse=index%2!==0;const rowClass=isReverse?"reverse":"";const fotoFile=member.foto||"left-man.webp";let fotoPath=fotoFile;if(!fotoFile.includes("/")){if(fotoFile==="left-man.webp"||fotoFile==="right-man.webp"){fotoPath=`https://cdn.jsdelivr.net/gh/IKRafa/Cdn-webosisspensi@main/global/assets/assets%20global/${fotoFile}`}else{const folderName=unitId.replace("sekbid","sekbid ");fotoPath=`https://cdn.jsdelivr.net/gh/IKRafa/Cdn-webosisspensi@main/global/assets/assets%20struktur/${folderName}/${fotoFile}`}}
html+=`
                <div class="sk-member-row ${rowClass} reveal-stagger">
                    <div class="sk-member-photo-col">
                        <img src="${fotoPath}" alt="${member.nama || "Foto Profil"}" loading="lazy" onload="this.classList.add('loaded')">
                        ${member.panggilan ? `<div class="sk-member-nickname">${member.panggilan}</div>` : ""}
                    </div>
                    <div class="sk-member-info-col">
                        <div class="sk-member-role-label">${member.jabatan}</div>
                        <h3 class="sk-member-name-large">${member.nama || "— Belum Diisi —"}</h3>
                        
                        ${member.tugas ? `<p style="color: var(--text-color); font-size: 0.95rem; margin-top: 10px; margin-bottom: 20px; font-style: italic; line-height: 1.5;"><strong>Tugas:</strong>${member.tugas}</p>` : ''}
                        
                        <div class="sk-motto-box">
                            <div class="sk-motto-header">Motto</div>
                            <div class="sk-motto-body">"${member.motto || "Data motto belum tersedia."}"</div>
                        </div>

                        <div class="sk-prestasi-box">
                            <div class="sk-prestasi-header">Prestasi</div>
                            <ul class="sk-prestasi-list">
                                ${Array.isArray(member.prestasi) &&
        member.prestasi.length > 0
        ? member.prestasi
          .map(
            (p) => `<li class="sk-prestasi-item"><div class="sk-prestasi-icon">🏆</div><div class="sk-prestasi-title">${p}</div></li>`,
          )
          .join("")
        : `<li class="sk-prestasi-item"><div class="sk-prestasi-icon">🏆</div><div class="sk-prestasi-title">${member.prestasi||"— Belum Diisi —"}</div></li>`
      }
                            </ul>
                        </div>
                        <a href="${member.link_ig && member.link_ig !== "#" ? member.link_ig : "#"}" class="sk-ig-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            Ikuti Saya
                        </a>
                    </div>
                </div>
            `});return html}
function renderView(unit){const cfg=UNIT_CONFIG[unit];if(!cfg)return;const label=cfg.short;document.getElementById("hero-badge-text").textContent=cfg.type==="inti"?"PENGURUS INTI OSIS":cfg.type==="mpk"?"MAJELIS PERWAKILAN KELAS":`SEKSI BIDANG ${cfg.roman}`;document.getElementById("hero-roman").textContent=cfg.roman;document.getElementById("hero-roman-bg").textContent=cfg.roman;document.getElementById("hero-subtitle").textContent=cfg.title;const heroBg=document.getElementById("sk-hero-bg");if(heroBg&&cfg.bannerFoto){heroBg.style.backgroundImage=`url('${cfg.bannerFoto}')`}
const isMpkMode=cfg.type==="mpk";const parentLink=document.getElementById("bc-parent-link");if(parentLink){if(isMpkMode){parentLink.textContent="MPK";parentLink.href="../struktur/struktur.html?unit=mpk";document.getElementById("breadcrumb-current").textContent="ANGGOTA MPK"}else{parentLink.textContent="SEKBID";parentLink.href="../struktur/struktur.html?unit=sekbid1";document.getElementById("breadcrumb-current").textContent=label}}else{document.getElementById("breadcrumb-current").textContent=label}
document.getElementById("struktur-sekbid-name").textContent=label;document.getElementById("members-container").innerHTML=generateMembersHTML(unit,cfg.type,);const prokerSection=document.getElementById("proker-section");if(prokerSection){prokerSection.style.display=(cfg.type==="inti"||cfg.type==="mpk")?"none":"block";if(cfg.type==="sekbid"){document.getElementById("proker-sekbid-name").textContent=label;const prokerGrid=document.getElementById("proker-grid-container");if(prokerGrid&&typeof DATA_PROKER!=="undefined"){const prokers=DATA_PROKER[unit]||["Program Kerja Belum Ditambahkan"];prokerGrid.innerHTML=prokers.map((proker,idx)=>{const num=String(idx+1).padStart(2,'0');return `
                    <div class="sk-proker-card reveal">
                        <div class="sk-proker-num">${num}</div>
                        <div class="sk-proker-body">
                            <span class="sk-proker-tag">Program Kerja</span>
                            <h3 class="sk-proker-title">${proker}</h3>
                        </div>
                    </div>
                `}).join('')}}}
document.title=`${label} — ${cfg.title} | OSIS SPENSI`;setActiveStrip(unit);const observer=new IntersectionObserver((entries,obs)=>{entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add("active");obs.unobserve(entry.target)}})},{threshold:0.15},);document.querySelectorAll("#members-container .reveal-stagger, .sk-proker-card.reveal").forEach((el)=>{observer.observe(el)})}
let isNavigating=!1;function navigateTo(unit,pushState=!0){if(!UNIT_CONFIG[unit]||isNavigating)return;const currentUnit=getUnitFromURL();if(pushState&&unit===currentUnit)return;isNavigating=!0;const container=document.getElementById("sekbid-container");container.classList.add("fading");setTimeout(()=>{buildUnitStrip();renderView(unit);if(pushState){history.pushState({unit},"",`?unit=${unit}`)}else{history.replaceState({unit},"",`?unit=${unit}`)}
window.scrollTo({top:0,behavior:"smooth"});container.classList.remove("fading");isNavigating=!1},280)}
window.addEventListener("popstate",(e)=>{const unit=e.state?.unit||getUnitFromURL();renderView(unit);setActiveStrip(unit)});function initHeroBg(){const bg=document.getElementById("sk-hero-bg");const img=new Image();img.onload=()=>bg.classList.add("loaded");img.src="https://cdn.jsdelivr.net/gh/IKRafa/Cdn-webosisspensi@main/global/assets/assets%20global/Foto%20seluruh%20Osis.webp"}
document.addEventListener("DOMContentLoaded",()=>{const unit=getUnitFromURL();buildUnitStrip();renderView(unit);history.replaceState({unit},"",`?unit=${unit}`);initHeroBg()})
