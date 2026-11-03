# Fecha um livro: espera 2K, casa com os ids, remonta a previa e copia a fila do proximo.
# uso: fechar.ps1 TG026 [TG027]
param($livro, $prox)
Set-Location "$env:USERPROFILE\Documents\Terra Gentil\ebooks\fabrica"
python -I esperar.py $livro 2k
python -I casar2k.py $livro | Select-Object -Last 3
$n = $livro.Substring(2)
node fazer.mjs "curtos/tg$n.mjs" 2>&1 | Select-Object -Last 3
if ($prox) {
  $g = "C:\Gitlab_hz\terra-gentil-site\terra-gentil\insta-terra-gentil\gama-ebooks"
  Get-Content "$g\fila-fotos-$($prox.ToLower()).json" -Raw -Encoding utf8 | Set-Clipboard
  "fila $prox no clipboard"
}
