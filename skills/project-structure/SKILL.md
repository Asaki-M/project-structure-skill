---
name: project-structure
description: Use this skill whenever creating, moving, refactoring, or organizing project files and directories in frontend apps, backend services, libraries, or full-stack projects. Inspect existing conventions, place code near its owning feature or domain, avoid duplicate directories, and explain unavoidable new directories before creating them. For backend projects, keep the HTTP/API layer in core and independent capabilities such as LLM, RAG, memory, and tools outside core. Trigger for project structure, file placement, components, hooks, routes, services, persistence, integrations, API modules, refactors, and feature modules.
---

# Project Structure

## Overview

Use this skill to keep project structure predictable when adding or changing code. Before creating files or directories, inspect the existing layout, identify the owning feature or module, and place new code as close as possible to that owner.

Prefer extending existing conventions over introducing new structure. Create a new top-level directory only when no existing module owns the behavior, and explain why the new directory is necessary before creating it. Avoid duplicate folders, vague bucket names, and scattered helper files.

## General Rules

- Identify the project type before applying placement rules: frontend app, backend service, library, CLI, monorepo package, or full-stack project.
- Follow the nearest existing convention first. These rules provide defaults only when the repository does not already define a clearer pattern.
- Place files by ownership, not by file type alone. A file that only supports one feature or domain should live with that feature or domain.
- Promote code to shared directories only after it is reused by multiple modules.
- Do not let shared directories become catch-all buckets. When files grow across multiple concerns, split them by feature, domain, or concern instead of keeping unrelated code together.
- Keep public entry points small and explicit.

## Workspace & Package Boundaries

- In a workspace or full-stack project, identify the owning package or app before creating files.
- Put frontend code in the frontend package or app, backend code in the backend package or app, and shared code in the existing shared package only when the repository already has one.
- Do not create root-level `src` directories in workspace projects unless the repository already uses root source code.
- Do not move code across app or package boundaries just because file names look similar.
- If a new shared package is necessary, explain why existing apps or packages cannot own the code first.

## File Names & Folder Names

- Use `kebab-case` for file names, such as `user-list.tsx`.
- Use `kebab-case` for folder names, such as `user-list`.
- Folder names must be obvious and descriptive enough that their purpose is clear at a glance.
- Avoid vague folder names when a more specific feature or domain name is available.
- Avoid repeating the parent directory's meaning in child file names when the directory already provides that context.
- For example, prefer `steps/a.ts` and `steps/b.ts` over `steps/a-step.ts` or `steps/step-b.ts`.
- Apply the same rule to directories such as `helpers`, `utils`, `types`, `services`, `routes`, and `components`, unless the repeated term is necessary to avoid ambiguity or match an established nearby convention.

## UI Components

Use these rules only when working in a frontend app, UI package, or frontend module.

- Put reusable UI primitives in `src/components/ui`, such as `Input`, `Button`, and `Select`.
- Put business-specific components in `src/components`, such as `UserList` and `PostList`.
- If a component clearly belongs to a feature module, prefer placing it inside that module rather than promoting it to a global component directory.
- When shared components grow across multiple concerns, split them by domain or component family, such as `src/components/forms`, `src/components/layout`, or `src/components/user`.

## Utils

- Put shared utility functions in `src/utils`, such as `formatDate` and `getRandomColor`.
- Group shared utilities by concern inside `src/utils`. For example, put date-related helpers in `src/utils/date.ts` and export them from that file.
- When shared utilities grow beyond a few focused files, split them by concern or domain instead of adding unrelated helpers to a single `src/utils/index.ts`.
- Put business-specific or module-specific utilities inside the owning module.
- For example, if `src/memory` owns memory behavior, place memory utilities in `src/memory/utils`, such as `getMemory` and `setMemory`.
- Do not put feature-only utilities in `src/utils` just because they are small.

## Types

- Put shared type definitions in `src/types`, such as `User` and `Post`.
- Do not use `src/types` as a catch-all for every type in the project.
- When shared types grow across multiple concerns, split them by domain or concern, such as `src/types/user.ts`, `src/types/post.ts`, or `src/types/api.ts`.
- Put business-specific or module-specific types inside the owning module.
- For example, if `src/memory` owns memory behavior, place memory types in `src/memory/types`, such as `Memory` and `MemoryItem`.
- Do not promote module-only types to `src/types` unless they are reused across multiple modules.
- Avoid large monolithic type files such as `src/types/index.ts` that define unrelated domains; use index files only to re-export focused type modules when the repository already follows that pattern.

## Feature Modules

- Organize feature modules by capability or business domain.
- For example, an AI Agent feature may include `memory`, `tools`, and `llm` modules. In that case, use directories such as `src/memory`, `src/tools`, and `src/llm`.
- Keep module internals inside the module directory, including utilities, types, tests, and subcomponents when they are module-specific.
- Apply the same entry-point rule to module subdirectories. For example, module-specific utilities should export from `src/memory/utils/index.ts`, module-specific types should export from `src/memory/types/index.ts`, and module-specific components should export from `src/memory/components/index.ts` when those directories exist.
- Use composition files to assemble modules into higher-level behavior. For example, `src/agent.ts` can compose `memory`, `tools`, and `llm` into a complete Agent.
- Keep the public entry point small. For example, `src/index.ts` can export the assembled Agent directly.

## Backend Services

