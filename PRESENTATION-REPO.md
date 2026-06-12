# Starter

## Présentation technique du repository

Une architecture frontend pragmatique inspirée de :

- Clean Architecture ;
- Domain-Driven Design ;
- architecture hexagonale.

---

# 1. Pourquoi ce starter ?

L'objectif est de construire une application mobile sans laisser les règles produit se disperser dans les écrans.

Les choix structurants :

- organiser le métier par bounded contexts ;
- donner un nom explicite aux actions avec des use-cases ;
- isoler les fournisseurs derrière des gateways et des adapters ;
- garder les screens centrés sur la navigation et la composition ;
- utiliser Redux Toolkit pour orchestrer le `core/`.

Ce repository est aujourd'hui un **socle architectural** : les principales frontières existent, mais les parcours UI sont encore à construire.

---

# 2. Architecture actuelle et architecture cible

Le projet s'inspire de Clean Architecture sans en appliquer encore toutes les contraintes strictes.

| Aujourd'hui                                    | Cible                                                  |
| ---------------------------------------------- | ------------------------------------------------------ |
| Les contextes vivent dans `core/`              | Des contextes autonomes et clairement délimités        |
| Les use-cases sont des builders RTK Query      | Des actions applicatives explicites, faciles à tester  |
| Les slices Redux vivent dans `domain/`         | Séparer clairement modèles, règles et stockage runtime |
| Les gateways utilisent `BaseQueryFn`           | Des contrats indépendants de Redux et du transport     |
| Certains adapters portent encore des décisions | Réserver les adapters aux détails d'infrastructure     |

Le but n'est pas de prétendre que le découplage est déjà parfait.

Le but est d'avoir une direction claire et d'améliorer les frontières au fur et à mesure des fonctionnalités.

---

# 3. Hexagonal : les deux côtés

L'architecture hexagonale place les capacités de l'application au centre et distingue deux directions.

```text
                 CÔTÉ PRIMAIRE — ENTRANT

Utilisateur → Screen → API de contexte → Use-case
                                      │
                               ┌──────▼──────┐
                               │    Core     │
                               └──────┬──────┘
                                      │
                 Gateway → Adapter → Infrastructure

                 CÔTÉ SECONDAIRE — SORTANT
```

- **Adaptateurs primaires** : screens, composants interactifs et hooks RTK Query. Ils demandent à l'application d'agir.
- **Gateways** : contrats décrivant ce dont l'application a besoin.
- **Adaptateurs secondaires** : fake, mémoire ou fournisseur externe. Ils réalisent concrètement l'opération.

Règle cible de dépendance :

> Les choix techniques doivent dépendre des besoins du `core/`, pas l'inverse.

---

# 4. Carte du repository

```text
starter/
├── src/
│   ├── app/          Routes, screens et composition du runtime
│   ├── components/   Primitives UI et composants visuels
│   ├── hooks/        Hooks liés au shell de l'application
│   └── stores/       Stores Zustand liés à l'interface
│
└── core/
    ├── auth/         Authentification et compte
    ├── subscription/ Abonnements et offres
    ├── shared/       Infrastructure réellement partagée
    └── initReduxStore.ts
```

Règle de lecture :

```text
src/app/ orchestre → src/components/ affiche → core/ porte les capacités
```

---

# 5. Le DDD dans le `core/`

Le **Domain-Driven Design** organise le code autour des concepts et du vocabulaire du produit, plutôt qu'autour des technologies.

Dans ce repository, le DDD se traduit principalement par les **bounded contexts** :

```text
core/
├── auth/          Compte, session, connexion et onboarding
└── subscription/  Offres, achat, restauration et statut premium
```

Chaque contexte :

- possède son propre vocabulaire ;
- définit ses modèles dans `domain/` ;
- expose des actions explicites dans `use-cases/` ;
- contrôle ses gateways, adapters, APIs et selectors ;
- reste propriétaire de ses données et de leurs transitions.

Exemples de langage métier :

- `Account`, `Session`, `AuthUser` ;
- `Subscription`, `SubscriptionPlan`, `SubscriptionOffering` ;
- `retrieveAccount`, `completeOnboarding`, `purchaseSubscription`.

Le DDD ne consiste pas à multiplier les abstractions. Il sert ici à placer chaque règle et chaque donnée près du concept qui en est propriétaire.

---

# 6. Anatomie d'un bounded context

Exemple avec `core/auth/` :

```text
core/auth/
├── domain/               Modèles et slices Redux
├── use-cases/            Builders des actions applicatives
├── gateways/             Contrats d'accès
├── adapters/
│   ├── fake/             Scénarios simulés
│   ├── in-memory/        Implémentation locale
│   └── selectors/        Lecture du state pour l'UI
└── apis/                 Façade RTK Query et DTOs publics
```

Chaque dossier répond à une question :

