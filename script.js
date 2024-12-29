const secretKey = 'JKT48Live';
let url = window.location.pathname;
let data = decodeURIComponent(url.replace("/wrappedExtWeb/", ""));
const decryptedData = CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
let decode = decryptedData;

function isNumeric(value) {
    const parsedValue = parseInt(value, 10);
    return !isNaN(parsedValue) && value == parsedValue;
}

function toggleTopUpVisibility() {
    const topUpElement = document.getElementById('top-up-value');
    const toggleButton = document.getElementById('toggle-top-up');
    
    topUpElement.classList.toggle('hidden');
    if (topUpElement.classList.contains('hidden')) {
        toggleButton.textContent = 'Show';
    } else {
        toggleButton.textContent = 'Hide';
    }
}

function ensureThreeEntries(array) {
    while (array.length < 3) {
        array.push("-");
    }
    return array;
}

function createCard(data) {
    data = JSON.parse(data);
    const cardBody = document.querySelector('.card-body');
    let topSetlists = Array.isArray(data.data.theater.topSetlists) ? ensureThreeEntries([...data.data.theater.topSetlists]) : [data.data.theater.topSetlists];
    let topVCMembers = Array.isArray(data.data.videoCall.topMembers) ? ensureThreeEntries([...data.data.videoCall.topMembers]) : [data.data.videoCall.topMembers];
    const isAlltime = (isNumeric(data.year)) ? false : true;
    const selectedYear = (!isAlltime) ? ` ${data.year}` : `<br/>${data.year}`;
    const yearList = data.data.years;
    const yrs = Array.isArray(yearList) ? `${yearList[0]} - ${yearList[yearList.length - 1]}` : "";
    const showYearList = (isAlltime) ? 
    ` <small style="font-size: 15px; position: relative; top: -5px; display: inline-block;">${yrs}<span style="position: relative; display: block;">(${yearList} thn)</span></small>` : ``;
    cardBody.innerHTML = `
        <h2 class="card-title text-center jaro-font" style="font-size: 60px;">JKT48 Wrapped${selectedYear}${showYearList}</h2>
        <h5 class="text-center jaro-font">(${data.data.name})</h5>
        <br>
        <center>
            <img src="https://www.gak.co.uk/cdn-cgi/image/fit=scale-down,format=jpeg/${data.data.oshiPic}" width="50%" class="img-fluid rounded-image"><br>
            <p class="poppins-font"><b>Oshi:</b> ${data.data.oshi}</p>
        </center><br>
        <div class="row">
            <div class="col-md-6">
                <b>• Theater</b><br>
                ${(data.data.theater.topSetlists) ? `
                <b>Top Setlists:</b><br>${Array.isArray(topSetlists) ? topSetlists.join('<br>') : topSetlists}<br><br>
                <div class="mobile-spacing">
                    <b>🏆 Winrate:</b> ${data.data.theater.winrate.rate}<br>(<b>Menang:</b> ${data.data.theater.winrate.detail.menang}x, <b>Kalah:</b> ${data.data.theater.winrate.detail.kalah}x)
                </div>
                ` : data.data.theater}
            </div>
            <div class="col-md-6">
                <b>• Video Call</b><br>
                ${(data.data.videoCall.totalTickets) ? `
                <b>Top Video Call Members:</b><br>${Array.isArray(topVCMembers) ? topVCMembers.join('<br>') : topVCMembers}<br><br>
                <b>Total Video Call:</b><br>${(data.data.videoCall.totalTickets) ? `${data.data.videoCall.totalTickets} tiket` : data.data.videoCall} 
                ` : data.data.videoCall}
            </div>
        </div><br>
        <div class="poppins-font">
            <b>• Events</b><br>
            ${(data.data.events.lastEvents) ? `
            <b>Last Events:</b><br>${Array.isArray(data.data.events.lastEvents) ? data.data.events.lastEvents.map(event => `- ${event}`).join('<br>') : data.data.events}<br><br>
            ` : data.data.events+"<br><br>"}
            <b>Total Top-Up:</b><br><span class="total-topup censored">${data.data.topUp}</span><br><br>
            <center><small><b>#JKT48Wrapped made with ❤️ by JKT48 Live</b></small></center>
        </div>
    `;

    // Tambahkan event listener untuk Total Top-Up
    const totalTopUpElement = document.querySelector('.total-topup');
    totalTopUpElement.addEventListener('click', () => {
        totalTopUpElement.classList.toggle('censored');
    });
}

$(document).ready(function () {
    createCard(decode);
    //setTimeout(() => createCanvasFromCard(), 100);
});

function createCanvasFromCard() {
    const cardBody = document.querySelector('.card-body');
    html2canvas(document.body, { 
        useCORS: true, 
        scale: window.devicePixelRatio,
        //scrollY: -window.scrollY,
        width: 1200, // Lebar yang diinginkan, misalnya lebar layar PC
        height: 961, // Tinggi yang diinginkan, misalnya tinggi layar PC
        windowWidth: 1200, // Lebar window yang diinginkan
        windowHeight: 961 // Tinggi window yang diinginkan 
    }).then(canvas => {
        // Buat wrapper untuk tombol agar berada di tengah
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('text-center');

        // Buat tombol untuk download
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download Image';
        downloadBtn.classList.add('btn', 'btn-primary', 'mt-3');

        // Tambahkan event listener ke tombol untuk mendownload canvas sebagai gambar
        downloadBtn.addEventListener('click', function() {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'jkt48-wrapped.png';
            link.href = image;
            link.click();
        });

        // Tambahkan tombol ke wrapper
        buttonWrapper.appendChild(downloadBtn);

        // Tambahkan wrapper ke halaman, misalnya di bawah cardBody
        cardBody.appendChild(buttonWrapper);
    });
}
