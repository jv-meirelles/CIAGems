# Servidor local para visualizar a landing page (sem dependências).
# Uso: powershell -ExecutionPolicy Bypass -File serve.ps1 [-Port 8080]
param([int]$Port = 8080)

$root = $PSScriptRoot
$types = @{
  ".html" = "text/html; charset=utf-8"; ".css" = "text/css; charset=utf-8"; ".js" = "text/javascript; charset=utf-8"
  ".svg" = "image/svg+xml"; ".png" = "image/png"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg"
  ".mp4" = "video/mp4"; ".mov" = "video/mp4"; ".json" = "application/json"
}
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "C.IA landing page em http://localhost:$Port/"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request; $res = $ctx.Response; $fs = $null
  try {
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart("/"))
    # Pastas servem o index.html delas (ex.: /ciagems/ -> ciagems/index.html)
    if ($path -eq "" -or $path.EndsWith("/")) { $path = $path + "index.html" }
    elseif (Test-Path (Join-Path $root $path) -PathType Container) { $path = $path + "/index.html" }
    $file = [IO.Path]::GetFullPath((Join-Path $root $path))
    if (-not $file.StartsWith($root) -or -not (Test-Path $file -PathType Leaf)) {
      $res.StatusCode = 404; $res.Close(); continue
    }
    $ext = [IO.Path]::GetExtension($file).ToLower()
    $res.ContentType = $(if ($types[$ext]) { $types[$ext] } else { "application/octet-stream" })
    $res.AddHeader("Accept-Ranges", "bytes")
    $fs = New-Object IO.FileStream $file, "Open", "Read", "ReadWrite, Delete"
    $len = $fs.Length; $start = 0; $end = $len - 1
    $range = $req.Headers["Range"]
    if ($range -match "bytes=(\d*)-(\d*)") {
      if ($matches[1]) { $start = [int64]$matches[1] }
      if ($matches[2]) { $end = [Math]::Min([int64]$matches[2], $len - 1) }
      # Servidor atende um pedido por vez: entrega vídeo em blocos para não travar as imagens
      $end = [Math]::Min($end, $start + 1MB - 1)
      $res.StatusCode = 206
      $res.AddHeader("Content-Range", "bytes $start-$end/$len")
    }
    $count = $end - $start + 1
    $res.ContentLength64 = $count
    $fs.Seek($start, "Begin") | Out-Null
    $buf = New-Object byte[] 65536
    while ($count -gt 0) {
      $n = $fs.Read($buf, 0, [Math]::Min($buf.Length, $count))
      if ($n -le 0) { break }
      $res.OutputStream.Write($buf, 0, $n); $count -= $n
    }
  } catch { } finally {
    if ($fs) { $fs.Dispose() }
    try { $res.Close() } catch { }
  }
}
