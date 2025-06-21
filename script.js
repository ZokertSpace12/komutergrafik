// Fungsi untuk membuka sidebar dengan animasi
function openNav() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (sidebar && main) {
        sidebar.style.width = "280px"; // Lebar sidebar saat terbuka
        main.style.marginLeft = "280px"; // Dorong konten utama
        main.style.opacity = "0.7"; // Redupkan konten utama
        main.style.filter = "blur(2px)"; // Tambahkan efek blur
        sidebar.style.boxShadow = "4px 0 15px rgba(0,0,0,0.3)"; // Bayangan lebih kuat
        
        // Tambahkan kelas untuk efek transisi khusus jika diperlukan di CSS
        // (misalnya, untuk animasi ikon tombol menu)
        document.querySelector('.openbtn').classList.add('is-active');
        document.querySelector('.openbtn').setAttribute('aria-expanded', 'true');
    } else {
        console.error("Elemen 'sidebar' atau 'main' tidak ditemukan!");
    }
}

// Fungsi untuk menutup sidebar dengan animasi
function closeNav() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (sidebar && main) {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
        main.style.opacity = "1"; // Kembalikan opasitas
        main.style.filter = "none"; // Hapus blur
        sidebar.style.boxShadow = "2px 0 10px rgba(0,0,0,0.1)"; // Bayangan default
        
        document.querySelector('.openbtn').classList.remove('is-active');
        document.querySelector('.openbtn').setAttribute('aria-expanded', 'false');
    }
}

// Fungsi untuk memperbarui status aktif menu sidebar (tetap penting untuk UX)
function setActiveSidebarMenuItem(filename) {
    document.querySelectorAll('.sidebar-nav a').forEach(item => {
        item.classList.remove('active');
        // Logika untuk menentukan item aktif
        if (filename === 'dashboard' && item.getAttribute('onclick') === "loadContent('dashboard')") {
            item.classList.add('active');
        } else if (item.getAttribute('onclick') === `loadContent('${filename}')`) {
            item.classList.add('active');
        }
    });
}

// Fungsi untuk memuat konten dengan animasi
async function loadContent(filename) {
    const contentArea = document.getElementById('content-area');
    
    // Animasi fade-out & slide-out konten yang ada
    contentArea.style.opacity = "0";
    contentArea.style.transform = "translateY(20px)";
    
    // Tambahkan delay singkat sebelum memuat konten baru untuk memberi waktu animasi fade-out
    await new Promise(resolve => setTimeout(resolve, 300)); // Sesuaikan durasi dengan transisi CSS

    try {
        let contentHtml = ''; // Variabel untuk menyimpan HTML konten
        if (filename === 'dashboard') {
            contentHtml = `
                <div class="hero-section">
                    <h2>Selamat Datang di Portal Pembelajaran!</h2>
                    <p>Jelajahi materi-materi menarik kami yang tersusun rapi dari Pertemuan 1 hingga 14.</p>
                    <button class="cta-button" onclick="loadContent('per1.html')">Mulai Belajar Sekarang <i class="fas fa-arrow-right"></i></button>
                </div>

                <div class="info-cards-container">
                    <div class="info-card">
                        <div class="card-icon"><i class="fas fa-graduation-cap"></i></div>
                        <div class="card-content">
                            <h3>Total Pertemuan</h3>
                            <p>14 Materi Tersedia</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="card-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="card-content">
                            <h3>Progress Anda</h3>
                            <p>3 Pertemuan Selesai</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="card-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="card-content">
                            <h3>Statistik Belajar</h3>
                            <p>Lihat detail di Dashboard</p>
                        </div>
                    </div>
                </div>

                <div class="dashboard-section">
                    <h2>Ringkasan Perkembangan</h2>
                    <div class="pie-chart-container">
                        <canvas id="myPieChart"></canvas>
                    </div>
                    <ul class="pie-chart-legend" id="pieChartLegend"></ul>
                </div>
            `;
            contentArea.innerHTML = contentHtml; // Set HTML
            // Beri sedikit waktu agar DOM diperbarui sebelum menggambar chart
            await new Promise(resolve => setTimeout(resolve, 50));
            await drawPieChart(); // Gambar pie chart setelah elemen ada di DOM
        } else {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            contentHtml = await response.text();
            contentArea.innerHTML = contentHtml; // Set HTML
        }

        // Animasi fade-in & slide-in konten baru
        contentArea.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"; // Durasi fade-in
        contentArea.style.opacity = "1";
        contentArea.style.transform = "translateY(0)";

    } catch (error) {
        console.error('Terjadi masalah saat memuat konten:', error);
        contentArea.innerHTML = `<p style="color: red;">Gagal memuat konten: ${filename}. Silakan coba lagi. (${error.message})</p>`;
        contentArea.style.opacity = "1"; // Pastikan tetap terlihat jika error
        contentArea.style.transform = "translateY(0)";
    } finally {
        closeNav(); // Tutup sidebar setelah memuat konten
        setActiveSidebarMenuItem(filename); // Perbarui highlight menu
    }
}

