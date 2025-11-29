// ===============================
// Data kartun dari YouTube
// ===============================
const kartunData = [
    {
        id: 1,
        title: "JUMBO",
        description: "JUMBO adalah film animasi Indonesia yang mengisahkan petualangan Don, seorang anak yang sering diejek karena tubuhnya besar. Ia bertekad membuktikan diri melalui pementasan teater.",
        youtubeId: "V8VOaFWYu3s",
        thumbnail: "image/Jumbo.jpeg",
        price: "0.01 ETH"
    },
    {
        id: 2,
        title: "Brightheart",
        description: "Brightheart adalah kunang-kunang pahlawan di desa Bugville yang merupakan satu-satunya sumber cahaya.",
        youtubeId: "c7tkONnwFGg",
        thumbnail: "image/Brightheart.jpg",
        price: "0.01 ETH"
    },
    {
        id: 3,
        title: "Two Tails",
        description: "Two Tails adalah film animasi Rusia tentang persahabatan antara seekor kucing bernama Max yang petualang dan seekor berang-berang bernama Bob yang serius.",
        youtubeId: "ClNmIjrYiyk",
        thumbnail: "image/Two Tails.png",
        price: "0.01 ETH"
    },
    {
        id: 4,
        title: "Princess and the Dragon",
        description: "Mengisahkan tentang Putri Barbara yang sedang merayakan ulang tahunnya yang keenam belas di sebuah kastil.",
        youtubeId: "xnxWGVYVbwc",
        thumbnail: "image/The Princess.jpg",
        price: "0.01 ETH"
    },
    {
        id: 5,
        title: "Tarzan and Jane Genesis",
        description: "Menceritakan kembali kisah ikonik Tarzan dan Jane. Kisah ini berfokus pada awal mula pertemuan mereka di hutan.",
        youtubeId: "BDfX2EuxJzw",
        thumbnail: "image/Tarzan and Jane Genesis.jpg",
        price: "0.01 ETH"
    },
    {
        id: 6,
        title: "The Big Trip",
        description: "Menceritakan petualangan Mic Mic, beruang grizzly yang pemarah, dan Oscar, kelinci yang kikuk.",
        youtubeId: "G3iA1sKHk7k",
        thumbnail: "image/The Big Trip.jpeg",
        price: "0.01 ETH"
    },
    {
        id: 7,
        title: "The Canterville Ghost",
        description: "Menceritakan keluarga Otis dari Amerika yang pindah ke Puri Canterville di Inggris, meskipun diperingatkan bahwa puri itu dihantui.",
        youtubeId: "PmpWDHv1aNQ",
        thumbnail: "image/The Canterville Ghost.jpg",
        price: "0.01 ETH"
    },
    {
        id: 8,
        title: "Valley Of The Lanterns",
        description: "Menceritakan kisah Lighta, kunang-kunang kecil yang bersemangat namun terisolasi, yang tinggal di sebuah rumah kunang-kunang tua di hutan.",
        youtubeId: "UTAvGzCK6ok",
        thumbnail: "image/Valley Of The Lanterns.png",
        price: "0.01 ETH"
    },
    {
        id: 9,
        title: "Battle Of Surabaya",
        description: "film animasi sejarah Indonesia yang berlatar belakang pertempuran 10 November 1945 di Surabaya. Kisahnya berpusat pada Musa, seorang remaja tukang semir sepatu yang menjadi kurir surat rahasia bagi para pejuang kemerdekaan. Meskipun menghadapi bahaya dan konflik, Musa berusaha menjalankan tugasnya sambil menemukan makna persahabatan, cinta, dan kehilangan di tengah hiruk pikuk perang. Film ini menggambarkan semangat perjuangan arek-arek Suroboyo dalam mempertahankan kemerdekaan.",
        youtubeId: "qMd6LnDzFLc",
        thumbnail: "image/Battle Of Surabaya.jpg",
        price: "0.01 ETH"
    }
];

// ===============================
// Variabel global
// ===============================
let web3;
let account = null;
let contract = null;
let currentVideoId = null;
let currentNetwork = null; // info jaringan aktif (Ganache / Sepolia)

