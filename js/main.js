const CACHE_NAME = 'cryptocoin_dinamic';
var dinamicCacheJSON = function () {};

const states = {
  coinsInfo: {},
  coinsList: {},
};

async function fetchCryptoCoinsInformation() {
  fetch('api/coins-list.json', { mode: 'cors' })
    .then((result) => {
      result.json().then((json) => {
        states.coinsInfo = json.data;
        dinamicCacheJSON();
        renderCards(json.data);
      });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {});
}

async function fetchCriptoCoins() {
  fetch('api/coins.json', { mode: 'cors' })
    .then((result) => {
      result.json().then((json) => {
        dinamicCacheJSON();
        states.coinsList = json.data;
      });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {});
}

let windowInstallation = null;
let btnInstall = document.getElementById('btn-install');
window.addEventListener('beforeinstallprompt', captureLoadWindow);

function captureLoadWindow(event) {
  windowInstallation = event;
}

function intallApp() {
  btnInstall.removeAttribute('hidden');
  btnInstall.addEventListener('click', function () {
    windowInstallation.prompt();

    windowInstallation.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('User has installed the progressive app');
      } else {
        console.log('User rejected to install!');
      }
    });
  });
}

function renderCards(coinsList) {
  const cardList = document.getElementById('card-list');
  Object.values(coinsList).forEach((cripto, _) => {
    let cardHtml = `
            <div id="card-${cripto.symbol.toLowerCase()}" class="col-sm-6 col-md-6 col-lg-4 card-cripto" onClick="javascript:showCoinDetails(\'${
      cripto.id
    }\');">
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-4" id="card-image">
                            <img src="${
                              cripto.logo
                            }" class="img-fluid img-logo-cripto rounded-start" alt="Criptocurrency logo">
                        </div>
                        <div class="col-6">
                            <div class="card-body">
                            <h5 class="card-title">${cripto.name}</h5>
                                                        
                            <p>${sanitizeCategories(cripto.category)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    cardList.innerHTML += cardHtml;
  });
}

function renderCoins(cripto, coinsInfo) {
  const html = `
        <div id="cripto-detail">
            <div class="container">
                <div class="row">
                    <div class="image-cripto-detail">
                        <img
                            src="${cripto.logo}"
                            alt=""
                        />
                    </div>

                    <div id="cripto-detail-body">
                        <div class="col-12">
                            <h1>${cripto.name}</h1>

                            <p>
                            <b>Descrição:</b> ${cripto.description}
                            </p>
                        </div>

                        ${renderUrls(cripto.urls)}

                        <!--<b>Circulação:</b> US ${
                          coinsInfo.circulating_supply
                        }-->
                    </div>
                </div>
            </div>
        </div>
    `;

  const render = document.getElementById('cripto-detail');
  render.innerHTML = html;
}

function renderUrls(urls) {
  const html = `
        <div class="col-12">
            ${renderMicroUrl('Reddit', urls.reddit)}
            ${renderMicroUrl('Twitter', urls.twitter)}
            ${renderMicroUrl('Website', urls.website)}
            ${renderMicroUrl('Source Code', urls.source_code)}
            ${renderMicroUrl('Documentação', urls.technical_doc)}
        </div>
    `;

  return html;
}

function renderMicroUrl(field, object) {
  if (object && object.length > 0) {
    return `
            <p>
                <b>${field}:</b> <a href="${object[0]}" target="_blank">${object[0]}</a>
            </p>
        `;
  } else {
    return ``;
  }
}

function showCoinDetails(criptoId) {
  const pageDetail = document.getElementById('details-page');
  pageDetail.style.display = 'block';
  let cripto = states.coinsInfo[criptoId];
  let details = states.coinsList;
  let coinsInfo = details.find((b) => b.id == criptoId);

  renderCoins(cripto, coinsInfo);
}

function returnToPage() {
  const pageDetail = document.getElementById('details-page');
  pageDetail.style.display = 'none';
}

function sanitizeCriptoDescription(description) {
  if (description && description.length > 150) {
    description = description.slice(0, 150) + '...';
  }

  return description;
}

function sanitizeTags(tags) {
  let tagsHtml = ``;

  if (tags) {
    tags.forEach((tag, index) => {
      if (tag && index <= 3) {
        tagsHtml += `<span class="badge bg-secondary">${tag}</span>`;
      } else {
        return;
      }
    });
  }

  return tagsHtml;
}

function sanitizeCategories(category) {
  let categoryHtml = ``;

  if (category && category === 'coin') {
    categoryHtml += `<span class="badge bg-coin-outline">${category}</span>`;
    localStorage[CACHE_NAME] = JSON.stringify(states);
  } else if (category && category === 'token') {
    categoryHtml += `<span class="badge bg-token-outline">${category}</span>`;
  }

  return categoryHtml;
}

fetchCryptoCoinsInformation();
fetchCriptoCoins();