// Fungsi untuk menggambar Pie Chart (dengan animasi sederhana)
async function drawPieChart() {
    const canvas = document.getElementById('myPieChart');
    const ctx = canvas.getContext('2d');
    const legendEl = document.getElementById('pieChartLegend');

    if (!canvas || !ctx || !legendEl) {
        console.warn("Elemen canvas, konteks, atau legenda tidak ditemukan untuk menggambar chart.");
        return;
    }

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const data = [
        { label: 'Selesai', value: 70, color: '#FF7AA2' }, // Pink yang lebih cerah
        { label: 'Belum Selesai', value: 30, color: '#993366' }, // Pink lebih tua/ungu
        { label: 'Tertunda', value: 10, color: '#FFD1DC' } // Pink sangat pucat
    ];

    legendEl.innerHTML = ''; // Bersihkan legenda sebelumnya

    let total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    const animationDuration = 1200; // Durasi animasi lebih panjang
    const startTime = performance.now();

    function animatePie(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let currentAngle = 0;
        data.forEach(item => {
            let sliceAngle = (item.value / total) * 2 * Math.PI * progress;
            let endAngle = currentAngle + sliceAngle;

            ctx.beginPath();
            ctx.arc(canvas.width / (2 * dpr), canvas.height / (2 * dpr), Math.min(canvas.width, canvas.height) / (2 * dpr) - 20, currentAngle, endAngle);
            ctx.lineTo(canvas.width / (2 * dpr), canvas.height / (2 * dpr));
            ctx.fillStyle = item.color;
            ctx.fill();

            currentAngle = endAngle;
        });

        if (progress < 1) {
            requestAnimationFrame(animatePie);
        } else {
            // Setelah animasi selesai, tambahkan legenda
            data.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<span style="background-color:${item.color};"></span> ${item.label} (${item.value})`;
                legendEl.appendChild(li);
            });
        }
    }
    requestAnimationFrame(animatePie);
}

// Event listener saat DOM sudah dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Memuat dashboard secara default saat halaman pertama kali dibuka
    loadContent('dashboard');

    // Menggunakan event delegation pada sidebar untuk klik menu
    // Ini memastikan event listener tetap berfungsi meskipun konten diubah
    const sidebarElement = document.getElementById('sidebar');
    if (sidebarElement) {
        sidebarElement.addEventListener('click', function(event) {
            let target = event.target;

            // Pastikan kita mengklik elemen <a> dengan atribut onclick yang benar
            // Lakukan iterasi ke atas DOM tree sampai menemukan elemen <a> yang relevan
            while (target !== this && target.tagName !== 'A') {
                target = target.parentNode;
            }
            
            // Cek jika target adalah <a> dan memiliki onclick yang dimulai dengan 'loadContent'
            if (target.tagName === 'A' && target.hasAttribute('onclick') && target.getAttribute('onclick').startsWith('loadContent(')) {
                event.preventDefault(); // Mencegah perilaku default link

                // Ekstrak nama file dari string onclick
                const onclickString = target.getAttribute('onclick');
                const filenameMatch = onclickString.match(/loadContent\(['"](.+)['"]\)/);
                
                if (filenameMatch && filenameMatch[1]) {
                    const filename = filenameMatch[1];
                    loadContent(filename);
                }
            }
        });
    } else {
        console.error("Elemen 'sidebar' tidak ditemukan untuk event delegation!");
    }
});