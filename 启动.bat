@echo off
setlocal

pushd "%~dp0"

set "RUNTIME=C:\Users\Administrator.DESKTOP-4E45318\.cache\codex-runtimes\codex-primary-runtime\dependencies"
set "NODE_BIN=%RUNTIME%\node\bin"
set "PNPM=%RUNTIME%\bin\fallback\pnpm.cmd"

if exist "%NODE_BIN%\node.exe" (
  set "PATH=%NODE_BIN%;%PATH%"
)

echo.
echo Starting local website server...
echo Project: %cd%
echo.

if exist "node_modules\.bin\vite.cmd" (
  call "node_modules\.bin\vite.cmd" --host 127.0.0.1
) else if exist "%PNPM%" (
  call "%PNPM%" run dev
) else (
  call npm run dev
)

echo.
echo Server stopped.
pause

popd
