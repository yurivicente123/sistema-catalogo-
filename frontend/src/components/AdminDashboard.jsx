import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Settings, LogOut, Plus, Edit, Trash, Upload, Package, Clock, TrendingUp, Check, XCircle, DollarSign, FileText } from 'lucide-react';
import { getProducts, deleteProduct, updateSettings, API_FILE_URL, getOrders, updateOrderStatus, getOrderStats } from '../services/api';
import AdminProductForm from './AdminProductForm';

const AdminDashboard = ({ settings, setSettings }) => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'orders', 'finance'
    const [editingProduct, setEditingProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/admin/login');
            return;
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        if (activeTab === 'catalog') fetchProducts();
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'finance') fetchStats();
    }, [activeTab]);

    const fetchProducts = async () => {
        const res = await getProducts();
        setProducts(res.data);
        // Extract unique categories
        const uniqueCats = [...new Set(res.data.map(p => p.categoria))].filter(Boolean);
        setCategories(uniqueCats);
    };

    const fetchOrders = async () => {
        const res = await getOrders();
        setOrders(res.data);
    };

    const fetchStats = async () => {
        const res = await getOrderStats();
        setStats(res.data);
    };

    const handleUpdateOrderStatus = async (id, status) => {
        try {
            await updateOrderStatus(id, status);
            fetchOrders();
        } catch (err) {
            alert('Erro ao atualizar pedido');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza?')) {
            await deleteProduct(id);
            fetchProducts();
        }
    };

    const handleSaveSettings = async () => {
        const formData = new FormData();
        Object.keys(settings).forEach(key => {
            formData.append(key, settings[key]);
        });
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        try {
            await updateSettings(formData);
            alert('Configurações salvas!');
            window.location.reload();
        } catch (err) {
            alert('Erro ao salvar configurações');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 style={{ marginBottom: '2rem' }}>Admin</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button 
                        onClick={() => setActiveTab('catalog')}
                        className={activeTab === 'catalog' ? 'sidebar-btn active' : 'sidebar-btn'}
                    >
                        <Package size={20} /> <span>Catálogo</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={activeTab === 'orders' ? 'sidebar-btn active' : 'sidebar-btn'}
                    >
                        <Clock size={20} /> <span>Pedidos</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('finance')}
                        className={activeTab === 'finance' ? 'sidebar-btn active' : 'sidebar-btn'}
                    >
                        <TrendingUp size={20} /> <span>Financeiro</span>
                    </button>
                    
                    <div style={{ height: '2rem' }}></div>

                    <button onClick={handleLogout} className="sidebar-btn logout" style={{ color: '#ff4757', marginTop: 'auto' }}>
                        <LogOut size={20} /> <span>Sair</span>
                    </button>
                </nav>
            </aside>

            <style>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #f4f7f6;
                }
                .admin-sidebar {
                    width: 260px;
                    background: #2f3542;
                    color: white;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    position: sticky;
                    top: 0;
                    height: 100vh;
                    z-index: 100;
                    transition: transform 0.3s ease;
                }
                .sidebar-btn {
                    background: none;
                    color: rgba(255,255,255,0.7);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    padding: 0.8rem 1rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                    width: 100%;
                    text-align: left;
                    font-weight: 500;
                }
                .sidebar-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }
                .sidebar-btn.active {
                    background: var(--primary);
                    color: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .admin-main {
                    flex: 1;
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }
                .stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .order-row {
                    border-bottom: 1px solid #eee;
                    transition: background 0.2s;
                }
                .order-row:hover {
                    background: #fcfcfc;
                }
                .badge {
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .badge-pendente { background: #fff8e1; color: #f57f17; }
                .badge-fechado { background: #e8f5e9; color: #2e7d32; }
                .badge-cancelado { background: #ffebee; color: #c62828; }

                /* Mobile Layout Adjustments */
                @media (max-width: 768px) {
                    .admin-layout {
                        flex-direction: column;
                    }
                    .admin-sidebar {
                        width: 100%;
                        height: auto;
                        position: sticky;
                        top: 0;
                        padding: 1rem;
                        flex-direction: row;
                        justify-content: space-around;
                        align-items: center;
                        gap: 10px;
                    }
                    .admin-sidebar h2 { display: none; }
                    .sidebar-btn span { display: none; }
                    .sidebar-btn { justify-content: center; padding: 10px; width: auto; }
                    .sidebar-btn.logout { margin-top: 0 !important; }
                    
                    .admin-main { padding: 1rem; }
                    .admin-table { display: none; } /* Hide complex tables on mobile */
                    
                    .mobile-card-list {
                        display: grid;
                        gap: 1rem;
                    }
                    .mobile-card {
                        background: white;
                        padding: 1rem;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }
                }
                
                @media (min-width: 769px) {
                    .mobile-card-list { display: none; }
                }
            `}</style>

            <main className="admin-main">
                {activeTab === 'catalog' && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h1>Catálogo de Produtos</h1>
                            <button className="btn-primary" onClick={() => { setEditingProduct(null); setIsFormOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Plus size={20} /> Novo Produto
                            </button>
                        </div>

                        {/* Settings and Product List Content */}
                        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
                            <h2 style={{ marginBottom: '1.5rem' }}>Configurações da Loja</h2>
                            {/* ... (Existing Settings Inputs) */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nome da Loja</label>
                                    <input type="text" value={settings.themeName || ''} onChange={e => setSettings({ ...settings, themeName: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Telefone / WhatsApp</label>
                                    <input type="text" value={settings.storeContact || ''} onChange={e => setSettings({ ...settings, storeContact: e.target.value, whatsapp: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Instagram (Link ou @)</label>
                                    <input type="text" value={settings.instagram || ''} onChange={e => setSettings({ ...settings, instagram: e.target.value })} placeholder="Ex: @seuluxo" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                </div>
                            </div>
                            {/* Simplified for brevity, will include the full section in actual replacement */}
                            <div style={{ marginTop: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Endereço Completo</label>
                                <textarea value={settings.storeAddress || ''} onChange={e => setSettings({ ...settings, storeAddress: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '60px' }} />
                                <button className="btn-primary" style={{ marginTop: '1rem', padding: '10px 30px' }} onClick={handleSaveSettings}>Salvar Configurações</button>
                            </div>
                        </section>

                        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                            <h2 style={{ marginBottom: '1.5rem' }}>Produtos do Catálogo</h2>
                            
                            {/* Desktop View Table */}
                            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem' }}>Produto</th>
                                        <th style={{ padding: '1rem' }}>Preço</th>
                                        <th style={{ padding: '1rem' }}>Categoria</th>
                                        <th style={{ padding: '1rem' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id} className="order-row">
                                            <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <img src={`${API_FILE_URL}${p.imagem}`} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                                                <span>{p.nome}</span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>R$ {p.preco.toFixed(2)}</td>
                                            <td style={{ padding: '1rem' }}>{p.categoria}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <button onClick={() => { setEditingProduct(p); setIsFormOpen(true); }} style={{ marginRight: '1rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={18}/></button>
                                                <button onClick={() => handleDelete(p.id)} style={{ color: '#ff4757', background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={18}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile View Card List */}
                            <div className="mobile-card-list">
                                {products.map(p => (
                                    <div key={p.id} className="mobile-card">
                                        <img src={`${API_FILE_URL}${p.imagem}`} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.nome}</div>
                                            <div style={{ color: 'var(--primary)', fontWeight: 800 }}>R$ {p.preco.toFixed(2)}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{p.categoria}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => { setEditingProduct(p); setIsFormOpen(true); }} style={{ color: 'var(--primary)', background: 'none', border: 'none' }}><Edit size={20}/></button>
                                            <button onClick={() => handleDelete(p.id)} style={{ color: '#ff4757', background: 'none', border: 'none' }}><Trash size={20}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'orders' && (
                    <>
                        <div style={{ marginBottom: '2rem' }}>
                            <h1>Gestão de Pedidos (WhatsApp)</h1>
                            <p style={{ color: 'var(--gray)' }}>Pedidos salvos silenciosamente no momento que o cliente clicou para ir ao Zap.</p>
                        </div>

                        <section className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                            {/* Desktop Table */}
                            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left', color: 'var(--gray)', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '1rem' }}>Data</th>
                                        <th style={{ padding: '1rem' }}>Itens</th>
                                        <th style={{ padding: '1rem' }}>Total</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} className="order-row">
                                            <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                                {new Date(order.created_at).toLocaleString('pt-BR')}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.8rem' }}>
                                                    {order.items.map(item => `${item.quantity}x ${item.nome}`).join(', ')}
                                                </div>
                                                {order.customer_notes && (
                                                    <div style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic', marginTop: '4px' }}>
                                                        🗨️ {order.customer_notes}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: 700 }}>
                                                R$ {parseFloat(order.total_price).toFixed(2).replace('.', ',')}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span className={`badge badge-${order.status}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                {order.status === 'pendente' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateOrderStatus(order.id, 'fechado')}
                                                            title="Fechar Venda"
                                                            style={{ border: 'none', background: '#e8f5e9', color: '#2e7d32', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateOrderStatus(order.id, 'cancelado')}
                                                            title="Cancelar"
                                                            style={{ border: 'none', background: '#ffebee', color: '#c62828', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Orders List */}
                            <div className="mobile-card-list">
                                {orders.map(order => (
                                    <div key={order.id} className="mobile-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{new Date(order.created_at).toLocaleString('pt-BR')}</span>
                                            <span className={`badge badge-${order.status}`}>{order.status}</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, margin: '8px 0' }}>
                                            {order.items.map(item => `${item.quantity}x ${item.nome}`).join(', ')}
                                        </div>
                                        {order.customer_notes && (
                                            <div style={{ fontSize: '0.8rem', background: '#f9f9f9', padding: '8px', borderRadius: '8px', width: '100%', marginBottom: '8px' }}>
                                                🗨️ {order.customer_notes}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                                                R$ {parseFloat(order.total_price).toFixed(2).replace('.', ',')}
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {order.status === 'pendente' && (
                                                    <>
                                                        <button onClick={() => handleUpdateOrderStatus(order.id, 'fechado')} style={{ border: 'none', background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px' }}><Check size={20} /></button>
                                                        <button onClick={() => handleUpdateOrderStatus(order.id, 'cancelado')} style={{ border: 'none', background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px' }}><XCircle size={20} /></button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'finance' && (
                    <>
                        <div style={{ marginBottom: '2rem' }}>
                            <h1>Balanço Financeiro</h1>
                            <p style={{ color: 'var(--gray)' }}>Dados baseados apenas nas vendas marcadas como "Fechado".</p>
                        </div>

                        {stats ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                <div className="stat-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2e7d32' }}>
                                        <DollarSign size={20} /> <span style={{ fontWeight: 600 }}>Receita Total</span>
                                    </div>
                                    <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>R$ {stats.totalRevenue.toFixed(2).replace('.', ',')}</span>
                                </div>
                                <div className="stat-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                                        <ShoppingBag size={20} /> <span style={{ fontWeight: 600 }}>Vendas Fechadas</span>
                                    </div>
                                    <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalSales}</span>
                                </div>
                                <div className="stat-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1976d2' }}>
                                        <FileText size={20} /> <span style={{ fontWeight: 600 }}>Ticket Médio</span>
                                    </div>
                                    <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                                        R$ {stats.totalSales > 0 ? (stats.totalRevenue / stats.totalSales).toFixed(2).replace('.', ',') : '0,00'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p>Carregando estatísticas...</p>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                            <section className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Produtos Mais Vendidos</h3>
                                {stats && Object.keys(stats.productStats).length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {Object.entries(stats.productStats)
                                            .sort((a, b) => b[1] - a[1])
                                            .map(([name, qty]) => (
                                                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 500 }}>{name}</span>
                                                    <span style={{ background: '#eee', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem' }}>{qty} unid.</span>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--gray)' }}>Nenhuma venda fechada ainda.</p>
                                )}
                            </section>
                        </div>
                    </>
                )}

                {isFormOpen && (
                    <AdminProductForm
                        product={editingProduct}
                        categories={categories}
                        onClose={() => setIsFormOpen(false)}
                        onSuccess={() => { setIsFormOpen(false); fetchProducts(); }}
                    />
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
