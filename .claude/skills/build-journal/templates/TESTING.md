# Testing <project>

How to check that everything works, from the automated tests to restoring production, and what to do when something goes wrong.

## 1. The automated checks

| Command | What it checks |
| --- | --- |
| `<typecheck command>` | <…> |
| `<lint command>` | <…> |
| `<test command>` | <…> |

<Prerequisites: such as "the database tests need Postgres: `docker compose up -d postgres`", and how test data is isolated.>

**What's tested** (<N> tests, <month year>):

| Package or area | Tests | What they cover |
| --- | --- | --- |
| <…> | <n> | <…> |

**Every new test is seen failing once,** by breaking the code it covers on purpose, before it's trusted.

## 2. What CI runs

| Job | When | What it does |
| --- | --- | --- |
| <…> | <…> | <…> |

**When a job is red:** <where to look>.

## 3. By hand, on your machine

### <An end-to-end flow>

```bash
<commands>
```

<What success looks like.>

## 4. Against the live system

### From anywhere

```bash
curl https://<host>/health
# <expected output>
```

### On the server

| Command | What you should see |
| --- | --- |
| <…> | <…> |

### The disaster drill

<Before you start: a snapshot and a fresh backup. Then the commands, then what to compare.>

**Last run:** not yet.

## 5. Troubleshooting

### On your machine

**<The symptom, as seen>.** <The cause>. <The fix>.

### <The server / deploys / …>

**<The symptom>.** <The cause>. <The fix>.
