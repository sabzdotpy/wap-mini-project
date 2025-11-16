// simple product store - intermediate level
// basic javascript implementation

// global variables
let products = [];
let filteredProducts = [];
let categories = [];

// load initial data
function loadProducts() {
    products = [
        {
            id: 1,
            name: "Wireless Headphones",
            category: "electronics",
            price: 7500,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
            description: "Good quality wireless headphones"
        },
        {
            id: 2,
            name: "Running Shoes",
            category: "clothing",
            price: 10800,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
            description: "Comfortable running shoes"
        },
        {
            id: 3,
            name: "Coffee Maker",
            category: "home",
            price: 16650,
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
            description: "Automatic coffee maker"
        },
        {
            id: 4,
            name: "Bluetooth Speaker",
            category: "electronics",
            price: 6660,
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
            description: "Portable bluetooth speaker"
        },
        {
            id: 5,
            name: "Yoga Mat",
            category: "sports",
            price: 3330,
            image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop",
            description: "Non-slip yoga mat"
        }
    ];
    
    filteredProducts = products;
    updateCategories();
    updateProductCount();
}

// update categories list
function updateCategories() {
    categories = [...new Set(products.map(p => p.category))];
    
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    
    categories.forEach(category => {
        const div = document.createElement('div');
        div.innerHTML = `
            <label class="flex items-center mb-1">
                <input type="checkbox" class="category-filter mr-2" value="${category}">
                <span class="capitalize">${category}</span>
            </label>
        `;
        categoryList.appendChild(div);
    });
    
    // add event listeners
    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });
}

// format price
function formatPrice(price) {
    return price.toLocaleString();
}

// render products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const loading = document.getElementById('loading');
    const noResults = document.getElementById('noResults');
    
    // hide loading
    loading.classList.add('hidden');
    
    if (filteredProducts.length === 0) {
        grid.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    grid.classList.remove('hidden');
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card bg-white rounded-lg shadow p-4">
            <img src="${product.image}" alt="${product.name}" 
                 class="w-full h-48 object-cover rounded mb-3"
                 onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            
            <div class="mb-2">
                <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                    ${product.category}
                </span>
            </div>
            
            <h3 class="font-bold text-lg mb-2">${product.name}</h3>
            <p class="text-gray-600 text-sm mb-3">${product.description}</p>
            
            <div class="flex justify-between items-center">
                <div class="text-xl font-bold text-blue-600">₹${formatPrice(product.price)}</div>
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// filter products
function filterProducts() {
    const minPrice = parseInt(document.getElementById('minPrice').value);
    const maxPrice = parseInt(document.getElementById('maxPrice').value);
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
    
    filteredProducts = products.filter(product => {
        // price filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }
        
        // category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }
        
        return true;
    });
    
    sortProducts();
    renderProducts();
    updateResultCount();
}

// sort products
function sortProducts() {
    const sortBy = document.getElementById('sortBy').value;
    
    if (sortBy === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
        filteredProducts.sort((a, b) => a.price - b.price);
    }
}

// update product count
function updateProductCount() {
    document.getElementById('productCount').textContent = products.length;
}

// update result count
function updateResultCount() {
    const count = filteredProducts.length;
    const total = products.length;
    document.getElementById('resultCount').textContent = `Showing ${count} of ${total} products`;
}

// clear filters
function clearAllFilters() {
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 100000;
    document.getElementById('minDisplay').textContent = '0';
    document.getElementById('maxDisplay').textContent = '100000';
    
    document.querySelectorAll('.category-filter').forEach(cb => {
        cb.checked = false;
    });
    
    filteredProducts = products;
    sortProducts();
    renderProducts();
    updateResultCount();
}

// csv file handling
function handleCSVFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
            
            const newProducts = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                if (values.length >= headers.length) {
                    const product = { id: Date.now() + i };
                    
                    headers.forEach((header, index) => {
                        let value = values[index];
                        if (header === 'price') {
                            value = parseFloat(value);
                        }
                        product[header] = value;
                    });
                    
                    newProducts.push(product);
                }
            }
            
            products = [...products, ...newProducts];
            filteredProducts = products;
            updateCategories();
            updateProductCount();
            sortProducts();
            renderProducts();
            updateResultCount();
            
            alert(`Successfully imported ${newProducts.length} products!`);
        } catch (error) {
            alert('Error reading CSV file. Please check the format.');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // reset file input
}

// modal functions
function showModal() {
    const modal = document.getElementById('helpModal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('hide');
        modal.classList.add('show');
    }, 10);
}

function hideModal() {
    const modal = document.getElementById('helpModal');
    modal.classList.remove('show');
    modal.classList.add('hide');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 200);
}

// initialize everything
function init() {
    loadProducts();
    
    setTimeout(() => {
        renderProducts();
        updateResultCount();
    }, 1000); // simple loading delay
    
    // event listeners
    document.getElementById('minPrice').addEventListener('input', function() {
        document.getElementById('minDisplay').textContent = formatPrice(this.value);
        filterProducts();
    });
    
    document.getElementById('maxPrice').addEventListener('input', function() {
        document.getElementById('maxDisplay').textContent = formatPrice(this.value);
        filterProducts();
    });
    
    document.getElementById('sortBy').addEventListener('change', function() {
        sortProducts();
        renderProducts();
    });
    
    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
    
    document.getElementById('csvFile').addEventListener('change', handleCSVFile);
    
    document.getElementById('helpBtn').addEventListener('click', showModal);
    document.getElementById('closeModal').addEventListener('click', hideModal);
    
    // close modal when clicking outside
    document.getElementById('helpModal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideModal();
        }
    });
}

// start the app
init();