# Attribution & maintenance strategy for Matt Pocock-derived behavior

Research for [98kb/skills#11](https://github.com/98kb/skills/issues/11).

## What MIT actually requires

Primary source: `LICENSE` at [github.com/mattpocock/skills](https://github.com/mattpocock/skills),
fetched from `https://raw.githubusercontent.com/mattpocock/skills/main/LICENSE`.
Verbatim content:

```
MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

This is the unmodified standard MIT template. No repo-specific additions,
NOTICE file, or attribution clause beyond the boilerplate were found in
mattpocock/skills — the fetched file contains exactly the text above, nothing
more.

The operative clause is:

> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.

MIT's textual requirement is narrow and mechanical: when you copy the
Software (or a substantial portion of it), the copyright notice and license
text must travel with that copy. It does not, on its face, mandate a
"Sources" section, a credits page, or any particular citation format — it's
satisfied by including the notice+license text alongside the copied material.
It also does not restrict modification, relicensing of derivative works, or
commercial use; it only conditions redistribution of the (substantial
portions of the) licensed Software itself.

## Existing convention in this repo

Checked via `git show 36cf08e --stat`, `README.md`, `CLAUDE.md`,
`skills-lock.json`, and a recursive search of `.claude/skills/` and `docs/`
for `LICENSE`/`NOTICE` files or embedded copyright/license strings.

**No `LICENSE` or `NOTICE` file exists anywhere in this repo** — not at the
root, and not under `.claude/skills/` where the vendored skill files
themselves live (`find /home/dsfx3d/work/98kb/skills -iname "LICENSE*" -o
-iname "NOTICE*"` returns nothing, and the same holds scoped to
`.claude/skills/`). None of the vendored `SKILL.md` files contain an embedded
copyright notice or license text either (checked all 18; only literal string
matches for "Matt" are skill titles like `# Ask Matt` and `# Setup Matt
Pocock's Skills`, not attribution).

Attribution today lives in three places, none of which reproduce the MIT
license text itself:

**1. `README.md`** (root), the only prose attribution, quoted exactly:

> - **`.claude/skills/`** — vendored skills installed from
>   [mattpocock/skills](https://github.com/mattpocock/skills) via the
>   [`skills`](https://github.com/vercel-labs/skills) CLI. **Never edit these
>   by hand.** They're only ever changed by running `npx skills update` and
>   reviewing the resulting diff before committing it.

This is a link-based, plain-English attribution embedded in a bullet about
repo layout — not a dedicated "Credits" or "Third-Party" section, and not
adjacent to any copyright/license text.

**2. `skills-lock.json`** (root), a machine-readable provenance record, one
entry per vendored skill, e.g.:

```json
"wayfinder": {
  "source": "mattpocock/skills",
  "sourceType": "github",
  "skillPath": "skills/engineering/wayfinder/SKILL.md",
  "computedHash": "f343ecf46157cb645a5494644418308ad95391e9fc696faa47ae5a412bf5f6e4"
}
```

Every one of the 18 vendored skills carries `"source": "mattpocock/skills"`
and `"sourceType": "github"` — this is the closest thing to a per-item
copyright/provenance record in the repo, but it's a lockfile artifact of the
`skills` CLI, not attribution text a human or license would recognize as such.

**3. The vendoring commit message** (`36cf08e`, "Vendor Matt Pocock's
engineering skills and bootstrap repo config"): names the source
(`mattpocock/skills`) and the mechanism (`skills CLI`), but commit messages
aren't part of the shipped tree and wouldn't travel with a copy of the
Software the way MIT's clause contemplates.

`CLAUDE.md` itself contains no attribution — it only points to
`docs/agents/*.md` for issue-tracker/triage/domain-doc conventions and does
not mention Matt Pocock or the source repo at all.

**Net convention:** attribution here is achieved by *linking to the source
repo and CLI tooling in README prose*, plus a *machine-readable source field*
in the lockfile — not by vendoring the MIT LICENSE text or a NOTICE file
into this repo. If new skills (`to-vision`, `to-roadmap`, `to-milestone`)
are meant to "follow the same established convention," that convention is:
name the source, link it, done — not reproduce license boilerplate.

## Open nuance for the founder (not resolved here)

MIT's clause is triggered by copying "the Software... or substantial portions
of the Software." Two different situations are in play for the new skills,
and this research doesn't take a position on which one MIT's text covers:

- **Verbatim/near-verbatim reuse**: if a new skill's SKILL.md (or supporting
  doc) copies substantial wording from a vendored file — e.g. lifting the
  "grilling" discipline's actual prose about facts vs. decisions vs.
  dependent questions — that looks like copying "a substantial portion of
  the Software" in MIT's terms, which on its face triggers the
  notice-inclusion clause.
- **Behavioral/protocol adaptation without copying text**: if a new skill
  independently describes the same *discipline* (agent investigates facts,
  human keeps decisions, dependent questions wait, explicit approval gates
  proceed) in original wording, without copying the source file's text, it's
  a much less clear case — MIT protects the expression (the actual text/code)
  of the Software, not the underlying idea or protocol it describes. Whether
  a "discipline" or "protocol" is itself protectable expression, versus an
  unprotectable method/idea, is exactly the kind of line MIT's text doesn't
  answer and this research isn't positioned to resolve.

This is flagged as a distinction to weigh, not a conclusion: the repo's
current convention (link + lockfile entry, no LICENSE/NOTICE file) may be
sufficient for case 2 but arguably thin for case 1 if any new skill ends up
copying substantial text from a vendored `SKILL.md`.

## Sources

- `https://raw.githubusercontent.com/mattpocock/skills/main/LICENSE` (fetched
  2026-08-08; confirmed `main` is the default branch via `gh repo view
  mattpocock/skills --json defaultBranchRef`)
- `/home/dsfx3d/work/98kb/skills/README.md`
- `/home/dsfx3d/work/98kb/skills/CLAUDE.md`
- `/home/dsfx3d/work/98kb/skills/skills-lock.json`
- `/home/dsfx3d/work/98kb/skills/.claude/skills/**/SKILL.md` (all 18 vendored
  skill files, checked for embedded copyright/license text — none found)
- `git show 36cf08e --stat` (local checkout, `98kb/skills`)
