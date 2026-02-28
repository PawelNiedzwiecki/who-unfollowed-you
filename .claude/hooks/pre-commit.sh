#!/bin/bash
# Runs before any Bash tool call. Intercepts git commit commands and
# validates TypeScript + tests before allowing the commit to proceed.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only intercept git commit calls
if ! echo "$COMMAND" | grep -q "git commit"; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 0

echo "Running type check..."
if ! yarn tsc --noEmit; then
  echo "TypeScript errors found — commit blocked." >&2
  exit 2
fi

echo "Running tests..."
if ! yarn test; then
  echo "Tests failed — commit blocked." >&2
  exit 2
fi

echo "All checks passed."
exit 0
