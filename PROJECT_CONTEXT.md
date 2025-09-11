# Résumé du Projet : WanderLink

## 1. Concept de l'Application

**WanderLink** est une application web conçue pour connecter des voyageurs ayant des intérêts et des styles de voyage similaires. L'objectif est de permettre aux utilisateurs de trouver des partenaires de voyage compatibles pour leurs prochaines aventures, en se basant sur une analyse détaillée de leurs profils.

L'application met l'accent sur la compatibilité à plusieurs niveaux :
- **Style de voyage :** Aventure, luxe, sac à dos, culturel, etc.
- **Intérêts communs :** Randonnée, gastronomie, musées, etc.
- **Destinations de rêve partagées.**
- **Arrangements financiers :** Partage des frais (50/50), sponsoring, voyage de groupe, etc.

## 2. Pile Technique (Tech Stack)

- **Framework Frontend :** Next.js avec App Router
- **Langage :** TypeScript
- **Styling :** Tailwind CSS
- **Composants UI :** shadcn/ui
- **Icônes :** lucide-react
- **Base de données et Authentification :** Firebase (Firestore, Firebase Auth, Firebase Storage)
- **Fonctionnalités IA :** Genkit (pour le matching intelligent de profils)
- **Gestion de formulaires :** React Hook Form avec Zod pour la validation de schémas.

## 3. Fonctionnalités Clés Implémentées

### a. Authentification des Utilisateurs
- Inscription et connexion par e-mail/mot de passe.
- Inscription et connexion via Google (OAuth).
- Gestion de la session utilisateur avec Firebase Auth.
- Fichiers pertinents : `src/app/signup/page.tsx`, `src/lib/firebase.ts`.

### b. Création et Gestion de Profil
- Un parcours de création de profil en plusieurs étapes pour collecter des informations détaillées.
- Champs collectés : informations de base (nom, âge, genre), photos, bio, langues parlées, localisation, style de vie (tabac, alcool), et détails du prochain voyage (destination, dates, style, activités, arrangement financier).
- Possibilité de modifier le profil après sa création.
- Téléchargement et suppression de photos de profil, stockées dans Firebase Storage.
- Fichiers pertinents : `src/app/create-profile/page.tsx`, `src/app/profile/page.tsx`, `src/app/profile/edit/page.tsx`, `src/app/actions.ts`, `src/lib/schema.ts`.

### c. Page d'Accueil et Découverte
- Affiche un carrousel de profils d'utilisateurs potentiels (`possibleMatches`).
- Un bouton "Find my AI Match" lance le processus de matching intelligent.
- Fichiers pertinents : `src/app/page.tsx`, `src/components/match-carousel.tsx`.

### d. Matching par IA (Genkit)
- Un flux Genkit est implémenté pour analyser le profil de l'utilisateur actuel et le comparer à une liste de correspondances potentielles.
- Le flux renvoie une liste de profils compatibles avec un score de compatibilité et une raison expliquant le match.
- Utilise un "Tool" Genkit pour évaluer si la connaissance d'une langue est un avantage dans un pays de destination.
- Fichiers pertinents : `src/ai/flows/ai-powered-matching.ts`, `src/app/actions.ts` (fonction `handleAiMatching`), `src/components/ai-match-results.tsx`.

### e. Paramètres de l'Application
- Une section "Paramètres" a été créée, bien que les pages spécifiques ne soient pas encore toutes implémentées.
- Fichier de base : `src/app/settings/page.tsx` (contient la navigation vers les sous-pages).

## 4. Structure des Fichiers Clés

- `src/app/` : Contient les pages principales de l'application (accueil, profil, inscription, etc.).
- `src/components/` : Contient les composants React réutilisables (barre de navigation, cartes de profil, composants UI shadcn).
- `src/ai/` : Contient la logique liée à l'IA avec Genkit.
  - `flows/` : Définit les flux de traitement de l'IA (ex: `ai-powered-matching.ts`).
- `src/lib/` : Contient les utilitaires, la configuration de Firebase, les schémas de validation (Zod), et les données mock.
- `src/app/actions.ts` : Contient les "Server Actions" de Next.js pour les interactions avec la base de données (Firestore) et l'IA (Genkit).

## 5. État Actuel et Prochaines Étapes

- **Ce qui fonctionne :** Le flux d'authentification, la création/édition de profil, l'affichage des profils, et la fonctionnalité de matching par IA sont fonctionnels en utilisant des données mock (`mock-data.ts`).
- **Prochaines étapes possibles :**
  1. **Remplacer les données mock :** Connecter la page d'accueil et le flux d'IA à la base de données Firestore pour utiliser les vrais profils utilisateurs au lieu des données de `mock-data.ts`.
  2. **Développer la messagerie :** Implémenter une fonctionnalité de chat en temps réel (probablement avec Firestore) pour que les utilisateurs "matchés" puissent communiquer.
  3. **Finaliser la section "Paramètres" :** Construire les pages pour la gestion du compte, de la confidentialité, des notifications, etc.
  4. **Améliorer l'UI/UX :** Affiner le design, ajouter des animations et des indicateurs de chargement pour améliorer l'expérience utilisateur.
  5. **Déployer l'application.**
