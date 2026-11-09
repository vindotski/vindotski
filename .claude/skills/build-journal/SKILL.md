---
name: build-journal
description: Capture what building something teaches, while it's fresh. A private build log of decisions, problems and fixes, appended after each task and written so it can become blog posts, case studies or portfolio pieces; a TESTING.md that records every way the project is checked (automated, CI, by hand, live, and a disaster drill); and a troubleshooting FAQ grown only from failures that actually happened. Use this after finishing a task, step or debugging session worth remembering; when the user mentions a blog post, write-up, case study or portfolio; when setting up or updating TESTING.md, a runbook or troubleshooting docs; or when the user asks "how do we test this?" or "what went wrong last time?"
---

# Build journal

Three documents, each catching something that's otherwise lost when a session ends:

| Document | Lives | For | Grows when |
| --- | --- | --- | --- |
| **Build log** | Outside the repository (private) | Write-ups: blog posts, case studies, interviews | After each task: what was decided, what broke, what was learned |
| **`TESTING.md`** | The repository's root | Anyone repeating a check | A new kind of check is done, or the test counts change |
| **Troubleshooting FAQ** | In `TESTING.md`, or a runbook | Anyone hitting the same failure | A failure actually happens, and gets fixed |

## The build log

**Ask the user once where it lives** (a Markdown file outside the repository, such as `../PROJECT_BUILD_LOG.md`), and **append to it after every task or step**, without being asked again. Never put it in the repository: it holds drafts, blunders and opinions, which READMEs and ADRs shouldn't.

An entry is worth writing when it has a **story**: a decision with real alternatives, a failure with a surprising cause, a fix that taught something general. Write it so it can be lifted into a post:

- **A heading** with the step, the date and the decision's number: `## Step 12: the shared API, hosted (2026-11-02, ADR 44)`.
- **What was built, and the choice made,** in two or three sentences, including what the user chose when there were options, and why.
- **Problems, each as symptom → cause → fix → lesson.** Quote the actual error message: it's what readers search for.
  > **The first deploy failed on an rsync pattern.** `failed to read dockerfile: open Dockerfile: no such file or directory`. `--exclude Dockerfile` has no leading slash, so it also matched `backup/Dockerfile`. Fix: `--exclude /Dockerfile`. Lesson: the local trial never exercised the copy step that only CI does.
- **Evidence:** "Seen failing: …", test counts, sizes before and after ("1.26 GB → 1 GB"), measured times.
- **Second opinions and corrections:** when a better idea came from elsewhere, or the user corrected course, say so. That's part of the story, and it's honest.

Keep entries factual and specific. Leave out secrets, private hostnames and personal data, since the log may become public.

## TESTING.md

One page answering "how do I know this works?", in this order ([template](templates/TESTING.md)):
1. **The automated checks:** the commands, what each covers, and a table of test counts by package (a shrinking count stands out).
2. **What CI runs:** each job, when, and how to read a red one.
3. **By hand, locally:** the end-to-end flows a person can repeat, with the exact commands and what success looks like.
4. **Against the live system:** checks from anywhere (`curl`, the certificate), checks on the server, the restore check, and a **disaster drill** with a "Last run:" date.
5. **Troubleshooting:** below.

Write commands that were actually run, and outputs that were actually seen. When a check is described but hasn't been run, mark it ("Last run: not yet").

## The troubleshooting FAQ

Only real failures, each as:

> **<The symptom, as the person sees it: the error message or behaviour>.** <The cause, in a sentence>. <The fix, with the command>.

Group entries by where they happen (your machine, the server, DNS and backups, deploys). Add an entry in the same change as the fix. When a failure was fixed in code, keep the entry with "(fixed)", because people search for old error messages.

## Habits

- **At the end of every task:** append to the build log, update `TESTING.md` if checks or counts changed, and add FAQ entries for anything that broke.
- **When something fails mid-task,** note the exact message straight away. Reconstructed error messages are rarely right.
- **When the user asks for a write-up,** start from the build log: the material is already there, in order, with the evidence.
