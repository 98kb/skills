# Distinct label for child maps, not reused `wayfinder:map` + parent inference

Wayfinder's two-level extension needed a way to tell a child map apart from an ordinary ticket and from the milestone map itself, in a sub-issue list. The alternative was reusing `wayfinder:map` on both levels and inferring level from the parent link (child map = a `wayfinder:map` issue whose parent is also `wayfinder:map`). We chose a distinct `wayfinder:map:child` label instead: it stays visually distinct at a glance without following the parent link, and it keeps `label:wayfinder:map` meaning exactly what it means today — "the top-level map for this effort" — so existing single-level maps and any tooling built against that label are unaffected.

Considered options: reuse `wayfinder:map` on both levels and distinguish by parent-link inference (rejected — cheap for tooling to compute but not visible to a human scanning labels, and it changes what `label:wayfinder:map` returns once child maps exist).
