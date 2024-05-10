# Fix dependabot entries

# Find all folders that start with \d{4}-
$codeFolders = @()

Get-ChildItem | Where-Object { $_.Name -match "^\d{4}-" } | ForEach-Object {
    $codeFolders += "      - `"/" + $_.Name + "`""
}

$joined = $codeFolders -join "`n"
$dependabotContent = @"
version: 2
updates:
  # Maintain dependencies for npm
  - package-ecosystem: "npm"
    groups:
      npm:
        patterns:
          - '*'
    directories:
      - "/boilerplate-cdk"
$joined
    schedule:
      interval: "daily"
"@

Out-File -FilePath "./.github/dependabot.yml" -InputObject ($dependabotContent -replace "`r" , '')