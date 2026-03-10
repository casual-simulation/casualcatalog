# Shared init for all Husky hooks.
# Ensures node is available in GUI git clients (Fork, GitHub Desktop, etc.)
# that don't inherit your shell's PATH.

# macOS — nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || true

# macOS — Homebrew
[ -s "/opt/homebrew/bin/brew" ] && eval "$(/opt/homebrew/bin/brew shellenv)" || true

# Linux — Homebrew (linuxbrew)
[ -s "/home/linuxbrew/.linuxbrew/bin/brew" ] && eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)" || true

# Linux — common node locations
[ -d "/usr/local/bin" ] && export PATH="/usr/local/bin:$PATH" || true

# Windows (Git Bash) — nvm-windows
[ -d "$APPDATA/nvm" ] && export PATH="$APPDATA/nvm:$PATH" || true

# Windows (Git Bash) — volta
[ -d "$LOCALAPPDATA/Volta/bin" ] && export PATH="$LOCALAPPDATA/Volta/bin:$PATH" || true

# fnm (cross-platform)
command -v fnm >/dev/null 2>&1 && eval "$(fnm env)" || true
