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
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{ width: '250px', background: 'var(--secondary)', color: 'white', padding: '2rem' }}>
                <h2 style={{ marginBottom: '2rem' }}>Admin</h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button style={{ background: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left', fontWeight: 'bold' }}>
                        <ShoppingBag size={20} /> Painel Geral
                    </button>
                    <button onClick={handleLogout} style={{ background: 'none', color: '#ff4757', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', padding: '2rem 0' }}>
                        <LogOut size={20} /> Sair
                    </button>
                </nav>
            </aside>

            <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5', overflowY: 'auto' }}>
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>E-mail de Contato</label>
                            <input type="email" value={settings.storeEmail || ''} onChange={e => setSettings({ ...settings, storeEmail: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
                        </div>
                    </div>

                    <button className="btn-primary" style={{ marginTop: '2rem', padding: '15px 40px' }} onClick={handleSaveSettings}>
                        Salvar Configurações
                    </button>
                </section>

                <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Produtos Cadastrados</h2>
                    <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
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
                                        <button onClick={() => { setEditingProduct(p); setIsFormOpen(true); }} style={{ color: 'var(--secondary)' }}><Edit size={20} /></button>
                                        <button onClick={() => handleDelete(p.id)} style={{ color: '#ff4757' }}><Trash size={20} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
