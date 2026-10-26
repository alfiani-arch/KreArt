
// ==========================================
// KREART LAB - JAVASCRIPT
// ==========================================

// 1. COLOR PLAYGROUND

const palettes = [
  ["#6C4CF1", "#FF875B", "#FFD166", "#F7F3EA", "#24212D"],
  ["#143D59", "#1D7A8C", "#BFDBF7", "#F1FAEE", "#FF6B6B"],
  ["#386641", "#6A994E", "#A7C957", "#F2E8CF", "#BC4749"],
  ["#FF70A6", "#FF9770", "#FFD670", "#70D6FF", "#6C4CF1"],
  ["#4F359B", "#7353BA", "#A78BFA", "#DDD6FE", "#FFF7ED"]
];

const paletteElement = document.getElementById("palette");
const generateButton = document.getElementById("generateColor");

function renderPalette(colors) {
  if (!paletteElement) return;

  paletteElement.replaceChildren();

  colors.forEach(function(color) {
    const swatch = document.createElement("button");

    swatch.type = "button";
    swatch.className = "swatch";
    swatch.style.backgroundColor = color;
    swatch.textContent = color;
    swatch.title = "Klik untuk menyalin " + color;
    swatch.setAttribute("aria-label", "Salin kode warna " + color);

    const lightColors = [
      "#F7F3EA", "#FFF7ED", "#BFDBF7",
      "#F1FAEE", "#FFD166", "#F2E8CF",
      "#A7C957", "#FFD670", "#DDD6FE"
    ];

    if (lightColors.includes(color)) {
      swatch.style.color = "#24212D";
      swatch.style.textShadow = "none";
    }

    swatch.addEventListener("click", function() {
      copyColor(color);
    });

    paletteElement.appendChild(swatch);
  });
}

function generatePalette() {
  let index = Math.floor(Math.random() * palettes.length);
  const previous = paletteElement.dataset.paletteIndex;

  // Hindari palet yang sama secara berurutan
  if (previous !== undefined && palettes.length > 1) {
    while (index === Number(previous)) {
      index = Math.floor(Math.random() * palettes.length);
    }
  }

  paletteElement.dataset.paletteIndex = String(index);
  renderPalette(palettes[index]);
}

async function copyColor(color) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(color);
    } else {
      const temp = document.createElement("textarea");

      temp.value = color;
      temp.style.position = "fixed";
      temp.style.opacity = "0";

      document.body.appendChild(temp);
      temp.select();

      const copied = document.execCommand("copy");
      temp.remove();

      if (!copied) {
        throw new Error("Clipboard tidak tersedia");
      }
    }

    alert("Kode warna " + color + " berhasil disalin!");
  } catch (error) {
    window.prompt("Salin kode warna berikut:", color);
  }
}

if (generateButton) {
  generateButton.addEventListener("click", generatePalette);
}

// Aktifkan klik pada palet awal dari HTML
if (paletteElement) {
  paletteElement.querySelectorAll(".swatch").forEach(function(swatch) {
    swatch.setAttribute("role", "button");
    swatch.tabIndex = 0;

    const handler = function() {
      copyColor(swatch.textContent.trim());
    };

    swatch.addEventListener("click", handler);

    swatch.addEventListener("keydown", function(event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handler();
      }
    });
  });
}


// ==========================================
// 2. DKV QUIZ
// ==========================================

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const feedbackElement = document.getElementById("quizFeedback");
const scoreElement = document.getElementById("score");
const nextButton = document.getElementById("nextQuestion");

