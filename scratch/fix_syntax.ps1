$path = "d:\anti-gv\16. 올리고크루즈\src\pages\AdminHomeEditor.jsx"
$content = Get-Content $path
$newContent = @()
for ($i=0; $i -lt $content.Count; $i++) {
    if ($i -eq 524 -and $content[$i].Trim() -eq "</div>" -and $content[$i+1].Trim() -eq "</div>") {
        # Skip this line if it's the 525th line (index 524) and is a duplicate </div>
        continue
    }
    $newContent += $content[$i]
}
$newContent | Set-Content $path
