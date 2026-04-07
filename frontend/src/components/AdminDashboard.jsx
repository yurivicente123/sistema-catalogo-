import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Settings, LogOut, Plus, Edit, Trash, Upload } from 'lucide-react';
import { getProducts, deleteProduct, updateSettings, API_FILE_URL } from '../services/api';
import AdminProductForm from './AdminProductForm';

const AdminDashboard = ({ settings, setSettings }) => {
    const [products, setProducts] = useState([]);
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

    const fetchProducts = async () => {
        const res = await getProducts();
        setProducts(res.data);
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
                    <button style={{ background: 'none', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>
                        <ShoppingBag size={20} /> <span>Painel</span>
                    </button>
                    <button onClick={handleLogout} style={{ background: 'none', color: '#ff4757', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
                        <LogOut size={20} /> <span>Sair</span>
                    </button>
                </nav>
            </aside>

            <main className="admin-main">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Configurações do Sistema</h1>
                    <button className="btn-primary" onClick={() => { setEditingProduct(null); setIsFormOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={20} /> Novo Produto
                    </button>
                </div>

                {/* Global Settings Section */}
                <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Dados da Loja (Informações do Recibo)</h2>
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

                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Endereço Completo (Aparece no topo do recibo)</label>
                        <textarea value={settings.storeAddress || ''} onChange={e => setSettings({ ...settings, storeAddress: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }} placeholder="Ex: RUA ALBERTO TEIXEIRA DA CUNHA, Nº 38..." />
                    </div>

                    <h2 style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>Aparência do Catálogo</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Cor Principal</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="color" value={settings.primaryColor || '#ff4757'} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} style={{ width: '50px', height: '42px', border: 'none', borderRadius: '8px' }} />
                                <input type="text" value={settings.primaryColor || ''} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} placeholder="#hex ou rgb" style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Título de Boas-vindas</label>
                            <input type="text" value={settings.heroTitle || ''} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Subtítulo</label>
                            <input type="text" value={settings.heroSubtitle || ''} onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Texto do Banner Informativo</label>
                        <textarea value={settings.bannerText || ''} onChange={e => setSettings({ ...settings, bannerText: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '60px' }} />
                    </div>

                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Logo da Loja</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            {settings.siteLogo && (
                                <img src={`${API_FILE_URL}${settings.siteLogo}`} alt="Current Logo" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                            )}
                            <input type="file" onChange={e => setLogoFile(e.target.files[0])} style={{ display: 'none' }} id="logo-upload" />
                            <label htmlFor="logo-upload" style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                                background: '#eee', borderRadius: '8px', cursor: 'pointer', fontWeight: 500
                            }}>
                                <Upload size={18} /> {logoFile ? logoFile.name : 'Alterar Logo'}
                            </label>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                                <span style={{ fontWeight: 600 }}>Alinhamento:</span>
                                <button onClick={() => setSettings({ ...settings, logoAlignment: 'flex-start' })} style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ddd', background: settings.logoAlignment === 'flex-start' ? 'var(--primary)' : 'white', color: settings.logoAlignment === 'flex-start' ? 'white' : 'black' }}>Esquerda</button>
                                <button onClick={() => setSettings({ ...settings, logoAlignment: 'center' })} style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ddd', background: settings.logoAlignment === 'center' ? 'var(--primary)' : 'white', color: settings.logoAlignment === 'center' ? 'white' : 'black' }}>Centro</button>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '0.8rem' }}>
                            💡 **Dica de Velocidade**: Tente subir fotos de até 500kb para que o seu catálogo carregue instantaneamente em qualquer celular!
                        </p>
                    </div>

                    <h2 style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>Personalização de Fontes e Cores</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { id: 'storeName', label: 'Nome da Loja (Navbar)' },
                            { id: 'heroTitle', label: 'Título do Banner (Pequeno)' },
                            { id: 'heroSubtitle', label: 'Subtítulo do Banner (Grande)' },
                            { id: 'productName', label: 'Nome dos Produtos' },
                            { id: 'productPrice', label: 'Preço dos Produtos' }
                        ].map(part => (
                            <div key={part.id} className="glass" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{part.label}</h4>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Fonte</label>
                                    <select
                                        value={settings[`font_${part.id}`] || 'Inter'}
                                        onChange={e => setSettings({ ...settings, [`font_${part.id}`]: e.target.value })}
                                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: e => e.target.value }}
                                    >
                                        {['Inter', 'Roboto', 'Montserrat', 'Playfair Display', 'Dancing Script', 'Pacifico', 'Outfit', 'Quicksand'].map(f => (
                                            <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Peso</label>
                                        <select
                                            value={settings[`weight_${part.id}`] || 'normal'}
                                            onChange={e => setSettings({ ...settings, [`weight_${part.id}`]: e.target.value })}
                                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                                        >
                                            <option value="light">Fino</option>
                                            <option value="normal">Normal</option>
                                            <option value="bold">Negrito</option>
                                        </select>
                                    </div>
                                    <div style={{ width: '80px' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>Cor</label>
                                        <input
                                            type="color"
                                            value={settings[`color_${part.id}`] || (part.id.includes('Price') ? '#ff4757' : '#2f3542')}
                                            onChange={e => setSettings({ ...settings, [`color_${part.id}`]: e.target.value })}
                                            style={{ width: '100%', height: '35px', border: 'none', borderRadius: '6px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="btn-primary" style={{ marginTop: '2rem', padding: '15px 60px', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)' }} onClick={handleSaveSettings}>
                        Salvar Todas as Configurações
                    </button>
                </section>

                <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Produtos Cadastrados</h2>

                    {/* Desktop View Table */}
                    <table className="admin-table" style={{ width: '100%', background: 'white', borderCollapse: 'collapse', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ background: '#eee', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Imagem</th>
                                <th style={{ padding: '1rem' }}>Nome / Categoria</th>
                                <th style={{ padding: '1rem' }}>Preço</th>
                                <th style={{ padding: '1rem' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <img src={`${API_FILE_URL}${p.imagem}`} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{p.nome}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{p.categoria}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>R$ {p.preco.toFixed(2)}</td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.8rem' }}>
                                        <button onClick={() => { setEditingProduct(p); setIsFormOpen(true); }} style={{ color: 'var(--secondary)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={20} /></button>
                                        <button onClick={() => handleDelete(p.id)} style={{ color: '#ff4757', background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={20} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile View Cards */}
                    <div className="admin-cards">
                        {products.map(p => (
                            <div key={p.id} className="admin-card">
                                <img src={`${API_FILE_URL}${p.imagem}`} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>{p.nome}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{p.categoria}</div>
                                    <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>R$ {p.preco.toFixed(2)}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => { setEditingProduct(p); setIsFormOpen(true); }} style={{ color: 'var(--secondary)', background: 'none', border: 'none' }}><Edit size={20} /></button>
                                    <button onClick={() => handleDelete(p.id)} style={{ color: '#ff4757', background: 'none', border: 'none' }}><Trash size={20} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {isFormOpen && (
                    <AdminProductForm
                        product={editingProduct}
                        onClose={() => setIsFormOpen(false)}
                        onSuccess={() => { setIsFormOpen(false); fetchProducts(); }}
                    />
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
