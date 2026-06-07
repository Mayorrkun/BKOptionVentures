import { useState } from 'react';
import { useProducts } from '../../context/ProductsContext.jsx';
import { ADMIN_PASSWORD } from '../../config.js';
import '../../css/admin.css';
import '../../css/adminProducts.css';

const RENTAL_CATEGORIES = ['Canopies', 'Chairs', 'Tables', 'Fans', 'Air Conditioners'];
const SALES_CATEGORIES = ['Chairs', 'Tables', 'Fans'];


function emptyForm(type) {
  return {
    name: '',
    category: type === 'rental' ? 'Canopies' : 'Chairs',
    price: '',
    description: '',
    specs: '',
    imagePreview: null,
    stock: '',
  };
}

// ── Add / Edit form ──
function ProductForm({ type, initial, onSave, onCancel }) {
  const isEdit = !!initial;
  const categories = type === 'rental' ? RENTAL_CATEGORIES : SALES_CATEGORIES;

  const [form, setForm] = useState(() => {
    if (initial) {
      return {
        name: initial.name || '',
        category: initial.category || categories[0],
        price: initial.price != null ? String(initial.price) : '',
        description: initial.description || '',
        specs: Array.isArray(initial.specs) ? initial.specs.join('\n') : '',
        imagePreview: null,
        stock: initial.stock != null ? String(initial.stock) : '',
      };
    }
    return emptyForm(type);
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload.php', {
        method: 'POST',
        headers: { 'X-Api-Key': ADMIN_PASSWORD },
        body: formData,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Upload failed');
      set('imagePreview', json.url);
    } catch (err) {
      alert('Could not upload image: ' + err.message);
    }
  }

  const handleSave = () => {
    if (!form.name.trim()) { alert('Product name is required.'); return; }

    const product = {
      id: isEdit ? initial.id : `${type === 'rental' ? 'r' : 's'}_${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      price: 0,
      priceUnit: type === 'rental' ? 'per day' : 'each',
      description: form.description.trim(),
      specs: form.specs.split('\n').map(s => s.trim()).filter(Boolean),
      images: form.imagePreview ? [form.imagePreview] : (initial?.images || []),
      ...(type === 'sale' ? { stock: form.stock === '' ? 0 : +form.stock } : {}),
    };

    onSave(product);
  };

  return (
    <div className="product-form-panel">
      <h3>{isEdit ? 'Edit Product' : `Add ${type === 'rental' ? 'Rental' : 'Sales'} Product`}</h3>
      <div className="product-form-grid">
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Large Canopy (20×20 ft)"
          />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {type === 'sale' && (
          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={e => set('stock', e.target.value)}
              placeholder="0"
            />
          </div>
        )}
        <div className="form-group pf-full">
          <label>Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Describe the product..."
          />
        </div>
        <div className="form-group pf-full">
          <label>Specifications <span className="form-hint">(one per line)</span></label>
          <textarea
            rows={4}
            value={form.specs}
            onChange={e => set('specs', e.target.value)}
            placeholder={'Size: 10ft × 10ft\nColour: White\nCapacity: Up to 20 guests'}
          />
        </div>
        <div className="form-group pf-full">
          <label>Product Image</label>
          <div className="image-upload-zone">
            {(form.imagePreview || initial?.images?.[0]) && (
              <div className="image-preview-wrap">
                <img
                  src={form.imagePreview || initial.images[0]}
                  alt="Preview"
                  className="image-upload-preview"
                />
                {form.imagePreview && (
                  <button
                    type="button"
                    className="image-clear-btn"
                    onClick={() => set('imagePreview', null)}
                    title="Remove uploaded image"
                  >✕</button>
                )}
              </div>
            )}
            <label className="image-upload-btn">
              {form.imagePreview ? 'Replace Image' : (initial?.images?.[0] ? 'Replace Image' : 'Upload Image')}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>
            <span className="form-hint">JPG, PNG, or WebP — max 5 MB</span>
          </div>
        </div>
      </div>
      <div className="product-form-actions">
        <button className="btn btn-secondary btn-md" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary btn-md" onClick={handleSave}>
          {isEdit ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </div>
  );
}

// ── Product table ──
function ProductTable({ products, type, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <p className="no-products-msg">
        No {type === 'rental' ? 'rental' : 'sales'} products yet.
        Click &ldquo;Add Product&rdquo; above to get started.
      </p>
    );
  }

  return (
    <div className="table-wrap">
      <table className="products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            {type === 'sale' && <th>Stock</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>
                {p.images?.[0]
                  ? <img src={p.images[0]} alt={p.name} className="product-thumb" />
                  : <div className="product-thumb-empty">No img</div>
                }
              </td>
              <td className="pt-name">{p.name}</td>
              <td><span className="cat-badge">{p.category}</span></td>
              {type === 'sale' && <td>{p.stock ?? '—'}</td>}
              <td>
                <div className="pt-actions">
                  <button className="pt-btn-edit" onClick={() => onEdit(p)}>Edit</button>
                  <button className="pt-btn-delete" onClick={() => onDelete(p)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ──
export default function AdminProductsPage() {
  const { rentalProducts, salesProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const [activeTab, setActiveTab] = useState('rental');
  const [formState, setFormState] = useState(null); // null | { mode: 'add' | 'edit', product?: {} }
  const [confirmDelete, setConfirmDelete] = useState(null); // null | { type, id, name }

  const products = activeTab === 'rental' ? rentalProducts : salesProducts;

  function switchTab(tab) {
    setActiveTab(tab);
    setFormState(null);
  }

  function handleSave(product) {
    if (formState.mode === 'add') {
      addProduct(activeTab, product);
    } else {
      updateProduct(activeTab, product.id, product);
    }
    setFormState(null);
  }

  function handleDeleteRequest(product) {
    setConfirmDelete({ type: activeTab, id: product.id, name: product.name });
  }

  function confirmDeleteProduct() {
    deleteProduct(confirmDelete.type, confirmDelete.id);
    setConfirmDelete(null);
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Product Manager</h1>
        <p>Add, edit, and remove products from your rental and sales catalogue</p>
      </div>

      <div className="admin-body container">

        {/* Tab bar */}
        <div className="products-tab-bar">
          <div className="tab-strip">
            <button
              className={`tab-pill${activeTab === 'rental' ? ' active' : ''}`}
              onClick={() => switchTab('rental')}
            >
              Rentals ({rentalProducts.length})
            </button>
            <button
              className={`tab-pill${activeTab === 'sale' ? ' active' : ''}`}
              onClick={() => switchTab('sale')}
            >
              Sales ({salesProducts.length})
            </button>
          </div>
          {!formState && (
            <button className="btn btn-primary btn-sm" onClick={() => setFormState({ mode: 'add' })}>
              + Add {activeTab === 'rental' ? 'Rental' : 'Sales'} Product
            </button>
          )}
        </div>

        {/* Add / Edit form */}
        {formState && (
          <ProductForm
            key={formState.product?.id ?? 'new'}
            type={activeTab}
            initial={formState.mode === 'edit' ? formState.product : null}
            onSave={handleSave}
            onCancel={() => setFormState(null)}
          />
        )}

        {/* Table */}
        <div className="admin-section">
          <ProductTable
            products={products}
            type={activeTab}
            onEdit={p => setFormState({ mode: 'edit', product: p })}
            onDelete={handleDeleteRequest}
          />
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {confirmDelete && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>Delete Product</h3>
            <p>
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn btn-secondary btn-md" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={confirmDeleteProduct}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