- **domain** : quelles données représentent le contexte ?
- **use-case** : quelle action peut être déclenchée ?
- **gateway** : de quelle opération externe avons-nous besoin ?
- **adapter** : comment cette opération est-elle réalisée ?
- **API de contexte** : quelle surface est exposée à l'UI ?
- **selector** : comment lire ou dériver le state ?

---

# 7. Redux et RTK Query comme orchestration

Redux est le gestionnaire de state global. Redux Toolkit et RTK Query facilitent l'orchestration du `core/`.

```text
Screen
  → hook RTK Query
  → builder du use-case
  → gateway / adapter
  → onQueryStarted
  → action Redux
  → selector
  → rendu
```

Points importants de l'implémentation :

- `createStore` est une factory injectable : APIs, état initial, dépendances thunk, persistance et middlewares ;
- Redux Persist conserve le state dans AsyncStorage ;
- le cache RTK Query persisté est filtré pour ne garder que les requêtes réussies ;
- `createEntityAdapter` normalise les offres d'abonnement ;
- les selectors exposent des lectures comme le statut premium.

Redux orchestre les actions et leurs résultats. Il ne doit pas devenir un emplacement générique pour toute logique.

---

# 8. Exemple disponible : le flux de connexion

Le pipeline existe dans le `core/`, même si l'écran d'authentification est encore vide.

```text
useLoginMutation()
        ↓
authAPI
        ↓
loginBuilder
        ↓
AuthBaseQuery
        ↓
FakeAuthBaseQuery ou InMemoryAuthBaseQuery
        ↓
setAuth(...) ou setError(...)
```

Ce flux démontre :

- une API stable pour le screen ;
- une orchestration centralisée avec RTK Query ;
- un adapter choisi au démarrage avec `EXPO_PUBLIC_APP_MODE` ;
- une mise à jour observable du state Redux.

Ce n'est pas encore un parcours utilisateur complet : `src/app/(auth)/index.tsx` ne contient pas de formulaire.

---

# 9. Organisation de l'UI

L'UI est organisée en trois niveaux.

## Screens d'entrée

`src/app/` utilise Expo Router :

- `index.tsx` représente l'entrée d'une route ;
- `_layout.tsx` organise la navigation ;
- les groupes `(auth)`, `(on-boarding)` et `(tabs)` structurent les parcours.

## Composants

Les sections et composants visuels composent un screen. Ils peuvent gérer du formatage local, une navigation locale ou un selector simple, sans porter de règle métier.

## Primitives

`src/components/ui/` fournit notamment `Text`, `Button`, `Input`, `TextArea`, `Icon` et `BottomSheetModal`.

Les primitives sont génériques, pilotées par des props et stylisées avec NativeWind.

---

# 10. `.agents/` : les conventions du repository

`AGENTS.md` reste volontairement court. Les décisions détaillées vivent dans quatre skills locaux.

Le dossier `.agents/` sert de documentation opérationnelle pour les agents de développement :

- l'agent charge les conventions adaptées au type de tâche ;
- il comprend l'architecture locale avant de proposer du code ;
- les décisions restent cohérentes entre plusieurs interventions ;
- les règles peuvent évoluer sans transformer `AGENTS.md` en documentation monolithique.

| Skill              | Responsabilité                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `architecture`     | Placement dans `src/app/`, `src/components/` ou `core/`, bounded contexts et workflow de feature |
| `ui-conventions`   | Screens, navigation, primitives, NativeWind, layout et formulaires                               |
| `domain-layer`     | Domaine, use-cases, gateways, adapters, APIs, selectors et state runtime                         |
| `coding-standards` | Nommage, TypeScript, découpage, refactoring et checklist de review                               |

Règles permanentes :

- préférer du code évident à du code astucieux ;
- ne pas mettre les décisions métier dans les screens ;
- ne pas mettre la mécanique UI temporaire dans les modèles du `core/` ;
- donner à chaque donnée et action un propriétaire clair.

Point à corriger : `AGENTS.md` demande de lire `docs/product-agent-brief.md`, mais ce fichier est absent.

---

# 11. Remplacer les infrastructures

Le mode d'exécution choisit aujourd'hui l'adapter d'authentification :

```ts
if (appMode === "fake") {
  authBaseQuery = new FakeAuthBaseQuery();
} else {
  authBaseQuery = new InMemoryAuthBaseQuery();
}
```

Cette frontière permet de :

- développer l'UI avant le backend ;
- simuler des scénarios reproductibles ;
- remplacer une source sans modifier les screens ;
- concentrer le code fournisseur dans un adapter.

État actuel :

- Supabase est installé, mais aucun adapter d'authentification réel n'est branché ;
- une classe d'adapter RevenueCat existe ;
- le runtime RevenueCat et son SDK ne sont pas implémentés ;
- `subscriptionAPI` n'est pas encore injectée dans `app-runtime.ts`.

---

# 12. État réel du starter

## Déjà en place

