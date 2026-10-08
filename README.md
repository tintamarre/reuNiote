## reuNiote

Petite application web pour estimer en direct le coût d'une réunion de travail pour le contribuable.

- **Demo** : https://tintamarre.github.io/reuNiote/

Application statique Vue 3 + Vite + Tailwind CSS v4, déployée sur GitHub Pages.

# Développement

```bash
npm install
npm run dev
```

# Build

```bash
npm run build     # génère dist/
npm run preview   # sert dist/ en local
```

# Déploiement

Chaque push sur `main` déclenche le workflow `.github/workflows/deploy.yml` qui build l'application et la publie sur GitHub Pages (Settings → Pages → Source : « GitHub Actions »).
