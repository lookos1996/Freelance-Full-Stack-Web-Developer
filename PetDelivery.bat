@echo off
:: Ξεκινάει τον server αόρατα στο παρασκήνιο
start /MIN cmd /c "node server.js"

:: Περιμένει 2 δευτερόλεπτα για να προλάβει να σηκωθεί ο server
timeout /t 2 >nul

:: Ανοίγει το πρόγραμμα σαν κανονική εφαρμογή (αλλάξε το path αν έχεις άλλον browser)
start chrome --app="http://localhost:3000"