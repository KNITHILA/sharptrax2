# ============================================================
# REAL image optimization: resize + adaptive quality reduction
# until every file is under the target size (default 500KB).
# Keeps original filenames/extensions so no code changes needed.
# ============================================================

$root      = Get-Location
$backup    = Join-Path $root ".optimization-backup"
$targetKB  = 500        # per-file target
$maxWidth  = 1600        # no web image needs to be wider than this
New-Item -ItemType Directory -Force -Path $backup | Out-Null

$totalOriginal = 0
$totalFinal    = 0
$optimizedCount = 0
$skippedCount   = 0

function Optimize-Jpeg {
    param($srcPath, $tempPath, $maxWidth, $targetKB)

    $quality = 85
    $width   = $maxWidth

    for ($i = 0; $i -lt 8; $i++) {
        magick "$srcPath" -strip -interlace Plane -sampling-factor 4:2:0 `
            -resize "${width}x${width}>" -quality $quality "$tempPath" 2>$null

        if (-not (Test-Path $tempPath)) { return $false }
        $sizeKB = (Get-Item $tempPath).Length / 1KB
        if ($sizeKB -le $targetKB -or $quality -le 45) { return $true }

        # Not small enough yet: drop quality first, then shrink dimensions
        if ($quality -gt 60) { $quality -= 10 }
        else { $width = [int]($width * 0.85); $quality = 70 }
    }
    return $true
}

function Optimize-Png {
    param($srcPath, $tempPath, $maxWidth, $targetKB)

    $colors = 256
    $width  = $maxWidth

    for ($i = 0; $i -lt 6; $i++) {
        magick "$srcPath" -strip -resize "${width}x${width}>" `
            -define png:compression-level=9 -define png:compression-filter=5 `
            -colors $colors -dither Riemersma "PNG8:$tempPath" 2>$null

        if (-not (Test-Path $tempPath)) { return $false }
        $sizeKB = (Get-Item $tempPath).Length / 1KB
        if ($sizeKB -le $targetKB -or $colors -le 32) { return $true }

        if ($colors -gt 64) { $colors = [int]($colors / 2) }
        else { $width = [int]($width * 0.85) }
    }
    return $true
}

$extensions = @("*.jpg", "*.jpeg", "*.png")

foreach ($pattern in $extensions) {
    Get-ChildItem -Path $root -Filter $pattern -File -Recurse |
        Where-Object { $_.FullName -notlike "*\.optimization-backup\*" } |
        ForEach-Object {

            $file = $_
            $relative = $file.FullName.Substring($root.Path.Length).TrimStart('\')
            $relativeDir = Split-Path $relative -Parent
            $backupDir = Join-Path $backup $relativeDir
            New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

            $temp = "$($file.FullName).optimized"
            $originalSize = $file.Length
            $totalOriginal += $originalSize

            Write-Host ""
            Write-Host "Optimizing: $relative ($([math]::Round($originalSize/1KB,1)) KB)" -ForegroundColor Cyan

            $ok = $false
            if ($file.Extension -match "\.jpe?g") {
                $ok = Optimize-Jpeg -srcPath $file.FullName -tempPath $temp -maxWidth $maxWidth -targetKB $targetKB
            }
            elseif ($file.Extension -eq ".png") {
                $ok = Optimize-Png -srcPath $file.FullName -tempPath $temp -maxWidth $maxWidth -targetKB $targetKB
            }

            if (-not $ok -or -not (Test-Path $temp)) {
                Write-Host "  FAILED - original kept" -ForegroundColor Red
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
                $flag = if ($optimizedSize/1KB -gt $targetKB) { " [STILL OVER TARGET]" } else { "" }
                Write-Host "  -> $([math]::Round($optimizedSize/1KB,1)) KB  (saved $saving%)$flag" -ForegroundColor Green
            }
            else {
                Remove-Item $temp -Force
                $totalFinal += $originalSize
                $skippedCount++
                Write-Host "  No improvement - original kept" -ForegroundColor Yellow
            }
        }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor White
Write-Host " IMAGE OPTIMIZATION COMPLETE" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor White
Write-Host "Optimized: $optimizedCount   Kept as-is: $skippedCount"
Write-Host "Original total : $([math]::Round($totalOriginal/1MB,2)) MB"
Write-Host "Final total    : $([math]::Round($totalFinal/1MB,2)) MB"
if ($totalOriginal -gt 0) {
    $saving = (($totalOriginal - $totalFinal) / $totalOriginal) * 100
    Write-Host "Reduction      : $([math]::Round($saving,1))%" -ForegroundColor Cyan
}
Write-Host "Backups in: $backup"
