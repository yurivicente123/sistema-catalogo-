import React from 'react';
import { useCart } from '../context/CartContext';
import { API_FILE_URL } from '../services/api';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const imageUrl = product.imagem.startsWith('http') ? product.imagem : `${API_FILE_URL}${product.imagem}`;

    return (
        <div className="animate-fade" style={{ background: 'transparent' }}>
            <div style={{
                position: 'relative',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                aspectRatio: '0.85', /* Slightly taller for a more compact look */
                background: '#fff',
                boxShadow: 'var(--shadow)',
                marginBottom: '12px'
            }}>
                <img src={imageUrl || 'https://via.placeholder.com/300x300?text=Produto'}
                    alt={product.nome}
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'opacity 0.3s ease-in'
                    }} />
            </div>

            <div style={{ textAlign: 'center', padding: '0 5px' }}>
                <h4 style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--secondary)',
                    marginBottom: '2px',
                    letterSpacing: '0.3px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '2.2em'
                }}>
                    {product.nome}
                </h4>
                <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--secondary)', marginBottom: '10px' }}>
                    R$ {parseFloat(product.preco).toFixed(2).replace('.', ',')}
                </p>

                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                    onClick={() => addToCart(product)}
                >
                    Comprar
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