// ===============================
// ABI Kontrak Pintar
// ===============================
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_videoId",
                "type": "uint256"
            }
        ],
        "name": "purchaseVideo",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newPrice",
                "type": "uint256"
            }
        ],
        "name": "setVideoPrice",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "videoId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "VideoPurchased",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_videoId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "hasPurchased",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "purchases",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "videoPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// ===============================
// Konfigurasi jaringan & alamat kontrak
// ===============================

// mapping chainId -> info jaringan
// pastikan chainId yang kamu pakai cocok.
const NETWORK_CONFIG = {
    "0x539": { // Ganache
        name: "Ganache",
        chainId: "0x539",
        contractAddress: "0xfB9e976162F3B7917e74E8b6302C2AbdEbD35c18",
        explorerTx: ""
    },
    "0xaa36a7": { // Sepolia
        name: "Sepolia",
        chainId: "0xaa36a7",
        contractAddress: "0x36094Ae0B6139ed4B8BE12D785555A7BfF389182",
        explorerTx: "https://sepolia.etherscan.io/tx/"
    }
};

// ===============================
// Inisialisasi aplikasi
// ===============================
document.addEventListener('DOMContentLoaded', function () {
    loadKartunGrid();
    setupEventListeners();
    checkMetaMask();
});

// ===============================
// Fungsi util
// ===============================

// Ekstrak YouTube ID dari berbagai format URL
function extractYouTubeId(url) {
    if (!url) return '';

    // Kalau sudah ID murni
    if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
        return url;
    }

    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
}

// ===============================
// Render Grid Kartun
// ===============================
function loadKartunGrid() {
    const kartunGrid = document.getElementById('kartunGrid');
    if (!kartunGrid) {
        console.error('Elemen #kartunGrid tidak ditemukan di HTML');
        return;
    }

    kartunData.forEach(kartun => {
        const kartunCard = document.createElement('div');
        kartunCard.className = 'kartun-card';
        kartunCard.setAttribute('data-id', kartun.id);

        kartunCard.innerHTML = `
            <div class="kartun-thumbnail">
                <img src="${kartun.thumbnail}" alt="${kartun.title}" onerror="this.src='https://via.placeholder.com/300x400/6ecbf5/ffffff?text=Gambar+Tidak+Tersedia'">
                <div class="play-icon">▶</div>
            </div>
            <div class="kartun-info">
                <h3>${kartun.title}</h3>
                <p>${kartun.description.substring(0, 100)}...</p>
                <div class="kartun-price">
                    <span class="price">${kartun.price}</span>
                </div>
            </div>
        `;

        kartunGrid.appendChild(kartunCard);
    });
}

// ===============================
// Event Listeners
// ===============================
function setupEventListeners() {
    const connectBtn = document.getElementById('connectWallet');
    if (connectBtn) {
        connectBtn.addEventListener('click', connectMetaMask);
    }

    // Klik kartu kartun → buka modal
    document.addEventListener('click', function (e) {
        const kartunCard = e.target.closest('.kartun-card');
        if (kartunCard) {
            const videoId = parseInt(kartunCard.getAttribute('data-id'));
            openVideoModal(videoId);
        }
    });

    const buyBtn = document.getElementById('buyVideo');
    if (buyBtn) {
        buyBtn.addEventListener('click', purchaseVideo);
    }

    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        videoModal.addEventListener('click', function (e) {
            if (e.target === this) closeModal();
        });
    }

    const learnMoreBtn = document.getElementById('learnMore');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function () {
            const section = document.querySelector('.how-to-pay');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===============================
// MetaMask & Web3
// ===============================
function checkMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask terdeteksi!');
        if (localStorage.getItem('walletConnected') === 'true') {
            connectMetaMask();
        }
    } else {
        alert('MetaMask tidak terdeteksi! Silakan install MetaMask terlebih dahulu.');
    }
}

