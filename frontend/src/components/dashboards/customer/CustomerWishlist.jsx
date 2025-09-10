import React from "react";
import "../../../css/CustomerDashboard.css";

export default function CustomerWishlist({ user }) {
  // Sample data for demonstration
  const wishlistItems = [
    { 
      id: 1, 
      name: "Premium Cardamom", 
      price: 450, 
      image: "/images/plant11.jpeg",
      seller: "Green Valley Farms",
      inStock: true,
      addedOn: "2023-05-10"
    },
    { 
      id: 3, 
      name: "Special Grade Cardamom", 
      price: 650, 
      image: "/images/plant13.jpeg",
      seller: "Highland Spices",
      inStock: true,
      addedOn: "2023-05-08"
    },
    { 
      id: 5, 
      name: "Cardamom Seeds", 
      price: 250, 
      image: "/images/plant15.jpeg",
      seller: "Green Seeds Co.",
      inStock: false,
      addedOn: "2023-05-05"
    },
    { 
      id: 6, 
      name: "Cardamom Harvesting Tool", 
      price: 1200, 
      image: "/images/plant11.jpeg",
      seller: "AgriTools Inc.",
      inStock: true,
      addedOn: "2023-04-28"
    },
    { 
      id: 8, 
      name: "Organic Fertilizer", 
      price: 450, 
      image: "/images/plant13.jpeg",
      seller: "Organic Solutions",
      inStock: true,
      addedOn: "2023-04-20"
    },
  ];

  const removeFromWishlist = (itemId) => {
    // In a real app, this would call an API to remove the item
    console.log(`Removing item ${itemId} from wishlist`);
  };

  const moveToCart = (itemId) => {
    // In a real app, this would call an API to move the item to cart
    console.log(`Moving item ${itemId} to cart`);
  };

  return (
    <div className="customer-wishlist">
      <div className="page-header">
        <h2>My Wishlist</h2>
        <p>Items you've saved for later</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Save items you like for later by clicking the heart icon</p>
          <button className="browse-btn">Browse Products</button>
        </div>
      ) : (
        <>
          <div className="wishlist-actions">
            <button className="move-all-btn">Move All to Cart</button>
            <button className="clear-all-btn">Clear Wishlist</button>
          </div>
          
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div className="wishlist-card" key={item.id}>
                <div className="wishlist-image">
                  <img src={item.image} alt={item.name} />
                  {!item.inStock && <div className="out-of-stock">Out of Stock</div>}
                </div>
                <div className="wishlist-details">
                  <h3>{item.name}</h3>
                  <p className="wishlist-seller">by {item.seller}</p>
                  <p className="wishlist-price">₹{item.price}/kg</p>
                  <p className="wishlist-date">Added on {item.addedOn}</p>
                  <div className="wishlist-actions">
                    <button 
                      className="move-to-cart-btn" 
                      disabled={!item.inStock}
                      onClick={() => moveToCart(item.id)}
                    >
                      {item.inStock ? 'Move to Cart' : 'Notify When Available'}
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}