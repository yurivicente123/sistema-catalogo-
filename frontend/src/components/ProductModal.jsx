import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_FILE_URL } from '../services/api';

const ProductModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(product?.compra_minima || 1);
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (product) {
            setQuantity(product.compra_minima || 1);
            
            // Build images array
            let imgs = [];
            if (product.imagens && product.imagens.length > 0) {
                imgs = product.imagens;
            } else if (product.imagem) {
                imgs = [product.imagem];
            }
            // Fallback placeholder
            if (imgs.length === 0) {
                imgs = ['https://via.placeholder.com/500x500?text=Sem+Foto'];
            }
            setImages(imgs.map(img => img.startsWith('http') ? img : `${API_FILE_URL}${img}`));
            setCurrentImage(0);
        }
    }, [product]);

    if (!product) return null;

    const handleNext = () => setCurrentImage((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

    // Generate quantity options
    const options = [];
    const min = product.compra_minima || 1;
    // If minimum is large (e.g. 10), increment by 10 or 5. Else increment by 1.
    const step = min >= 10 ? 10 : (min >= 5 ? 5 : 1); 
    for (let i = 0; i < 20; i++) {
        options.push(min + (i * step));
    }

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        onClose(); // Optional: close modal on add, or keep it open.
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '1rem'
        }} onClick={onClose}>
            
            <div className="glass animate-fade" style={{
                background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '450px', 
                overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '95vh'
            }} onClick={e => e.stopPropagation()}>

                {/* Close Button */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '15px', zIndex: 10,
                    background: 'rgba(255,255,255,0.8)', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <X size={20} color="#333" />
                </button>

                {/* Image Carousel */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: '#f5f5f5' }}>
                    <img src={images[currentImage]} alt={product.nome} style={{
                        width: '100%', height: '100%', objectFit: 'cover'
                    }} />
                    
                    {images.length > 1 && (
                        <>
                            <button onClick={handlePrev} style={{
                                position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.8)', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}>
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={handleNext} style={{
                                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                background: 'rgba(255,255,255,0.8)', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}>
                                <ChevronRight size={20} />
                            </button>
                            
                            {/* Dots */}
                            <div style={{
                                position: 'absolute', bottom: '15px', left: '0', right: '0', 
                                display: 'flex', justifyContent: 'center', gap: '8px'
                            }}>
                                {images.map((_, idx) => (
                                    <div key={idx} style={{
                                        width: '8px', height: '8px', borderRadius: '50%', 
                                        background: idx === currentImage ? 'var(--primary)' : 'rgba(255,255,255,0.8)'
                                    }} />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Details Section */}
                <div style={{ padding: '24px', overflowY: 'auto' }}>
                    <h2 className="font-product-name" style={{ 
                        fontSize: '1.2rem', textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' 
                    }}>
                        {product.nome}
                    </h2>
                    
                    {/* Full Description */}
                    {product.descricao && (
                        <div style={{ 
                            fontSize: '0.85rem', color: '#666', textAlign: 'center', marginBottom: '20px', 
                            lineHeight: '1.6', whiteSpace: 'pre-wrap'
                        }}>
                            {product.descricao}
                        </div>
                    )}
                    
                    {product.prazo_entrega && (
                        <p style={{ fontSize: '0.85rem', color: '#d35400', fontWeight: 600, textAlign: 'center', marginBottom: '20px' }}>
                            ⏱️ Prazo de produção: {product.prazo_entrega}
                        </p>
                    )}

                    {/* Styled Selector mimicking the screenshot */}
                    <div style={{ 
                        border: '2px solid rgba(255, 71, 87, 0.2)', borderRadius: '16px', padding: '15px', 
                        marginBottom: '20px', background: 'rgba(255, 71, 87, 0.03)'
                    }}>
                        <label style={{ 
                            display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', 
                            textAlign: 'center', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' 
                        }}>
                            Quantidade e Valor Total:
                        </label>
                        <select 
                            value={quantity} 
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            style={{ 
                                width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 71, 87, 0.3)', 
                                outline: 'none', background: 'white', color: 'var(--primary)', fontSize: '1.05rem', 
                                fontWeight: 700, textAlign: 'center', appearance: 'none', cursor: 'pointer'
                            }}
                        >
                            {options.map(qty => (
                                <option key={qty} value={qty} style={{ color: '#333' }}>
                                    {qty} UN - R$ {(product.preco * qty).toFixed(2).replace('.', ',')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button 
                        className="btn-primary" 
                        onClick={handleAddToCart}
                        style={{ 
                            width: '100%', padding: '16px', fontSize: '1.05rem', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' 
                        }}
                    >
                        <ShoppingBag size={20} />
                        Adicionar à sacola
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
