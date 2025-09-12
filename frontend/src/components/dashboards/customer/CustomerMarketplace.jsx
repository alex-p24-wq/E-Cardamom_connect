import React, { useState } from "react";
import "../../../css/CustomerDashboard.css";

export default function CustomerMarketplace({ user }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  
  // Sample data for demonstration
  const categories = [
    { id: "all", name: "All Products" },
    { id: "premium", name: "Premium Grade" },
    { id: "organic", name: "Organic" },
    { id: "regular", name: "Regular Grade" },
    { id: "seeds", name: "Seeds & Saplings" },
    { id: "tools", name: "Tools & Equipment" },
  ];
  
  const products = [
    { 
      id: 1, 
      name: "Premium Cardamom", 
      category: "premium",
      price: 450, 
      rating: 4.8,
      reviews: 124,
      image: "/images/plant11.jpeg",
      seller: "Green Valley Farms",
      inStock: true,
      popularity: 95
    },
    { 
      id: 2, 
      name: "Organic Cardamom", 
      category: "organic",
      price: 550, 
      rating: 4.9,
      reviews: 89,
      image: "/images/plant12.jpeg",
      seller: "Organic Treasures",
      inStock: true,
      popularity: 90
    },
    { 
      id: 3, 
      name: "Special Grade Cardamom", 
      category: "premium",
      price: 650, 
      rating: 4.7,
      reviews: 56,
      image: "/images/plant13.jpeg",
      seller: "Highland Spices",
      inStock: true,
      popularity: 85
    },
    { 
      id: 4, 
      name: "Regular Cardamom", 
      category: "regular",
      price: 350, 
      rating: 4.3,
      reviews: 210,
      image: "/images/plant14.jpeg",
      seller: "Valley Farms",
      inStock: true,
      popularity: 80
    },
    { 
      id: 5, 
      name: "Cardamom Seeds", 
      category: "seeds",
      price: 250, 
      rating: 4.5,
      reviews: 45,
      image: "/images/plant15.jpeg",
      seller: "Green Seeds Co.",
      inStock: false,
      popularity: 70
    },
    { 
      id: 6, 
      name: "Cardamom Harvesting Tool", 
      category: "tools",
      price: 1200, 
      rating: 4.6,
      reviews: 32,
      image: "/images/plant11.jpeg",
      seller: "AgriTools Inc.",
      inStock: true,
      popularity: 65
    },
    { 
      id: 7, 
      name: "Cardamom Saplings", 
      category: "seeds",
      price: 180, 
      rating: 4.4,
      reviews: 67,
      image: "/images/plant12.jpeg",
      seller: "Green Thumb Nursery",
      inStock: true,
      popularity: 75
    },
    { 
      id: 8, 
      name: "Organic Fertilizer", 
      category: "organic",
      price: 450, 
      rating: 4.7,
      reviews: 93,
      image: "/images/plant13.jpeg",
      seller: "Organic Solutions",
      inStock: true,
      popularity: 60
    },
  ];

  // Filter products based on active category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "popularity":
      default:
        return b.popularity - a.popularity;
    }
  });

  return (
    <div className="customer-marketplace">
      <div className="page-header">
        <h2>Marketplace</h2>
        <p>Discover and shop quality cardamom products</p>
      </div>

      <div className="marketplace-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products or sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>
        
        <div className="sort-dropdown">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort" 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popularity">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      <div className="marketplace-layout">
        <div className="categories-sidebar">
          <h3>Categories</h3>
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
          
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-range">
              <input type="range" min="0" max="2000" step="100" />
              <div className="price-inputs">
                <input type="number" placeholder="Min" min="0" />
                <span>-</span>
                <input type="number" placeholder="Max" min="0" />
              </div>
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Seller Rating</h3>
            <div className="rating-options">
              <label>
                <input type="checkbox" checked /> 4★ & above
              </label>
              <label>
                <input type="checkbox" /> 3★ & above
              </label>
            </div>
          </div>
          
          <div className="filter-section">
            <h3>Availability</h3>
            <div className="availability-options">
              <label>
                <input type="checkbox" checked /> In Stock
              </label>
            </div>
          </div>
          
          <button className="apply-filters-btn">Apply Filters</button>
        </div>
        
        <div className="products-grid">
          {sortedProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="reset-btn" onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}>
                Reset Filters
              </button>
            </div>
          ) : (
            sortedProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {!product.inStock && <div className="out-of-stock">Out of Stock</div>}
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="product-seller">by {product.seller}</p>
                  <div className="product-rating">
                    <span className="stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}</span>
                    <span className="rating-count">({product.reviews})</span>
                  </div>
                  <p className="product-price">₹{product.price}/kg</p>
                  <div className="product-actions">
                    <button className="add-to-cart-btn" disabled={!product.inStock}>
                      {product.inStock ? 'Add to Cart' : 'Notify Me'}
                    </button>
                    <button className="wishlist-btn">❤️</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}