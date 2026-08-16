# Branching

How any change that touches source files gets isolated, integrated, and landed.

Applies to changes to source files. Does not apply to read-only work (answering questions, exploring, reviewing) — those stay in the main checkout.

## The shape

```
main
 └── trunk/<slug>          ← the change; lives in its own worktree
      ├── <slug>/subtask-a ← branches off trunk, merges back into trunk
      └── <slug>/subtask-b
```

One change → one trunk branch → one worktree → one PR into `main`.

## Choosing the granularity: one trunk, or several?

A parent issue that decomposes into several tickets can map either way. The predicate is **shared file surface, not the ticket hierarchy**.

- **Tickets touching disjoint files → one trunk each, worked in parallel.** Each is its own change with its own PR into `main`.
- **Tickets converging on the same file → one trunk for the set, tickets as subtask branches merging into it.** Integration happens on trunk, where conflicting edits are reconciled once instead of across several racing PRs.

Sharing a parent issue proves nothing either way: two subtasks of one issue are often independent, and two tickets under different parents can collide. Check what the tickets edit, not how they're filed.

Semantic conflicts matter more than textual ones here. Two tickets can edit non-adjacent lines of one document and still contradict each other — a value stated once in one ticket and restated differently in another. A shared trunk is the cheap defence.

## 1. Open an isolated worktree and a trunk branch

Before touching any source file, create a worktree with a fresh trunk branch cut from `main`:

```bash
git worktree add ../skills-<slug> -b trunk/<slug> main
```

- `<slug>` — short kebab-case name for the change (e.g. `worktree-workflow`, `issue-58-triage-fix`).
- Worktrees live as **siblings of the repo**, not inside it — the repo has no `.gitignore`, so a nested worktree dir would show up as untracked.
- All work for the change happens in that worktree. The main checkout stays on `main` and stays clean.

## 2. Subtasks branch off and back into trunk

If the change decomposes into subtasks (parallel agents, separable pieces, spikes), each one branches off the trunk branch and merges back into it. Subtasks never branch from `main` and never merge into `main`.

```bash
git switch -c <slug>/subtask-a trunk/<slug>
# ...work, commit...
git switch trunk/<slug>
git merge --no-ff <slug>/subtask-a
git branch -d <slug>/subtask-a
```

Trunk is the integration point: subtasks integrate with each other there, not in the PR.

## 3. On arrival, PR from trunk into main

When the change is complete — every subtask merged into trunk, work verified — open the pull request from `trunk/<slug>` into `main`:

```bash
git push -u origin trunk/<slug>
gh pr create --base main --head trunk/<slug>
```

Only trunk branches open PRs against `main`. Never commit to `main` directly, and never open a PR into `main` from a subtask branch.

## 4. Clean up after the merge

```bash
git worktree remove ../skills-<slug>
git branch -d trunk/<slug>
```

## Notes

- The `EnterWorktree` / `ExitWorktree` tools do steps 1 and 4 when available; the commands above are the fallback and the source of truth for naming.
- Pushing and PR creation are outward-facing — ask before doing either unless already told to proceed.
- The granularity rule above was recorded from #59's ten-ticket decomposition, before any converging ticket set had been worked end to end. Revisit it once one has.
