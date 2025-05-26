document.addEventListener('DOMContentLoaded', () => {
    const dashboardGrid = document.getElementById('dashboardGrid');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const authButton = document.getElementById('authButton');
    // const profileIcon = document.querySelector('.profile-icon'); // For later use

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
    filterAndSortData();

    // Event listeners for filters
    if (categoryFilter) categoryFilter.addEventListener('change', filterAndSortData);
    if (sortFilter) sortFilter.addEventListener('change', filterAndSortData);

    // Auth button functionality (placeholder)
    if (authButton) {
        authButton.addEventListener('click', () => {
            // This would typically redirect to a login/signup page or open a modal
            alert('Login/Sign Up functionality to be implemented!');
            // Example: window.location.href = 'pages/login.html';
        });
    }

    // Hamburger menu functionality
    const hamburgerMenu = document.createElement('div');
    hamburgerMenu.className = 'hamburger-menu';
    hamburgerMenu.innerHTML = '&#9776;'; // Hamburger icon
    const topNav = document.querySelector('.top-nav');
    const sidebar = document.querySelector('.sidebar');

    if (topNav && sidebar) {
        // Check if screen width is appropriate for hamburger menu
        if (window.innerWidth <= 768) {
            topNav.appendChild(hamburgerMenu);
        }

        hamburgerMenu.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Hide hamburger on larger screens and ensure sidebar is visible
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                if (topNav.contains(hamburgerMenu)) {
                    // topNav.removeChild(hamburgerMenu); // Optionally remove it
                }
                sidebar.style.display = ''; // Reset display for CSS to take over
            } else {
                if (!topNav.contains(hamburgerMenu)) {
                    // topNav.appendChild(hamburgerMenu); // Add it back if not present
                }
                if (!sidebar.classList.contains('active')) {
                     sidebar.style.display = 'none'; // Ensure it's hidden if not active
                }
            }
        });
    }
});