- navigation protégée pour auth, onboarding et tabs ;
- store Redux configurable et persistant ;
- contextes `auth` et `subscription` ;
- 16 fichiers de use-cases ;
- adapters fake et in-memory ;
- primitives UI et conventions NativeWind ;
- TypeScript strict, routes Expo typées et React Compiler.

## Encore incomplet

- screens principaux vides ;
- aucun test automatisé ;
- aucune CI métier visible ;
- authentification Supabase non branchée ;
- intégration RevenueCat non opérationnelle ;
- README encore proche du template Expo.

Le starter valide une structure, pas encore un parcours produit de bout en bout.

---

# 13. Écarts, risques et compromis

## Écarts actuels

- les use-cases et gateways restent liés à Redux Toolkit / RTK Query ;
- `isConnected` est persisté dans Zustand alors qu'il est dérivable de Redux ;
- le splash est masqué après une seconde, même si la récupération du compte continue ;
- les contrôles Redux d'immutabilité et de sérialisation sont désactivés ;
- les versions Expo sont en `canary`.

## Coûts assumés

- davantage de fichiers et de wiring ;
- une courbe d'apprentissage pour les nouveaux contributeurs ;
- le risque de sur-modéliser une fonctionnalité simple ;
- la nécessité de maintenir les frontières lors des reviews.

La structure apporte de la valeur si elle rend les changements plus localisés et testables. Sinon, elle devient seulement de la cérémonie.

---

# 14. Comment ajouter une fonctionnalité

Ordre recommandé :

1. Identifier le bounded context propriétaire.
2. Modéliser les données et règles nécessaires.
3. Nommer l'action sous forme de use-case.
4. Définir ou étendre le gateway.
5. Implémenter l'adapter.
6. Exposer l'action dans l'API du contexte.
7. Mettre à jour le state et les selectors.
8. Composer le screen avec les primitives existantes.
9. Tester les règles, le contrat de l'adapter et le flux Redux.

```text
Besoin produit
  → modèle
  → use-case
  → contrat
  → infrastructure
  → state
  → UI
```

Le point de départ est le sens de la fonctionnalité, pas le JSX du screen.

---

# 15. Priorités et décisions attendues

## Priorités proposées

1. Construire un premier parcours auth complet.
2. Supprimer la double source de vérité Redux/Zustand.
3. Ajouter des tests sur les use-cases et adapters.
4. Brancher un adapter Supabase réel.
5. Injecter `subscriptionAPI` et décider de l'intégration RevenueCat.
6. Ajouter les contrôles de lint, tests et architecture dans la CI.
7. Créer le brief produit manquant.

## Décisions pour l'équipe

- Quel parcours doit valider l'architecture de bout en bout en premier ?
- Jusqu'où voulons-nous découpler le `core/` de Redux Toolkit ?
- Quelle stratégie minimale de tests et de CI rend ces conventions vérifiables ?

---

# Annexe A — Stack

| Besoin                  | Technologie                  |
| ----------------------- | ---------------------------- |
| Application             | React Native 0.83 + React 19 |
| Toolchain               | Expo 55 canary               |
| Navigation              | Expo Router                  |
| State et orchestration  | Redux Toolkit + RTK Query    |
| Persistance             | Redux Persist + AsyncStorage |
| Store UI complémentaire | Zustand                      |
| Styles                  | NativeWind / Tailwind CSS    |
| Formulaires             | React Hook Form              |
| Backend prévu           | Supabase                     |
| Langage                 | TypeScript                   |

Metro est verrouillé en version `0.83.3` dans les résolutions du package.

---

# Annexe B — Conventions UI

- fichiers UI en **kebab-case** : `root-navigator.tsx`, `bottom-sheet-modal.tsx` ;
- composants React en **PascalCase** ;
- primitives de `src/components/ui/` avant toute alternative locale ;
- `className`, NativeWind et tokens de thème pour le styling ;
- le parent contrôle le placement et les espacements externes ;
- l'enfant contrôle son espacement interne ;
- props explicites : `title`, `selected`, `disabled`, `onPress` ;
- `react-hook-form` et `Controller` pour les formulaires ;
- handlers nommés hors du JSX lorsque cela améliore la lecture.

```text
Screen → Section fonctionnelle → Composant → Primitive
```

---

# Annexe C — Composition du runtime

```text
src/app/_layout.tsx
        ↓
RootAppProviders
        ├── Redux Provider
        ├── PersistGate
        ├── SafeAreaProvider
        ├── GestureHandlerRootView
        ├── BottomSheetModalProvider
        └── ThemeProvider
        ↓
RootNavigator
        ├── (auth)
        ├── (on-boarding)
        └── (tabs)
```

`src/app/app-runtime.ts` choisit les adapters, crée les APIs RTK Query, construit le store et configure sa persistance.

`useAppReadiness` synchronise `isConnected` avec le compte Redux et masque actuellement le splash après un délai fixe d'une seconde.
