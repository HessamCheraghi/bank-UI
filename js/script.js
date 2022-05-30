"use strict";

const account1 = {
  owner: "حسام الدین چراغی",
  movements: [
    200000, 455000, -306500, 250000, -642000, -133900, 791000, 130000,
  ],
  interestRate: 1.2, // %
  username: "js",
  pin: 1111,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-27T17:01:17.194Z",
    "2022-07-11T23:36:17.929Z",
    "2022-07-12T10:51:36.790Z",
  ],
  currency: "IRR",
  locale: "fa-IR",
};

const account2 = {
  owner: "محمد محمدی",
  movements: [50000, 340000, -150000, -790000, -321000, 1000000, 85000, -30000],
  interestRate: 1.5,
  username: "go",
  pin: 2222,

  movementsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2021-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2022-07-26T12:01:20.894Z",
  ],
  currency: "IRR",
  locale: "fa-IR",
};

const accounts = [account1, account2];

const body = document.querySelector("body");
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const logOutButton = document.querySelector(".logout__btn");
const formatMovmentDate = function (date, locale = "fa-IR") {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "امروز";
  if (daysPassed === 0) return "دیروز";
  if (daysPassed <= 7) return `${daysPassed} روز پیش`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return `${new Intl.NumberFormat(locale).format(value)} ریال`;
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";

  const movsToDisplay = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movsToDisplay.forEach(function (mov, i) {
    const movementType = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovmentDate(date, account.locale);

    const formattedMovment = formatCurrency(
      mov,
      account.locale,
      account.currency
    );

    const html = `
    <div class="movements__row">
      <div class="movements__value">${formattedMovment}</div>
      <div class="movements__type movements__type--${movementType}">
      ${mov > 0 ? "واریز به حساب" : "برداشت از حساب"}
      </div>
      <div class="movements__date">${displayDate}</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );

  const out = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    account.locale,
    account.currency
  );
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(
    (accumulator, movement) => accumulator + movement,
    0
  );
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

const updateUI = function (currentAccount) {
  calcDisplayBalance(currentAccount);

  displayMovements(currentAccount);

  calcDisplaySummary(currentAccount);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60));
    const sec = String(Math.trunc(time % 60));
    labelTimer.textContent = ` ${min} دقیقه و ${sec} ثانیه `;
    if (time === 0) {
      clearInterval(timer);
      console.log("logged out user => ", currentAccount.owner);

      labelWelcome.textContent = "برای دیدن اطلاعات حساب ابتدا وارد شوید";
      body.classList.remove("logged-in");
      currentAccount = undefined;
    }
    time--;
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    console.log("logged in user => ", currentAccount.owner);

    labelWelcome.textContent = `سلام ${
      currentAccount.owner.split(" ")[0]
    } خوش آمدی`;
    body.classList.add("logged-in");

    const now = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    inputLoginUsername.value = inputLoginPin.value = "";

    inputLoginUsername.blur();
    inputLoginPin.blur();

    if (timer) clearInterval(timer);

    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    (account) => account.username === inputTransferTo.value
  );
  console.log("requesting transfer", amount, "to", receiverAccount.owner);

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount?.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    console.log("Transfer is valid!");

    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferAmount.blur();
    inputTransferTo.blur();
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((movement) => movement >= amount * (10 / 100))
  ) {
    console.log("loan request accepted");
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
    setTimeout(function () {
      updateUI(currentAccount);
    }, 1500);
  }

  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    console.log("deleted", currentAccount.owner);
    const index = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );
    accounts.splice(index, 1);

    body.classList.remove("logged-in");
    inputCloseUsername.value = inputClosePin.value = "";
    inputCloseUsername.blur();
    inputClosePin.blur();
    labelWelcome.textContent = "برای دیدن اطلاعات حساب ابتدا وارد شوید";
  }
});

let sorted = false;
btnSort.addEventListener("click", () => {
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});

logOutButton.addEventListener("click", () => {
  body.classList.remove("logged-in");
  inputCloseUsername.value = inputClosePin.value = "";
  inputCloseUsername.blur();
  inputClosePin.blur();
  labelWelcome.textContent = "برای دیدن اطلاعات حساب ابتدا وارد شوید";
});
