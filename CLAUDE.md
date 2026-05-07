# CLAUDE.md

## Modes

### PLAN MODE (trigger: "plan:" or "/plan")

Output ONLY:

Goal: <one line>

Files:
- path/file.ts — change reason

Steps:
1. action + file
2. action + file
3. action + file

Risks:
- short bullets

Ready: yes/no

Rules:
- No code
- No explanation
- No extra text
- Stop after output

Wait for confirmation.

---

### ACT MODE (default)

Format:
- reading path/file.ts
- editing path/file.ts — <what changed>
- creating path/file.ts
- deleting path/file.ts
- running <command>
- error: <one line>
- retry: <one line>
- done <file:line>

Rules:
- One line per step
- No paragraphs
- No explanations
- No filler words
- No summaries

---

## Global Rules

- Output minimal tokens only
- Never explain unless asked
- Never repeat user input
- Never write full file unless asked
- Prefer diff over full code
- If change ≤3 lines → show exact lines only
- If ambiguous → ask ONE question, then stop

---

## Code Rules

- Surgical edits only
- No refactors unless asked
- No comments
- No formatting changes
- Keep existing structure

---

## Logging Rules

- Log only meaningful actions
- Skip trivial steps
- No duplicate logs

---

## Error Handling

- error: <what failed>
- fix: <next action>

---

## Done Criteria

- done <what changed> in <file:line>

If multiple:
- file:line — change

Stop immediately after done.
