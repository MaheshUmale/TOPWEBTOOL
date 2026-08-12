
# 3. Completely delete the temporary folder from the Windows Temp directory
Write-Host " DELETING FILES FROM D:\LIVE_SITE\"
Remove-Item -Path "D:\LIVE_SITE\*" -Recurse -Force
# Windows treats NUL as a device path; use bash rm to actually delete it if present
$nul = Get-ChildItem -LiteralPath "D:\LIVE_SITE" -Filter "NUL" -Force -ErrorAction SilentlyContinue
if ($nul) { sh -c 'rm -f "D:/LIVE_SITE/NUL"' }

Write-Host "DELETING LOCAL ZIP FILES "
Remove-Item -Path .\*.zip -Recurse -Force

Write-Host "COPYING TO D:\LIVE_SITE and ZIPPING FILES"
robocopy . "D:\LIVE_SITE" /E /XD .git .kilo .opencode .vscode node_modules dist /XF .gitignore opencode.json .session-state.json AGENTS.md README.md ACTION_PLAN.md *.ps1 *.zip NUL CON PRN AUX COM1 COM2 COM3 COM4 COM5 COM6 COM7 COM8 COM9 LPT1 LPT2 LPT3 LPT4 LPT5 LPT6 LPT7 LPT8 LPT9
  
# Remove Windows reserved device names that break Compress-Archive
$reserved = @('CON','PRN','AUX','NUL','COM1','COM2','COM3','COM4','COM5','COM6','COM7','COM8','COM9','LPT1','LPT2','LPT3','LPT4','LPT5','LPT6','LPT7','LPT8','LPT9')
foreach ($name in $reserved) {
    $item = Get-ChildItem -Path "D:\LIVE_SITE" -Filter $name -Force -ErrorAction SilentlyContinue
    if ($item) {
        Remove-Item -LiteralPath $item.FullName -Force
        Write-Host "Removed reserved device file: $($item.FullName)"
    }
}

 # 2. Zip that clean folder directly into your project root
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path .\deployment.zip) { Remove-Item .\deployment.zip -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory('D:\LIVE_SITE', '.\deployment.zip', [System.IO.Compression.CompressionLevel]::Optimal, $false)


Write-Host "COPYING completed -- .\deployment.zip"
