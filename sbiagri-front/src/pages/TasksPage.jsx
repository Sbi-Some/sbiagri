import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { cultureService } from '../services/cultureService';
import Alert from '../components/Common/Alert';
import Button from '../components/Common/Button';
import Input from '../components/Common/Input';
import Modal from '../components/Common/Modal';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    due_date: '',
    culture_id: '',
    status: 'À faire',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll(filterStatus ? { status: filterStatus } : {});
      setTasks(data.data || data);
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  const fetchCultures = async () => {
    try {
      const data = await cultureService.getAll();
      setCultures(data.data || data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCultures();
  }, [filterStatus]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      due_date: new Date().toISOString().split('T')[0],
      culture_id: '',
      status: 'À faire',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      due_date: task.due_date?.split('T')[0] || '',
      culture_id: task.culture_id || '',
      status: task.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = {
        ...formData,
        culture_id: formData.culture_id || null,
      };

      if (editingTask) {
        await taskService.update(editingTask.id, data);
        setSuccess('Tâche modifiée avec succès');
      } else {
        await taskService.create(data);
        setSuccess('Tâche créée avec succès');
      }
      setIsModalOpen(false);
      fetchTasks();
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
    if (!window.confirm('Supprimer cette tâche ?')) return;
    try {
      await taskService.delete(id);
      setSuccess('Tâche supprimée');
      fetchTasks();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'À faire': return 'bg-yellow-100 text-yellow-700';
      case 'En cours': return 'bg-blue-100 text-blue-700';
      case 'Terminée': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📝 Tâches agricoles</h1>
        <Button onClick={openCreateModal}>➕ Nouvelle tâche</Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Filtres */}
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-4 py-2 rounded-lg ${filterStatus === '' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilterStatus('À faire')}
          className={`px-4 py-2 rounded-lg ${filterStatus === 'À faire' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
        >
          À faire
        </button>
        <button
          onClick={() => setFilterStatus('En cours')}
          className={`px-4 py-2 rounded-lg ${filterStatus === 'En cours' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
        >
          En cours
        </button>
        <button
          onClick={() => setFilterStatus('Terminée')}
          className={`px-4 py-2 rounded-lg ${filterStatus === 'Terminée' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
        >
          Terminées
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : tasks.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-gray-500">Aucune tâche trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{task.title}</h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>📅 {new Date(task.due_date).toLocaleDateString('fr-FR')}</span>
                  {task.culture && <span>🌱 {task.culture.name}</span>}
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => openEditModal(task)}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Titre"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Irriguer parcelle A"
            required
          />
          <Input
            label="Date prévue"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Culture associée (optionnel)</label>
            <select
              name="culture_id"
              value={formData.culture_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Aucune</option>
              {cultures.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="Terminée">Terminée</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit">{editingTask ? 'Modifier' : 'Créer'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}