const quizQuestions = [
  {
    question: "Apa tujuan utama hierarki visual?",
    answers: [
      "Membuat semua elemen sama besar",
      "Mengatur urutan perhatian audiens",
      "Menggunakan sebanyak mungkin warna",
      "Menghilangkan ruang kosong"
    ],
    correct: 1,
    explanation:
      "Hierarki visual membantu audiens mengetahui informasi yang paling penting."
  },
  {
    question: "Apa fungsi kontras dalam desain?",
    answers: [
      "Membuat semua elemen sama",
      "Menghilangkan judul",
      "Menonjolkan perbedaan dan informasi penting",
      "Membuat desain tanpa warna"
    ],
    correct: 2,
    explanation:
      "Kontras bisa dibuat melalui perbedaan warna, ukuran, atau ketebalan."
  },
  {
    question: "Apa yang dimaksud dengan tipografi?",
    answers: [
      "Seni dan pengaturan huruf",
      "Teknik memotret",
      "Teknik menggambar perspektif",
      "Cara mengedit suara"
    ],
    correct: 0,
    explanation:
      "Tipografi membahas pemilihan dan pengaturan huruf dalam komunikasi visual."
  },
  {
    question: "Apa fungsi alignment?",
    answers: [
      "Membuat teks selalu miring",
      "Menambahkan banyak warna",
      "Memperbesar semua gambar",
      "Membuat elemen teratur dan sejajar"
    ],
    correct: 3,
    explanation:
      "Alignment membantu menciptakan keteraturan dalam layout."
  },
  {
    question: "Apa arti repetisi dalam prinsip desain?",
    answers: [
      "Menghapus elemen desain",
      "Mengulang elemen untuk menciptakan konsistensi",
      "Membuat semua objek berbeda",
      "Memusatkan seluruh teks"
    ],
    correct: 1,
    explanation:
      "Repetisi mengulang elemen visual untuk membangun konsistensi."
  }
];

let currentQuestion = 0;
let score = 0;
let hasAnswered = false;
let quizFinished = false;

function showQuestion() {
  const item = quizQuestions[currentQuestion];

  questionElement.textContent = item.question;
  answersElement.replaceChildren();

  feedbackElement.textContent = "";
  feedbackElement.style.color = "";
  scoreElement.textContent = "Skor: " + score;

  nextButton.disabled = true;

  nextButton.textContent =
    currentQuestion === quizQuestions.length - 1
      ? "Lihat Hasil"
      : "Pertanyaan Berikutnya →";

  hasAnswered = false;
  quizFinished = false;

  item.answers.forEach(function(answer, index) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer";
    button.textContent = answer;

    button.addEventListener("click", function() {
      checkAnswer(index, button);
    });

    answersElement.appendChild(button);
  });
}

function checkAnswer(selectedIndex, selectedButton) {
  if (hasAnswered || quizFinished) return;

  hasAnswered = true;

  const item = quizQuestions[currentQuestion];
  const buttons = answersElement.querySelectorAll("button");

  buttons.forEach(function(button) {
    button.disabled = true;
  });

  if (selectedIndex === item.correct) {
    score++;

    selectedButton.classList.add("correct");

    feedbackElement.textContent =
      "Benar! " + item.explanation;

    feedbackElement.style.color = "#2f7b3d";
  } else {
    selectedButton.classList.add("wrong");
    buttons[item.correct].classList.add("correct");

    feedbackElement.textContent =
      "Belum tepat. " + item.explanation;

    feedbackElement.style.color = "#a34d31";
  }

  scoreElement.textContent =
    "Skor: " + score + " dari " + quizQuestions.length;

  nextButton.disabled = false;
}

function finishQuiz() {
  quizFinished = true;

  const percentage = Math.round(
    (score / quizQuestions.length) * 100
  );

  questionElement.textContent = "Kuis selesai! 🎉";
  answersElement.replaceChildren();

  feedbackElement.textContent =
    "Nilai kamu: " + percentage + "/100. " +
    (
      percentage >= 80
        ? "Hebat! Kamu memahami dasar desain."
        : "Tetap semangat! Coba pelajari materi DKV lagi."
    );

  feedbackElement.style.color = "";
  scoreElement.textContent =
    "Jawaban benar: " + score + " dari " + quizQuestions.length;

  nextButton.textContent = "Ulangi Kuis ↻";
  nextButton.disabled = false;
}

