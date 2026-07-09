# project-structure-skill

Cross-agent skill for keeping AI-generated files in the right project structure.

Use it with Codex, Claude Code, or OpenCode when adding, moving, refactoring, or organizing files across frontend apps, backend services, libraries, and full-stack workspaces.

## Install

```bash
npx project-structure-skill --agent all --scope user
pnpx project-structure-skill install --agent codex --scope project
```

Use `--force` to overwrite an existing installed copy.

## Upgrade

```bash
npx project-structure-skill@latest upgrade --agent codex --scope user
pnpx project-structure-skill@latest upgrade --agent all --scope project
```

`upgrade` and `update` overwrite the existing installed skill with the bundled skill from the package version being run.

## Targets

- Codex: `~/.codex/skills` or `.codex/skills`
- Claude Code: `~/.claude/skills` or `.claude/skills`
- OpenCode: `~/.config/opencode/skills` or `.opencode/skills`

The bundled skill lives at `skills/project-structure/SKILL.md`.
