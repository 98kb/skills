# 98kb/skills

Agent skills for Claude Code, managed npm-dependency-style: vendored source plus
a lockfile, updated deliberately rather than auto-pulled.

## Layout

- **`skills/engineering/`** — hand-authored engineering skills, written and
  maintained in this repo. Edit these directly.
- **`.claude/skills/`** — vendored skills installed from
  [mattpocock/skills](https://github.com/mattpocock/skills) via the
  [`skills`](https://github.com/vercel-labs/skills) CLI. **Never edit these by
  hand.** They're only ever changed by running `npx skills update` and
  reviewing the resulting diff before committing it.
- **`skills-lock.json`** — the lockfile pinning exactly which upstream skill
  versions are installed. Commit it alongside any vendored-skill change.
- **`docs/agents/`** — per-repo configuration the vendored engineering skills
  read from (issue tracker, triage labels, domain-doc layout), written by the
  `setup-matt-pocock-skills` bootstrapper skill.

## Restoring skills on a fresh clone

```
npx skills experimental_install
```

Reads `skills-lock.json` and reinstalls every vendored skill at the pinned
version — no network guessing, no drift from what's checked in.

## Checking for upstream updates

```
npx skills check
```

Reports whether any vendored skill has a newer version upstream. Nothing is
changed automatically.

## Updating a vendored skill

```
npx skills update
```

Then review the diff under `.claude/skills/` before committing — treat it like
reviewing a dependency bump, not a blind pull.

## Installing skills from this repo

Once skills are published here, others can install them the same way:

```
npx skills add 98kb/skills --skill <name>
```
