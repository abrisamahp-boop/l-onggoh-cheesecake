// State Variables
let cart = [];
let customState = {
  basePrice: 45000,
  sizeName: 'Single Slice',
  flavor: 'Classic New York',
  img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80'
};

// GSAP Page Entrance Animation
window.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') {
    gsap.from('.hero-text > *', { opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: 'power2.out' });
    gsap.from('.hero-image', { opacity: 0, scale: 0.9, duration: 1, delay: 0.3, ease: 'power2.out' });
  }
});

// FUNGSI BARU: Pindah ke section Bikin Versimu saat tombol "+ Tambah Pesanan" di menu diklik
function selectMenuAndCustomize(flavorName, imgUrl) {
  // Update state kustomisasi rasa & gambar
  setFlavor(flavorName, imgUrl);

  // Scroll halus ke section Bikin Versimu
  const customizerSection = document.getElementById('customizer');
  if (customizerSection) {
    customizerSection.scrollIntoView({ behavior: 'smooth' });
    
    // Beri efek highlight border sejenak pada card customizer
    const card = document.getElementById('customizerCard');
    if (card) {
      card.classList.add('ring-4', 'ring-brand/40');
      setTimeout(() => {
        card.classList.remove('ring-4', 'ring-brand/40');
      }, 1500);
    }
  }
}

// Customizer Logic
function setCustomSize(type, price, name) {
  customState.basePrice = price;
  customState.sizeName = name;
  document.getElementById('customSizeBadge').innerText = name;
  
  // Toggle button active styling
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.remove('border-brand', 'bg-warm/30');
    btn.classList.add('border-transparent', 'bg-cream');
  });
  if (event && event.currentTarget) {
    event.currentTarget.classList.add('border-brand', 'bg-warm/30');
    event.currentTarget.classList.remove('border-transparent', 'bg-cream');
  }

  calculateCustomPrice();
}

function setFlavor(flavorName, imgUrl) {
  customState.flavor = flavorName;
  customState.img = imgUrl;
  
  const previewImg = document.getElementById('customPreviewImg');
  const customTitle = document.getElementById('customTitle');
  
  if (previewImg) previewImg.src = imgUrl;
  if (customTitle) customTitle.innerText = `Custom ${flavorName}`;
  
  // Update tampilan tombol rasa yang aktif
  document.querySelectorAll('.flavor-btn').forEach(btn => {
    const btnFlavor = btn.getAttribute('data-flavor');
    if (btnFlavor === flavorName) {
      btn.classList.add('bg-brand', 'text-white', 'border-brand');
      btn.classList.remove('bg-cream', 'text-dark', 'border-[#EFE5D8]');
    } else {
      btn.classList.remove('bg-brand', 'text-white', 'border-brand');
      btn.classList.add('bg-cream', 'text-dark', 'border-[#EFE5D8]');
    }
  });
  
  calculateCustomPrice();
}

function calculateCustomPrice() {
  let total = customState.basePrice;
  let toppings = [];
  
  const topBerry = document.getElementById('topBerry');
  const topChoco = document.getElementById('topChoco');

  if (topBerry && topBerry.checked) {
    total += 10000;
    toppings.push('Extra Strawberry');
  }
  if (topChoco && topChoco.checked) {
    total += 10000;
    toppings.push('Choco Drizzle');
  }

  const priceEl = document.getElementById('customTotalPrice');
  const descEl = document.getElementById('customDesc');

  if (priceEl) priceEl.innerText = `Rp ${total.toLocaleString('id-ID')}`;
  const toppingText = toppings.length > 0 ? ` + Topping: ${toppings.join(', ')}` : '';
  if (descEl) descEl.innerText = `${customState.sizeName}${toppingText}`;
  
  return total;
}

function addCustomToCart() {
  const price = calculateCustomPrice();
  let toppingName = [];
  if (document.getElementById('topBerry').checked) toppingName.push('Berry');
  if (document.getElementById('topChoco').checked) toppingName.push('Choco');
  
  const title = `${customState.flavor} (${customState.sizeName}${toppingName.length ? ' + ' + toppingName.join('&') : ''})`;
  addToCart(title, price, customState.img);
}

