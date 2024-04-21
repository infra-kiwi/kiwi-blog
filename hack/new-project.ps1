$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$PSNativeCommandUseErrorActionPreference = $true

$projectName = $args[0]

$source = 'boilerplate-cdk'
$destination = (New-Item -Name $projectName -ItemType "directory").FullName

$resolved = (Resolve-Path $source).Path
$exclude = @('node_modules', 'cdk.out')

Get-ChildItem $resolved -Exclude $exclude | Copy-Item -Recurse -Destination { Join-Path $destination $_.FullName.Substring($resolved.length) }

$newModuleName = 'kiwi-blog-' + $projectName

Push-Location -EA Stop $destination
# Replace all entries of the boilerplate project name
Get-ChildItem -r *.* |
    ForEach-Object {
        $a = $_.fullname; (Get-Content $a) |
                ForEach-Object { $_ -Replace "kiwi-blog-boilerplate-cdk",$newModuleName } |
                Set-Content $a
    }

& npm install
& npm run lint
& npm run test
Pop-Location