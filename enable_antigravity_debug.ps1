$WshShell = New-Object -ComObject WScript.Shell
$foundShortcuts = @()
$searchLocations = @(
    [Environment]::GetFolderPath('Desktop'),
    [Environment]::GetFolderPath('StartMenu'),
    "$env:APPDATA\Microsoft\Windows\Start Menu\Programs",
    "$env:ProgramData\Microsoft\Windows\Start Menu\Programs"
)

foreach ($location in $searchLocations) {
    if (Test-Path $location) {
        Write-Host "Searching: $location"
        $shortcuts = Get-ChildItem -Path $location -Recurse -Filter "*.lnk" -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -like "*Antigravity*" }
        if ($shortcuts) {
            $foundShortcuts += $shortcuts
        }
    }
}

if ($foundShortcuts.Count -eq 0) {
    Write-Host "No shortcuts found. Searching for Antigravity installation..." -ForegroundColor Yellow
    $exePath = "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe"

    if (Test-Path $exePath) {
        $desktopPath = [Environment]::GetFolderPath('Desktop')
        $shortcutPath = "$desktopPath\Antigravity.lnk"
        $shortcut = $WshShell.CreateShortcut($shortcutPath)
        $shortcut.TargetPath = $exePath
        $shortcut.Arguments = "--remote-debugging-port=9000"
        $shortcut.Save()
        Write-Host "Created new shortcut: $shortcutPath" -ForegroundColor Green
    } else {
        Write-Host "ERROR: Antigravity.exe not found. Please install Antigravity first." -ForegroundColor Red
    }
} else {
    Write-Host "Found $($foundShortcuts.Count) shortcut(s)" -ForegroundColor Green
    foreach ($shortcutFile in $foundShortcuts) {
        try {
            $shortcut = $WshShell.CreateShortcut($shortcutFile.FullName)
            $originalArgs = $shortcut.Arguments

            if ($originalArgs -match "--remote-debugging-port=\d+") {
                $newArgs = $originalArgs -replace "--remote-debugging-port=\d+", "--remote-debugging-port=9000"
            } else {
                $newArgs = "--remote-debugging-port=9000 " + $originalArgs
            }
            
            $shortcut.Arguments = $newArgs
            $shortcut.Save()
            Write-Host "Updated: $($shortcutFile.Name)" -ForegroundColor Green
        } catch {
            Write-Host "Failed to update $($shortcutFile.Name): $_" -ForegroundColor Red
        }
    }
}
