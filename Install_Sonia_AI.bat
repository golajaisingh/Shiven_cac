@echo off
set "DEST=%USERPROFILE%\Sonia AI Receptionist"
if not exist "%DEST%" mkdir "%DEST%"
xcopy "%~dp0*" "%DEST%\" /E /I /Y >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop')+'\Sonia AI Receptionist.lnk');$s.TargetPath='%DEST%\Start_Sonia_AI.bat';$s.WorkingDirectory='%DEST%';$s.IconLocation='shell32.dll,220';$s.Save()"
echo.
echo Sonia AI Receptionist installed successfully.
echo A shortcut has been created on your Desktop.
pause
start "" "%DEST%\index.html"
