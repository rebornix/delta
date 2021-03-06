###########################################################################################################
##
## This Powershell Script is used for Configuring the Development Environment of DELTA
##
###########################################################################################################

$IsConfigSuccess = $true
$CurrentDir = (Get-Location -PSProvider FileSystem).ProviderPath
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

###########################################################################################################
# Step 1 - Install Chocolatey
###########################################################################################################

if (Get-Command cinst -ErrorAction SilentlyContinue) {
    Write-Host "Chocolatey installed." -ForegroundColor Green
}
else {
    Write-Host "Installing Chocolatey..." -ForegroundColor Yellow
    iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))
    if (! $?) {
        $IsConfigSuccess = $false
        Write-Host "error while install chocolatey package: $packageName" -ForegroundColor red
    }
}


###########################################################################################################
# Step 2 - Install Chocolatey Packages
###########################################################################################################

$chocolateyPackages = ("node.exe", "nodejs.install"), ("git.exe", "git.install"), ("python.exe", "python2")
foreach ($package in $chocolateyPackages) {
    $packageName = $package[1]
    if (Get-Command $package[0] -ErrorAction SilentlyContinue) {
        Write-Host "$packageName installed." -ForegroundColor Green
    }
    else {
        Write-Host "Installing $packageName..." -ForegroundColor Yellow
        cinst $packageName -force
        if (! $?) {
            $IsConfigSuccess = $false
            Write-Host "error while install chocolatey package: $packageName" -ForegroundColor red
        }
    }
}


###########################################################################################################
# Step 3 - Add Additional Path to Environment Variable
###########################################################################################################

Write-Host "Adding path to environment variable..." -ForegroundColor green
$NpmBinPath = "${env:APPDATA}\npm"
$GitCmdSplits = (Get-Command git -syntax).split("\")
for($i=0; $i-lt $GitCmdSplits.length - 2; $i++) { # path looks like "*\Git\cmd\git.exe"
    $GitBinPath += $GitCmdSplits[$i] + "\"
}
$GitBinPath += "bin"

$pathsToAdd = $NpmBinPath, $GitBinPath
$oldPath = [System.Environment]::GetEnvironmentVariable("path", "machine")
$newPath = $oldPath
foreach ($path in $pathsToAdd) {
    if (!$env:path.ToLower().Contains($path.ToLower())) {
        $newPath += ";" + $path  # add this path to environment permanently
    }
}
if ($newPath -ne $oldPath) {
    [System.Environment]::SetEnvironmentVariable("path", $newPath, "machine")
    if (! $?) {
        $IsConfigSuccess = $false
        Write-Host "error while adding path to environment variable." -ForegroundColor red
    }
}
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")


###########################################################################################################
# Step 4 - Install NPM Packages (This has to be called after setting environment variable)
# Yeoman tool set = npm install -g yo grunt-cli bower
###########################################################################################################

$GlobalNpmPackages = ("yo", "yo"), ("grunt", "grunt-cli"), ("bower", "bower"), ("protractor", "protractor")
foreach ($package in $GlobalNpmPackages) {
    $packageName = $package[1]
    if (Get-Command $package[0] -ErrorAction SilentlyContinue) {
        Write-Host "$packageName installed." -ForegroundColor Green
    }
    else {
        Write-Host "Installing $packageName..." -ForegroundColor Yellow
        npm install -g $packageName
    }
}

$GruntPath = "$CurrentDir\node_modules\grunt"
$ShellJSPath = "$CurrentDir\node_modules\shelljs"
$LocalNpmPackages = ($GruntPath, "grunt"), ($ShellJSPath, "shelljs")
foreach ($package in $LocalNpmPackages) {
    $packageName = $package[1]
    if (Test-Path -path $package[0]) {
        Write-Host "$packageName installed." -ForegroundColor Green
    }
    else {
        Write-Host "Installing $packageName" -ForegroundColor Yellow
        npm install $packageName
    }
}


###########################################################################################################
# Step 5 - Configure Windows FireWall
###########################################################################################################

$NodePath = Get-Command "node.exe" -syntax
$ChromeDriverPath = "${env:APPDATA}\npm\node_modules\protractor\selenium\chromedriver.exe"
$IEDriverPath = "${env:APPDATA}\npm\node_modules\protractor\selenium\IEDriverServer.exe"

netsh advfirewall firewall delete rule name = "Node" | out-null # delete first to prevent avoid duplication
netsh advfirewall firewall delete rule name = "Java" | out-null
netsh advfirewall firewall delete rule name = "Chrome Driver" | out-null
netsh advfirewall firewall delete rule name = "IE Driver" | out-null

netsh advfirewall firewall add rule name = "Node" dir=in action=allow program=$NodePath enable=yes | out-null
netsh advfirewall firewall add rule name = "Chrome Driver" dir=in action=allow program=$ChromeDriverPath enable=yes | out-null
netsh advfirewall firewall add rule name = "IE Driver" dir=in action=allow program=$IEDriverPath enable=yes | out-null


###########################################################################################################
# Step N - Show the Result
###########################################################################################################

if ($IsConfigSuccess) {
    #Clear-Host
    Write-Host ""
    Write-Host "Your development environment is ready" -ForegroundColor Green
}
