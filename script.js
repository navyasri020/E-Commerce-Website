const products = [
    {id: 1, name: 'Wireless Headphones', category: 'Audio', price: 59.99, img:'https://www.bhphotovideo.com/images/images2500x2500/samsung_eo_bg920bbebus_level_u_wireless_headphones_black_1155910.jpg'},
    {id: 2, name: 'Smart Watch', category: 'Wearables', price: 149.99, img:'https://www.stuff.tv/wp-content/uploads/sites/2/2023/05/Best-Smartwatch-2023-Lead.jpg'},
    {id: 3, name: 'Gaming Mouse', category: 'Peripherals', price: 39.99, img:'https://alexnld.com/wp-content/uploads/2020/12/c2a4c605-8d39-4e36-9cbb-0ea28e0f60c4.jpg'},
    {id: 4, name: 'Bluetooth Speaker', category: 'Audio', price: 79.99, img:'https://m.media-amazon.com/images/I/81KehT0f84L.jpg'},
    {id: 5, name: 'Fitness Tracker', category: 'Wearables', price: 99.99, img:'https://s.hdnux.com/photos/01/21/13/47/21281228/7/rawImage.jpg'},
    {id: 6, name: 'Mechanical Keyboard', category: 'Peripherals', price: 89.99, img:'https://cdn.mos.cms.futurecdn.net/wiUv69iFSzArgPKjBBTH9M.jpg'}
  ];

  const categories = [...new Set(products.map(p => p.category))];
  const categoryFilter = document.getElementById('category-filter');
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const searchInput = document.getElementById('search-input');
  const productsDiv = document.getElementById('products');
  const cartItemsUl = document.getElementById('cart-items');
  const totalPriceDiv = document.getElementById('total-price');
  const checkoutBtn = document.getElementById('checkout-btn');

  // User login UI elements
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const welcomeMsg = document.getElementById('welcome-msg');
  const loginSection = document.getElementById('login-section');
  const doLoginBtn = document.getElementById('do-login-btn');
  const usernameInput = document.getElementById('username');

  let cart = [];
  let user = null;

  // Render products with filtering
  function renderProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filteredProducts = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm);
      const matchCategory = category === '' || p.category === category;
      return matchSearch && matchCategory;
    });

    productsDiv.innerHTML = '';

    filteredProducts.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" />
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="price">$${p.price.toFixed(2)}</p>
          <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      `;
      productsDiv.appendChild(card);
    });

    // Add event listeners for add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.onclick = () => {
        if (!user) {
          alert('Please log in to add items to your cart.');
          showLogin();
          return;
        }
        addToCart(Number(button.dataset.id));
      };
    });
  }

  // Cart functions
  function addToCart(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty++;
    } else {
      cart.push({id, qty: 1});
    }
    renderCart();
  }

  function renderCart() {
    cartItemsUl.innerHTML = '';

    if (cart.length === 0) {
      cartItemsUl.innerHTML = '<li>Your cart is empty.</li>';
      totalPriceDiv.textContent = 'Total: $0.00';
      return;
    }

    let total = 0;

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      total += product.price * item.qty;

      const li = document.createElement('li');
      li.innerHTML = `
        <span>${product.name} ($${product.price.toFixed(2)})</span>
        <span>
          Qty: <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="qty-input" />
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </span>
      `;
      cartItemsUl.appendChild(li);
    });

    totalPriceDiv.textContent = `Total: $${total.toFixed(2)}`;

    // Attach listeners for quantity input changes
    document.querySelectorAll('.qty-input').forEach(input => {
      input.onchange = () => {
        const id = Number(input.dataset.id);
        const qty = Number(input.value);
        if (qty <= 0) {
          removeFromCart(id);
        } else {
          updateQty(id, qty);
        }
      };
    });

    // Attach listeners for remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.onclick = () => {
        removeFromCart(Number(button.dataset.id));
      };
    });
  }

  function updateQty(id, qty) {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty = qty;
      renderCart();
    }
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
  }

  // User login/logout simulation
  function showLogin() {
    loginSection.style.display = 'block';
  }
  function hideLogin() {
    loginSection.style.display = 'none';
  }
  function updateUserUI() {
    if (user) {
      welcomeMsg.textContent = `Welcome, ${user}!`;
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      hideLogin();
    } else {
      welcomeMsg.textContent = '';
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      showLogin();
    }
  }

  loginBtn.onclick = () => {
    showLogin();
  };

  doLoginBtn.onclick = () => {
    const username = usernameInput.value.trim();
    if (username === '') {
      alert('Please enter a username');
      return;
    }
    user = username;
    cart = []; // clear cart on login for demo
    usernameInput.value = '';
    updateUserUI();
    renderCart();
  };

  logoutBtn.onclick = () => {
    user = null;
    cart = [];
    updateUserUI();
    renderCart();
  };

  // Checkout handler
  checkoutBtn.onclick = () => {
    if (!user) {
      alert('Please log in to checkout.');
      showLogin();
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    let receipt = `Thank you for your purchase, ${user}!\n\nOrder summary:\n\n`;
    let total = 0;
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      receipt += `${product.name} x${item.qty} = $${(product.price * item.qty).toFixed(2)}\n`;
      total += product.price * item.qty;
    });
    receipt += `\nTotal: $${total.toFixed(2)}`;
    alert(receipt);
    cart = [];
    renderCart();
  };

  // Initial render
  renderProducts();
  updateUserUI();
  renderCart();

  // Filter events
  searchInput.oninput = renderProducts;
  categoryFilter.onchange = renderProducts;