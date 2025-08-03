/*
 * script.js
 *
 * Provides a basic data model for Caryn’s curated shop and dynamically
 * renders cards for each item in the Clothing, Accessories and Home
 * categories. Each object in the `items` array represents a product
 * Caryn might affiliate with; in a production deployment this data
 * could be loaded from an API or CMS. For now, the samples give
 * a sense of the visual layout and allow the page to feel alive.
 */

const items = [
  {
    category: 'clothing',
    name: 'Velvet Lace Jacket',
    image: 'https://images.unsplash.com/photo-1519415943484-c1a66774406f?auto=format&fit=crop&w=800&q=50',
    description: 'An elegant velvet jacket with lace trim inspired by Victorian gothic fashion.',
    link: 'https://gothicplus.com?ref=caryn-curations'
  },
  {
    category: 'clothing',
    name: 'Ruffled Maxi Dress',
    image: 'https://images.unsplash.com/photo-1514995567534-be1939c1e536?auto=format&fit=crop&w=800&q=50',
    description: 'Flowing dress with ruffled sleeves and corset-inspired bodice.',
    link: 'https://prettyattitude.com?ref=caryn-curations'
  },
  {
    category: 'clothing',
    name: 'Steampunk Waistcoat',
    image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=50',
    description: 'Tailored waistcoat with brass buttons and brocade pattern.',
    link: 'https://darkattitude.com?ref=caryn-curations'
  },
  {
    category: 'accessories',
    name: 'Silver Crescent Necklace',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=50',
    description: 'Delicate sterling necklace featuring a crescent moon and gemstone pendant.',
    link: 'https://hellaholics.com?ref=caryn-curations'
  },
  {
    category: 'accessories',
    name: 'Victorian Lace Gloves',
    image: 'https://images.unsplash.com/photo-1556228914-e6bb65a11531?auto=format&fit=crop&w=800&q=50',
    description: 'Soft lace gloves reminiscent of Victorian gothic elegance.',
    link: 'https://shopcursedcloset.com?ref=caryn-curations'
  },
  {
    category: 'accessories',
    name: 'Leather Choker with O-Ring',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=50',
    description: 'Simple yet edgy choker crafted from black leather with a metal O-ring.',
    link: 'https://attitudeclothing.com?ref=caryn-curations'
  },
  {
    category: 'home',
    name: 'Candle Holder Set',
    image: 'https://images.unsplash.com/photo-1530199202256-d8d7c90a6a92?auto=format&fit=crop&w=800&q=50',
    description: 'Black wrought iron candle holders to cast a warm gothic glow.',
    link: 'https://blackangelonline.com?ref=caryn-curations'
  },
  {
    category: 'home',
    name: 'Skull Planter',
    image: 'https://images.unsplash.com/photo-1513908957991-3d5a21a58218?auto=format&fit=crop&w=800&q=50',
    description: 'A ceramic skull planter perfect for succulents or herbs.',
    link: 'https://spiraldirect.com?ref=caryn-curations'
  },
  {
    category: 'home',
    name: 'Baroque Mirror',
    image: 'https://images.unsplash.com/photo-1591736832069-e8265b64c049?auto=format&fit=crop&w=800&q=50',
    description: 'Ornate baroque-style mirror to adorn your gothic boudoir.',
    link: 'https://prettyattitude.com?ref=caryn-curations'
  }
];

function renderItems() {
  items.forEach(item => {
    const container = document.getElementById(`${item.category}-items`);
    if (!container) return;
    const card = document.createElement('div');
    card.className = 'item-card';
    // Store searchable text on the card for quick filtering
    card.dataset.search = `${item.name.toLowerCase()} ${item.description.toLowerCase()}`;
    card.innerHTML = `
      <div class="item-image" style="background-image: url('${item.image}');"></div>
      <h4>${item.name}</h4>
      <p>${item.description}</p>
      <a href="${item.link}" target="_blank" class="item-link">View Item</a>
    `;
    container.appendChild(card);
  });

  // Attach search functionality
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', event => {
      const query = event.target.value.trim().toLowerCase();
      document.querySelectorAll('.item-card').forEach(card => {
        const text = card.dataset.search || '';
        if (text.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', renderItems);