if (nextButton) {
  nextButton.addEventListener("click", function() {
    if (quizFinished) {
      currentQuestion = 0;
      score = 0;
      hasAnswered = false;
      quizFinished = false;

      showQuestion();
      return;
    }

    if (!hasAnswered) return;

    if (currentQuestion < quizQuestions.length - 1) {
      currentQuestion++;
      showQuestion();
    } else {
      finishQuiz();
    }
  });
}

if (questionElement && answersElement && nextButton) {
  showQuestion();
}


// ==========================================
// 3. MINI POSTER STUDIO
// ==========================================

const titleInput = document.getElementById("posterTitleInput");
const subtitleInput = document.getElementById("posterSubtitleInput");
const backgroundInput = document.getElementById("posterBg");
const textColorInput = document.getElementById("posterFg");

const posterPreview = document.getElementById("posterPreview");
const posterTitle = document.getElementById("posterTitle");
const posterSubtitle = document.getElementById("posterSubtitle");
const downloadButton = document.getElementById("downloadPoster");

function updatePoster() {
  if (!posterPreview) return;

  posterTitle.textContent =
    titleInput.value.trim() || "JUDUL POSTER";

  posterSubtitle.textContent =
    subtitleInput.value.trim() || "Pesan pendukung poster";

  posterPreview.style.backgroundColor = backgroundInput.value;
  posterPreview.style.color = textColorInput.value;
}

[titleInput, subtitleInput, backgroundInput, textColorInput]
  .forEach(function(element) {
    if (element) {
      element.addEventListener("input", updatePoster);
    }
  });

function wrapCanvasText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach(function(word) {
    const test = line ? line + " " + word : word;

    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });

  if (line) lines.push(line);

  return lines;
}

function downloadPosterImage() {
  const canvas = document.createElement("canvas");

  canvas.width = 900;
  canvas.height = 1200;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    alert("Browser tidak mendukung pembuatan gambar.");
    return;
  }

  const bg = backgroundInput.value;
  const fg = textColorInput.value;

  // Warna latar poster
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = fg;

  // Teks bagian atas
  ctx.font = "bold 22px Arial";
  ctx.fillText("KREART LAB / DESIGN STUDY", 70, 85);

  // Judul poster
  ctx.font = "900 84px Arial";

  const titleLines = wrapCanvasText(
    ctx,
    titleInput.value.trim() || "JUDUL POSTER",
    760
  );

  let y = 300;

  titleLines.slice(0, 4).forEach(function(line) {
    ctx.fillText(line, 70, y, 760);
    y += 95;
  });

  // Pesan pendukung
  ctx.font = "32px Arial";

  const subtitleLines = wrapCanvasText(
    ctx,
    subtitleInput.value.trim() || "Pesan pendukung poster",
    760
  );

  y += 20;

  subtitleLines.slice(0, 6).forEach(function(line) {
    ctx.fillText(line, 70, y, 760);
    y += 46;
  });

  // Elemen lingkaran
  ctx.strokeStyle = fg;
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(760, 970, 55, 0, Math.PI * 2);
  ctx.stroke();

  // Teks bagian bawah
  ctx.font = "bold 20px Arial";
  ctx.fillText("EXPLORE YOUR IDEAS", 70, 1120);

  // Unduh hasil poster
  const link = document.createElement("a");

  link.download = "kreart-lab-poster.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

if (downloadButton) {
  downloadButton.addEventListener("click", downloadPosterImage);
}

// Terapkan tampilan poster saat halaman dibuka
updatePoster();


// ==========================================
// 4. TAHUN OTOMATIS DI FOOTER
// ==========================================

const yearElement = document.getElementById("currentYear");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

console.log("KreArt Lab berhasil dijalankan!");
