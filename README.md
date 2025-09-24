# 🚀 Next.js Template – BetterAuth, Shadcn, Prisma

Un template **Next.js 15 (App Router)** prêt à l’emploi, conçu pour accélérer le démarrage de nouveaux projets.  
Il inclut l’authentification sécurisée avec **BetterAuth**, des composants UI **Shadcn**, et une base de données gérée par **Prisma**.  

---

## 📦 Stack Technique

- **Next.js 15** – App Router, Server Actions
- **BetterAuth** – Authentification moderne (signup / signin, routes protégées)
- **Prisma ORM** – Gestion de la base de données
- **Shadcn/UI** – UI components (button, theme toggle, etc.)
- **Tailwind CSS** – Système de design utility-first
- **TypeScript** – Typage strict

---

## 🔨 Installation

1. **Cloner le repo**  
   ```
   git clone https://github.com/ezanka/nextjs-template.git
   cd nextjs-template
   ```

2. **Installer les dépendances**  
    ```
    pnpm install
    # ou npm install / yarn install
    ```

3. **Configurer l’environnement**  
Copier .env.example → .env et remplir :
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
    BETTER_AUTH_SECRET="super-secret-key"
    ...
    ```

4. **Générer le client Prisma**  
    ```
    npx prisma generate
    npx prisma db push
    ```

5. **Lancer le projet** 
    ``` 
    pnpm dev
    ```

---

## 🚀 Fonctionnalités

✅ Authentification avec BetterAuth (signup / signin)
✅ Redirection automatique si connecté / non connecté
✅ Prisma configuré avec schéma généré
✅ Thème clair / sombre avec Shadcn Theme Toggle
✅ Exemple de composant (Button, card...) inclus

---

## ⚡ Utilisation
Tu peux utiliser ce template comme base pour tes futurs projets :

---

## 👤 Auteur
Template créé par Ezanka – réutilisable pour tous tes futurs projets 🚀