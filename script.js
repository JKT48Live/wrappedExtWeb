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

function toArray(v) {
  return Array.isArray(v) ? [...v] : v ? [v] : [];
}

function createCard(data) {
    data = JSON.parse(data);
    const cardBody = document.querySelector('.card-body');
    let topSetlists  = toArray(data?.data?.theater?.topSetlists);
    let mostApplied  = toArray(data?.data?.theater?.mostApplied);
    let topVCMembers = toArray(data?.data?.videoCall?.topMembers);
    let top2SMembers = toArray(data?.data?.twoShot?.topMembers);
    const isAlltime = (isNumeric(data.year)) ? false : true;
    const selectedYear = (!isAlltime) ? ` ${data.year}` : `<br/>${data.year}`;
    const yearList = data.data.years;
    const yrs = Array.isArray(yearList) ? `(${yearList[0]} - ${yearList[yearList.length - 1]})` : "";
    const showYearList = (isAlltime) ? 
    ` <small style="font-size: 15px; position: relative; top: -20px; display: inline-block;" class="poppins-font">${yrs}</small>` : ``;
    cardBody.innerHTML = `
        <h2 class="card-title text-center modak-regular" style="font-size: 60px;">JKT48 Wrapped${selectedYear}${showYearList}</h2>
        <h5 class="text-center poppins-font">[ ${data.data.name} ]</h5><br>
        <center>
            <img src="https://wsrv.nl/?output=png&af&l=6&url=${data.data.oshiPic}" width="50%" class="img-fluid rounded-image"><br>
            <p class="poppins-font"><b>Oshi:</b> ${data.data.oshi}</p>
        </center><br>
        <div class="row poppins-font">
            <!-- Title -->
            <div class="col-12 text-center mt-3 mobile-spacing">
                <b>• Theater</b>
            </div>

            <!-- Left Column -->
            <div class="col-md-6 text-start theater-column">
                <div>
                    <b>Top Setlists (Win):</b>
                </div>
                <div class="theater-slot">
                    ${Array.isArray(topSetlists) ? topSetlists.join('<br>') : topSetlists}
                </div>
            </div>

            <!-- Right Column -->
            <div class="col-md-6 text-start theater-column">
                <div>
                    <b>Most Applied Setlists:</b>
                </div>
                <div class="theater-slot">
                    ${Array.isArray(mostApplied) ? mostApplied.join('<br>') : mostApplied}
                </div>
            </div>

            <!-- Winrate Center -->
            <div class="col-12 text-center mt-3 mobile-spacing">
                <div class="winrate-box">
                    <b>🏆 Winrate:</b> ${data.data.theater.winrate.rate}<br>
                    (<b>Win:</b> ${data.data.theater.winrate.detail.menang}x, 
                    <b>Lose:</b> ${data.data.theater.winrate.detail.kalah}x)
                </div>
            </div>
        </div><br>
        <div class="row poppins-font">
            <div class="col-md-6 mng-column">
                <div class="slot-title">
                    <b>• Video Call / MnG</b>
                </div>
                <div class="slot slot-top mobile-bottom">
                    <b>Top Video Call / MnG:</b><br>
                    ${Array.isArray(topVCMembers) ? topVCMembers.join('<br>') : topVCMembers}
                </div>
                <div class="slot slot-total mobile-bottom">
                    <b>Total Video Call / MnG:</b><br>
                    ${data?.data?.videoCall?.totalTickets ?? 0} tiket
                </div>
            </div>

            <div class="col-md-6 mng-column">
                <div class="slot-title">
                    <b>• Two Shot / MnG</b>
                </div>
                <div class="slot slot-top mobile-bottom">
                    <b>Top Two Shot / MnG:</b><br>
                    ${Array.isArray(top2SMembers) ? top2SMembers.join('<br>') : top2SMembers}
                </div>
                <div class="slot slot-total">
                    <b>Total Two Shot / MnG:</b><br>
                    ${data?.data?.twoShot?.totalTickets ?? 0} tiket
                </div>
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

    const totalTopUpElement = document.querySelector('.total-topup');
    totalTopUpElement.addEventListener('click', () => {
        totalTopUpElement.classList.toggle('censored');
    });
}

$(document).ready(function () {
    createCard(decode);
    setTimeout(() => createCanvasFromCard(), 100);
});

function createCanvasFromCard() {
    const cardBody = document.querySelector('.card-body');
    html2canvas(document.body, {
    useCORS: true,
    allowTaint: false,
    scale: window.devicePixelRatio,
    scrollX: 0,
    scrollY: 0,
    windowWidth: 1300,
    windowHeight: 1300
})
.then(canvas => {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('text-center');

        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Screenshot';
        downloadBtn.classList.add('btn', 'btn-light', 'mt-3');

        downloadBtn.addEventListener('click', function() {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'jkt48-wrapped.png';
            link.href = image;
            link.click();
        });

        buttonWrapper.appendChild(downloadBtn);
        cardBody.appendChild(buttonWrapper);
    });
}