async function connectMetaMask() {
    try {
        // minta akses akun
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        account = accounts[0];
        web3 = new Web3(window.ethereum);

        // Ambil chainId (Ganache / Sepolia)
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Terhubung ke chainId:', chainId);

        const networkConfig = NETWORK_CONFIG[chainId];

        if (!networkConfig) {
            alert(
                `Jaringan dengan chainId ${chainId} belum didukung.\n` +
                `Silakan pindah ke Ganache atau Sepolia di MetaMask.`
            );
            return;
        }

        currentNetwork = networkConfig;
        console.log('Network aktif:', currentNetwork.name);
        console.log('Alamat kontrak:', currentNetwork.contractAddress);

        // Inisialisasi kontrak sesuai jaringan
        contract = new web3.eth.Contract(contractABI, currentNetwork.contractAddress);

        updateWalletInfo();
        localStorage.setItem('walletConnected', 'true');
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        alert('Gagal terhubung ke MetaMask. Pastikan Anda telah mengizinkan akses.');
    }
}

async function updateWalletInfo() {
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');
    const walletBalance = document.getElementById('walletBalance');
    const connectButton = document.getElementById('connectWallet');

    if (!walletInfo || !walletAddress || !walletBalance || !connectButton) return;

    connectButton.style.display = 'none';
    walletInfo.style.display = 'flex';

    const shortAddress = account.substring(0, 6) + '...' + account.substring(account.length - 4);
    walletAddress.textContent = `Alamat: ${shortAddress}${currentNetwork ? ' (' + currentNetwork.name + ')' : ''}`;

    try {
        const balance = await web3.eth.getBalance(account);
        const balanceInEth = web3.utils.fromWei(balance, 'ether');
        walletBalance.textContent = `Saldo: ${parseFloat(balanceInEth).toFixed(4)} ETH`;
    } catch (error) {
        console.error('Error getting balance:', error);
        walletBalance.textContent = 'Saldo: Tidak tersedia';
    }
}

