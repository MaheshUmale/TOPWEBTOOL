$dirs = Get-ChildItem -Path 'D:\TOPWEBTOOL' -Directory | Where-Object { $_.Name -notlike '.*' -and $_.Name -notlike 'backup*' -and $_.Name -notlike '.kilo' } | Sort-Object Name
foreach ($d in $dirs) {
    Write-Host $d.Name
}
