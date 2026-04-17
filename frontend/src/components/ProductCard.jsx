import React from 'react';
import { useCart } from '../context/CartContext';
import { API_FILE_URL } from '../services/api';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const imageUrl = product.imagem.startsWith('http') ? product.imagem : `${API_FILE_URL}${product.imagem}`;

    return (
        <div className="animate-fade" style={{ 
            background: 'transparent', 
            display: 'flex', 
            flexDirection: 'column',
            height: '100%' 
        }}>
            <div style={{
                position: 'relative',
                borderRadius: '0', 
                overflow: 'hidden',
                aspectRatio: '1', /* Square layout */
                background: '#fff',
                boxShadow: 'var(--shadow)',
                marginBottom: '15px'
            }}>
                <img src={imageUrl || 'https://via.placeholder.com/300x300?text=Produto'}
                    alt={product.nome}
                    loading="lazy"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '0',
                        transition: 'opacity 0.3s ease-in'
                    }} />
            </div>

            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                textAlign: 'left', 
                padding: '0 5px' 
            }}>
                <h4 className="font-product-name" style={{
                    fontSize: '0.85rem',
                    color: 'var(--secondary)',
                    marginBottom: '8px',
                    letterSpacing: '0.3px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    minHeight: '2.5rem', /* Ensure space for 2 lines */
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {product.nome}
                </h4>
                
                <div style={{ marginBottom: '12px' }}>
                    <p className="font-product-price" style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '2px' }}>
                        R$ {parseFloat(product.preco).toFixed(2).replace('.', ',')}
                    </p>
                    {product.compra_minima > 1 && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray)', fontWeight: 600 }}>
                            Compra mínima: {product.compra_minima} unidades
                        </p>
                    )}
                </div>

                {product.descricao && (
                    <p style={{ 
                        fontSize: '0.8rem', 
                        color: '#666', 
                        marginBottom: '10px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.4'
                    }}>
                        {product.descricao}
                    </p>
                )}

                {product.prazo_entrega && (
                    <p style={{ fontSize: '0.75rem', color: '#d35400', fontWeight: 700, marginBottom: '15px' }}>
                        ⏱️ Pronto em até {product.prazo_entrega}
                    </p>
                )}

                <button
                    className="btn-primary"
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        fontSize: '0.85rem',
                        marginTop: 'auto' /* Pushes button to bottom */
                    }}
                    onClick={() => addToCart(product)}
                >
                    Comprar
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
