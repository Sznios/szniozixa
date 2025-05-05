// Globalne zmienne
let time = 0; // Zmienna czasu dla animacji
let spirals = []; // Tablica przechowująca spirale
let fibNumbers = []; // Tablica na liczby Fibonacciego

// Parametry spirali 
let numSpirals = 3; // Zmniejszona liczba spiral dla lepszej widoczności
let spiralDensity = 300; // Gęstość punktów na spirali
let circleSpacing = 25; // Zmniejszony odstęp między kołami
let circleSize = 10; // Rozmiar kół
let circlePoints = 80; // Liczba punktów w kole

// Parametry animacji
let rotationSpeed = 0.004; // Prędkość rotacji
let sinusAmplitude = 85; // Amplituda sinusa
let sinusFrequency = 0.05; // Częstotliwość sinusa
let sinusSpeed = 0.33; // Prędkość animacji sinusa

// Współczynnik skalowania całości 
let zoomFactor = 2.5; // Przybliżenie całej animacji

// Dostosowanie parametrów dla urządzeń mobilnych
function setupMobileParameters() {
  // Sprawdzenie czy urządzenie jest mobilne
  if (windowWidth <= 768) {
    // Zmniejszamy złożoność dla urządzeń mobilnych
    numSpirals = 2;
    spiralDensity = 200;
    circleSpacing = 35;
    circlePoints = 50;
    zoomFactor = 1.8; // Mniejsze przybliżenie dla telefonów
  } else if (windowWidth <= 1024) {
    // Tablet
    numSpirals = 3;
    zoomFactor = 2.2;
  }
}

// Funkcja generująca sekwencję Fibonacciego
function generateFibonacci(n) {
  let sequence = [1, 1]; // Zaczynamy od 1, 1
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i-1] + sequence[i-2]);
  }
  return sequence;
}

// Funkcja inicjalizująca spiralę
function initSpiral(index) {
  let spiral = {
    points: [], // Punkty na spirali
    circles: [], // Koła na spirali
    phase: index * TWO_PI / numSpirals, // Faza początkowa (przesunięcie)
    hueBase: 220 + index * 30, // Bazowy kolor (zakres niebiesko-różowy)
    rotation: random(TWO_PI) // Losowa rotacja początkowa
  };
  
  // Generujemy punkty spirali 
  for (let i = 0; i < spiralDensity; i++) {
    let t = i / 15; // Dzielnik dla spirali
    
    // Wzór na spiralę logarytmiczną
    let r = 12 + 1.3 * t;
    let theta = t * 0.8 + spiral.phase; // Zmniejszony mnożnik dla mniejszej liczby obrotów
    
    // Obliczamy pozycję XY
    let x = r * cos(theta);
    let y = r * sin(theta);
    
    // Dodajemy punkt do spirali
    spiral.points.push({
      x: x,
      y: y,
      theta: theta,
      r: r,
      originalTheta: theta, // Zapamiętujemy oryginalne wartości
      originalR: r
    });
    
    // Co określony odstęp dodajemy koło
    if (i % circleSpacing === 0 && i > 0) {
      let circle = {
        centerX: x,
        centerY: y,
        radius: circleSize + (i / spiralDensity) * 20,
        points: [] // Punkty koła
      };
      
      // Generujemy punkty koła
      for (let j = 0; j < circlePoints; j++) {
        let angle = j * TWO_PI / circlePoints;
        let px = circle.radius * cos(angle);
        let py = circle.radius * sin(angle);
        
        circle.points.push({
          x: px,
          y: py,
          angle: angle
        });
      }
      
      spiral.circles.push(circle);
    }
  }
  
  return spiral;
}

// Funkcja setup uruchamia się raz na początku
function setup() {
  // Dostosowanie parametrów do urządzenia
  setupMobileParameters();
  
  // Tworzymy canvas (płótno) na całą szerokość i wysokość okna
  createCanvas(windowWidth, windowHeight);
  
  // Generujemy liczby Fibonacciego
  fibNumbers = generateFibonacci(20);
  
  // Ustawiamy tryb kolorów na HSB (Hue, Saturation, Brightness)
  colorMode(HSB, 360, 100, 100, 1);
  
  // Inicjalizujemy spirale
  for (let i = 0; i < numSpirals; i++) {
    spirals.push(initSpiral(i));
  }
}

