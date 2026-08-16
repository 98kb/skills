# Portability boundary & target runtimes

Research for [issue #10](https://github.com/98kb/skills/issues/10). The `to-vision`, `to-roadmap`, `to-milestone` skills and the two-level Wayfinder map extension are meant to run as portable Agent Skills, but must also work well inside Claude Code (this repo's primary target — see `.claude/skills/wayfinder/SKILL.md`) and ideally degrade gracefully in Codex. This doc pins down, from primary sources, which capabilities each runtime actually gives a skill author.

## 1. The generic Agent Skills spec

Primary source: [agentskills.io/specification](https://agentskills.io/specification) (the spec that `github.com/anthropics/skills/blob/main/spec/agent-skills-spec.md` now points to).

The spec defines only:

- A skill is a directory with a required `SKILL.md` (YAML frontmatter + Markdown body) and optional `scripts/`, `references/`, `assets/` subdirectories.
- Frontmatter fields: `name` (required, ≤64 chars, lowercase/hyphens, must match the directory name), `description` (required, ≤1024 chars), `license`, `compatibility` (free-text environment-requirements hint, e.g. "Designed for Claude Code (or similar products)"), `metadata` (arbitrary string map), and `allowed-tools` (space-separated list of pre-approved tools — explicitly marked **experimental**, "support for this field may vary between agent implementations").
- Progressive disclosure: metadata loaded at startup (~100 tokens), full body loaded on activation (<5000 tokens recommended), `scripts/`/`references/`/`assets/` loaded on demand.
- Body content has "no format restrictions" — it's freeform Markdown instructions.

**The spec says nothing about runtime capabilities.** It does not define, mention, or require: invoking other skills, spawning subagents/background agents, asking the human structured multi-turn questions, filesystem read/write, scheduled/background task execution, or issue-tracker integration. The `compatibility` field exists precisely because the spec authors expect these things to vary by host; `allowed-tools` is the one explicit acknowledgment that tool access is host-defined and not standardized. In short: **the base spec is a file-format and discovery contract, not a capability contract.** Whatever a skill can *do* comes entirely from whatever tools/agent loop the host runtime exposes to it — the spec is silent by design.

## 2. Claude Code

Primary source: [code.claude.com/docs/en/tools-reference](https://code.claude.com/docs/en/tools-reference) (Claude Code's built-in tools reference), cross-checked against this repo's own `.claude/skills/wayfinder/SKILL.md`.

Claude Code layers a large, product-specific tool surface on top of the base spec:

- **Subagents / background agents** — the `Agent` tool spawns a subagent with its own context window ("Task" tool internally); subagents run in the background by default (v2.1.198+) and report a single result back. `SendMessage`/`ListAgents` allow messaging other agents/sessions. `TaskStop` halts a running background agent. This is exactly what `wayfinder`'s Research ticket type depends on ("Resolved by a `/research` **subagent**").
- **Structured multi-turn questions to a human** — `AskUserQuestion` presents multiple-choice questions (with free-text "Other" fallback) and stays open until answered or a configurable timeout elapses. This is a first-class tool, not something built out of plain chat turns.
- **Filesystem access** — `Read`, `Write`, `Edit`, `Glob`, `Grep`, `NotebookEdit` are all native, permissioned tools.
- **`gh`/issue-tracker integration** — no dedicated GitHub tool; it goes through the generic `Bash` tool (permissioned, path/command-pattern rules), i.e. `gh` works because Bash + an installed `gh` CLI exist, not because Claude Code has a GitHub-specific integration. This repo's `docs/agents/issue-tracker.md` and the wayfinder skill both lean on this (issues, labels, assignment, native blocking via `gh`).
- **Background/scheduled task tracking** — `TaskCreate`/`TaskList`/`TaskGet`/`TaskUpdate` manage a session task list; `CronCreate`/`CronList`/`CronDelete` schedule recurring or one-shot prompts (session-scoped); `Monitor` watches long-running processes/logs/websockets and reports back mid-conversation; `PushNotification` notifies on long-running work.
- **Skill-to-skill invocation** — the `Skill` tool "executes reusable prompt-based workflows through existing tools" and is itself permissioned (`Skill(deploy *)` style rules), confirming a skill can trigger another skill natively.
- **Hooks** — event-driven deterministic scripts triggered on tool/session events, independent of model interpretation (not itself invoked by a skill, but shapes what a skill can rely on happening automatically).

All of the above are Claude Code product features, not part of the agentskills.io spec — they exist because Claude Code implements a rich native tool set that a `SKILL.md` file can merely *instruct* the agent to use, exactly as the base spec anticipates via `allowed-tools`/`compatibility`.

## 3. Codex (OpenAI)

Primary sources: [developers.openai.com/codex/skills](https://developers.openai.com/codex/skills) (redirects to `learn.chatgpt.com/docs/build-skills`), [developers.openai.com/codex/guides/agents-md](https://developers.openai.com/codex/guides/agents-md) (redirects to `learn.chatgpt.com/docs/agent-configuration/agents-md`), and [github.com/openai/codex/blob/main/docs/skills.md](https://github.com/openai/codex/blob/main/docs/skills.md) (a stub pointing at the same developer-portal page — i.e. OpenAI keeps one canonical skills doc, mirrored from the CLI repo).

Codex **does** have a public, documented skills mechanism as of today, and it follows the same open `SKILL.md` format:

- Skill = directory with required `SKILL.md` (`name` + `description` frontmatter), optional `scripts/`, `references/`, `assets/`, plus a Codex-specific optional `agents/openai.yaml` for UI metadata (`display_name`, icons, `default_prompt`) and policy (`policy.allow_implicit_invocation`, `dependencies.tools` referencing e.g. MCP tools).
- Invocation: explicit via `$skill-name` or `/skills` in the CLI (or `@` in ChatGPT), or implicit when the task description matches — implicit invocation can be turned off per-skill via `allow_implicit_invocation: false`.
- Discovery precedence: `$CWD/.agents/skills` → `$REPO_ROOT/.agents/skills` → `$HOME/.agents/skills` → `/etc/codex/skills`. Same-named skills at different levels are **not merged**; both remain selectable — a divergence from any single-source-of-truth assumption.
- `AGENTS.md` is a separate, always-on instruction-layering mechanism (global `~/.codex` + project-scoped, closer files override farther ones) — analogous in spirit to `CLAUDE.md` in this repo, but not part of the skills format itself.
- Codex CLI has native shell/filesystem execution (`shell`, `apply_patch`, `update_plan` tools per Codex's own prompt-instruction files in `github.com/openai/codex`), so a skill's instructions can drive `gh` the same way Claude Code's Bash does — through general shell access, not a bespoke GitHub tool.
- Codex Cloud provides asynchronous, repo-scoped background execution (fire off a task, come back to a PR) — but this is a separate cloud product surface for whole tasks, not a subagent-dispatch primitive a skill can call mid-session.

**What the primary sources do *not* document:** a subagent/sub-task dispatch tool callable from within a skill (parallel or nested agent invocation), a structured multi-turn clarifying-question tool analogous to `AskUserQuestion`, or any skill-level API for issue-tracker integration beyond shelling out. The one build-skills doc fetched explicitly notes the absence of subagents, background/async orchestration, and structured questioning as skill-level features — Codex's own skill docs describe skills as instruction-plus-scripts packages, not autonomous multi-agent orchestrators. Community write-ups (e.g. an "Awesome Codex CLI" GitHub discussion cataloguing "subagents" as one of 150+ *ecosystem* add-ons) confirm subagent patterns exist only as community conventions layered on top of AGENTS.md/shell, not as a native Codex primitive — so this should be treated as unverified/community, not primary-sourced Codex capability.

## Portability boundary

**Safe to assume everywhere (base spec + any compliant host):**
- A `SKILL.md` with `name`/`description` frontmatter will be discovered and its body loaded progressively.
- The skill can reference bundled `scripts/`, `references/`, `assets/` files.
- The skill can shell out to whatever CLI tools exist in the host's execution environment (in practice this is how `gh` issue-tracker integration works in *both* Claude Code and Codex — via general shell/Bash access, not a bespoke tool) — but only if the host grants shell/filesystem execution at all; the base spec does not guarantee it.
- Filesystem read of the skill's own bundled files (scripts/references/assets) — loading these is spec-defined behavior.

**Claude-Code-only (documented, no Codex or base-spec equivalent found):**
- Native subagent/background-agent dispatch mid-session (`Agent`/Task tool, `SendMessage`, `TaskStop`) — this is what wayfinder's Research ticket type currently assumes ("Resolved by a `/research` **subagent**"). No equivalent exists in Codex's documented skill surface.
- Structured multi-turn clarifying questions via a dedicated tool (`AskUserQuestion`) — Codex's grilling/HITL-style tickets would need to fall back to plain conversational turns.
- Native skill-to-skill invocation via a first-class `Skill` tool with its own permission model.
- Native session task list and cron/scheduling primitives (`TaskCreate`/`CronCreate`/`Monitor`) callable from within a skill's instructions.
- Hooks (deterministic, event-triggered scripts independent of the model).

**Currently unknown / unverifiable from public docs:**
- Whether Codex Cloud's background-task surface can be triggered *from within* a running skill (as opposed to being the top-level way a task is launched) — the docs describe it as a separate product surface, not a callable primitive, but this wasn't exhaustively confirmed against Codex's tool-call schema.
- Whether Codex plans to add an `AskUserQuestion`-equivalent or subagent-dispatch tool — no roadmap statement found in primary sources.
- Behavior of `allowed-tools` (base spec, marked experimental) under Codex specifically — the spec warns support "may vary between agent implementations" and Codex's own docs don't cross-reference it.
- Any third runtime beyond Claude Code/Codex (e.g. other agentskills.io-compliant hosts) is entirely unresearched here; scope was limited to the two runtimes this repo currently targets or is considering.

**Design implication for the three new skills + map extension:** anything relying on subagent dispatch (research tickets), structured multi-turn questions (grilling/prototype tickets), or the `Skill` tool for composition should either (a) be written to degrade to plain conversational instructions when those tools are absent, or (b) be explicitly scoped as Claude-Code-only in the skill's `compatibility` field, per the base spec's own mechanism for declaring environment requirements.
