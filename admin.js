// admin.js
const API_BASE = 'http://localhost:4000';

document.addEventListener('DOMContentLoaded', () => {
    const btnLoad = document.getElementById('loadTransactions');
    btnLoad.addEventListener('click', loadTransactions);
});

async function loadTransactions() {
    const token = document.getElementById('adminToken').value.trim();
    const msgEl = document.getElementById('adminMessage');
    const tbody = document.getElementById('transactionsTableBody');

    msgEl.textContent = 'Memuat data...';

    try {
        const res = await fetch(`${API_BASE}/api/transactions?limit=200`, {
            headers: {
                'x-admin-token': token
            }
        });

        if (!res.ok) {
            const text = await res.text();
            msgEl.textContent = `Gagal memuat data: ${text}`;
            tbody.innerHTML = `<tr><td colspan="6">Tidak dapat memuat data.</td></tr>`;
            return;
        }

        const data = await res.json();
        console.log('Data transaksi dari backend:', data);
        msgEl.textContent = `Berhasil memuat ${data.length} transaksi.`;

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">Belum ada transaksi.</td></tr>`;
            return;
        }

        tbody.innerHTML = '';

        data.forEach(tx => {
            const tr = document.createElement('tr');

            const time = new Date(tx.timestamp || tx.createdAt).toLocaleString('id-ID');
            const status = tx.status || 'success';

            // --- Normalisasi info network ---
            const networkNameRaw = tx.networkName != null ? tx.networkName : '';
            const chainIdRaw = tx.chainId != null ? tx.chainId : '';

            const networkName = String(networkNameRaw).toLowerCase();
            const chainIdStr = String(chainIdRaw).toLowerCase();

            // Dianggap Sepolia jika:
            const isSepolia =
                networkName.includes('sepolia') ||
                chainIdStr === '0xaa36a7' ||
                chainIdStr === '11155111';

            // --- Isi kolom Tx Hash ---
            let txHashCell = '-';

            if (tx.txHash) {
                const shortHash = tx.txHash.slice(0, 10) + '...';

                if (isSepolia) {
                    // Sepolia → link ke Etherscan + badge
                    txHashCell = `
                        <span class="tx-cell">
                            <a class="tx-hash-link"
                               href="https://sepolia.etherscan.io/tx/${tx.txHash}"
                               target="_blank">
                                ${shortHash}
                            </a>
                            <span class="tx-badge tx-badge-sepolia">Sepolia</span>
                        </span>
                    `;
                } else {
                    // Ganache / lokal → hanya teks + badge local
                    txHashCell = `
                        <span class="tx-cell">
                            <span class="tx-hash-text">${shortHash}</span>
                            <span class="tx-badge tx-badge-local">Local</span>
                        </span>
                    `;
                }
            }

            tr.innerHTML = `
                <td>${time}</td>
                <td>
                    <strong>${tx.videoTitle}</strong><br>
                    <small>ID: ${tx.videoId}</small>
                </td>
                <td>${tx.buyer}</td>
                <td>${tx.priceEth}</td>
                <td>${txHashCell}</td>
                <td><span class="badge-success">${status}</span></td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        msgEl.textContent = 'Terjadi error di sisi frontend.';
        tbody.innerHTML = `<tr><td colspan="6">Error.</td></tr>`;
    }
}
