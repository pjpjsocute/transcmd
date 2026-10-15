#!/bin/bash

# Alfred does not inherit the interactive shell PATH, so Node installed by
# Homebrew, nvm, fnm, etc. may otherwise be invisible to the workflow.
if command -v node >/dev/null 2>&1; then
    exec node "$@"
fi

node_binary="$(/bin/zsh -lic 'command -v node' 2>/dev/null | /usr/bin/tail -n 1)"
if [[ -n "$node_binary" && -x "$node_binary" ]]; then
    exec "$node_binary" "$@"
fi

echo '{"items":[{"title":"找不到 Node.js","subtitle":"TransCmd 需要 Node.js 12 或更高版本","valid":false}]}'
