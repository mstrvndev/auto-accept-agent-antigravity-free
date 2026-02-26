const vscode = require('vscode');
const { execSync, spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const CDP_PORT = 9000;
const CDP_FLAG = `--remote-debugging-port=${CDP_PORT}`;

/**
 * Relauncher - Automatically configures CDP for the IDE
 * Runs PowerShell/bash scripts silently without user intervention
 * NOTE: Auto-restart removed. Users must restart the IDE manually.
 */
class Relauncher {
    constructor(logger = console.log) {
        this.platform = os.platform();
        this.logger = logger;
    }

    log(msg) {
        this.logger(`[Relauncher] ${msg}`);
    }

    getIdeName() {
        const appName = vscode.env.appName || '';
        if (appName.toLowerCase().includes('cursor')) return 'Cursor';
        if (appName.toLowerCase().includes('antigravity')) return 'Antigravity';
        return 'Code';
    }

    /**
     * Show a toast notification prompting the user to manually restart the IDE.
     */
    _showRestartRequiredToast(ideName, detail) {
        const message = `⚠️ ${ideName} must be restarted manually for Auto Accept to work. Please close and reopen ${ideName} using the updated shortcut.`;
        vscode.window.showWarningMessage(
            detail ? `${message}\n\n${detail}` : message,
            { modal: false },
            'OK'
        );
        this.log(`Toast shown: Restart required for ${ideName}`);
    }

    /**
     * Main entry point: ensures CDP is enabled and prompts user to restart manually.
     * No automatic restart — user must close and reopen the IDE themselves.
     */
    async ensureCDPAndRelaunch() {
        this.log('Checking if current process has CDP flag...');
        const hasFlag = await this.checkShortcutFlag();
        const ideName = this.getIdeName();

        if (hasFlag) {
            this.log('CDP flag present but port inactive. Prompting user to restart manually.');
            vscode.window.showWarningMessage(
                `Auto Accept: The CDP flag is present, but the debugger port is not responding. Please close ${ideName} completely and reopen it from the shortcut.`,
                { modal: false },
                'OK'
            );
            return { success: true, relaunched: false };
        }

        this.log('CDP flag missing. Running automatic CDP setup...');

        // Run the appropriate platform script AUTOMATICALLY
        try {
            await this.runCDPSetupAutomatically(ideName);
            return { success: true, relaunched: false };
        } catch (err) {
            this.log(`Auto CDP setup failed: ${err.message}`);
            vscode.window.showErrorMessage(
                `Auto Accept: CDP setup failed — ${err.message}. Please add --remote-debugging-port=9000 to your ${ideName} shortcut manually, then restart.`
            );
            return { success: false, relaunched: false };
        }
    }

    /**
     * Run the CDP setup script automatically without any user intervention
     */
    async runCDPSetupAutomatically(ideName) {
        if (this.platform === 'win32') {
            await this.runWindowsSetup(ideName);
        } else if (this.platform === 'darwin') {
            await this.runMacSetup(ideName);
        } else if (this.platform === 'linux') {
            await this.runLinuxSetup(ideName);
        } else {
            throw new Error(`Unsupported platform: ${this.platform}`);
        }
    }

    /**
     * Windows: Run PowerShell script with elevated privileges automatically
     */
    async runWindowsSetup(ideName) {
        this.log('Running Windows CDP setup automatically...');

        // Write the script to a temp file
        const tmpDir = os.tmpdir();
        const scriptPath = path.join(tmpDir, 'auto-accept-cdp-setup.ps1');

        const script = `
# AUTO-ACCEPT-MSTRVN — Automatic CDP Setup
# This script runs automatically — no user action needed

$ErrorActionPreference = "SilentlyContinue"

$searchLocations = @(
    [Environment]::GetFolderPath('Desktop'),
    "$env:USERPROFILE\\Desktop",
    "$env:USERPROFILE\\OneDrive\\Desktop",
    "$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs",
    "$env:ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
    "$env:USERPROFILE\\AppData\\Roaming\\Microsoft\\Internet Explorer\\Quick Launch\\User Pinned\\TaskBar"
)

$WshShell = New-Object -ComObject WScript.Shell
$foundShortcuts = @()

foreach ($location in $searchLocations) {
    if (Test-Path $location) {
        $shortcuts = Get-ChildItem -Path $location -Recurse -Filter "*.lnk" -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -like "*${ideName}*" }
        $foundShortcuts += $shortcuts
    }
}

if ($foundShortcuts.Count -eq 0) {
    $exePath = "$env:LOCALAPPDATA\\Programs\\${ideName}\\${ideName}.exe"

    if (Test-Path $exePath) {
        $desktopPath = [Environment]::GetFolderPath('Desktop')
        $shortcutPath = "$desktopPath\\${ideName}.lnk"
        $shortcut = $WshShell.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = $exePath
        $shortcut.Arguments = "--remote-debugging-port=9000"
        $shortcut.Save()
    } else {
        exit 1
    }
} else {
    foreach ($shortcutFile in $foundShortcuts) {
        $shortcut = $WshShell.CreateShortcut($shortcutFile.FullName)
        $originalArgs = $shortcut.Arguments

        if ($originalArgs -match "--remote-debugging-port=\\d+") {
            $shortcut.Arguments = $originalArgs -replace "--remote-debugging-port=\\d+", "--remote-debugging-port=9000"
        } else {
            $shortcut.Arguments = "--remote-debugging-port=9000 " + $originalArgs
        }
        $shortcut.Save()
    }
}

exit 0
`;

        fs.writeFileSync(scriptPath, script, 'utf-8');
        this.log(`Script written to: ${scriptPath}`);

        // Show progress notification while running
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Auto Accept: Setting up CDP automatically...',
                cancellable: false
            },
            async (progress) => {
                progress.report({ increment: 20, message: 'Writing setup script...' });

                try {
                    progress.report({ increment: 30, message: 'Configuring shortcuts...' });

                    await new Promise((resolve, reject) => {
                        const ps = spawn('powershell.exe', [
                            '-NoProfile',
                            '-NonInteractive',
                            '-ExecutionPolicy', 'Bypass',
                            '-File', scriptPath
                        ], {
                            windowsHide: true,
                            stdio: ['ignore', 'pipe', 'pipe']
                        });

                        let stdout = '';
                        let stderr = '';

                        ps.stdout.on('data', (data) => { stdout += data.toString(); });
                        ps.stderr.on('data', (data) => { stderr += data.toString(); });

                        ps.on('close', (code) => {
                            this.log(`PowerShell exited with code: ${code}`);
                            if (stdout) this.log(`PowerShell stdout: ${stdout}`);
                            if (stderr) this.log(`PowerShell stderr: ${stderr}`);

                            if (code === 0) {
                                resolve();
                            } else {
                                // If non-elevated fails, try with elevation
                                this.log('Non-elevated run failed, attempting with elevation...');
                                this.runElevatedPowerShell(scriptPath)
                                    .then(resolve)
                                    .catch(reject);
                            }
                        });

                        ps.on('error', (err) => {
                            this.log(`PowerShell spawn error: ${err.message}, trying elevated...`);
                            this.runElevatedPowerShell(scriptPath)
                                .then(resolve)
                                .catch(reject);
                        });
                    });

                    progress.report({ increment: 50, message: 'Done! Please restart manually.' });

                } catch (err) {
                    this.log(`CDP setup error: ${err.message}`);
                    throw err;
                } finally {
                    // Clean up temp script
                    try { fs.unlinkSync(scriptPath); } catch (e) { }
                }
            }
        );

        // Show toast notification — user must restart manually
        this._showRestartRequiredToast(ideName, 'Shortcuts have been updated with --remote-debugging-port=9000.');
    }

    /**
     * Run PowerShell with elevation (Start-Process -Verb RunAs)
     */
    runElevatedPowerShell(scriptPath) {
        return new Promise((resolve, reject) => {
            this.log('Running PowerShell with elevation...');

            const elevateCmd = `Start-Process powershell.exe -ArgumentList '-NoProfile -NonInteractive -ExecutionPolicy Bypass -File "${scriptPath}"' -Verb RunAs -Wait -WindowStyle Hidden`;

            const ps = spawn('powershell.exe', [
                '-NoProfile',
                '-NonInteractive',
                '-ExecutionPolicy', 'Bypass',
                '-Command', elevateCmd
            ], {
                windowsHide: true,
                stdio: ['ignore', 'pipe', 'pipe']
            });

            let stderr = '';
            ps.stderr.on('data', (data) => { stderr += data.toString(); });

            ps.on('close', (code) => {
                this.log(`Elevated PowerShell exited with code: ${code}`);
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Elevated script failed (code ${code}): ${stderr}`));
                }
            });

            ps.on('error', (err) => {
                reject(new Error(`Failed to start elevated PowerShell: ${err.message}`));
            });
        });
    }

    /**
     * macOS: Run bash script automatically
     */
    async runMacSetup(ideName) {
        this.log('Running macOS CDP setup automatically...');

        const tmpDir = os.tmpdir();
        const scriptPath = path.join(tmpDir, 'auto-accept-cdp-setup.sh');

        const script = `#!/bin/bash
# AUTO-ACCEPT-MSTRVN — Automatic CDP Setup for macOS

IDE_NAME="${ideName}"

APP_LOCATIONS=(
    "/Applications"
    "$HOME/Applications"
    "/Applications/Utilities"
)

app_path=""
for location in "\${APP_LOCATIONS[@]}"; do
    if [ -d "$location" ]; then
        found=$(find "$location" -maxdepth 2 -name "*\${IDE_NAME}*.app" -type d 2>/dev/null | head -n1)
        if [ -n "$found" ]; then
            app_path="$found"
            break
        fi
    fi
done

if [ -z "$app_path" ]; then
    exit 1
fi

info_plist="$app_path/Contents/Info.plist"

if [ ! -f "$info_plist" ]; then
    exit 1
fi

if grep -q "remote-debugging-port" "$info_plist"; then
    exit 0
fi

cp "$info_plist" "\${info_plist}.bak"

sed -i '' '/<\\/dict>/i\\
    <key>LSArguments<\\/key>\\
    <array>\\
        <string>--remote-debugging-port=9000<\\/string>\\
    <\\/array>
' "$info_plist"

exit 0
`;

        fs.writeFileSync(scriptPath, script, { mode: 0o755 });

        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Auto Accept: Setting up CDP automatically...',
                cancellable: false
            },
            async (progress) => {
                progress.report({ increment: 30, message: 'Configuring Info.plist...' });

                await new Promise((resolve, reject) => {
                    const bash = spawn('bash', [scriptPath], {
                        stdio: ['ignore', 'pipe', 'pipe']
                    });

                    bash.on('close', (code) => {
                        this.log(`macOS setup exited with code: ${code}`);
                        if (code === 0) resolve();
                        else reject(new Error(`macOS setup failed (code ${code})`));
                    });

                    bash.on('error', reject);
                });

                progress.report({ increment: 70, message: 'Done!' });
                try { fs.unlinkSync(scriptPath); } catch (e) { }
            }
        );

        // Show toast notification — user must restart manually
        this._showRestartRequiredToast(ideName, 'Info.plist has been updated with --remote-debugging-port=9000.');
    }

    /**
     * Linux: Run bash script automatically
     */
    async runLinuxSetup(ideName) {
        this.log('Running Linux CDP setup automatically...');

        const tmpDir = os.tmpdir();
        const scriptPath = path.join(tmpDir, 'auto-accept-cdp-setup.sh');

        const ideNameLower = ideName.toLowerCase();

        const script = `#!/bin/bash
# AUTO-ACCEPT-MSTRVN — Automatic CDP Setup for Linux

IDE_NAME="${ideName}"
IDE_NAME_LOWER="${ideNameLower}"

SEARCH_LOCATIONS=(
    "$HOME/.local/share/applications"
    "$HOME/Desktop"
    "$HOME/.config/autostart"
    "/usr/share/applications"
    "/usr/local/share/applications"
    "/var/lib/snapd/desktop/applications"
    "/var/lib/flatpak/exports/share/applications"
)

for dir in "\${SEARCH_LOCATIONS[@]}"; do
    if [ -d "$dir" ]; then
        for file in "$dir"/*.desktop; do
            if [ -f "$file" ]; then
                if grep -qi "$IDE_NAME_LOWER" "$file" 2>/dev/null; then
                    if ! grep -q "remote-debugging-port" "$file"; then
                        cp "$file" "\${file}.bak"
                        sed -i 's|^Exec=\\(.*\\)$|Exec=\\1 --remote-debugging-port=9000|' "$file"
                        if grep -q "^TryExec=" "$file"; then
                            sed -i 's|^TryExec=\\(.*\\)$|TryExec=\\1 --remote-debugging-port=9000|' "$file"
                        fi
                    fi
                fi
            fi
        done
    fi
done

exit 0
`;

        fs.writeFileSync(scriptPath, script, { mode: 0o755 });

        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: 'Auto Accept: Setting up CDP automatically...',
                cancellable: false
            },
            async (progress) => {
                progress.report({ increment: 30, message: 'Configuring .desktop files...' });

                await new Promise((resolve, reject) => {
                    const bash = spawn('bash', [scriptPath], {
                        stdio: ['ignore', 'pipe', 'pipe']
                    });

                    bash.on('close', (code) => {
                        this.log(`Linux setup exited with code: ${code}`);
                        if (code === 0) resolve();
                        else reject(new Error(`Linux setup failed (code ${code})`));
                    });

                    bash.on('error', reject);
                });

                progress.report({ increment: 70, message: 'Done!' });
                try { fs.unlinkSync(scriptPath); } catch (e) { }
            }
        );

        // Show toast notification — user must restart manually
        this._showRestartRequiredToast(ideName, '.desktop files have been updated with --remote-debugging-port=9000.');
    }

    /**
     * Check if the current launch has the CDP flag
     */
    async checkShortcutFlag() {
        const args = process.argv.join(' ');
        return args.includes('--remote-debugging-port=9000');
    }
}

module.exports = { Relauncher };
