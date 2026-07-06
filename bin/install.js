#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const skillName = "project-structure";
const sourceSkill = join(root, "skills", skillName);

const targets = {
  codex: {
    user: join(homedir(), ".agents", "skills"),
    project: join(process.cwd(), ".agents", "skills")
  },
  claude: {
    user: join(homedir(), ".claude", "skills"),
    project: join(process.cwd(), ".claude", "skills")
  },
  opencode: {
    user: join(homedir(), ".config", "opencode", "skills"),
    project: join(process.cwd(), ".opencode", "skills")
  }
};

const aliases = {
  "claude-code": "claude",
  claudecode: "claude",
  claude: "claude",
  codex: "codex",
  opencode: "opencode",
  all: "all"
};

function usage() {
  console.log(`project-structure-skill

Install the project-structure skill for Codex, Claude Code, or OpenCode.

The skill helps agents place files in the right module, package, or service layer.

Usage:
  npx project-structure-skill [install] [options]
  pnpx project-structure-skill [install] [options]

Options:
  --agent <name>     codex, claude, opencode, or all (default: all)
  --scope <scope>    user or project (default: user)
  --dir <path>       custom skills parent directory
  --force            overwrite an existing installed skill
  --list-targets     show resolved install targets
  -h, --help         show help

Examples:
  npx project-structure-skill --agent codex
  pnpx project-structure-skill install --agent all --scope project --force
  npx project-structure-skill --dir ~/.agents/skills --force
`);
}

function parseArgs(argv) {
  const args = {
    agent: "all",
    scope: "user",
    dir: null,
    force: false,
    listTargets: false
  };

  const rest = [...argv];
  if (rest[0] === "install") rest.shift();

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "-h" || arg === "--help") {
      args.help = true;
    } else if (arg === "--force") {
      args.force = true;
    } else if (arg === "--list-targets") {
      args.listTargets = true;
    } else if (arg === "--agent") {
      args.agent = requireValue(rest, ++i, arg);
    } else if (arg.startsWith("--agent=")) {
      args.agent = arg.slice("--agent=".length);
    } else if (arg === "--scope") {
      args.scope = requireValue(rest, ++i, arg);
    } else if (arg.startsWith("--scope=")) {
      args.scope = arg.slice("--scope=".length);
    } else if (arg === "--dir") {
      args.dir = requireValue(rest, ++i, arg);
    } else if (arg.startsWith("--dir=")) {
      args.dir = arg.slice("--dir=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  args.agent = aliases[args.agent] ?? args.agent;
  if (!["all", "codex", "claude", "opencode"].includes(args.agent)) {
    throw new Error("--agent must be codex, claude, opencode, claude-code, or all");
  }
  if (!["user", "project"].includes(args.scope)) {
    throw new Error("--scope must be user or project");
  }

  return args;
}

function requireValue(values, index, flag) {
  const value = values[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function expandHome(path) {
  if (path === "~") return homedir();
  if (path.startsWith("~/")) return join(homedir(), path.slice(2));
  return path;
}

function selectedTargets(args) {
  if (args.dir) {
    return [{ agent: "custom", parent: resolve(expandHome(args.dir)) }];
  }

  const agents = args.agent === "all" ? ["codex", "claude", "opencode"] : [args.agent];
  return agents.map((agent) => ({ agent, parent: targets[agent][args.scope] }));
}

function copySkill(parent, force) {
  const destination = join(parent, skillName);
  mkdirSync(parent, { recursive: true });

  if (existsSync(destination)) {
    if (!force) {
      throw new Error(`${destination} already exists. Re-run with --force to overwrite it.`);
    }
    rmSync(destination, { recursive: true, force: true });
  }

  cpSync(sourceSkill, destination, { recursive: true, dereference: true });
  return destination;
}

function assertSourceSkill() {
  if (!existsSync(sourceSkill) || !statSync(sourceSkill).isDirectory()) {
    throw new Error(`Bundled skill not found: ${sourceSkill}`);
  }
  const files = readdirSync(sourceSkill);
  if (!files.includes("SKILL.md")) {
    throw new Error(`Bundled skill is missing SKILL.md: ${sourceSkill}`);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  assertSourceSkill();
  const installs = selectedTargets(args);

  if (args.listTargets) {
    for (const item of installs) {
      console.log(`${item.agent}: ${join(item.parent, skillName)}`);
    }
    return;
  }

  for (const item of installs) {
    const destination = copySkill(item.parent, args.force);
    console.log(`Installed ${skillName} for ${item.agent}: ${destination}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  console.error("Run with --help for usage.");
  process.exitCode = 1;
}
