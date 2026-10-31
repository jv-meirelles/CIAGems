# Gera as fotos otimizadas do portfólio e a lista de projetos (js/projects.js)
# a partir de Media/CASA C/03. GALERIA DE PROJETO.
# Também cria uma página por projeto em projetos/<projeto>/index.html (modelo: tools/projeto-modelo.html).
# Uso:  powershell -ExecutionPolicy Bypass -File tools/gerar-portfolio.ps1              (fotos + páginas)
#       powershell -ExecutionPolicy Bypass -File tools/gerar-portfolio.ps1 -SoPaginas   (só as páginas, sem reprocessar fotos)
param([switch]$SoPaginas)
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $root "Media\CASA C\03. GALERIA DE PROJETO"
$dst  = Join-Path $root "img\portfolio"

# Nome de exibição e local de cada pasta (as pastas não têm acentos)
$projetos = [ordered]@{
  "01" = @{ slug = "ape-solar";      nome = "Apê Solar";      local = "Noroeste" }
  "02" = @{ slug = "ape-904";        nome = "Apê 904";        local = "Águas Claras" }
  "03" = @{ slug = "ape-vida";       nome = "Apê Vida";       local = "Samambaia" }
  "04" = @{ slug = "ape-conquista";  nome = "Apê Conquista";  local = "Samambaia" }
  "05" = @{ slug = "ape-urban";      nome = "Apê Urban";      local = "Águas Claras" }
  "06" = @{ slug = "clinica-gr";     nome = "Clínica GR";     local = "Sudoeste" }
  "07" = @{ slug = "casa-meirelles"; nome = "Casa Meirelles"; local = "Taguatinga" }
  "08" = @{ slug = "refugio-casali"; nome = "Refúgio Casali"; local = "Asa Norte" }
  "09" = @{ slug = "ape-essencia";   nome = "Apê Essência";   local = "Águas Claras" }
}

$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
function Save-Jpg($srcPath, $dstPath, [double]$max, [long]$q) {
  $p = New-Object System.Drawing.Imaging.EncoderParameters 1
  $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $q
  $i = [System.Drawing.Image]::FromFile($srcPath)
  if ($i.PropertyIdList -contains 274) {
    switch ($i.GetPropertyItem(274).Value[0]) { 3 { $i.RotateFlip('Rotate180FlipNone') } 6 { $i.RotateFlip('Rotate90FlipNone') } 8 { $i.RotateFlip('Rotate270FlipNone') } }
  }
  [double]$s = [math]::Min(1.0, $max / [double][math]::Max($i.Width, $i.Height))
  $w = [int]($i.Width * $s); $h = [int]($i.Height * $s)
  $b = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($b)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.PixelOffsetMode = 'HighQuality'
  $g.Clear([System.Drawing.Color]::White); $g.DrawImage($i, 0, 0, $w, $h)
  $b.Save($dstPath, $enc, $p)
  $g.Dispose(); $b.Dispose(); $i.Dispose()
  return @($w, $h)
}

$utf8 = New-Object System.Text.UTF8Encoding $false
$modelo = [IO.File]::ReadAllText((Join-Path $PSScriptRoot "projeto-modelo.html"), [Text.Encoding]::UTF8)
$paginas = Join-Path $root "projetos"
function Html([string]$s) { $s.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace('"', "&quot;") }

$lista = @()
foreach ($pasta in Get-ChildItem $src -Directory | Sort-Object Name) {
  $num = $pasta.Name.Substring(0, 2)
  if (-not $projetos.Contains($num)) { Write-Host "Ignorada (sem nome cadastrado): $($pasta.Name)"; continue }
  $info = $projetos[$num]
  $out = Join-Path $dst $info.slug

  # Fotos: no modo -SoPaginas usa as já otimizadas; senão, reexporta da pasta original
  $itens = @()
  if ($SoPaginas) {
    foreach ($f in Get-ChildItem $out -Filter "??.jpg" | Sort-Object Name) {
      $i = [System.Drawing.Image]::FromFile($f.FullName); $itens += ,@($f.Name, $i.Width, $i.Height); $i.Dispose()
    }
  } else {
    if (Test-Path $out) { Remove-Item $out -Recurse -Force }
    New-Item -ItemType Directory -Force $out | Out-Null
    # A capa vem primeiro (arquivo com "CAPA" no nome; senão, o primeiro em ordem alfabética)
    $fotos = @(Get-ChildItem -LiteralPath $pasta.FullName -File | Where-Object { $_.Extension -match '^\.(jpe?g|png)$' } | Sort-Object Name)
    $capa = $fotos | Where-Object { $_.Name -match 'CAPA' } | Select-Object -First 1
    if (-not $capa) { $capa = $fotos[0] }
    $fotos = @($capa) + @($fotos | Where-Object { $_.FullName -ne $capa.FullName })
    $n = 1
    foreach ($f in $fotos) {
      $nome = "{0:D2}.jpg" -f $n
      $wh = Save-Jpg $f.FullName (Join-Path $out $nome) 1600 80
      $itens += ,@($nome, $wh[0], $wh[1])
      $n++
    }
    $null = Save-Jpg $capa.FullName (Join-Path $out "capa.jpg") 900 80
  }

  # Página do projeto: projetos/<slug>/index.html a partir do modelo
  $raiz = "../../"
  $total = $itens.Count; $k = 0
  $fotosHtml = ($itens | ForEach-Object {
    $k++
    $carga = $(if ($k -le 3) { "eager" } else { "lazy" })
    "          <button type=`"button`" class=`"project__photo`" aria-label=`"Ampliar foto $k de $total`"><img src=`"${raiz}img/portfolio/$($info.slug)/$($_[0])`" alt=`"$(Html $info.nome), foto $k`" width=`"$($_[1])`" height=`"$($_[2])`" loading=`"$carga`"></button>"
  }) -join "`n"
  $html = $modelo.Replace("{{FOTOS}}", $fotosHtml).Replace("{{NOME}}", (Html $info.nome)).Replace("{{LOCAL}}", (Html $info.local)).Replace("{{SLUG}}", $info.slug).Replace("{{RAIZ}}", $raiz)
  $html = $html -replace '(?s)<!-- MODELO das páginas de projeto\..*?-->\r?\n', ''
  $dirPagina = Join-Path $paginas $info.slug
  New-Item -ItemType Directory -Force $dirPagina | Out-Null
  [IO.File]::WriteAllText((Join-Path $dirPagina "index.html"), $html, $utf8)

  Write-Host ("{0}: {1} fotos -> projetos/{2}/" -f $info.nome, $total, $info.slug)
  $lista += "  { slug: `"$($info.slug)`", nome: `"$($info.nome)`", local: `"$($info.local)`" }"
}

$js = "/* Gerado por tools/gerar-portfolio.ps1 a partir de Media/CASA C/03. GALERIA DE PROJETO. Não edite à mão. */`nwindow.CASAC_PROJETOS = [`n" + ($lista -join ",`n") + "`n];`n"
[IO.File]::WriteAllText((Join-Path $root "js\projects.js"), $js, $utf8)
"{0:N1} MB em img/portfolio" -f ((Get-ChildItem $dst -Recurse -File | Measure-Object Length -Sum).Sum / 1MB)
