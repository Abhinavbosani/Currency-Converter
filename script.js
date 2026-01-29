import { API_KEY } from "./config.js";

const URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`

let fromSelect;
let toSelect;
let imgs;
let amount;
let result;

const resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", () => {
  amount.value = "1";

  fromSelect.value = "USD";
  toSelect.value = "INR";

  updateFlag(fromSelect, imgs[0]);
  updateFlag(toSelect, imgs[1]);

  result.innerText = "Enter amount and click Convert";
});

window.onload = async () => {
    const rates = await getExchangeRate();
    const submitBtn = document.getElementById("convert-btn");

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault(); 
        convertCurrency();
    });

    fromSelect = document.getElementById("from");
    toSelect = document.getElementById("to");
    imgs = document.querySelectorAll(".select-container img");
    amount = document.getElementById("amount");
    result = document.getElementById("result");
    amount.value = "1";

    for (let currency in rates) {
        fromSelect.add(new Option(currency, currency));
        toSelect.add(new Option(currency, currency));
    }

    fromSelect.value = "USD";
    toSelect.value = "INR";

    updateFlag(fromSelect, imgs[0]);
    updateFlag(toSelect, imgs[1]);

    fromSelect.addEventListener("change", () =>
        updateFlag(fromSelect, imgs[0])
    );

    toSelect.addEventListener("change", () =>
        updateFlag(toSelect, imgs[1])
    );
};

function updateFlag(selectEl, imgEl) {
    const currency = selectEl.value;
    const countryCode = currency.slice(0, 2);

    imgEl.src = `https://flagsapi.com/${countryCode}/flat/32.png`;
}




document.getElementById("swap").addEventListener("click", () => {
    const from = document.getElementById("from");
    const to = document.getElementById("to");

    [from.value, to.value] = [to.value, from.value];
    updateFlag(from, document.querySelectorAll(".select-container img")[0]);
    updateFlag(to, document.querySelectorAll(".select-container img")[1]);
});

async function convertCurrency() {
    const rates = await getExchangeRate();

    const amount = parseFloat(document.getElementById("amount").value);
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;

    if (isNaN(amount) || amount <= 0) {
        document.getElementById("result").innerText = "Enter valid amount";
        return;
    }

    const converted =
        (amount / rates[from]) * rates[to];

    document.getElementById("result").innerText =
        `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
}


async function getExchangeRate() {
    let response = await fetch(URL)
    let data = await response.json()
    return data.conversion_rates
}
