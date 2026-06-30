// Handle bfcache (Back-Forward Cache) to restore page state if user clicks 'Back'
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        document.body.classList.remove('page-exit');
        document.body.classList.add('page-loaded');
    }

    // --- Load Pembina Data for Home Page ---
    const pembinaHome = document.getElementById('pembina-home');
    if (pembinaHome && typeof DATA_PENGURUS !== 'undefined') {
        const pembinaData = DATA_PENGURUS.inti && DATA_PENGURUS.inti.length > 0 ? DATA_PENGURUS.inti[0] : null;
        if (pembinaData) {
            document.getElementById('home-pembina-nama').textContent = pembinaData.nama || 'Nama Pembina';
            if (pembinaData.motto) {
                document.getElementById('home-pembina-motto').textContent = '"' + pembinaData.motto + '"';
            }
            
            // Resolve image path
            const fotoFile = pembinaData.foto || "left-man.webp";
            let fotoPath = fotoFile;
            if (!fotoFile.includes("/")) {
                if (fotoFile === "left-man.webp" || fotoFile === "right-man.webp") {
                    fotoPath = `./global/assets/assets global/${fotoFile}`;
                } else {
                    fotoPath = `./global/assets/assets struktur/inti/${fotoFile}`;
                }
            }
            document.getElementById('home-pembina-img').src = fotoPath;
        }
    }


    
    // --- Load Data Ketua OSIS for Home Page ---
    if (typeof DATA_PENGURUS !== 'undefined' && document.getElementById('home-ketua-img')) {
        const ketuaData = DATA_PENGURUS.inti.find(p => p.jabatan === "Ketua OSIS");
        if (ketuaData) {
            const nameEl = document.getElementById('home-ketua-nama');
            if (nameEl && ketuaData.nama) nameEl.textContent = ketuaData.nama;
            
            const pesanEl = document.getElementById('home-ketua-pesan');
            if (pesanEl && ketuaData.motto) {
                pesanEl.textContent = '"' + ketuaData.motto + '"';
            }
            
            const fotoFile = ketuaData.foto || "left-man.webp";
            let fotoPath = fotoFile;
            if (!fotoFile.includes("/")) {
                if (fotoFile === "right-man.webp" || fotoFile === "left-man.webp" || fotoFile === "Logo Osis.webp") {
                    fotoPath = "./global/assets/assets global/" + fotoFile;
                } else {
                    fotoPath = "./global/assets/assets struktur/inti/" + fotoFile;
                }
            }
            document.getElementById('home-ketua-img').src = fotoPath;
        }
    }

    // --- Load Berita Terbaru for Home Page ---
    const beritaHomeGrid = document.getElementById('berita-home-grid');
    if (beritaHomeGrid) {
        fetch('./kegiatan/db/beritasekolah-data.json')
            .then(response => response.json())
            .then(data => {
                // Get first 3 items
                const latest = data.slice(0, 3);
                let html = '';
                latest.forEach((item, index) => {
                    // Shorten caption to make them curious
                    const shortCaption = item.caption.length > 100 ? item.caption.substring(0, 100) + '...' : item.caption;
                    
                    // Generate Instagram Embed URL
                    let embedUrl = item.link;
                    if (embedUrl && !embedUrl.includes('/embed')) {
                        embedUrl = embedUrl.endsWith('/') ? embedUrl + 'embed/' : embedUrl + '/embed/';
                    }
                    
                    html += `
                    <div class="news-card reveal">
                        <div class="news-img-wrapper">
                            <iframe src="${embedUrl}" allowtransparency="true" allow="encrypted-media" scrolling="no" frameborder="0" loading="lazy" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></iframe>
                        </div>
                        <div class="news-content">
                            <div class="news-date">${item.date}</div>
                            <h3 class="news-title">${item.title}</h3>
                            <p class="news-excerpt">${shortCaption}</p>
                            <a href="${item.link}" target="_blank" class="news-read-more">Baca Selengkapnya <span>&rarr;</span></a>
                        </div>
                    </div>
                    `;
                });
                beritaHomeGrid.innerHTML = html;
                
                // Re-trigger scroll reveal for newly added elements
                setTimeout(() => {
                    document.querySelectorAll('.news-card.reveal').forEach(el => {
                        if (typeof revealObserver !== 'undefined') {
                            revealObserver.observe(el);
                        } else {
                            // Fallback if observer is not available
                            el.classList.add('active');
                        }
                    });
                }, 100);
            })
            .catch(err => {
                console.error('Error loading news:', err);
                beritaHomeGrid.innerHTML = '<p style="text-align:center; color: var(--gray-light);">Gagal memuat berita terbaru.</p>';
            });
    }

});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Trigger Page Fade-in on Load
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 50);

    // Dynamic Footer Loading
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        // Determine base path from the script tag that loaded global.js
        const scripts = document.getElementsByTagName('script');
        let basePath = './';
        for (let s of scripts) {
            const src = s.getAttribute('src');
            if (src && src.includes('global/js/global.js')) {
                basePath = src.replace('global/js/global.js', '');
                break;
            }
        }
        
        if (basePath === '') basePath = './';

        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerUrl = basePath + 'layout/header.html';
            fetch(headerUrl + '?v=' + new Date().getTime())
                .then(response => {
                    if (!response.ok) throw new Error('Header fetch failed');
                    return response.text();
                })
                .then(html => {
                    const resolvedHtml = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
                    headerPlaceholder.innerHTML = resolvedHtml;
                    
                    // Highlight active link
                    const currentPath = window.location.pathname;
                    const links = headerPlaceholder.querySelectorAll('.nav-links a');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href !== '#' && currentPath.includes(href.replace(basePath, ''))) {
                            // Remove active from all others just in case, but usually not needed
                            links.forEach(l => l.classList.remove('active'));
                            link.classList.add('active');
                        }
                    });

                    // Re-init navbar scroll effect
                    const navbar = document.querySelector('.navbar');
                    if (navbar) {
                        const handleScroll = () => {
                            if (window.scrollY > 20) {
                                navbar.classList.add('navbar-scrolled');
                            } else {
                                navbar.classList.remove('navbar-scrolled');
                            }
                        };
                        handleScroll();
                        window.addEventListener('scroll', handleScroll, { passive: true });
                    }

                    // Mobile Menu Toggle
                    const mobileBtn = headerPlaceholder.querySelector('.mobile-menu-btn');
                    const navContainer = headerPlaceholder.querySelector('.nav-links');
                    
                    if (mobileBtn && navContainer) {
                        mobileBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            mobileBtn.classList.toggle('active');
                            navContainer.classList.toggle('active');
                        });
                        
                        // Close menu when clicking outside
                        document.addEventListener('click', (e) => {
                            if (!navContainer.contains(e.target) && !mobileBtn.contains(e.target) && navContainer.classList.contains('active')) {
                                mobileBtn.classList.remove('active');
                                navContainer.classList.remove('active');
                            }
                        });
                        
                        // Handle mobile dropdown toggles
                        const dropdowns = navContainer.querySelectorAll('.dropdown > a');
                        dropdowns.forEach(drop => {
                            drop.addEventListener('click', (e) => {
                                if (window.innerWidth <= 992) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const parentLi = drop.parentElement;
                                    // Toggle this dropdown
                                    parentLi.classList.toggle('active');
                                }
                            });
                        });
                    }
                })
                .catch(error => console.error('Error loading header:', error));
        }

        const footerUrl = basePath + 'layout/footer.html';

        fetch(footerUrl + '?v=' + new Date().getTime())
            .then(response => {
                if (!response.ok) throw new Error('Footer fetch failed');
                return response.text();
            })
            .then(html => {
                // Replace {{BASE_PATH}} with the actual relative path to root
                const resolvedHtml = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
                footerPlaceholder.innerHTML = resolvedHtml;
                
                // Re-observe new elements inside the loaded footer for scroll animations
                const newRevealElements = footerPlaceholder.querySelectorAll('.reveal, .reveal-stagger');
                newRevealElements.forEach(el => revealObserver.observe(el));
            })
            .catch(error => console.error('Error loading footer:', error));
    }

    // 2. Intercept links for Page Fade-out transition
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            
            // Ignore anchors on the same page or external/empty links
            if (target.startsWith('#') || target.startsWith('mailto:') || this.getAttribute('target') === '_blank' || target === '') {
                return;
            }
            
            e.preventDefault();
            
            document.body.classList.remove('page-loaded');
            document.body.classList.add('page-exit');
            
            // Wait for transition to finish
            setTimeout(() => {
                window.location.href = target;
            }, 500);
        });
    });

    // Tab switching logic for MPK pages and other places with tabs
    const tabContainers = document.querySelectorAll('.tabs-container');
    
    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-btn');
        const contents = container.querySelectorAll('.tab-content');
        
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents in this container
                buttons.forEach(b => b.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                if(contents[index]) {
                    contents[index].classList.add('active');
                }
            });
        });
    });

    // Scroll Reveal Observer
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing after reveal
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15
    });

    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    revealElements.forEach(el => revealObserver.observe(el));

    });
