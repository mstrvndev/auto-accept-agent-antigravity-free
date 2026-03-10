# 🚀 AUTO-ACCEPT-MSTRVNDEV — Free Edition

[![Version](https://img.shields.io/badge/version-1.0.3-blue?style=for-the-badge)](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/releases)
[![Open VSX](https://img.shields.io/open-vsx/v/mstrvndev/auto-accept-mstrvndev?style=for-the-badge&label=Open%20VSX&color=purple)](https://open-vsx.org/extension/mstrvndev/auto-accept-mstrvndev)
[![VS Code](https://img.shields.io/badge/VS%20Code-%3E%3D1.75.0-007ACC?style=for-the-badge&logo=visual-studio-code)](https://code.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Downloads](https://img.shields.io/github/downloads/mstrvndev/auto-accept-agent-antigravity-free/total?style=for-the-badge&color=orange)](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/releases)

> **Automatically accept AI agent suggestions in Cursor, Antigravity & VS Code — hands-free coding at lightning speed.**

AUTO-ACCEPT-MSTRVNDEV is a powerful **VS Code / Cursor / Antigravity extension** that automates the "Accept" workflow when working with AI coding agents. Stop clicking manually — let the agent run autonomously while you focus on what matters.

---

## ✨ Key Features

| Feature | Free | Pro |
|---|:---:|:---:|
| 🤖 **Auto-Accept AI Suggestions** | ✅ | ✅ |
| ⚡ **Fast Polling (0.3s interval)** | ✅ | ✅ |
| 🔄 **Background Mode** (all chats) | — | ✅ |
| 🎯 **Custom Poll Frequency** | — | ✅ |
| 🛡️ **Dangerous Command Blocking** | ✅ | ✅ |
| 🖥️ **CDP-Based Browser Control** | ✅ | ✅ |
| 📊 **Analytics Dashboard** | ✅ | ✅ |
| 🔧 **Automatic CDP Setup** | ✅ | ✅ |
| 🌐 **Multi-IDE Support** (Cursor, Antigravity, VS Code) | ✅ | ✅ |
| 🔽 **Auto Scroll-to-Bottom** | ✅ | ✅ |
| ✅ **"Always Allow" Auto-Accept** | ✅ | ✅ |

---

## 📦 Installation

### Option 1 — Open VSX Registry (Recommended for Antigravity)

1. Open your IDE's Extensions panel.
2. Search for **`auto-accept-mstrvndev`**.
3. Click **Install**.

Or install directly from: **[open-vsx.org/extension/mstrvndev/auto-accept-mstrvndev](https://open-vsx.org/extension/mstrvndev/auto-accept-mstrvndev)**

### Option 2 — Pre-built VSIX

1. Go to the [**Releases**](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/releases) page.
2. Download the latest **`.vsix`** file.
3. In VS Code / Cursor / Antigravity, open the Command Palette (`Ctrl+Shift+P`).
4. Run **`Extensions: Install from VSIX...`** and select the downloaded file.

### Option 3 — From Source

```bash
git clone https://github.com/mstrvndev/auto-accept-agent-antigravity-free.git
cd auto-accept-agent-antigravity-free
npm install
npm run compile
npx vsce package
```

Then install the generated `.vsix` via `Extensions: Install from VSIX...`.

---

## 🚀 Quick Start

1. **Install** the extension (see above).
2. Look for **`Auto Accept`** in the status bar (bottom-right).
3. **Click** the status bar item or run `Auto Accept: Toggle ON/OFF` from the Command Palette.
4. **First time only:** The extension will automatically configure your IDE shortcuts with the required `--remote-debugging-port=9000` flag and show a toast notification.
5. **Restart your IDE manually** by closing and reopening it from the updated shortcut.
6. After restart, click **Auto Accept** again — the agent will now **automatically accept** AI suggestions as they appear.

> **💡 Tip:** You no longer need to run any external PowerShell script. The extension handles the CDP setup automatically on first use.

### Commands

| Command | Description |
|---|---|
| `Auto Accept: Toggle ON/OFF` | Enable or disable auto-accept |
| `Auto Accept: Toggle Background Mode` | Toggle background mode (Pro) |
| `Auto Accept: Settings` | Open settings panel |

---

## 🛡️ Safety — Dangerous Command Blocking

AUTO-ACCEPT-MSTRVNDEV ships with a built-in blocklist of dangerous terminal commands to keep you safe:

- `rm -rf /`, `rm -rf ~`, `rm -rf *`
- `format c:`, `del /f /s /q`, `rmdir /s /q`
- Fork bombs, `dd if=`, `mkfs.`, `chmod -R 777 /`

You can customize this list in the settings panel.

---

## 🏗️ Architecture

```
auto-accept-mstrvndev/
├── extension.js              # Main VS Code extension entry
├── settings-panel.js         # Settings webview UI
├── dist/                     # Compiled output (bundled by esbuild)
├── main_scripts/
│   ├── cdp-handler.js        # Chrome DevTools Protocol integration
│   ├── auto_accept.js        # Core auto-accept logic
│   ├── antigravity_background_poll.js  # Antigravity polling
│   ├── full_cdp_script.js    # Full CDP injection script
│   ├── relauncher.js         # CDP setup & restart prompt
│   ├── selector_finder.js    # DOM selector detection
│   ├── overlay.js            # UI overlay
│   ├── simple_poll.js        # Lightweight polling fallback
│   ├── utils.js              # Shared utilities
│   └── analytics/            # Usage analytics modules
├── media/
│   ├── icon.png              # Extension icon
│   └── image.png             # Promo image
└── .github/
    └── workflows/
        └── publish-openvsx.yml  # Auto-publish to Open VSX on push
```

---

## 🔧 How It Works

1. **IDE Detection** — Automatically detects whether you're running Cursor, Antigravity, or VS Code.
2. **Automatic CDP Setup** — On first toggle, the extension configures your IDE shortcuts with `--remote-debugging-port=9000` and prompts you to restart manually.
3. **CDP Connection** — After restart, connects to the IDE's built-in browser via the Chrome DevTools Protocol.
4. **Polling Loop** — Watches for AI agent "Accept" buttons at configurable intervals.
5. **Safe Execution** — Checks every pending command against the blocklist before accepting.
6. **Auto Recovery** — If the connection drops, the extension reconnects automatically.
7. **Scroll-to-Bottom** — Automatically scrolls chat panels to reveal hidden accept buttons.

---

## 📋 Changelog

### v1.0.3

- **Added "Continue" button auto-click** — Now detects and clicks the "Continue" button (e.g. `Alt+Enter` prompt) automatically.
- **Fixed publisher namespace** — Changed publisher from `mstrvn` to `mstrvndev` to match the verified Open VSX publisher account, eliminating the "not a verified publisher" warning.

### v1.0.2

- Minor internal updates.

### v1.0.1

- **Removed auto-restart of IDE** — The extension no longer force-quits and relaunches your IDE. Instead, it shows a toast notification prompting you to restart manually.
- **Integrated CDP setup** — No more external PowerShell scripts needed (`enable_antigravity_debug.ps1` is now built into the extension).
- **Published to Open VSX** — Install directly from the Open VSX Registry.
- **CI/CD** — Added GitHub Actions workflow for automatic Open VSX publishing on every push.

### v1.0.0

- Initial release with auto-accept, CDP integration, background mode, analytics dashboard, and dangerous command blocking.

---

## 🤝 Compatible With

- [**Antigravity Tools**](https://github.com/lbjlaq/Antigravity-Manager) — AI account manager & proxy gateway
- **Cursor** — AI-first code editor
- **VS Code** — Microsoft Visual Studio Code
- **Claude Code CLI** — Anthropic's coding agent
- **Gemini CLI** — Google's AI coding assistant
- **OpenAI Codex** — OpenAI's code generation

---

## 📋 Requirements

- VS Code / Cursor / Antigravity **≥ 1.75.0**
- Node.js (for building from source)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 [mstrvndev](https://github.com/mstrvndev)

---

## ⭐ Star This Repo

If AUTO-ACCEPT-MSTRVNDEV saves you time, please give it a ⭐ on GitHub — it helps others discover this tool!

---

## 🔗 Links

- 📥 [Download Latest Release](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/releases)
- 🟣 [Open VSX Registry](https://open-vsx.org/extension/mstrvndev/auto-accept-mstrvndev)
- 🐛 [Report Issues](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/issues)
- 💬 [Discussions](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/discussions)

---

**Keywords**: auto accept mstrvndev, auto accept agent, cursor auto accept, antigravity auto accept, vscode auto accept, ai agent automation, cursor extension, antigravity extension, auto accept vsix, free auto accept, coding agent automation, ai coding assistant, cursor ai, antigravity tools, vscode extension, auto approve agent, hands-free coding, ai workflow automation, mstrvndev, auto-accept-mstrvndev, open vsx
