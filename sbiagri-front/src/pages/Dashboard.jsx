import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import Alert from '../components/Common/Alert';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dashboardService.getSummary();
        setData(result);
      } catch (err) {
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Tableau de bord</h1>

      {/* Compteurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="text-3xl mb-2">🌱</div>
          <div className="text-3xl font-bold text-gray-800">{data.counters.total_cultures}</div>
          <div className="text-gray-500">Cultures</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-3xl font-bold text-gray-800">{data.counters.total_tasks}</div>
          <div className="text-gray-500">Tâches en cours</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-3xl font-bold text-gray-800">{data.counters.low_stocks}</div>
          <div className="text-gray-500">Alertes de stock</div>
        </div>
      </div>

      {/* Prochaines tâches */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🔔 Prochaines tâches</h2>
        {data.upcoming_tasks.length === 0 ? (
          <p className="text-gray-500">Aucune tâche à venir</p>
        ) : (
          <ul className="space-y-2">
            {data.upcoming_tasks.map((task) => (
              <li key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{task.title}</span>
                  {task.culture && (
                    <span className="text-sm text-gray-500 ml-2">({task.culture.name})</span>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  📅 {new Date(task.due_date).toLocaleDateString('fr-FR')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Alertes de stock */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⚠️ Stocks en alerte</h2>
        {data.alert_stocks.length === 0 ? (
          <p className="text-gray-500">Aucun stock en alerte</p>
        ) : (
          <ul className="space-y-2">
            {data.alert_stocks.map((stock) => (
              <li key={stock.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <span className="font-medium">{stock.name}</span>
                <span className="text-red-600 font-bold">
                  {stock.quantity} {stock.unit} (seuil: {stock.alert_threshold})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}