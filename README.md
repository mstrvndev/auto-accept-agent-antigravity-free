# 🚀 Auto Accept Agent — Free Edition

[![Version](https://img.shields.io/badge/version-8.9.0-blue?style=for-the-badge)](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/releases)
[![VS Code](https://img.shields.io/badge/VS%20Code-%3E%3D1.75.0-007ACC?style=for-the-badge&logo=visual-studio-code)](https://code.visualstudio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Downloads](https://img.shields.io/github/downloads/mstrvndev/auto-accept-agent-antigravity-free/total?style=for-the-badge&color=orange)](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/releases)

> **Automatically accept AI agent suggestions in Cursor, Antigravity & VS Code — hands-free coding at lightning speed.**

Auto Accept Agent is a powerful **VS Code / Cursor / Antigravity extension** that automates the "Accept" workflow when working with AI coding agents. Stop clicking manually — let the agent run autonomously while you focus on what matters.

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
| 🔁 **Auto-Relauncher** | ✅ | ✅ |
| 🌐 **Multi-IDE Support** (Cursor, Antigravity, VS Code) | ✅ | ✅ |

---

## 📦 Installation

### Option 1 — Pre-built VSIX (Recommended)

1. Go to the [**Releases**](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/releases) page.
2. Download the latest **`auto-accept-agent-8.9.0.vsix`** file.
3. In VS Code / Cursor / Antigravity, open the Command Palette (`Ctrl+Shift+P`).
4. Run **`Extensions: Install from VSIX...`** and select the downloaded file.

### Option 2 — From Source

```bash
git clone https://github.com/mstrvndev/auto-accept-agent-antigravity-free.git
cd auto-accept-agent-antigravity-free
npm install
npm run compile
```

Then install the extension folder in your IDE via `Extensions: Install from VSIX` or load it as a development extension.

---

## 🚀 Quick Start

1. **Install** the extension (see above).
2. Look for **`Auto Accept`** in the status bar (bottom-right).
3. **Click** the status bar item or run `Auto Accept: Toggle ON/OFF` from the Command Palette.
4. The agent will now **automatically accept** AI suggestions as they appear.

### Commands

| Command | Description |
|---|---|
| `Auto Accept: Toggle ON/OFF` | Enable or disable auto-accept |
| `Auto Accept: Toggle Background Mode` | Toggle background mode (Pro) |
| `Auto Accept: Settings & Pro` | Open settings panel |

---

## 🛡️ Safety — Dangerous Command Blocking

Auto Accept Agent ships with a built-in blocklist of dangerous terminal commands to keep you safe:

- `rm -rf /`, `rm -rf ~`, `rm -rf *`
- `format c:`, `del /f /s /q`, `rmdir /s /q`
- Fork bombs, `dd if=`, `mkfs.`, `chmod -R 777 /`

You can customize this list in the settings panel.

---

## 🏗️ Architecture

```
auto-accept-agent/
├── extension.js          # Main VS Code extension entry
├── config.js             # Configuration
├── settings-panel.js     # Settings webview UI
├── setup-panel.js        # Setup wizard
├── dist/                 # Compiled output
├── main_scripts/
│   ├── cdp-handler.js        # Chrome DevTools Protocol integration
│   ├── auto_accept.js        # Core auto-accept logic
│   ├── antigravity_background_poll.js  # Antigravity polling
│   ├── full_cdp_script.js    # Full CDP injection script
│   ├── relauncher.js         # Auto-relaunch on crash
│   ├── selector_finder.js    # DOM selector detection
│   ├── overlay.js            # UI overlay
│   ├── simple_poll.js        # Lightweight polling fallback
│   ├── utils.js              # Shared utilities
│   └── analytics/            # Usage analytics modules
└── media/
    ├── icon.png              # Extension icon
    └── image.png             # Promo image
```

---

## 🔧 How It Works

1. **IDE Detection** — Automatically detects whether you're running Cursor, Antigravity, or VS Code.
2. **CDP Connection** — Connects to the IDE's built-in browser via the Chrome DevTools Protocol.
3. **Polling Loop** — Watches for AI agent "Accept" buttons at configurable intervals.
4. **Safe Execution** — Checks every pending command against the blocklist before accepting.
5. **Auto Recovery** — If the connection drops, the relauncher module reconnects automatically.

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

---

## ⭐ Star This Repo

If Auto Accept Agent saves you time, please give it a ⭐ on GitHub — it helps others discover this tool!

---

## 🔗 Links

- 📥 [Download Latest Release](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/releases)
- 🐛 [Report Issues](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/issues)
- 💬 [Discussions](https://github.com/mstrvndev/auto-accept-agent-antigravity-free/discussions)

---

**Keywords**: auto accept agent, cursor auto accept, antigravity auto accept, vscode auto accept, ai agent automation, cursor extension, antigravity extension, auto accept vsix, free auto accept, coding agent automation, ai coding assistant, cursor ai, antigravity tools, vscode extension, auto approve agent, hands-free coding, ai workflow automation


