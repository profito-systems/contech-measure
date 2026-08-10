# Profito - Miarka

Moduł pomiarowy będący częścią platformy Profito.
Upload zdjęcia -> wykrycie kartki A4 -> warp -> skala mm/pixel.

## Uruchomienie podstrony

git add .
git commit -m "Aktualizacja podstrony miarka"
git push origin main

GitHub Pages opublikuje ten moduł jako podstronę głównego serwisu Profito, lądując w katalogu public/miarka.

## Praca lokalna

Wymagane są Git, Node.js oraz Python.

Uruchomienie lokalnego serwera:

    npm run serve

Następnie otwórz stronę `http://localhost:8000/public/index.html`.

Kontrola projektu:

    npm run check

Kontrola sprawdza składnię plików JavaScript, obecność assetów wskazanych przez stronę oraz kompletność katalogu wdrożeniowego.

## Standard pracy z repozytorium

Każde zadanie realizujemy na osobnej gałęzi. Przed Pull Requestem uruchamiamy `npm run check` i opisujemy w PR zakres zmian, testy, ryzyko oraz zrzuty ekranu dla zmian interfejsu. Gałąź `main` przyjmuje zmiany wyłącznie przez Pull Request.
