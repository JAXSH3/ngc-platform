document.addEventListener('DOMContentLoaded', () => {
    const dashboardGrid = document.getElementById('dashboardGrid');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const authButton = document.getElementById('authButton');
    const navRight = document.querySelector('.nav-right'); // Get the container for auth button/profile
    let currentUser = null;

    // Dummy data for content cards
    const dummyData = [
        { id: 1, title: 'Understanding LSTMs', category: 'Research Papers', type: 'research', description: 'A deep dive into Long Short-Term Memory networks.', meta: 'Published: Jan 2024', trending: true, mostUsed: false, premium: false },
        { id: 2, title: 'Project Alpha: Image Recognition', category: 'Projects', type: 'projects', description: 'An open-source project for advanced image classification.', meta: 'Last Update: May 2025', trending: false, mostUsed: true, premium: false },
        { id: 3, title: 'GPT-4 API Tool', category: 'AI Tools', type: 'ai-tools', description: 'A wrapper for easily integrating GPT-4 into applications.', meta: 'Version: 1.2.0', trending: true, mostUsed: true, premium: false },
        { id: 4, title: 'Creative Writing Prompt Set', category: 'Prompts', type: 'prompts', description: '100+ prompts for generating creative stories with AI.', meta: 'Curated: Apr 2025', trending: false, mostUsed: false, premium: true },
        { id: 5, title: 'Diffusion Models Explained', category: 'Research Papers', type: 'research', description: 'Comprehensive overview of diffusion models in generative AI.', meta: 'Published: Mar 2025', trending: true, mostUsed: false, premium: false },
        { id: 6, title: 'AI Ethics Framework', category: 'Projects', type: 'projects', description: 'A community-driven framework for ethical AI development.', meta: 'Last Update: Feb 2025', trending: false, mostUsed: true, premium: false },
        { id: 7, title: 'AutoCode Pro', category: 'AI Tools', type: 'ai-tools', description: 'AI-powered code generation and completion tool.', meta: 'Version: 2.0.1', trending: true, mostUsed: true, premium: true },
        { id: 8, title: 'Marketing Copy Prompts', category: 'Prompts', type: 'prompts', description: 'Effective prompts for generating marketing copy using AI.', meta: 'Curated: May 2025', trending: true, mostUsed: false, premium: false },
        { id: 9, title: 'Federated Learning Insights', category: 'Research Papers', type: 'research', description: 'Exploring the advancements in federated machine learning.', meta: 'Published: Apr 2025', trending: false, mostUsed: false, premium: false },
        { id: 10, title: 'DataViz Suite', category: 'AI Tools', type: 'ai-tools', description: 'A suite of tools for advanced data visualization.', meta: 'Version: 3.1.0', trending: false, mostUsed: true, premium: false },
        { id: 11, title: 'Advanced SEO Prompts (Premium)', category: 'Prompts', type: 'prompts', description: 'Premium prompts for complex SEO strategy generation.', meta: 'Curated: May 2025', trending: true, mostUsed: false, premium: true },
        { id: 12, title: 'Project Chronos: Time Series Forecasting', category: 'Projects', type: 'projects', description: 'A project focused on AI-driven time series analysis.', meta: 'Last Update: May 2025', trending: true, mostUsed: true, premium: false },
    ];

    function renderCards(dataToRender) {
        if (!dashboardGrid) return;
        dashboardGrid.innerHTML = ''; // Clear existing cards
        dataToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = 'content-card';
            card.innerHTML = `
                ${item.premium ? '<span class="premium-badge">Premium</span>' : ''}
                <h3>${item.title}</h3>
                <span class="card-category">${item.category}</span>
                <p>${item.description}</p>
                <span class="card-meta">${item.meta}</span>
            `;
            dashboardGrid.appendChild(card);
        });
    }

    function filterAndSortData() {
        let filteredData = [...dummyData];
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const selectedSort = sortFilter ? sortFilter.value : 'trending';

        // Filter by category
        if (selectedCategory !== 'all') {
            filteredData = filteredData.filter(item => item.type === selectedCategory);
        }

        // Sort data
        if (selectedSort === 'trending') {
            filteredData.sort((a, b) => b.trending - a.trending); // Simple sort, true first
        } else if (selectedSort === 'most-used') {
            filteredData.sort((a, b) => b.mostUsed - a.mostUsed); // Simple sort, true first
        } else if (selectedSort === 'recent') {
            // Assuming IDs or a date field can be used for 'recent'
            // For dummy data, let's sort by ID descending as a proxy
            filteredData.sort((a, b) => b.id - a.id);
        }

        renderCards(filteredData);
    }

    // Initial render
    if (dashboardGrid) filterAndSortData(); // Only if on dashboard page

    // Event listeners for filters
    if (categoryFilter) categoryFilter.addEventListener('change', filterAndSortData);
    if (sortFilter) sortFilter.addEventListener('change', filterAndSortData);

    function updateAuthUI() {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('ngcUser');
        
        if (token && userString) {
            currentUser = JSON.parse(userString);
            if (navRight) {
                navRight.innerHTML = `
                    <span class="user-greeting">Hi, ${currentUser.name.split(' ')[0]}!</span>
                    <img src="${window.location.pathname.includes('/pages/') ? '../assets/profile-icon-placeholder.png' : 'assets/profile-icon-placeholder.png'}" alt="${currentUser.name}" class="profile-icon" id="profileLink">
                    <button class="auth-button" id="logoutButton">Logout</button>
                `;
                // Add event listener for new logout button
                const logoutButton = document.getElementById('logoutButton');
                if (logoutButton) {
                    logoutButton.addEventListener('click', () => {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('ngcUser');
                        currentUser = null;
                        updateAuthUI(); // Re-render auth elements
                        if(window.location.pathname.includes('/pages/') || window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/ngc-platform/') || window.location.pathname.endsWith('/')){
                             window.location.href = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
                        }
                    });
                }
                const profileLink = document.getElementById('profileLink');
                if (profileLink) {
                    profileLink.addEventListener('click', () => {
                        // Navigate to the profile page
                        window.location.href = window.location.pathname.includes('/pages/') ? 'profile.html' : 'pages/profile.html';
                    });
                }
            }
        } else {
            currentUser = null;
            if (navRight) {
                navRight.innerHTML = `
                    <button class="auth-button" id="authButton">Login / Sign Up</button>
                `;
                // Add event listener for new auth button
                const newAuthButton = document.getElementById('authButton');
                if (newAuthButton) {
                    newAuthButton.addEventListener('click', () => {
                         // Adjust path based on current page
                        if(window.location.pathname.includes('/pages/')){
                            window.location.href = 'login.html';
                        } else {
                            window.location.href = 'pages/login.html';
                        }
                    });
                }
            }
        }
    }
    
    updateAuthUI(); // Call on initial load

    // New Hamburger menu functionality
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content'); // Or a more specific content wrapper
    let hamburgerMenu = document.querySelector('.hamburger-menu'); // Check if already in HTML

    if (!hamburgerMenu && navRight) { // If not in HTML, create and append to nav-right
        hamburgerMenu = document.createElement('div');
        hamburgerMenu.className = 'hamburger-menu';
        hamburgerMenu.innerHTML = '&#9776;'; // Hamburger icon
        // navRight.appendChild(hamburgerMenu); // Appending it here might conflict with authUI updates
        // Better to ensure it's part of the initial HTML in nav-right or prepend it
    }
    
    // Function to create and manage hamburger if not present in HTML
    function ensureHamburgerMenu() {
        if (!navRight) return;
        let ham = navRight.querySelector('.hamburger-menu');
        if (window.innerWidth <= 768) {
            if (!ham) {
                ham = document.createElement('div');
                ham.className = 'hamburger-menu';
                ham.innerHTML = '&#9776;';
                navRight.insertBefore(ham, navRight.firstChild); // Add as first child of nav-right
                ham.addEventListener('click', () => {
                    if (sidebar) sidebar.classList.toggle('active');
                    // if (mainContent) mainContent.classList.toggle('sidebar-active'); // Optional push/overlay effect
                });
            }
            ham.style.display = 'block';
        } else {
            if (ham) ham.style.display = 'none';
            if (sidebar) sidebar.classList.remove('active'); // Ensure sidebar is closed on larger screens
            // if (mainContent) mainContent.classList.remove('sidebar-active');
        }
    }

    if (sidebar) { // Only proceed if a sidebar exists on the page
        ensureHamburgerMenu(); // Call on load
        window.addEventListener('resize', ensureHamburgerMenu); // Call on resize
    }
    
    // Logic for explore dashboard button and home link (from index.html specific script)
    // This should ideally be page-specific, but for now, ensure it doesn't break other pages.
    const heroSection = document.getElementById('heroSection');
    const mainDashboardLayout = document.getElementById('mainDashboardLayout');
    const exploreDashboardBtn = document.getElementById('exploreDashboardBtn');
    const homeLink = document.getElementById('homeLink');

    function showDashboardView() {
        if (heroSection) heroSection.style.display = 'none';
        if (mainDashboardLayout) mainDashboardLayout.style.display = 'flex';
        if (homeLink) homeLink.classList.add('active');
        // Potentially update dashboard title or clear filters
        const dashboardTitle = document.getElementById('dashboardTitle');
        if (dashboardTitle) dashboardTitle.textContent = 'Dashboard';
    }

    function showHeroView() {
        if (heroSection) heroSection.style.display = 'flex';
        if (mainDashboardLayout) mainDashboardLayout.style.display = 'none';
        if (homeLink) homeLink.classList.remove('active');
    }

    if (exploreDashboardBtn) {
        exploreDashboardBtn.addEventListener('click', showDashboardView);
    }
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showDashboardView();
        });
    }
    
    // Initial view check (only if on index.html)
    if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) {
        // Default to hero view, or dashboard if logged in (optional)
        // if (localStorage.getItem('authToken')) {
        //     showDashboardView();
        // } else {
        //     showHeroView();
        // }
        if (heroSection && mainDashboardLayout) { // Ensure elements exist before calling
             showHeroView();
        }
    }


});