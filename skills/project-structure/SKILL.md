---
name: project-structure
description: Use this skill whenever creating, moving, refactoring, or organizing project files and directories in frontend apps, backend services, libraries, or full-stack projects. It prevents messy AI-generated folder structures by forcing the agent to inspect existing conventions, place code near the owning feature or domain, avoid duplicate directories, and explain any unavoidable new directory before creating it. Trigger for tasks involving project structure, file placement, new components, hooks, routes, controllers, services, repositories, API modules, refactors, and feature modules.
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
- If a file is already inside a `helper` folder, the file name may omit the `helper` prefix or suffix.

## UI Components

Use these rules only when working in a frontend app, UI package, or frontend module.

- Put reusable UI primitives in `src/components/ui`, such as `Input`, `Button`, and `Select`.
- Put business-specific components in `src/components`, such as `UserList` and `PostList`.
- If a component clearly belongs to a feature module, prefer placing it inside that module rather than promoting it to a global component directory.

## Utils

- Put shared utility functions in `src/utils`, such as `formatDate` and `getRandomColor`.
- Group shared utilities by concern inside `src/utils`. For example, put date-related helpers in `src/utils/date.ts` and export them from that file.
- Put business-specific or module-specific utilities inside the owning module.
- For example, if `src/memory` owns memory behavior, place memory utilities in `src/memory/utils`, such as `getMemory` and `setMemory`.
- Do not put feature-only utilities in `src/utils` just because they are small.

## Types

- Put shared type definitions in `src/types`, such as `User` and `Post`.
- Put business-specific or module-specific types inside the owning module.
- For example, if `src/memory` owns memory behavior, place memory types in `src/memory/types`, such as `Memory` and `MemoryItem`.
- Do not promote module-only types to `src/types` unless they are reused across multiple modules.

## Feature Modules

- Organize feature modules by capability or business domain.
- For example, an AI Agent feature may include `memory`, `tools`, and `llm` modules. In that case, use directories such as `src/memory`, `src/tools`, and `src/llm`.
- Keep module internals inside the module directory, including utilities, types, tests, and subcomponents when they are module-specific.
- Apply the same entry-point rule to module subdirectories. For example, module-specific utilities should export from `src/memory/utils/index.ts`, module-specific types should export from `src/memory/types/index.ts`, and module-specific components should export from `src/memory/components/index.ts` when those directories exist.
- Use composition files to assemble modules into higher-level behavior. For example, `src/agent.ts` can compose `memory`, `tools`, and `llm` into a complete Agent.
- Keep the public entry point small. For example, `src/index.ts` can export the assembled Agent directly.

## Backend Services

Use these rules when working in a backend service, API package, worker package, or server-side module.

- Put core backend capabilities in `src/core`.
- Put database connections and database access functions in `src/core/dao`.
- Put database model/type definitions in `src/core/dao/models` when they are needed. This applies to relational databases, document databases, caches, and other persistence layers such as MySQL, MongoDB, and Redis.
- Put third-party integration logic in `src/core/manager`. This includes calls to third-party APIs, third-party SDKs, external libraries, or external functions.
- Put business logic in `src/core/service`. Service files should define the logic behind API operations and coordinate DAO, manager, and core functionality.
- Put API route definitions in `src/core/router`. Router files should define routes and delegate business behavior to `src/core/service`.
- Put scheduled jobs in `src/cron`. Cron files should define recurring tasks and delegate reusable business behavior to services when possible.
- Keep each layer focused: routers handle routing, services handle business logic, DAOs handle persistence, managers handle third-party integrations, and core contains internal reusable backend capabilities.

## Before Creating New Structure

- Search for an existing owner before adding a new directory.
- Prefer colocating files with the feature that uses them.
- Reuse existing naming and placement patterns from nearby files.
- If a new directory is unavoidable, choose a clear capability or domain name and explain the reason before creating it.
- Do not create parallel directories with overlapping meanings, such as both `helpers` and `utils`, unless the repository already defines a clear distinction.
