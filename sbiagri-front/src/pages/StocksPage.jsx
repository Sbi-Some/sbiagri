import { useState, useEffect } from 'react';
import { stockService } from '../services/stockService';
import Alert from '../components/Common/Alert';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import Modal from '../components/Common/Modal';

export default function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    alert_threshold: '',
  });

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const params = showLowStock ? { low_stock: 'true' } : {};
      const data = await stockService.getAll(params);
      setStocks(data.data || data);
    } catch (err) {
      setError('Erreur lors du chargement des stocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [showLowStock]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingStock(null);
    setFormData({ name: '', quantity: '', unit: 'kg', alert_threshold: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (stock) => {
    setEditingStock(stock);
    setFormData({
      name: stock.name,
      quantity: stock.quantity,
      unit: stock.unit,
      alert_threshold: stock.alert_threshold,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingStock) {
        await stockService.update(editingStock.id, formData);
        setSuccess('Stock modifié avec succès');
      } else {
        await stockService.create(formData);
        setSuccess('Article ajouté au stock');
      }
      setIsModalOpen(false);
      fetchStocks();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError('Erreur lors de l\'enregistrement');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      await stockService.delete(id);
      setSuccess('Article supprimé');
      fetchStocks();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const isLowStock = (stock) => parseFloat(stock.quantity) <= parseFloat(stock.alert_threshold);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📦 Stocks d'intrants</h1>
        <Button onClick={openCreateModal}>➕ Nouvel article</Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Filtre */}
      <div className="mb-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-gray-700">Afficher uniquement les stocks en alerte</span>
        </label>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : stocks.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-gray-500">Aucun article en stock</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Quantité</th>
                <th className="px-6 py-3 text-left">Seuil d'alerte</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.id} className={`border-b hover:bg-gray-50 ${isLowStock(stock) ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 font-medium">{stock.name}</td>
                  <td className="px-6 py-4">{stock.quantity} {stock.unit}</td>
                  <td className="px-6 py-4">{stock.alert_threshold} {stock.unit}</td>
                  <td className="px-6 py-4">
                    {isLowStock(stock) ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">⚠️ Alerte</span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">✅ OK</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(stock)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(stock.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStock ? 'Modifier l\'article' : 'Nouvel article'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nom de l'article"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Engrais NPK"
            required
          />
          <Input
            label="Quantité"
            name="quantity"
            type="number"
            step="0.01"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Unité</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="kg">kg</option>
              <option value="L">L</option>
              <option value="unités">unités</option>
              <option value="sacs">sacs</option>
            </select>
          </div>
          <Input
            label="Seuil d'alerte"
            name="alert_threshold"
            type="number"
            step="0.01"
            value={formData.alert_threshold}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit">{editingStock ? 'Modifier' : 'Créer'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}