// Cart System
function addToCart(title, price, img) {
  const existing = cart.find(item => item.title === title);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ title, price, img, qty: 1 });
  }

  // Confetti Celebration Effect
  if (typeof confetti !== 'undefined') {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.85 }
    });
  }

  updateCartUI();
  toggleCart(true);
}

function updateCartUI() {
  const container = document.getElementById('cartItems');
  const countBadge = document.getElementById('cartCount');
  container.innerHTML = '';

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-center text-xs text-muted py-10">Keranjang belanja Anda masih kosong.</p>';
  } else {
    cart.forEach((item, index) => {
      total += item.price * item.qty;
      count += item.qty;

      container.innerHTML += `
        <div class="flex items-center gap-3 bg-cream p-3 rounded-xl border border-[#EFE5D8]">
          <img src="${item.img}" class="w-14 h-14 object-cover rounded-lg">
          <div class="flex-1">
            <h5 class="font-bold text-xs text-dark leading-tight">${item.title}</h5>
            <span class="text-xs font-bold text-brand">Rp ${item.price.toLocaleString('id-ID')}</span>
          </div>
          <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-[#EFE5D8]">
            <button onclick="changeQty(${index}, -1)" class="text-xs font-bold text-dark">-</button>
            <span class="text-xs font-bold text-dark">${item.qty}</span>
            <button onclick="changeQty(${index}, 1)" class="text-xs font-bold text-dark">+</button>
          </div>
        </div>
      `;
    });
  }

  document.getElementById('cartSubtotal').innerText = `Rp ${total.toLocaleString('id-ID')}`;
  countBadge.innerText = count;
  countBadge.style.transform = count > 0 ? 'scale(1)' : 'scale(0)';
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCartUI();
}

function toggleCart(forceOpen = false) {
  const modal = document.getElementById('cartModal');
  const drawer = document.getElementById('cartDrawer');
  
  if (forceOpen || modal.classList.contains('pointer-events-none')) {
    modal.classList.remove('pointer-events-none', 'opacity-0');
    drawer.classList.remove('translate-x-full');
  } else {
    modal.classList.add('pointer-events-none', 'opacity-0');
    drawer.classList.add('translate-x-full');
  }
}

// Filter Menu Tabs
function filterMenu(category) {
  const cards = document.querySelectorAll('.menu-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// WhatsApp Direct Order
function checkoutWhatsApp() {
  if (cart.length === 0) return alert('Keranjang masih kosong!');
  
  let text = "Halo L'Onggoh Cheesecake, saya mau pesan:\n\n";
  cart.forEach(i => {
    text += `- ${i.title} (x${i.qty}) : Rp ${(i.price * i.qty).toLocaleString('id-ID')}\n`;
  });
  text += `\nTotal: ${document.getElementById('cartSubtotal').innerText}`;
  
  window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
}


document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const flavor = params.get("flavor");

  const menu = {
    classic: {
      name: "Classic New York",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80"
    },
    strawberry: {
      name: "Ruby Strawberry",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80"
    },
    chocolate: {
      name: "Belgian Chocolate",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
    }
  };

  if (menu[flavor]) {
    setFlavor(menu[flavor].name, menu[flavor].image);
  }
});

// Fungsi Filter Menu + Efek Tombol Aktif
function filterMenu(category, btnElement) {
  // 1. Reset semua warna tombol ke tampilan biasa (putih)
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.classList.remove('bg-[#D97736]', 'text-white');
    btn.classList.add('bg-white', 'border', 'border-[#EFE5D8]', 'text-[#2C221E]');
  });

  // 2. Jika tombol diklik langsung via event listener
  const targetBtn = btnElement || (window.event && window.event.currentTarget);

  // 3. Beri warna oranye (brand) pada tombol yang diklik
  if (targetBtn) {
    targetBtn.classList.remove('bg-white', 'border', 'border-[#EFE5D8]', 'text-[#2C221E]');
    targetBtn.classList.add('bg-[#D97736]', 'text-white');
  }

  // 4. Saring/Filter kartu menu
  const cards = document.querySelectorAll('.menu-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}