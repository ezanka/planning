# 🚀 Next.js Template — BetterAuth, Shadcn, Prisma

Un **template moderne Next.js 15 (App Router)** prêt à l’emploi pour démarrer rapidement un projet SaaS ou fullstack.  
Inclut une **authentification sécurisée**, une UI soignée avec **Shadcn**, et une base de données connectée via **Prisma**.

---

## 🧱 Stack technique

- ⚛️ **Next.js 15** – App Router, Server Actions
- 🔐 **BetterAuth** – Authentification complète (signup / signin, sessions, redirections)
- 🧬 **Prisma** – ORM pour PostgreSQL / MySQL
- 🎨 **Shadcn/UI** – Composants réutilisables (button, card, toggle...)
- 💨 **Tailwind CSS** – Utility-first CSS
- 🧑‍💻 **TypeScript** – Typage strict pour une meilleure DX

---

## ⚙️ Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/ezanka/nextjs-template.git
   cd nextjs-template
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   # ou npm install / yarn install
   ```

3. **Configurer les variables d’environnement**

   Copier le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```

   Remplir avec vos infos :
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   BETTER_AUTH_SECRET="super-secret-key"
   ```

4. **Initialiser la base de données**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Lancer le serveur de développement**
   ```bash
   pnpm dev
   ```

---

## ✅ Fonctionnalités incluses

- 🔐 Authentification avec BetterAuth (signup / login)
- 🔁 Redirections automatiques selon l’état de session
- 🗂️ Prisma préconfiguré (schéma + accès DB)
- 🌙 Système de thème (clair / sombre)
- 🧩 Composants Shadcn prêts à l’emploi (bouton, carte, etc.)

---

## 🧪 Commandes utiles

```bash
pnpm dev            # Lancer le projet en mode dev
pnpm build          # Build de production
npx prisma studio   # Interface visuelle pour la BDD
```

---

## 🔁 Astuce pour démarrer ton propre projet

Après avoir cloné ce template, pense à **mettre à jour le remote** Git :

```bash
git remote set-url origin https://github.com/<ton-utilisateur>/<ton-repo>.git
git push -u origin main
```

---

## 👤 Auteur

Template créé avec ❤️ par **Ezanka**  
→ Utilisable pour tous tes futurs projets fullstack / SaaS 🚀  
[GitHub – @ezanka](https://github.com/ezanka)

---