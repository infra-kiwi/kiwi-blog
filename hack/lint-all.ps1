# Fix dependabot entries

# Find all folders that start with \d{4}-
$codeFolders = @()

Get-ChildItem | Where-Object { $_.Name -match "^\d{4}-" } | ForEach-Object {
    Push-Location $_.Name

    & npm run lint

    Pop-Location
}

Push-Location boilerplate-cdk

& npm run lint

Pop-Location