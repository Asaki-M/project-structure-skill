# project-structure-skill

Cross-agent skill for keeping AI-generated files in the right project structure.

Use it with Codex, Claude Code, or OpenCode when adding, moving, refactoring, or organizing files across frontend apps, backend services, libraries, and full-stack workspaces.

## Install

```bash
npx project-structure-skill --agent all --scope user
pnpx project-structure-skill install --agent codex --scope project
```

Use `--force` to overwrite an existing installed copy.

## Targets

- Codex: `~/.agents/skills` or `.agents/skills`
- Claude Code: `~/.claude/skills` or `.claude/skills`
- OpenCode: `~/.config/opencode/skills` or `.opencode/skills`

The bundled skill lives at `skills/project-structure/SKILL.md`.
