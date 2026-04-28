import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        const qtyToAdd = product.quantity || 1;
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + qtyToAdd } : item
                );
            }
            return [...prev, { ...product, quantity: qtyToAdd }];
        });
        
        // Show notification
        setToastMessage(`Adicionado: ${qtyToAdd}x ${product.nome}`);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, amount) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + amount);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((acc, item) => acc + (item.preco * item.quantity), 0);
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount
        }}>
            {children}
            {/* Toast Notification */}
            {toastMessage && (
                <div style={{
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: '#2ecc71', color: 'white', padding: '12px 24px', borderRadius: '50px',
                    boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)', zIndex: 9999,
                    fontWeight: 600, fontSize: '0.9rem', animation: 'fadeInDown 0.3s ease-out'
                }}>
                    ✨ {toastMessage}
                </div>
            )}
            <style>
                {`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                `}
            </style>
        </CartContext.Provider>
    );
};
