// dynamic retail storefront - advanced implementation
// technology-driven retail consortium solution

class DynamicStorefront {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.categories = new Map();
        this.currentView = 'grid';
        this.currentSort = 'name-asc';
        this.searchTimeout = null;
        this.currentFilters = {
            search: '',
            minPrice: 0,
            maxPrice: 10000,
            categories: new Set()
        };
        
        this.init();
    }
    
    init() {
        this.loadInitialData();
        this.bindEvents();
        this.createLoadingSkeleton();
        
        // simulate loading delay for better ux
        setTimeout(() => {
            this.hideLoadingSkeleton();
            this.setPriceRanges();
            this.renderProducts();
            this.renderCategoryTree();
            this.renderCategoryFilters();
            this.updateProductCount();
        }, 1500);
    }
    
    loadInitialData() {
        // preloaded sample data - production would fetch from api
        this.products = [
            {
                id: 1,
                name: "wireless bluetooth headphones",
                category: "electronics",
                subcategory: "audio",
                price: 7500,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
                description: "premium wireless headphones with noise cancellation and 30-hour battery life"
            },
            {
                id: 2,
                name: "smartphone 128gb",
                category: "electronics",
                subcategory: "mobile",
                price: 49999,
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
                description: "latest smartphone with advanced camera system and fast processor"
            },
            {
                id: 3,
                name: "running shoes",
                category: "clothing",
                subcategory: "footwear",
                price: 2999,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
                description: "lightweight running shoes with responsive cushioning and breathable mesh"
            },
            {
                id: 4,
                name: "coffee maker",
                category: "home",
                subcategory: "kitchen",
                price: 1350,
                image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
                description: "programmable coffee maker with built-in grinder and thermal carafe"
            },
            {
                id: 5,
                name: "gaming laptop",
                category: "electronics",
                subcategory: "computers",
                price: 108300,
                image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
                description: "high-performance gaming laptop with rtx graphics and rgb keyboard"
            },
            {
                id: 6,
                name: "yoga mat",
                category: "sports",
                subcategory: "fitness",
                price: 330,
                image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop",
                description: "premium yoga mat with non-slip surface and extra cushioning"
            },
            {
                id: 7,
                name: "winter jacket",
                category: "clothing",
                subcategory: "outerwear",
                price: 3700,
                image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
                description: "waterproof winter jacket with down insulation and multiple pockets"
            },
            {
                id: 8,
                name: "desk lamp led",
                category: "home",
                subcategory: "lighting",
                price: 1160,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
                description: "adjustable led desk lamp with touch controls and usb charging port"
            },
            {
                id: 9,
                name: "bluetooth speaker",
                category: "electronics",
                subcategory: "audio",
                price: 3669,
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
                description: "portable bluetooth speaker with 360-degree sound and waterproof design"
            },
            {
                id: 10,
                name: "tennis racket",
                category: "sports",
                subcategory: "equipment",
                price: 2500,
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy1ba3rVBRukp1idD-H5QU_zMHtsL-SqROXg&s",
                description: "professional tennis racket with graphite frame and comfortable grip"
            },
            {
                id: 11,
                name: "backpack travel",
                category: "accessories",
                subcategory: "bags",
                price: 7500,
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
                description: "durable travel backpack with laptop compartment and multiple pockets"
            },
            {
                id: 12,
                name: "kitchen knife set",
                category: "home",
                subcategory: "kitchen",
                price: 830,
                image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=300&fit=crop",
                description: "professional kitchen knife set with wooden block and sharpening steel"
            }
        ];
        
        this.filteredProducts = [...this.products];
        this.buildCategoryHierarchy();
    }
    
    buildCategoryHierarchy() {
        this.categories.clear();
        
        this.products.forEach(product => {
            if (!this.categories.has(product.category)) {
                this.categories.set(product.category, {
                    name: product.category,
                    subcategories: new Set(),
                    products: [],
                    expanded: false
                });
            }
            
            const category = this.categories.get(product.category);
            if (product.subcategory) {
                category.subcategories.add(product.subcategory);
            }
            category.products.push(product);
        });
    }
    
    bindEvents() {
        // search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        searchInput.addEventListener('focus', () => this.showSearchSuggestions());
        searchInput.addEventListener('blur', () => {
            // delay hiding to allow click on suggestions
            setTimeout(() => this.hideSearchSuggestions(), 150);
        });
        
        // price range filters
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        minPrice.addEventListener('input', (e) => this.updatePriceFilter('min', e.target.value));
        maxPrice.addEventListener('input', (e) => this.updatePriceFilter('max', e.target.value));
        
        // sort functionality
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderProducts();
        });
        
        // view toggle
        document.getElementById('gridView').addEventListener('click', () => this.setView('grid'));
        document.getElementById('listView').addEventListener('click', () => this.setView('list'));
        
        // clear filters
        document.getElementById('clearFilters').addEventListener('click', () => this.clearAllFilters());
        
        // csv upload
        document.getElementById('csvUpload').addEventListener('change', (e) => this.handleCSVUpload(e));
        
        // add product modal
        document.getElementById('addProductBtn').addEventListener('click', () => this.showAddProductModal());
        document.getElementById('cancelAddProduct').addEventListener('click', () => this.hideAddProductModal());
        document.getElementById('addProductForm').addEventListener('submit', (e) => this.handleAddProduct(e));
        
        // help modal
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelpModal());
        document.getElementById('closeHelpModal').addEventListener('click', () => this.hideHelpModal());
        
        // scroll to top
        document.getElementById('scrollToTop').addEventListener('click', () => this.scrollToTop());
        window.addEventListener('scroll', () => this.handleScroll());
        
        // close modal on backdrop click
        document.getElementById('addProductModal').addEventListener('click', (e) => {
            if (e.target.id === 'addProductModal') {
                this.hideAddProductModal();
            }
        });
        
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target.id === 'helpModal') {
                this.hideHelpModal();
            }
        });
        
        // keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    handleSearch(query) {
        clearTimeout(this.searchTimeout);
        this.currentFilters.search = query.toLowerCase();
        
        this.searchTimeout = setTimeout(() => {
            this.applyFilters();
            this.updateSearchSuggestions(query);
        }, 300);
    }
    
    updateSearchSuggestions(query) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (!query.trim()) {
            this.hideSearchSuggestions();
            return;
        }
        
        const suggestions = this.products
            .filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase()) ||
                (product.subcategory && product.subcategory.toLowerCase().includes(query.toLowerCase()))
            )
            .slice(0, 8);
        
        if (suggestions.length === 0) {
            this.hideSearchSuggestions();
            return;
        }
        
        suggestionsContainer.innerHTML = suggestions.map((product, index) => `
            <div class="suggestion-item p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center space-x-3 animate__animated animate__fadeInDown" 
                 data-product-id="${product.id}" style="animation-delay: ${index * 0.1}s">
                <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1">
                    <div class="font-medium text-gray-900">${this.highlightMatch(product.name, query)}</div>
                    <div class="text-sm text-gray-500">${product.category}</div>
                </div>
                <div class="text-primary font-semibold">₹${this.formatPrice(product.price)}</div>
            </div>
        `).join('');
        
        // bind suggestion clicks
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = parseInt(item.dataset.productId);
                this.selectProduct(productId);
            });
        });
        
        this.showSearchSuggestions();
    }
    
    highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    }
    
    selectProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            document.getElementById('searchInput').value = product.name;
            this.currentFilters.search = product.name.toLowerCase();
            this.applyFilters();
            this.hideSearchSuggestions();
        }
    }
    
    showSearchSuggestions() {
        document.getElementById('searchSuggestions').classList.remove('hidden');
    }
    
    hideSearchSuggestions() {
        document.getElementById('searchSuggestions').classList.add('hidden');
    }
    
    updatePriceFilter(type, value) {
        this.currentFilters[`${type}Price`] = parseFloat(value);
        document.getElementById(`${type}PriceDisplay`).textContent = value;
        this.applyFilters();
    }
    
    toggleCategoryFilter(category, subcategory = null) {
        const filterKey = subcategory ? `${category}:${subcategory}` : category;
        
        if (this.currentFilters.categories.has(filterKey)) {
            this.currentFilters.categories.delete(filterKey);
        } else {
            this.currentFilters.categories.add(filterKey);
        }
        
        this.applyFilters();
        this.renderCategoryFilters();
    }
    
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // search filter
            if (this.currentFilters.search && 
                !product.name.toLowerCase().includes(this.currentFilters.search) &&
                !product.category.toLowerCase().includes(this.currentFilters.search) &&
                !(product.subcategory && product.subcategory.toLowerCase().includes(this.currentFilters.search))) {
                return false;
            }
            
            // price filter
            if (product.price < this.currentFilters.minPrice || product.price > this.currentFilters.maxPrice) {
                return false;
            }
            
            // category filter
            if (this.currentFilters.categories.size > 0) {
                const categoryMatch = this.currentFilters.categories.has(product.category);
                const subcategoryMatch = product.subcategory && 
                    this.currentFilters.categories.has(`${product.category}:${product.subcategory}`);
                
                if (!categoryMatch && !subcategoryMatch) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.renderProducts();
        this.updateResultsCount();
    }
    
    clearAllFilters() {
        const maxPrice = Math.max(...this.products.map(p => p.price)) + 10000;
        this.currentFilters = {
            search: '',
            minPrice: 0,
            maxPrice: maxPrice,
            categories: new Set()
        };
        
        document.getElementById('searchInput').value = '';
        document.getElementById('minPrice').value = 0;
        document.getElementById('maxPrice').value = maxPrice;
        document.getElementById('minPriceDisplay').textContent = '0';
        document.getElementById('maxPriceDisplay').textContent = this.formatPrice(maxPrice);
        
        this.applyFilters();
        this.renderCategoryFilters();
    }
    
    setView(view) {
        this.currentView = view;
        
        // update button states
        document.getElementById('gridView').classList.toggle('bg-white', view === 'grid');
        document.getElementById('gridView').classList.toggle('shadow-sm', view === 'grid');
        document.getElementById('listView').classList.toggle('bg-white', view === 'list');
        document.getElementById('listView').classList.toggle('shadow-sm', view === 'list');
        
        this.renderProducts();
    }
    
    renderProducts() {
        const sortedProducts = this.sortProducts([...this.filteredProducts]);
        
        if (this.currentView === 'grid') {
            this.renderGridView(sortedProducts);
        } else {
            this.renderListView(sortedProducts);
        }
        
        this.updateResultsCount();
    }
    
    sortProducts(products) {
        const [field, direction] = this.currentSort.split('-');
        
        return products.sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];
            
            if (field === 'price') {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            } else {
                aValue = aValue.toString().toLowerCase();
                bValue = bValue.toString().toLowerCase();
            }
            
            if (direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }
    
    renderGridView(products) {
        const gridContainer = document.getElementById('productsGrid');
        const listContainer = document.getElementById('productsList');
        const noResults = document.getElementById('noResults');
        
        listContainer.classList.add('hidden');
        noResults.classList.add('hidden');
        
        if (products.length === 0) {
            gridContainer.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }
        
        gridContainer.classList.remove('hidden');
        gridContainer.innerHTML = products.map(product => this.createProductCard(product)).join('');
        
        // add entrance animations
        gridContainer.querySelectorAll('.product-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate__animated', 'animate__fadeInUp');
        });
        
        this.bindProductEvents();
    }
    
    renderListView(products) {
        const gridContainer = document.getElementById('productsGrid');
        const listContainer = document.getElementById('productsList');
        const noResults = document.getElementById('noResults');
        
        gridContainer.classList.add('hidden');
        noResults.classList.add('hidden');
        
        if (products.length === 0) {
            listContainer.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }
        
        listContainer.classList.remove('hidden');
        listContainer.innerHTML = products.map(product => this.createProductListItem(product)).join('');
        
        // add entrance animations
        listContainer.querySelectorAll('.product-list-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
            item.classList.add('animate__animated', 'animate__fadeInLeft');
        });
        
        this.bindProductEvents();
    }
    
    createProductCard(product) {
        return `
            <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden group" data-product-id="${product.id}">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" 
                         class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                         onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                    
                    <div class="absolute bottom-3 left-3">
                        <span class="bg-primary/90 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            ${product.category}
                        </span>
                    </div>
                    
                    <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                            <i class="far fa-heart text-red-500 hover:scale-110 transition-transform cursor-pointer" title="add to wishlist"></i>
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <h3 class="font-bold text-lg mb-2 text-gray-800 group-hover:text-primary transition-colors duration-200">
                        ${product.name}
                    </h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">${product.description}</p>
                    
                    <div class="flex items-center justify-between">
                        <div class="text-2xl font-bold text-primary">₹${this.formatPrice(product.price)}</div>
                        <button class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                            <i class="fas fa-cart-plus"></i>
                            <span>add</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    createProductListItem(product) {
        return `
            <div class="product-list-item bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group" data-product-id="${product.id}">
                <div class="flex items-center space-x-6">
                    <div class="relative">
                        <img src="${product.image}" alt="${product.name}" 
                             class="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                             onerror="this.src='https://via.placeholder.com/96x96?text=No+Image'">
                        
                        <span class="absolute -top-2 -right-2 bg-primary text-white px-2 py-1 rounded-lg text-xs font-medium">
                            ${product.category}
                        </span>
                    </div>
                    
                    <div class="flex-1">
                        <h3 class="font-bold text-xl mb-2 text-gray-800 group-hover:text-primary transition-colors duration-200">
                            ${product.name}
                        </h3>
                        <p class="text-gray-600 mb-2">${product.description}</p>
                        ${product.subcategory ? `<span class="text-sm text-gray-500">${product.subcategory}</span>` : ''}
                    </div>
                    
                    <div class="text-right">
                        <div class="text-3xl font-bold text-primary mb-3">₹${this.formatPrice(product.price)}</div>
                        <div class="flex space-x-2 justify-end">
                            <button class="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200"
                                    title="add to wishlist">
                                <i class="far fa-heart text-red-500"></i>
                            </button>
                            <button class="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                                <i class="fas fa-cart-plus"></i>
                                <span>add to cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindProductEvents() {
        // wishlist buttons (replacing edit/delete functionality)
        document.querySelectorAll('.fa-heart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isCurrentlyFilled = btn.classList.contains('fas');
                
                if (isCurrentlyFilled) {
                    btn.classList.remove('fas');
                    btn.classList.add('far');
                    this.showToast('success', 'Removed from wishlist', 'Product removed from your wishlist');
                } else {
                    btn.classList.remove('far');
                    btn.classList.add('fas');
                    this.showToast('success', 'Added to wishlist', 'Product added to your wishlist');
                }
            });
        });
    }
    
    renderCategoryTree() {
        const treeContainer = document.getElementById('categoryTree');
        treeContainer.innerHTML = '';
        
        Array.from(this.categories.entries()).forEach(([categoryName, categoryData]) => {
            const categoryElement = this.createCategoryNode(categoryName, categoryData);
            treeContainer.appendChild(categoryElement);
        });
    }
    
    createCategoryNode(categoryName, categoryData) {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-node';
        
        const hasSubcategories = categoryData.subcategories.size > 0;
        
        categoryElement.innerHTML = `
            <div class="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
                 onclick="toggleCategory('${categoryName}')">
                <div class="flex items-center space-x-2">
                    ${hasSubcategories ? 
                        `<i class="fas fa-chevron-${categoryData.expanded ? 'down' : 'right'} text-sm text-gray-500 transition-transform duration-200"></i>` : 
                        '<div class="w-4"></div>'
                    }
                    <i class="fas fa-folder text-primary"></i>
                    <span class="font-medium capitalize">${categoryName}</span>
                </div>
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    ${categoryData.products.length}
                </span>
            </div>
            
            ${hasSubcategories ? `
                <div class="subcategories ml-6 ${categoryData.expanded ? '' : 'hidden'} space-y-1">
                    ${Array.from(categoryData.subcategories).map(subcategory => `
                        <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                             onclick="event.stopPropagation(); selectCategory('${categoryName}', '${subcategory}')">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-file text-gray-400"></i>
                                <span class="text-sm capitalize">${subcategory}</span>
                            </div>
                            <span class="text-xs text-gray-400">
                                ${categoryData.products.filter(p => p.subcategory === subcategory).length}
                            </span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        return categoryElement;
    }
    
    renderCategoryFilters() {
        const filtersContainer = document.getElementById('categoryFilters');
        filtersContainer.innerHTML = '';
        
        Array.from(this.categories.entries()).forEach(([categoryName, categoryData]) => {
            const isChecked = this.currentFilters.categories.has(categoryName);
            
            const filterElement = document.createElement('div');
            filterElement.innerHTML = `
                <label class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                    <input type="checkbox" ${isChecked ? 'checked' : ''} 
                           onchange="storefront.toggleCategoryFilter('${categoryName}')"
                           class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary">
                    <span class="flex-1 capitalize">${categoryName}</span>
                    <span class="text-xs text-gray-500">${categoryData.products.length}</span>
                </label>
            `;
            
            filtersContainer.appendChild(filterElement);
            
            // add subcategory filters if any exist
            if (categoryData.subcategories.size > 0) {
                Array.from(categoryData.subcategories).forEach(subcategory => {
                    const subFilterKey = `${categoryName}:${subcategory}`;
                    const isSubChecked = this.currentFilters.categories.has(subFilterKey);
                    const subCount = categoryData.products.filter(p => p.subcategory === subcategory).length;
                    
                    const subFilterElement = document.createElement('div');
                    subFilterElement.className = 'ml-6';
                    subFilterElement.innerHTML = `
                        <label class="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                            <input type="checkbox" ${isSubChecked ? 'checked' : ''} 
                                   onchange="storefront.toggleCategoryFilter('${categoryName}', '${subcategory}')"
                                   class="w-3 h-3 text-primary border-gray-300 rounded focus:ring-primary">
                            <span class="flex-1 capitalize text-sm">${subcategory}</span>
                            <span class="text-xs text-gray-400">${subCount}</span>
                        </label>
                    `;
                    
                    filtersContainer.appendChild(subFilterElement);
                });
            }
        });
    }
    
    updateProductCount() {
        document.getElementById('productCount').textContent = this.products.length;
    }
    
    updateResultsCount() {
        const count = this.filteredProducts.length;
        const total = this.products.length;
        const resultsText = count === total ? 
            `showing all ${total} products` : 
            `showing ${count} of ${total} products`;
        
        document.getElementById('resultsCount').textContent = resultsText;
    }
    
    // csv upload functionality
    handleCSVUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const products = this.parseCSV(csv);
                this.importProducts(products);
                this.showToast('success', 'csv imported', `successfully imported ${products.length} products`);
            } catch (error) {
                this.showToast('error', 'import failed', 'failed to parse csv file');
                console.error('csv parse error:', error);
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // reset file input
    }
    
    parseCSV(csv) {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // validate required headers
        const required = ['name', 'category', 'price', 'image', 'description'];
        const missing = required.filter(req => !headers.includes(req));
        if (missing.length > 0) {
            throw new Error(`missing required columns: ${missing.join(', ')}`);
        }
        
        return lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            
            if (values.length !== headers.length) {
                console.warn(`row ${index + 2} has ${values.length} values, expected ${headers.length}`);
                return null;
            }
            
            const product = {
                id: Date.now() + index, // generate unique id
            };
            
            headers.forEach((header, i) => {
                let value = values[i];
                
                // type conversion
                if (header === 'price') {
                    value = parseFloat(value);
                    if (isNaN(value)) {
                        throw new Error(`invalid price in row ${index + 2}: ${values[i]}`);
                    }
                }
                
                product[header] = value;
            });
            
            return product;
        }).filter(product => product !== null);
    }
    
    importProducts(newProducts) {
        this.products = [...this.products, ...newProducts];
        this.buildCategoryHierarchy();
        this.applyFilters();
        this.renderCategoryTree();
        this.renderCategoryFilters();
        this.updateProductCount();
    }
    
    // add product modal
    showAddProductModal() {
        const modal = document.getElementById('addProductModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // force reflow to ensure initial state
        modal.offsetHeight;
        
        // transition to visible state
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-visible');
        modalContent.classList.remove('modal-scale-hidden');
        modalContent.classList.add('modal-scale-visible');
        
        setTimeout(() => {
            document.getElementById('productName').focus();
        }, 100);
    }
    
    hideAddProductModal() {
        const modal = document.getElementById('addProductModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // transition to hidden state
        modal.classList.remove('modal-visible');
        modal.classList.add('modal-hidden');
        modalContent.classList.remove('modal-scale-visible');
        modalContent.classList.add('modal-scale-hidden');
        
        setTimeout(() => {
            modal.classList.add('hidden');
            document.getElementById('addProductForm').reset();
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    handleAddProduct(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const product = {
            id: Date.now(),
            name: document.getElementById('productName').value.trim(),
            category: document.getElementById('productCategory').value.trim().toLowerCase(),
            subcategory: document.getElementById('productSubcategory').value.trim().toLowerCase() || null,
            price: parseFloat(document.getElementById('productPrice').value),
            image: document.getElementById('productImage').value.trim(),
            description: document.getElementById('productDescription').value.trim()
        };
        
        // validation
        if (!product.name || !product.category || !product.price || !product.image || !product.description) {
            this.showToast('error', 'validation failed', 'please fill in all required fields');
            return;
        }
        
        if (product.price <= 0) {
            this.showToast('error', 'invalid price', 'price must be greater than 0');
            return;
        }
        
        // add product
        this.products.push(product);
        this.buildCategoryHierarchy();
        this.applyFilters();
        this.renderCategoryTree();
        this.renderCategoryFilters();
        this.updateProductCount();
        
        this.hideAddProductModal();
        this.showToast('success', 'product added', `${product.name} has been added to catalog`);
    }
    
    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        // populate form with existing data
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productSubcategory').value = product.subcategory || '';
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productDescription').value = product.description;
        
        this.showAddProductModal();
        
        // change form behavior to edit mode
        const form = document.getElementById('addProductForm');
        const submitHandler = (e) => {
            e.preventDefault();
            
            // update product
            product.name = document.getElementById('productName').value.trim();
            product.category = document.getElementById('productCategory').value.trim().toLowerCase();
            product.subcategory = document.getElementById('productSubcategory').value.trim().toLowerCase() || null;
            product.price = parseFloat(document.getElementById('productPrice').value);
            product.image = document.getElementById('productImage').value.trim();
            product.description = document.getElementById('productDescription').value.trim();
            
            this.buildCategoryHierarchy();
            this.applyFilters();
            this.renderCategoryTree();
            this.renderCategoryFilters();
            
            this.hideAddProductModal();
            this.showToast('success', 'product updated', `${product.name} has been updated`);
            
            // restore original form handler
            form.removeEventListener('submit', submitHandler);
            form.addEventListener('submit', (e) => this.handleAddProduct(e));
        };
        
        form.removeEventListener('submit', this.handleAddProduct);
        form.addEventListener('submit', submitHandler);
    }
    
    deleteProduct(productId) {
        if (!confirm('are you sure you want to delete this product?')) return;
        
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex === -1) return;
        
        const product = this.products[productIndex];
        this.products.splice(productIndex, 1);
        
        this.buildCategoryHierarchy();
        this.applyFilters();
        this.renderCategoryTree();
        this.renderCategoryFilters();
        this.updateProductCount();
        
        this.showToast('success', 'product deleted', `${product.name} has been removed`);
    }
    
    // utility methods
    createLoadingSkeleton() {
        const container = document.getElementById('loadingContainer');
        const skeletonCards = Array(6).fill().map(() => `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div class="skeleton h-48 rounded-t-2xl"></div>
                <div class="p-6 space-y-3">
                    <div class="skeleton h-6 rounded"></div>
                    <div class="skeleton h-4 rounded w-3/4"></div>
                    <div class="skeleton h-4 rounded w-1/2"></div>
                    <div class="flex justify-between items-center mt-4">
                        <div class="skeleton h-8 w-20 rounded"></div>
                        <div class="skeleton h-10 w-24 rounded-lg"></div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = skeletonCards;
    }
    
    hideLoadingSkeleton() {
        document.getElementById('loadingContainer').classList.add('hidden');
    }
    
    setPriceRanges() {
        const prices = this.products.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices) + 10000;
        
        // update filter values
        this.currentFilters.maxPrice = maxPrice;
        
        // update UI elements
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        
        minPriceInput.max = maxPrice;
        maxPriceInput.max = maxPrice;
        maxPriceInput.value = maxPrice;
        
        document.getElementById('maxPriceDisplay').textContent = this.formatPrice(maxPrice);
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('en-IN').format(price);
    }
    
    showHelpModal() {
        const modal = document.getElementById('helpModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // force reflow to ensure initial state
        modal.offsetHeight;
        
        // transition to visible state
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-visible');
        modalContent.classList.remove('modal-scale-hidden');
        modalContent.classList.add('modal-scale-visible');
    }
    
    hideHelpModal() {
        const modal = document.getElementById('helpModal');
        const modalContent = modal.querySelector('.modal-content');
        
        // transition to hidden state
        modal.classList.remove('modal-visible');
        modal.classList.add('modal-hidden');
        modalContent.classList.remove('modal-scale-visible');
        modalContent.classList.add('modal-scale-hidden');
        
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    showToast(type, title, message) {
        const toast = document.getElementById('toast');
        const icon = document.getElementById('toastIcon');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        
        // set content
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        // set icon and colors based on type
        if (type === 'success') {
            icon.innerHTML = '<i class="fas fa-check text-green-600"></i>';
            icon.className = 'w-8 h-8 rounded-full bg-green-100 flex items-center justify-center';
        } else if (type === 'error') {
            icon.innerHTML = '<i class="fas fa-exclamation-triangle text-red-600"></i>';
            icon.className = 'w-8 h-8 rounded-full bg-red-100 flex items-center justify-center';
        }
        
        // show toast
        toast.classList.remove('translate-x-full');
        
        // hide after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
        }, 3000);
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    handleScroll() {
        const scrollBtn = document.getElementById('scrollToTop');
        if (window.pageYOffset > 300) {
            scrollBtn.classList.remove('hidden');
        } else {
            scrollBtn.classList.add('hidden');
        }
    }
    
    handleKeyboard(e) {
        // keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'f':
                case 'F':
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                    break;
                case 'n':
                case 'N':
                    e.preventDefault();
                    this.showAddProductModal();
                    break;
            }
        }
        
        // escape key
        if (e.key === 'Escape') {
            this.hideAddProductModal();
            this.hideHelpModal();
            this.hideSearchSuggestions();
        }
    }
}

// global functions for event handlers
function toggleCategory(categoryName) {
    const category = storefront.categories.get(categoryName);
    if (category) {
        category.expanded = !category.expanded;
        storefront.renderCategoryTree();
    }
}

function selectCategory(categoryName, subcategory = null) {
    storefront.toggleCategoryFilter(categoryName, subcategory);
}

// initialize storefront
const storefront = new DynamicStorefront();

// performance optimization - debounced resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // any resize-dependent logic here
    }, 250);
});