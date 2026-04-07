import React from 'react';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onCartClick, settings }) => {
    const { itemCount } = useCart();
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <nav className="glass" style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            padding: '0.8rem 0', display: 'flex', alignItems: 'center'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {isAdmin ? (
                        <Link to="/" style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', fontWeight: 600 }}>
                            <ChevronLeft size={20} /> Ver Site
                        </Link>
                    ) : (
                        <div style={{ width: '40px' }}></div> /* Spacer */
                    )}
                </div>

                <div className="font-store-name" style={{ fontSize: '1.2rem', color: 'var(--secondary)', letterSpacing: '-0.5px' }}>
                    {isAdmin ? 'Área Administrativa' : (settings.themeName || 'Personalize')}
                </div>

                {!isAdmin && (
                    <button onClick={onCartClick} className="glass" style={{
                        position: 'relative', background: 'white', color: 'var(--text)',
                        padding: '10px', borderRadius: '50%', boxShadow: 'var(--shadow)', border: 'none'
                    }}>
                        <ShoppingBag size={24} />
                        {itemCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary)',
                                color: 'white', borderRadius: '50%', width: '22px', height: '22px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '11px', fontWeight: 700, border: '2px solid white'
                            }}>
                                {itemCount}
                            </span>
                        )}
                    </button>
                )}
                {isAdmin && <div style={{ width: '40px' }}></div>}
            </div>
        </nav>
    );
};

export default Navbar;
