import { useState, useEffect } from 'react';
import { cultureService } from '../services/cultureService';
import Alert from '../components/Common/Alert';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import Modal from '../components/Common/Modal';

export default function CulturesPage() {
  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCulture, setEditingCulture] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    surface: '',
    planting_date: '',
    status: 'Semis',
  });

  const fetchCultures = async () => {
    try {
      setLoading(true);
      const data = await cultureService.getAll({ search });
      setCultures(data.data || data);
    } catch (err) {
      setError('Erreur lors du chargement des cultures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCultures();
  }, [search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingCulture(null);
    setFormData({
      name: '',
      type: '',
      surface: '',
      planting_date: new Date().toISOString().split('T')[0],
      status: 'Semis',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (culture) => {
    setEditingCulture(culture);
    setFormData({
      name: culture.name,
      type: culture.type,
      surface: culture.surface,
      planting_date: culture.planting_date?.split('T')[0] || '',
      status: culture.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCulture) {
        await cultureService.update(editingCulture.id, formData);
        setSuccess('Culture modifiée avec succès');
      } else {
        await cultureService.create(formData);
        setSuccess('Culture créée avec succès');
      }
      setIsModalOpen(false);
      fetchCultures();
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
    if (!window.confirm('Voulez-vous vraiment supprimer cette culture ?')) return;

    try {
      await cultureService.delete(id);
      setSuccess('Culture supprimée avec succès');
      fetchCultures();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🌱 Cultures</h1>
        <Button onClick={openCreateModal}>➕ Nouvelle culture</Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Barre de recherche */}
      <div className="mb-6">
        <Input
          placeholder="🔍 Rechercher par nom ou type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : cultures.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-gray-500">Aucune culture trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Surface (ha)</th>
                <th className="px-6 py-3 text-left">Plantation</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cultures.map((culture) => (
                <tr key={culture.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{culture.name}</td>
                  <td className="px-6 py-4">{culture.type}</td>
                  <td className="px-6 py-4">{culture.surface}</td>
                  <td className="px-6 py-4">
                    {new Date(culture.planting_date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {culture.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(culture)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(culture.id)}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCulture ? 'Modifier la culture' : 'Nouvelle culture'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Tomates"
            required
          />
          <Input
            label="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Ex: Légume"
            required
          />
          <Input
            label="Surface (ha)"
            name="surface"
            type="number"
            step="0.01"
            value={formData.surface}
            onChange={handleChange}
            placeholder="Ex: 0.5"
            required
          />
          <Input
            label="Date de plantation"
            name="planting_date"
            type="date"
            value={formData.planting_date}
            onChange={handleChange}
            required
          />
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Semis">Semis</option>
              <option value="En croissance">En croissance</option>
              <option value="Prêt pour récolte">Prêt pour récolte</option>
              <option value="Récoltée">Récoltée</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {editingCulture ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}