// ===============================
// Modal Video
// ===============================
async function openVideoModal(videoId) {
    currentVideoId = videoId;
    const kartun = kartunData.find(k => k.id === videoId);
    if (!kartun) return;

    const modalTitle = document.getElementById('modalTitle');
    const videoPlayer = document.getElementById('videoPlayer');
    const buyButton = document.getElementById('buyVideo');
    const purchaseStatus = document.getElementById('purchaseStatus');
    const videoModal = document.getElementById('videoModal');

    if (!modalTitle || !videoPlayer || !buyButton || !purchaseStatus || !videoModal) {
        console.error('Elemen modal tidak lengkap di HTML');
        return;
    }

    modalTitle.textContent = kartun.title;

    const youtubeId = extractYouTubeId(kartun.youtubeId);
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`;
    videoPlayer.src = embedUrl;

    const priceInEth = kartun.price.split(' ')[0];
    buyButton.textContent = `Beli Sekarang (${priceInEth} ETH)`;

    if (account && contract) {
        try {
            const hasPurchased = await contract.methods.hasPurchased(videoId, account).call();

            if (hasPurchased) {
                purchaseStatus.textContent = 'Sudah dibeli';
                purchaseStatus.className = 'purchased';
                buyButton.style.display = 'none';
                videoPlayer.style.display = 'block';
            } else {
                purchaseStatus.textContent = 'Belum dibeli';
                purchaseStatus.className = 'not-purchased';
                buyButton.style.display = 'block';
                videoPlayer.style.display = 'none';
            }
        } catch (error) {
            console.error('Error checking purchase status:', error);
            purchaseStatus.textContent = 'Error memeriksa status';
            purchaseStatus.className = 'not-purchased';
            buyButton.style.display = 'block';
            videoPlayer.style.display = 'none';
        }
    } else {
        purchaseStatus.textContent = 'Hubungkan MetaMask terlebih dahulu';
        purchaseStatus.className = 'not-purchased';
        buyButton.style.display = 'block';
        videoPlayer.style.display = 'none';
    }

    videoModal.style.display = 'block';
}

function closeModal() {
    const videoModal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoModal) videoModal.style.display = 'none';
    if (videoPlayer) videoPlayer.src = '';
}

// ===============================
// Pembelian Video
// ===============================
async function purchaseVideo() {
    if (!account || !contract) {
        alert('Silakan hubungkan MetaMask terlebih dahulu!');
        return;
    }

    if (!currentVideoId) {
        alert('Video tidak valid!');
        return;
    }

    const kartun = kartunData.find(k => k.id === currentVideoId);
    if (!kartun) {
        alert('Kartun tidak ditemukan!');
        return;
    }

    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'flex';

    try {
        const priceInEth = kartun.price.split(' ')[0];
        const priceInWei = web3.utils.toWei(priceInEth, 'ether');

        console.log(`Membeli video ${currentVideoId} dengan harga ${priceInEth} ETH (${priceInWei} Wei)`);

        const result = await contract.methods.purchaseVideo(currentVideoId).send({
            from: account,
            value: priceInWei,
            gas: 300000
        });

        console.log('Transaksi berhasil:', result);

        const purchaseStatus = document.getElementById('purchaseStatus');
        const buyBtn = document.getElementById('buyVideo');
        const videoPlayer = document.getElementById('videoPlayer');

        if (purchaseStatus) {
            purchaseStatus.textContent = 'Sudah dibeli';
            purchaseStatus.className = 'purchased';
        }
        if (buyBtn) buyBtn.style.display = 'none';
        if (videoPlayer) videoPlayer.style.display = 'block';

        showTransactionMessage('Pembelian berhasil! Selamat menikmati kartun.', 'success');

        await saveTransactionToBackend(currentVideoId, priceInEth, result);
    } catch (error) {
        console.error('Error purchasing video:', error);

        let errorMessage = 'Pembelian gagal: ';
        const msg = error && error.message ? error.message : '';

        if (msg.includes('rejected') || msg.includes('User denied transaction')) {
            errorMessage += 'Transaksi ditolak oleh pengguna';
        } else if (msg.includes('insufficient funds')) {
            errorMessage += 'Saldo ETH tidak cukup';
        } else {
            errorMessage += msg || 'Terjadi kesalahan tidak diketahui';
        }

        showTransactionMessage(errorMessage, 'error');
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

// ===============================
// Simpan transaksi ke backend
// ===============================
async function saveTransactionToBackend(videoId, priceInEth, txResult) {
    try {
        const kartun = kartunData.find(k => k.id === videoId);
        const txHash = txResult.transactionHash || txResult.hash || '';

        const body = {
            txHash: txHash,
            videoId: videoId,
            videoTitle: kartun ? kartun.title : `Video #${videoId}`,
            buyer: account.toLowerCase(),
            priceEth: priceInEth,
            timestamp: Date.now(),
            networkName: currentNetwork ? currentNetwork.name : 'Unknown',
            chainId: currentNetwork ? currentNetwork.chainId : null
        };

        const res = await fetch('http://localhost:4000/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            console.error('Gagal menyimpan transaksi ke backend:', await res.text());
        } else {
            console.log('Transaksi tersimpan ke backend');
        }
    } catch (err) {
        console.error('Error saveTransactionToBackend:', err);
    }
}

// ===============================
// Pesan transaksi di UI
// ===============================
function showTransactionMessage(message, type) {
    const existingMessage = document.querySelector('.transaction-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `transaction-message ${type === 'success' ? 'transaction-success' : 'transaction-error'}`;
    messageDiv.textContent = message;

    const modalInfo = document.querySelector('.modal-info');
    if (modalInfo && modalInfo.parentNode) {
        modalInfo.parentNode.insertBefore(messageDiv, modalInfo);
    } else {
        document.body.appendChild(messageDiv);
    }

    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// ===============================
// Event MetaMask (akun & chain)
// ===============================
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            const connectButton = document.getElementById('connectWallet');
            const walletInfo = document.getElementById('walletInfo');
            if (connectButton) connectButton.style.display = 'block';
            if (walletInfo) walletInfo.style.display = 'none';
            localStorage.setItem('walletConnected', 'false');
            account = null;
        } else {
            account = accounts[0];
            if (web3) {
                updateWalletInfo();
            }
        }
    });

    window.ethereum.on('chainChanged', function () {
        // reload supaya script baca chainId baru & pilih kontrak yg sesuai
        window.location.reload();
    });
}

// ===============================
// Fungsi bantuan untuk debugging
// ===============================
window.debugKartunData = function () {
    console.log('Data Kartun:', kartunData);
    kartunData.forEach(kartun => {
        const extractedId = extractYouTubeId(kartun.youtubeId);
        console.log(`Judul: ${kartun.title}, YouTube ID: ${extractedId}`);
    });
};
