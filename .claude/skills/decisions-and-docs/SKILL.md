---
name: decisions-and-docs
description: Keep a project's decisions and documentation honest. Architecture decision records (ADRs) with front matter, superseded rather than rewritten; READMEs that describe only how things work now, with "designed, not built yet" sections; and a roadmap of small steps, each with a check, ticked in the change that builds it. Use this whenever a change makes a decision (a library, a data model, an API shape, a host, a convention), when writing or updating a README, when planning work in steps, or when someone asks "why is it like this?" Use it even if the user doesn't say "ADR".
---

# Decisions and docs

Three kinds of document, each with one job, so none of them rots:

| Document | Answers | Changes when |
| --- | --- | --- |
| **ADR** (`docs/decisions/NNNN-title.md`) | *Why* is it like this, and what else was considered? | Never rewritten: superseded by a newer ADR |
| **README** (one per package or app) | *How* does it work *now*? | In the same change as the code it describes |
| **Roadmap** (`docs/roadmap.md`) | *What's next,* and how do we know each step is done? | A step is ticked in the change that builds it |

Keeping them apart is the point. A README full of history is hard to use. An ADR edited after the fact loses the reasoning that was true when it was made. A roadmap without checks can't say when a step is done.

## ADRs

**Every decision gets an ADR, in the same change that makes it.** A decision is anything someone might later ask "why?" about: choosing a library or a host, a data format, a naming convention, an API shape, a trade-off taken on purpose. Tooling (editor settings, lint rules, CI tweaks) usually doesn't need one.

- **Numbered in order,** never reusing a number: `0007-git-like-storage.md`. Add a row to the index, `docs/decisions/README.md` ([template](templates/decisions-README.md)).
- **Front matter, then four sections** ([template](templates/adr.md)):

  ```md
  ---
  title: "The decision, as one sentence"
  number: 7
  status: accepted             # or superseded (wholly replaced)
  implementation: designed     # built | partly-built | designed; leave it out for a principle
  date: 2026-11-02
  supersedes: [3]              # optional
  superseded_by: [12]          # optional, also when only part is superseded
  notes: "What the status alone doesn't say."
  ---

  ## Context
  ## Decision
  ## Alternatives
  ## Consequences
  ```

  - **Context:** the problem and its constraints, so a reader who wasn't there understands why a decision was needed.
  - **Decision:** what was decided, specifically enough to check the code against it (versions, names, rules).
  - **Alternatives:** what else was considered, and why not. If the user overrode a recommendation, say so: that's useful history.
  - **Consequences:** what follows, good and bad, including what the decision makes harder.
- **Supersede, never rewrite.** When a decision changes, write a new ADR listing the old one in `supersedes`. In the old ADR, change only the front matter: add `superseded_by`, set `status: superseded` if it's wholly replaced, and add a note. Its body keeps the names and paths that were true when it was written. That's what lets someone follow how the project got here.
- **Building a design later** is a front-matter change too: `implementation: designed` becomes `partly-built`, then `built`, with a note on what's built, and the index row updated.
- **The title is the decision,** not the topic: "Postgres stores content as Git-like commits", not "Storage".

`templates/adr-schema.yaml` is a JSON Schema for the front matter. If the project checks its docs (a CI script, or a content checker), validate ADRs with it.

## READMEs

**Every package and app has a README describing how it works now:** what it is, how to run or use it, its settings, its API, and its files. Update it in the same change as the code.

- **Designed, not built yet:** describe planned work in sections titled "… (designed, not built yet)". When it's built, drop the suffix and correct the details to match what was built.
- **No history or reasoning.** "We switched from X because…" belongs in an ADR. The README says what *is*, and can link to the ADR for why.
- **Concrete:** commands that run, settings with their defaults, tables of scripts and files. A reader should be able to use the package from its README alone.
- **When a detail moves,** fix every README that mentions it. Search for the old name before finishing a change.

## The roadmap

A roadmap is a list of stages, each a list of small, ordered steps. Each step is a single change that leaves every check green ([template](templates/roadmap.md)).

- **Each step ends in a *Check*:** an observable way to know it's done ("a fresh database migrates, and bad rows are refused"), not a feeling.
- **Each stage has a goal and a "done when"** for the whole stage.
- **Tick the step in the change that builds it,** with the ADR number in parentheses. Steps that come up along the way go under "Also done in this stage".
- **Decisions still to make** get their own list in the stage, so they're made on purpose rather than by accident.
- **Before starting a step,** re-read it: plans written weeks earlier often need adjusting, and adjusting the roadmap first is cheaper than building the wrong thing.

## Workflow for a change

1. Read the decisions index and the roadmap before proposing anything that might contradict an earlier decision.
2. If the change decides something, write the ADR (or the superseding one) first, as part of the plan.
3. Make the change, and update the READMEs it touches.
4. Tick the roadmap step if this builds one, and update the ADR's `implementation`.
5. Check: links resolve, the index has the new row, and no README describes the old behaviour.
