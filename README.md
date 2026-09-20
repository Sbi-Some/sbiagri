# 🌾 SbiAgri - Gestion agricole simple

Application web **Full-Stack** pour la gestion des cultures, tâches agricoles et stocks d'intrants.

---

##  Technologies utilisées

| Côté | Technologie |
|------|-------------|
| **Front-end** | React (Vite) + Tailwind CSS + Axios + React Router |
| **Back-end** | Laravel 11 + Sanctum + Eloquent ORM |
| **Base de données** | MySQL |

---

## ✨ Fonctionnalités

- 🔐 **Authentification** : inscription, connexion, déconnexion (Sanctum)
- 🌱 **Cultures** : CRUD complet (nom, type, surface, date, statut)
- 📝 **Tâches agricoles** : CRUD complet avec statuts (À faire, En cours, Terminée)
- 📦 **Stocks** : CRUD complet avec alertes de seuil critique
- 📊 **Dashboard** : statistiques, tâches imminentes, alertes de stock

---

## 📦 Installation

### Prérequis

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL

### Back-end (Laravel)

```bash
cd sbiagri-api
composer install
cp .env.example .env
php artisan key:generate
# Configurer la base de données dans .env
php artisan migrate --seed
php artisan serve