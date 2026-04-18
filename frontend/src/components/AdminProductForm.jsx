import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { addProduct, updateProduct, API_FILE_URL } from '../services/api';

const AdminProductForm = ({ product, categories, onClose, onSuccess }) => {
    const [nome, setNome] = useState(product?.nome || '');
    const [preco, setPreco] = useState(product?.preco || '');
    const [categoria, setCategoria] = useState(product?.categoria || 'Geral');
    const [precoCusto, setPrecoCusto] = useState(product?.preco_custo || '0');
    const [descricao, setDescricao] = useState(product?.descricao || '');
    const [compraMinima, setCompraMinima] = useState(product?.compra_minima || '1');
    const [prazoEntrega, setPrazoEntrega] = useState(product?.prazo_entrega || '');
    const [imagem, setImagem] = useState(null);
    const [preview, setPreview] = useState(product ? `${API_FILE_URL}${product.imagem}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('preco', preco);
        formData.append('categoria', categoria);
        formData.append('preco_custo', precoCusto);
        formData.append('descricao', descricao);
        formData.append('compra_minima', compraMinima);
        formData.append('prazo_entrega', prazoEntrega);
        if (imagem) formData.append('imagem', imagem);

        try {
            if (product) {
                await updateProduct(product.id, formData);
            } else {
                await addProduct(formData);
            }
            onSuccess();
        } catch (err) {
            alert('Erro ao salvar produto');
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
            <form onSubmit={handleSubmit} className="glass" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', width: '100%', maxWidth: '550px', maxHeight: '95vh', overflowY: 'auto', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.4rem' }}>{product ? 'Editar Produto' : 'Novo Produto'}</h2>
                    <button type="button" onClick={onClose} style={{ background: '#eee', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nome do Produto</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="Ex: Caneca de Porcelana" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Venda (R$)</label>
                        <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="0.00" required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Custo (R$)</label>
                        <input type="number" step="0.01" value={precoCusto} onChange={e => setPrecoCusto(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="0.00" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Categoria</label>
                        <input 
                            type="text" 
                            list="category-suggestions"
                            value={categoria} 
                            onChange={e => setCategoria(e.target.value)} 
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} 
                            placeholder="Escolha ou digite..." 
                            required 
                        />
                        <datalist id="category-suggestions">
                            {categories?.map(cat => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Pedido Mínimo</label>
                        <input type="number" value={compraMinima} onChange={e => setCompraMinima(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="1" />
                    </div>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Prazo de Entrega</label>
                    <input type="text" value={prazoEntrega} onChange={e => setPrazoEntrega(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="Ex: 10 dias úteis" />
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem' }}>Descrição do Produto</label>
                    <textarea value={descricao} onChange={e => setDescricao(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '80px' }} placeholder="Conte detalhes sobre o produto..." />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>Imagem do Produto</label>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        {preview && (
                            <img src={preview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '12px', objectFit: 'cover', border: '3px solid #eee' }} />
                        )}
                        <div style={{ flex: 1 }}>
                            <input type="file" onChange={handleImageChange} style={{ display: 'none' }} id="file-upload" required={!product} />
                            <label htmlFor="file-upload" style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px',
                                background: '#f8f9fa', border: '2px dashed #ddd', borderRadius: '12px', cursor: 'pointer', fontWeight: 500
                            }}>
                                <Upload size={20} /> {imagem ? imagem.name : 'Selecionar Imagem'}
                            </label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>
                    {product ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;
