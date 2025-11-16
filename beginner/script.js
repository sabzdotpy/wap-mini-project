// beginner product store
// very simple javascript

var products = [
    {
        name: "Headphones",
        category: "electronics",
        price: 2500,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
        description: "Good headphones for music"
    },
    {
        name: "T-Shirt", 
        category: "clothing",
        price: 800,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
        description: "Cotton t-shirt"
    },
    {
        name: "Coffee Mug",
        category: "home",
        price: 300,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=200&h=200&fit=crop",
        description: "Ceramic coffee mug"
    },
    {
        name: "Phone Case",
        category: "electronics", 
        price: 500,
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&h=200&fit=crop",
        description: "Protective phone case"
    },
    {
        name: "Notebook",
        category: "stationery",
        price: 150,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop", 
        description: "Spiral notebook"
    }
];

var filteredProducts = products;

function loadProducts() {
    showProducts();
    loadCategories();
    updateProductCount();
}

function showProducts() {
    var container = document.getElementById('productContainer');
    var html = '';
    
    if (filteredProducts.length == 0) {
        html = '<div class="no-products">No products found</div>';
    } else {
        for (var i = 0; i < filteredProducts.length; i++) {
            var product = filteredProducts[i];
            html += '<div class="product">';
            html += '<img src="' + product.image + '" alt="' + product.name + '">';
            html += '<div class="product-info">';
            html += '<div class="product-name">' + product.name + '</div>';
            html += '<div class="product-category">' + product.category + '</div>';
            html += '<div class="product-description">' + product.description + '</div>';
            html += '<div class="product-price">₹' + product.price + '</div>';
            html += '</div>';
            html += '</div>';
        }
    }
    
    container.innerHTML = html;
}

function loadCategories() {
    var categories = [];
    
    for (var i = 0; i < products.length; i++) {
        var category = products[i].category;
        if (categories.indexOf(category) == -1) {
            categories.push(category);
        }
    }
    
    var select = document.getElementById('categorySelect');
    
    for (var i = 0; i < categories.length; i++) {
        var option = document.createElement('option');
        option.value = categories[i];
        option.text = categories[i];
        select.appendChild(option);
    }
}

function filterProducts() {
    var maxPrice = document.getElementById('priceRange').value;
    var selectedCategory = document.getElementById('categorySelect').value;
    
    filteredProducts = [];
    
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var include = true;
        
        // check price
        if (product.price > maxPrice) {
            include = false;
        }
        
        // check category
        if (selectedCategory != 'all' && product.category != selectedCategory) {
            include = false;
        }
        
        if (include) {
            filteredProducts.push(product);
        }
    }
    
    sortProducts();
    showProducts();
    updateProductCount();
}

function sortProducts() {
    var sortBy = document.getElementById('sortSelect').value;
    
    if (sortBy == 'name') {
        filteredProducts.sort(function(a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
    } else if (sortBy == 'price-low') {
        filteredProducts.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (sortBy == 'price-high') {
        filteredProducts.sort(function(a, b) {
            return b.price - a.price;
        });
    }
}

function updateProductCount() {
    document.getElementById('productCount').innerHTML = filteredProducts.length;
}

function clearFilters() {
    document.getElementById('priceRange').value = 50000;
    document.getElementById('priceValue').innerHTML = '50000';
    document.getElementById('categorySelect').value = 'all';
    document.getElementById('sortSelect').value = 'name';
    
    filteredProducts = products;
    sortProducts();
    showProducts();
    updateProductCount();
}

function showHelp() {
    document.getElementById('helpModal').style.display = 'block';
}

function closeHelp() {
    document.getElementById('helpModal').style.display = 'none';
}

// setup event listeners
window.onload = function() {
    loadProducts();
    
    document.getElementById('priceRange').oninput = function() {
        document.getElementById('priceValue').innerHTML = this.value;
        filterProducts();
    };
    
    document.getElementById('categorySelect').onchange = function() {
        filterProducts();
    };
    
    document.getElementById('sortSelect').onchange = function() {
        sortProducts();
        showProducts();
    };
    
    // close modal when clicking outside
    window.onclick = function(event) {
        var modal = document.getElementById('helpModal');
        if (event.target == modal) {
            closeHelp();
        }
    };
};