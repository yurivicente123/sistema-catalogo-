import React from 'react';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_FILE_URL } from '../services/api';

const CartModal = ({ isOpen, onClose, settings }) => {
    const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

    if (!isOpen) return null;

    const handleCheckout = () => {
        const whatsappNumber = settings.whatsapp || '5511999999999';
        const storeName = (settings.themeName || 'SUBLIME STORE').toUpperCase();
        const storeAddress = settings.storeAddress || 'ENDEREÇO NÃO CONFIGURADO';
        const storeContact = settings.storeContact || whatsappNumber;
        const storeEmail = settings.storeEmail || 'contato@loja.com';

        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR');
        const timeStr = now.toLocaleTimeString('pt-BR');

        let message = `*${storeName}*\n\n`;
        message += `${storeAddress.toUpperCase()}\n\n`;
        message += `Telefone: ${storeContact}\n`;
        message += `E-mail: ${storeEmail}\n\n`;
        message += `Cliente: .\n\n`;
        message += `*RECIBO DE PRODUTOS/SERVIÇOS*\n`;
        message += `${dateStr} / ${timeStr}\n\n`;
        message += `----------------------------\n`;
        message += `*PRODUTOS*\n`;
        message += `----------------------------\n`;

        cart.forEach(item => {
            const itemTotal = (item.preco * item.quantity).toFixed(2).replace('.', ',');
            message += `${item.nome.toUpperCase()}\n`;
            message += `QTD: ${item.quantity.toFixed(1)}  x  R$ ${item.preco.toFixed(2).replace('.', ',')}  =  R$ ${itemTotal}\n`;
            message += `----------------------------\n`;
        });

        message += `*TOTAL DOS PRODUTOS = R$ ${total.toFixed(2).replace('.', ',')}*\n`;
        message += `----------------------------\n\n`;
        message += `----------------------------\n`;
        message += `*TOTAL GERAL = R$ ${total.toFixed(2).replace('.', ',')}*\n`;
        message += `DESCONTOS = R$ 0,00\n`;
        message += `*TOTAL (GERAL - DESCONTOS) = R$ ${total.toFixed(2).replace('.', ',')}*\n`;
        message += `VALOR PAGO = R$ 0,00\n`;
        message += `RESTANTE A PAGAR = R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
        message += `Obrigado`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div className="glass" style={{
                width: '100%', maxWidth: '400px', height: '100%', padding: '2rem',
                animation: 'slideIn 0.3s ease-out forwards', display: 'flex', flexDirection: 'column',
                borderRadius: '24px 0 0 24px'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Seu Pedido</h2>
                    <button onClick={onClose} style={{ background: '#eee', borderRadius: '50%', padding: '5px' }}><X size={24} /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem', paddingRight: '5px' }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                            <ShoppingBag size={48} color="#ddd" style={{ margin: '0 auto 1rem' }} />
                            <p style={{ color: 'var(--gray)' }}>O carrinho está vazio.</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <img src={`${API_FILE_URL}${item.imagem}`} alt={item.nome} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.nome}</h4>
                                    <p style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>R$ {item.preco.toFixed(2).replace('.', ',')}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem' }}>
                                        <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '4px', background: '#f0f0f0', borderRadius: '4px' }}><Minus size={14} /></button>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '4px', background: '#f0f0f0', borderRadius: '4px' }}><Plus size={14} /></button>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} style={{ color: '#ff4757', padding: '10px' }}><Trash2 size={18} /></button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div style={{ borderTop: '2px dashed #eee', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Total Geral</span>
                            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>R$ {total.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button
                            className="btn-primary"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '18px', fontSize: '1.1rem' }}
                            onClick={handleCheckout}
                        >
                            <MessageSquare size={22} fill="white" />
                            Finalizar no WhatsApp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
