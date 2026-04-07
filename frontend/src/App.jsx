import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import { getProducts, getSettings, API_FILE_URL } from './services/api';
import { Search, ChevronDown } from 'lucide-react';

import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

const GOOGLE_FONTS = [
    'Inter', 'Roboto', 'Montserrat', 'Playfair Display', 'Dancing Script', 'Pacifico', 'Outfit', 'Quicksand'
];

const HomePage = ({ settings }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Geral');
    const [search, setSearch] = useState('');

    useEffect(() => {
        getProducts().then(res => {
            setProducts(res.data);
            setFilteredProducts(res.data);
            const uniqueCats = ['Geral', ...new Set(res.data.map(p => p.categoria))];
            setCategories(uniqueCats);
        });
    }, []);

    useEffect(() => {
        let result = products;
        if (activeCategory !== 'Geral') {
            result = result.filter(p => p.categoria === activeCategory);
        }
        if (search) {
            result = result.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));
        }
        setFilteredProducts(result);
    }, [activeCategory, search, products]);

    const logoAlign = settings.logoAlignment || 'flex-start';

    return (
        <div style={{ paddingTop: '80px' }}>
            <Navbar onCartClick={() => setIsCartOpen(true)} settings={settings} />

            <header style={{ padding: '60px 0 40px', textAlign: 'center' }} className="animate-fade">
                <div className="container">
                    <div className="logo-container" style={{
                        display: 'flex',
                        justifyContent: logoAlign === 'center' ? 'center' : 'flex-start',
                        margin: logoAlign === 'center' ? '0 auto 20px' : '0 0 20px'
                    }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden' }}>
                            {settings.siteLogo ? (
                                <img src={`${API_FILE_URL}${settings.siteLogo}`} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ background: 'var(--primary)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800 }}>P</div>
                            )}
                        </div>
                    </div>
                    <p className="font-hero-title" style={{ color: 'var(--gray)', fontSize: '0.95rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                        {settings.heroTitle || 'Personalizados para você'}
                    </p>
                    <h1 className="font-hero-subtitle" style={{ fontSize: '1.4rem', color: 'var(--secondary)', maxWidth: '600px', margin: '0 auto 20px', lineHeight: 1.4 }}>
                        {settings.heroSubtitle || 'Todos os itens para festa personalizamos de acordo com o seu tema!'}
                    </h1>
                    <p style={{ color: 'var(--gray)', maxWidth: '500px', margin: '0 auto 30px', fontSize: '0.9rem' }}>
                        {settings.bannerText || 'Envie-nos seu tema e nós faremos o resto!'}
                    </p>
                </div>
            </header>

            <section className="container" style={{ marginBottom: '20px' }}>
                <div className="glass" style={{ padding: '8px 15px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
                    <Search size={20} color="var(--gray)" />
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', background: 'none', outline: 'none', flex: 1, fontSize: '1rem', padding: '8px 0' }}
                    />
                </div>
            </section>

            <section className="container" style={{ marginBottom: '30px' }}>
                <div className="category-pills">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`pill ${activeCategory === cat ? 'active' : ''}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            <main className="container" style={{ paddingBottom: '100px' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '25px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Produtos em Destaque</h2>
                <div className="product-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} color={settings.primaryColor} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px 0' }}>
                            <p style={{ color: 'var(--gray)' }}>Nenhum produto encontrado nesta categoria.</p>
                        </div>
                    )}
                </div>
            </main>

            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} settings={settings} />
        </div>
    );
};

function App() {
    const [settings, setSettings] = useState({});

    useEffect(() => {
        getSettings().then(res => {
            setSettings(res.data);
            if (res.data.primaryColor) {
                document.documentElement.style.setProperty('--primary', res.data.primaryColor);
            }
        });
    }, []);

    const generateStyles = () => {
        const getWeight = (w) => w === 'bold' ? '700' : w === 'light' ? '300' : '400';

        return `
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Inter:wght@300;400;700&family=Montserrat:wght@300;400;700&family=Outfit:wght@300;400;700&family=Pacifico&family=Playfair+Display:wght@400;700&family=Quicksand:wght@300;400;700&family=Roboto:wght@300;400;700&display=swap');

            .font-store-name { 
                font-family: '${settings.font_storeName || 'Inter'}', sans-serif;
                color: ${settings.color_storeName || 'var(--secondary)'};
                font-weight: ${getWeight(settings.weight_storeName)};
            }
            .font-hero-title { 
                font-family: '${settings.font_heroTitle || 'Inter'}', sans-serif;
                color: ${settings.color_heroTitle || 'var(--gray)'};
                font-weight: ${getWeight(settings.weight_heroTitle)};
            }
            .font-hero-subtitle { 
                font-family: '${settings.font_heroSubtitle || 'Inter'}', sans-serif;
                color: ${settings.color_heroSubtitle || 'var(--secondary)'};
                font-weight: ${getWeight(settings.weight_heroSubtitle)};
            }
            .font-product-name { 
                font-family: '${settings.font_productName || 'Inter'}', sans-serif;
                color: ${settings.color_productName || 'var(--secondary)'};
                font-weight: ${getWeight(settings.weight_productName)};
            }
            .font-product-price { 
                font-family: '${settings.font_productPrice || 'Inter'}', sans-serif;
                color: ${settings.color_productPrice || 'var(--primary)'};
                font-weight: ${getWeight(settings.weight_productPrice)};
            }
        `;
    };

    return (
        <Router>
            <style>{generateStyles()}</style>
            <CartProvider>
                <Routes>
                    <Route path="/" element={<HomePage settings={settings} />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={<AdminDashboard settings={settings} setSettings={setSettings} />} />
                </Routes>
            </CartProvider>
        </Router>
    );
}

export default App;
