# Interaktywna Animacja Spiral Fibonacciego

Interaktywna wizualizacja oparta na spiralach logarytmicznych i sekwencji Fibonacciego, stworzona przy użyciu P5.js. Animacja działa zarówno na komputerach, jak i na urządzeniach mobilnych.

## Funkcje

- Dynamicznie generowane spirale logarytmiczne
- Animacja wykorzystująca deformacje sinusoidalne
- Interaktywna zmiana parametrów animacji poprzez kliknięcie/dotyk
- Automatyczne dostosowanie do różnych rozmiarów ekranu, w tym urządzeń mobilnych
- Kolorystyka oparta na modelu HSB dla płynnych przejść kolorów

## Jak uruchomić lokalnie

1. Sklonuj to repozytorium
2. Otwórz plik `index.html` w przeglądarce

## Jak hostować na GitHub Pages

1. Utwórz nowe repozytorium na GitHub
2. Dodaj wszystkie pliki do repozytorium:
   ```
   git init
   git add .
   git commit -m "Pierwsza wersja"
   git branch -M main
   git remote add origin https://github.com/twoj-username/twoja-nazwa-repo.git
   git push -u origin main
   ```
3. Włącz GitHub Pages w ustawieniach repozytorium:
   - Przejdź do zakładki "Settings" w twoim repozytorium
   - Przewiń w dół do sekcji "GitHub Pages"
   - W źródle (Source) wybierz gałąź "main" i folder "/" (root)
   - Kliknij "Save"

4. Twoja animacja będzie dostępna pod adresem: `https://twoj-username.github.io/twoja-nazwa-repo`

## Struktura plików

- `index.html` - plik HTML z podstawową strukturą strony i linkami do skryptów
- `sketch.js` - główny plik JavaScript zawierający kod animacji

## Interakcja

- Kliknij myszą lub dotknij ekranu, aby zmienić parametry animacji (kolory, prędkość, amplitudę)
- Animacja automatycznie dostosowuje się do rozmiaru ekranu

## Technologie

- [P5.js](https://p5js.org/) - biblioteka JavaScript do tworzenia grafiki i animacji
