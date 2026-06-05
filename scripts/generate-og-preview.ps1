Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$bitmap = New-Object System.Drawing.Bitmap $width, $height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

function Color-Hex($hex, $alpha) {
  $color = [System.Drawing.ColorTranslator]::FromHtml($hex)
  [System.Drawing.Color]::FromArgb($alpha, $color.R, $color.G, $color.B)
}

function Text-FromCodes($codes) {
  -join ($codes | ForEach-Object { [char]$_ })
}

$background = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  [System.Drawing.Rectangle]::new(0, 0, $width, $height),
  [System.Drawing.Color]::FromArgb(255, 10, 12, 18),
  [System.Drawing.Color]::FromArgb(255, 20, 24, 36),
  35
)
$graphics.FillRectangle($background, 0, 0, $width, $height)

$gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(34, 151, 169, 255), 1)
for ($x = 60; $x -lt $width; $x += 72) { $graphics.DrawLine($gridPen, $x, 0, $x, $height) }
for ($y = 54; $y -lt $height; $y += 72) { $graphics.DrawLine($gridPen, 0, $y, $width, $y) }

$nodes = @(
  @(585, 305, 42, "#4361ee"),
  @(360, 205, 30, "#7c8cff"),
  @(835, 190, 28, "#6ee7b7"),
  @(830, 430, 31, "#fca5a5"),
  @(420, 420, 28, "#c4b5fd"),
  @(250, 330, 18, "#4361ee"),
  @(1010, 300, 20, "#4361ee"),
  @(610, 110, 18, "#a5b4fc"),
  @(620, 510, 17, "#a5b4fc"),
  @(180, 155, 13, "#4361ee"),
  @(1025, 145, 13, "#6ee7b7"),
  @(1010, 500, 14, "#fca5a5"),
  @(225, 505, 13, "#c4b5fd")
)
$links = @(
  @(0, 1), @(0, 2), @(0, 3), @(0, 4), @(1, 4), @(2, 3), @(1, 5), @(2, 6),
  @(0, 7), @(0, 8), @(1, 9), @(2, 10), @(3, 11), @(4, 12), @(5, 12), @(6, 10)
)

foreach ($link in $links) {
  $a = $nodes[$link[0]]
  $b = $nodes[$link[1]]
  $pen = New-Object System.Drawing.Pen((Color-Hex "#4361ee" 120), 3)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $centerX = ($a[0] + $b[0]) / 2
  $centerY = ($a[1] + $b[1]) / 2 - 35
  $path.AddBezier($a[0], $a[1], $centerX, $centerY, $centerX, $centerY, $b[0], $b[1])
  $graphics.DrawPath($pen, $path)
  $path.Dispose()
  $pen.Dispose()
}

foreach ($node in $nodes) {
  $glow = New-Object System.Drawing.SolidBrush((Color-Hex $node[3] 42))
  $fill = New-Object System.Drawing.SolidBrush((Color-Hex $node[3] 230))
  $border = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 246, 246, 252), 2)
  $graphics.FillEllipse($glow, $node[0] - $node[2] * 2, $node[1] - $node[2] * 2, $node[2] * 4, $node[2] * 4)
  $graphics.FillEllipse($fill, $node[0] - $node[2], $node[1] - $node[2], $node[2] * 2, $node[2] * 2)
  $graphics.DrawEllipse($border, $node[0] - $node[2], $node[1] - $node[2], $node[2] * 2, $node[2] * 2)
  $glow.Dispose()
  $fill.Dispose()
  $border.Dispose()
}

$panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(148, 10, 12, 18))
$titleFont = New-Object System.Drawing.Font("Malgun Gothic", 54, [System.Drawing.FontStyle]::Bold)
$subtitleFont = New-Object System.Drawing.Font("Malgun Gothic", 22, [System.Drawing.FontStyle]::Regular)
$smallFont = New-Object System.Drawing.Font("Malgun Gothic", 17, [System.Drawing.FontStyle]::Regular)
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 246, 246, 252))
$mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190, 213, 220, 255))
$accentBrush = New-Object System.Drawing.SolidBrush((Color-Hex "#4361ee" 255))
$titleText = Text-FromCodes @(0xB514, 0xC790, 0xC778, 0x20, 0xD150, 0xC158, 0x20, 0xC2A4, 0xD29C, 0xB514, 0xC624)
$subtitleText = Text-FromCodes @(0xC124, 0xACC4, 0x20, 0xAE34, 0xC7A5, 0xC744, 0x20, 0xB124, 0xD2B8, 0xC6CC, 0xD06C, 0xB85C, 0x20, 0xC77D, 0xC5B4, 0xC694)
$lensText = Text-FromCodes @(0xAD50, 0xC0AC, 0x20, 0x00B7, 0x20, 0xD559, 0xC0DD, 0x20, 0x00B7, 0x20, 0x49, 0x54, 0x20, 0x00B7, 0x20, 0xD589, 0xC815)

$graphics.FillRectangle($panelBrush, 58, 62, 520, 190)
$graphics.DrawString($titleText, $titleFont, $whiteBrush, 72, 82)
$graphics.DrawString($subtitleText, $subtitleFont, $mutedBrush, 76, 170)
$graphics.FillEllipse($accentBrush, 78, 229, 11, 11)
$graphics.DrawString($lensText, $smallFont, $mutedBrush, 98, 222)

$outputPath = Join-Path (Split-Path $PSScriptRoot -Parent) "og-preview.png"
$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()
