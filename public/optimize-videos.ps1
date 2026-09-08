# ============================================================
# REAL video optimization.
# Fixes the crash you hit: PowerShell treats ffmpeg's normal
# stderr logging as a terminating error when $ErrorActionPreference
# = "Stop" is combined with 2>&1. We switch it to "Continue"
# just for the ffmpeg call, and check $LASTEXITCODE instead.
# ============================================================

$root   = Get-Location
$backup = Join-Path $root ".optimization-backup"
New-Item -ItemType Directory -Force -Path $backup | Out-Null

$maxWidth = 1280   # most of your clips are already <=1280, this just caps outliers
$crf      = 26     # 23 = your old value (barely smaller). 26-28 = real savings, still clean quality
$audioBr  = "96k"

$totalOriginal = 0
$totalFinal    = 0
$optimizedCount = 0
$skippedCount   = 0

Get-ChildItem -Path $root -Filter *.mp4 -File -Recurse |
    Where-Object { $_.FullName -notlike "*\.optimization-backup\*" } |
    ForEach-Object {

        $file = $_
        $relative = $file.FullName.Substring($root.Path.Length).TrimStart('\')
        $relativeDir = Split-Path $relative -Parent
        $backupDir = Join-Path $backup $relativeDir
        New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

        $temp = "$($file.FullName).optimized.mp4"
        $originalSize = $file.Length
        $totalOriginal += $originalSize

        # Probe fps and width so we can decide whether to cap them
        $probe = & ffprobe -v error -select_streams v:0 `
            -show_entries stream=width,height,r_frame_rate `
            -of csv=p=0 "$($file.FullName)" 2>$null
        $parts = $probe -split ","
        $srcWidth = [int]$parts[0]
        $fpsRaw   = $parts[2]
        $fpsNum   = 30
        if ($fpsRaw -match "(\d+)/(\d+)") { $fpsNum = [math]::Round([double]$matches[1] / [double]$matches[2]) }

        $vf = "scale='min($maxWidth,iw)':-2"
        $fpsArgs = @()
        if ($fpsNum -gt 30) {
            # 60fps on a product/demo clip is wasted bitrate - drop to 30
            $fpsArgs = @("-r", "30")
        }

        Write-Host ""
        Write-Host "Optimizing: $relative ($([math]::Round($originalSize/1MB,2)) MB, ${srcWidth}px, ${fpsNum}fps)" -ForegroundColor Cyan

        $prevEAP = $ErrorActionPreference
        $ErrorActionPreference = "Continue"

        & ffmpeg -y -i "$($file.FullName)" -map 0:v:0 -map 0:a? `
            -vf $vf @fpsArgs `
            -c:v libx264 -preset slow -crf $crf -pix_fmt yuv420p -movflags +faststart `
            -c:a aac -b:a $audioBr `
            "$temp" 2>$null | Out-Null

        $exitCode = $LASTEXITCODE
        $ErrorActionPreference = $prevEAP

        if ($exitCode -ne 0 -or -not (Test-Path $temp)) {
            Write-Host "  FAILED (ffmpeg exit $exitCode) - original kept" -ForegroundColor Red
            if (Test-Path $temp) { Remove-Item $temp -Force }
            $totalFinal += $originalSize
            $skippedCount++
            return
        }

        $optimizedSize = (Get-Item $temp).Length

        if ($optimizedSize -lt $originalSize) {
            Copy-Item "$($file.FullName)" (Join-Path $backup $relative) -Force
            Move-Item $temp $file.FullName -Force
            $totalFinal += $optimizedSize
            $optimizedCount++
            $saving = [math]::Round((($originalSize - $optimizedSize) / $originalSize) * 100, 1)
            Write-Host "  -> $([math]::Round($optimizedSize/1MB,2)) MB (saved $saving%)" -ForegroundColor Green
        }
        else {
            Remove-Item $temp -Force
            $totalFinal += $originalSize
            $skippedCount++
            Write-Host "  No improvement - original kept" -ForegroundColor Yellow
        }
    }

Write-Host ""
Write-Host "============================================" -ForegroundColor White
Write-Host " VIDEO OPTIMIZATION COMPLETE" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor White
Write-Host "Optimized: $optimizedCount   Kept as-is: $skippedCount"
Write-Host "Original total : $([math]::Round($totalOriginal/1MB,2)) MB"
Write-Host "Final total    : $([math]::Round($totalFinal/1MB,2)) MB"
if ($totalOriginal -gt 0) {
    $saving = (($totalOriginal - $totalFinal) / $totalOriginal) * 100
    Write-Host "Reduction      : $([math]::Round($saving,1))%" -ForegroundColor Cyan
}
Write-Host "Backups in: $backup"
