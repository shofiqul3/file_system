// ===== HEADER SCROLL HIDE/SHOW =====
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('header-hidden');
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 50) {
        // Scrolling down - hide header
        header.classList.add('header-hidden');
    } else if (currentScroll < lastScroll) {
        // Scrolling up - show header
        header.classList.remove('header-hidden');
    }
    
    lastScroll = currentScroll;
});

// ===== 3-DOT MENU TOGGLE =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('active');

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

mobileOverlay.addEventListener('click', closeMenu);

// Close on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        setTimeout(closeMenu, 300);
    });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

function openMenu() {
    menuBtn.classList.add('active');
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== SMOOTH SCROLL (adjusted for fixed header) =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = 50;
            const position = target.offsetTop - headerHeight;
            window.scrollTo({ top: position, behavior: 'smooth' });
            
            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        }
    });
});

// ===== GITHUB PROJECTS - AUTO LOAD =====
async function loadGitHubProjects() {
    const grid = document.getElementById('projectsGrid');
    const username = 'shofiqul3';

    // Repos to hide
    const hiddenRepos = ['shofiqul3.github.io', 'file_system', 'website', 'MyGallery'];

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

        if (!response.ok) throw new Error('Failed to fetch');

        const repos = await response.json();

        // Filter out hidden repos
        const filteredRepos = repos.filter(repo => !hiddenRepos.includes(repo.name));

        if (filteredRepos.length === 0) {
            grid.innerHTML = '<p class="loading">No public repositories found.</p>';
            return;
        }

        grid.innerHTML = '';

        filteredRepos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const langColor = getLangColor(repo.language);

            card.innerHTML = `
                <h3><i class="fas fa-folder"></i> ${repo.name}</h3>
                <p>${repo.description || 'No description available.'}</p>
                <div class="project-stats">
                    ${repo.language ? `
                        <span>
                            <span class="lang-dot" style="background:${langColor}"></span>
                            ${repo.language}
                        </span>
                    ` : ''}
                    <span><i class="far fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                </div>
                <a href="${repo.html_url}" target="_blank">
                    View on GitHub <i class="fas fa-external-link-alt"></i>
                </a>
            `;

            grid.appendChild(card);
        });

    } catch (error) {
        grid.innerHTML = '<p class="loading">Could not load projects. Please try again later.</p>';
        console.error('GitHub API error:', error);
    }
}

// Language colors
function getLangColor(lang) {
    const colors = {
        'JavaScript': '#f1e05a',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#3178c6',
        'PHP': '#4F5D95',
        'C++': '#f34b7d',
        'C': '#555555',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
    };
    return colors[lang] || '#78716c';
}

// Load on page ready
loadGitHubProjects();
