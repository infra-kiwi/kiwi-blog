# Fix dependabot entries

# Find all folders that start with \d{4}-
$codeFolders = @()

Get-ChildItem | Where-Object { $_.Name -match "^\d{4}-" } | ForEach-Object {
    Push-Location $_.Name

    & npm install
    & npm run test

    Pop-Location
}

Push-Location boilerplate-cdk

& npm install
& npm run test

Pop-Location