Use these rules when working in a backend service, API package, worker package, or server-side application. Follow existing repository conventions first; these paths are defaults within the owning app or package. Create only the directories the application needs. A worker without HTTP APIs does not need a router or middleware layer.

### Core HTTP/API Layer

- Use `src/core` for the application's HTTP/API layer and the business logic directly supporting it: routing, API services, persistence access, and HTTP middleware.
- Do not treat `src/core` as a catch-all for every backend capability.
- Keep independent capabilities such as LLM, RAG, Agent, memory, tools, search, messaging, and storage outside `src/core` when they have clear ownership and their own internal structure.
- Services may consume those modules; using a capability from an HTTP API does not make it part of `core`.

For example, an application with LLM and RAG capabilities may use:

```text
src/
├── core/
│   ├── router/
│   ├── service/
│   ├── dao/
│   │   └── models/
│   └── middleware/
├── llm/
├── rag/
├── memory/
├── tools/
├── cron/
└── index.ts
```

### Router

- Put HTTP route definitions in `src/core/router`.
- Router files own paths, methods, route grouping, middleware registration, basic transport-level request extraction, and delegation to services. They send the response data returned by services through the HTTP framework.
- Keep routers thin. Do not put business workflows, database queries, LLM calls, or complex data processing in router files.
- Split routers by API module or business domain, such as `src/core/router/user.ts`, `knowledge.ts`, and `chat.ts`.
- Aggregate and register module routers through `src/core/router/index.ts`, or the repository's existing router entry file.

### Service

- Put API operation logic in `src/core/service`, grouped by API module or business domain, such as `user.ts`, `knowledge.ts`, and `chat.ts`.
- Services own input parameter processing and normalization, business validation, business workflows, and operation-specific errors and result states.
- Services coordinate DAO operations, independent capability modules such as `llm`, `rag`, `memory`, and `tools`, and external integrations as needed.
- Services also transform internal results into API response data. Keep parameter processing, business logic, and response data transformation together when they belong to the same API operation.
- Avoid introducing controller, handler, use-case, DTO, mapper, or response layers for simple operations unless the repository already uses them or the complexity requires them.
- When a service grows too large, split it by business capability or API domain instead of creating generic helper buckets.

### DAO

- Put database connection initialization and persistence access in `src/core/dao`. This includes queries, CRUD operations, transactions, record mapping, and caches used as data stores, such as MySQL, MongoDB, and Redis.
- Keep DAOs focused on persistence; do not put HTTP request handling or business workflows in DAO files.
- Split DAOs by database, domain, aggregate, or data source when needed, such as `src/core/dao/user.ts`, `knowledge.ts`, `mysql.ts`, or `redis.ts`.
- Put persistence-specific models and database record types in `src/core/dao/models` when needed. Keep general business types with their owning domain; being stored in a database does not make a type persistence-specific.

### Middleware

- Put HTTP-specific middleware in `src/core/middleware` when a dedicated directory is needed, such as `auth.ts`, `error-handler.ts`, `request-id.ts`, and `logging.ts`.
- Middleware owns transport-level and cross-cutting HTTP concerns. Keep domain business logic in services or capability modules.

### Capability Modules & Third-Party Integrations

- Put substantial capabilities that can exist independently of HTTP in clearly named modules such as `src/llm`, `src/rag`, `src/agent`, `src/memory`, `src/tools`, `src/search`, `src/queue`, or `src/storage`.
- Keep each capability's implementation, types, utilities, and submodules within its owner. For example, `src/rag` may contain `embedding`, `retrieval`, and `rerank`; `src/llm` may contain provider implementations and its own types.
- Place third-party SDK and API integrations with the capability or domain that owns them, such as `src/llm/openai.ts`, `src/llm/anthropic.ts`, `src/storage/s3.ts`, or `src/search/elasticsearch.ts`.
- Do not automatically collect integrations in `src/core/manager`. Preserve an existing manager layer only when the repository gives it a clear responsibility.
- An integration shared across unrelated capabilities may have its own clearly named module when it contains meaningful logic. Avoid generic root directories such as `manager`, `adapter`, `provider`, or `integration` unless the repository already defines their architectural role.

### Scheduled Jobs

- Put scheduled task entry points in `src/cron`, such as `cleanup.ts`, `sync-knowledge.ts`, or `refresh-index.ts`, and split them by job family when needed.
- Cron files own scheduling and task entry behavior. Reuse business workflows from the owning service or capability module instead of duplicating them in cron files.

### Dependency Direction

Prefer dependencies from the application boundary toward services, persistence, and independent capabilities:

```text
router → service → dao
                 → llm / rag / memory / tools
cron → owning service or capability module
```

- Capability modules may depend on lower-level libraries and persistence access when needed, but should not depend on HTTP routers or handlers.
- DAOs should not depend on services. Keep API orchestration in services and capability internals in their owning modules.
- Prefer the smallest structure that clearly expresses ownership and dependency direction. Do not create extra layers or scaffold every example directory in advance.

## Before Creating New Structure

- Search for an existing owner before adding a new directory.
- Prefer colocating files with the feature that uses them.
- Reuse existing naming and placement patterns from nearby files.
- If a new directory is unavoidable, choose a clear capability or domain name and explain the reason before creating it.
- Do not create parallel directories with overlapping meanings, such as both `helpers` and `utils`, unless the repository already defines a clear distinction.