// Funkcja draw uruchamia się w pętli
function draw() {
  // Ustawiamy ciemne tło
  background(240, 50, 17); // Ciemny kolor tła (HSB)
  
  // Aktualizujemy czas dla animacji
  time += 0.01;
  
  // Przesuwamy początek układu współrzędnych na środek ekranu
  translate(width / 2, height / 2);
  
  // Stosujemy współczynnik przybliżenia
  scale(zoomFactor);
  
  // Rysujemy wszystkie spirale
  for (let s = 0; s < spirals.length; s++) {
    let spiral = spirals[s];
    
    // Aktualizujemy rotację spirali
    spiral.rotation += rotationSpeed;
    
    // Rysujemy spiralę
    push(); // Zapisujemy stan transformacji
    
    rotate(spiral.rotation); // Obracamy całą spiralę
    
    // Rysujemy linię spirali
    beginShape();
    for (let i = 0; i < spiral.points.length; i++) {
      let p = spiral.points[i];
      
      // Dodajemy deformację sinusoidalną
      let sinusOffset = sin(p.theta * sinusFrequency + time * sinusSpeed) * sinusAmplitude;
      let r = p.originalR + sinusOffset;
      
      // Obliczamy nową pozycję XY
      let x = r * cos(p.originalTheta);
      let y = r * sin(p.originalTheta);
      
      // Aktualizujemy pozycję punktu
      p.x = x;
      p.y = y;
      p.r = r;
      
      // Określamy kolor na podstawie pozycji
      let hue = (spiral.hueBase + i * 0.2) % 360;
      let sat = 70;
      let brightness = 60 + sin(i * 0.01 + time) * 20;
      
      // Określamy przezroczystość na podstawie odległości od środka
      let alpha = map(i, 0, spiral.points.length, 0.4, 0.9);
      
      // Grubość linii
      strokeWeight(2.5);
      stroke(hue, sat, brightness, alpha);
      noFill();
      
      // Dodajemy punkt do kształtu
      vertex(x, y);
    }
    endShape();
    
    // Rysujemy koła na spirali
    for (let i = 0; i < spiral.circles.length; i++) {
      let circle = spiral.circles[i];
      
      // Uzyskujemy indeks punktu spirali dla tego koła
      let spiralPointIndex = (i + 1) * circleSpacing;
      if (spiralPointIndex < spiral.points.length) {
        // Pobieramy punkt spirali dla tego koła
        let spiralPoint = spiral.points[spiralPointIndex];
        
        // Aktualizujemy pozycję środka koła
        circle.centerX = spiralPoint.x;
        circle.centerY = spiralPoint.y;
        
        // Rysujemy koło
        beginShape();
        for (let j = 0; j < circle.points.length; j++) {
          let cp = circle.points[j];
          
          // Dodajemy deformację sinusoidalną do koła
          let circleRadius = circle.radius + sin(cp.angle * 8 + time * 2) * (circle.radius * 0.25);
          
          // Obliczamy pozycję XY punktu koła
          let x = circle.centerX + circleRadius * cos(cp.angle + time * 0.5);
          let y = circle.centerY + circleRadius * sin(cp.angle + time * 0.5);
          
          // Określamy kolor na podstawie pozycji i czasu
          let hue = (spiral.hueBase + j * 100 + i * 200 + time * 10) % 360;
          let sat = 80;
          let brightness = 90;
          
          // Grubość linii koła
          strokeWeight(1.5);
          stroke(hue, sat, brightness, 1);
          noFill();
          
          // Dodajemy punkt do kształtu
          vertex(x, y);
        }
        endShape(CLOSE);
      }
    }
    
    pop(); // Przywracamy stan transformacji
  }
}

// Funkcja dostosowująca rozmiar płótna po zmianie rozmiaru okna
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Ponowne dostosowanie parametrów
  setupMobileParameters();
  
  // Resetujemy spirale z nowymi parametrami
  spirals = [];
  for (let i = 0; i < numSpirals; i++) {
    spirals.push(initSpiral(i));
  }
}

// Funkcja reagująca na kliknięcie myszą lub dotyk ekranu
function mousePressed() {
  changeAnimation();
  return false; // Zapobiega domyślnym akcjom przeglądarki
}

// Funkcja reagująca na dotyk (dla urządzeń mobilnych)
function touchStarted() {
  changeAnimation();
  return false; // Zapobiega domyślnym akcjom przeglądarki
}

// Funkcja zmieniająca parametry animacji
function changeAnimation() {
  // Generujemy losowy odcień podstawowy
  let newHue = random(0, 360); // Losowy odcień z pełnego zakresu HSB

  // Zmieniamy odcień podstawowy dla każdej spirali
  for (let i = 0; i < spirals.length; i++) {
    spirals[i].hueBase = newHue + i * 30; // Każda spirala ma trochę inny odcień
  }

  // Zmieniamy inne parametry animacji przy kliknięciu
  sinusAmplitude = random(25, 65);
  sinusFrequency = random(0.26, 0.42);
  rotationSpeed = random(0.005, 0.007) * (random() > 0.5 ? 1 : -1);

  // Dostosowujemy współczynnik przybliżenia
  if (windowWidth <= 768) {
    zoomFactor = random(1.5, 2.0);
  } else {
    zoomFactor = random(2.0, 3.0);
  }
}
