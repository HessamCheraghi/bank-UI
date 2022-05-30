"use strict";var currentAccount,timer,account1={owner:"حسام الدین چراغی",movements:[2e5,455e3,-306500,25e4,-642e3,-133900,791e3,13e4],interestRate:1.2,username:"js",pin:1111,movementsDates:["2021-11-18T21:31:17.178Z","2021-12-23T07:42:02.383Z","2022-01-28T09:15:04.904Z","2022-04-01T10:17:24.185Z","2022-05-08T14:11:59.604Z","2022-05-27T17:01:17.194Z","2022-07-11T23:36:17.929Z","2022-07-12T10:51:36.790Z"],currency:"IRR",locale:"fa-IR"},account2={owner:"محمد محمدی",movements:[5e4,34e4,-15e4,-79e4,-321e3,1e6,85e3,-3e4],interestRate:1.5,username:"go",pin:2222,movementsDates:["2021-11-01T13:15:33.035Z","2021-11-30T09:48:16.867Z","2021-12-25T06:04:23.907Z","2022-01-25T14:18:46.235Z","2022-02-05T16:33:06.386Z","2022-04-10T14:43:26.374Z","2022-06-25T18:49:59.371Z","2022-07-26T12:01:20.894Z"],currency:"IRR",locale:"fa-IR"},accounts=[account1,account2],body=document.querySelector("body"),labelWelcome=document.querySelector(".welcome"),labelDate=document.querySelector(".date"),labelBalance=document.querySelector(".balance__value"),labelSumIn=document.querySelector(".summary__value--in"),labelSumOut=document.querySelector(".summary__value--out"),labelSumInterest=document.querySelector(".summary__value--interest"),labelTimer=document.querySelector(".timer"),containerApp=document.querySelector(".app"),containerMovements=document.querySelector(".movements"),btnLogin=document.querySelector(".login__btn"),btnTransfer=document.querySelector(".form__btn--transfer"),btnLoan=document.querySelector(".form__btn--loan"),btnClose=document.querySelector(".form__btn--close"),btnSort=document.querySelector(".btn--sort"),inputLoginUsername=document.querySelector(".login__input--user"),inputLoginPin=document.querySelector(".login__input--pin"),inputTransferTo=document.querySelector(".form__input--to"),inputTransferAmount=document.querySelector(".form__input--amount"),inputLoanAmount=document.querySelector(".form__input--loan-amount"),inputCloseUsername=document.querySelector(".form__input--user"),inputClosePin=document.querySelector(".form__input--pin"),logOutButton=document.querySelector(".logout__btn"),formatMovmentDate=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"fa-IR",t=function(e,n){return Math.round(Math.abs(e-n)/864e5)},r=t(new Date,e);return 0===r?"امروز":0===r?"دیروز":r<=7?"".concat(r," روز پیش"):new Intl.DateTimeFormat(n).format(e)},formatCurrency=function(e,n,t){return"".concat(new Intl.NumberFormat(n).format(e)," ریال")},displayMovements=function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];containerMovements.innerHTML="";var t=n?e.movements.slice().sort((function(e,n){return e-n})):e.movements;t.forEach((function(n,t){var r=n>0?"deposit":"withdrawal",o=new Date(e.movementsDates[t]),u=formatMovmentDate(o,e.locale),c=formatCurrency(n,e.locale,e.currency),a='\n    <div class="movements__row">\n      <div class="movements__value">'.concat(c,'</div>\n      <div class="movements__type movements__type--').concat(r,'">\n      ').concat(n>0?"واریز به حساب":"برداشت از حساب",'\n      </div>\n      <div class="movements__date">').concat(u,"</div>\n    </div>");containerMovements.insertAdjacentHTML("afterbegin",a)}))},calcDisplaySummary=function(e){var n=e.movements.filter((function(e){return e>0})).reduce((function(e,n){return e+n}),0);labelSumIn.textContent=formatCurrency(n,e.locale,e.currency);var t=e.movements.filter((function(e){return e<0})).reduce((function(e,n){return e+n}),0);labelSumOut.textContent=formatCurrency(Math.abs(t),e.locale,e.currency)},calcDisplayBalance=function(e){e.balance=e.movements.reduce((function(e,n){return e+n}),0),labelBalance.textContent=formatCurrency(e.balance,e.locale,e.currency)},updateUI=function(e){calcDisplayBalance(e),displayMovements(e),calcDisplaySummary(e)},startLogOutTimer=function(){var e=function(){var e=String(Math.trunc(n/60)),r=String(Math.trunc(n%60));labelTimer.textContent=" ".concat(e," دقیقه و ").concat(r," ثانیه "),0===n&&(clearInterval(t),console.log("logged out user => ",currentAccount.owner),labelWelcome.textContent="برای دیدن اطلاعات حساب ابتدا وارد شوید",body.classList.remove("logged-in"),currentAccount=void 0),n--},n=300;e();var t=setInterval(e,1e3);return t};btnLogin.addEventListener("click",(function(e){if(e.preventDefault(),(null==(currentAccount=accounts.find((function(e){return e.username===inputLoginUsername.value})))?void 0:currentAccount.pin)===+inputLoginPin.value){console.log("logged in user => ",currentAccount.owner),labelWelcome.textContent="سلام ".concat(currentAccount.owner.split(" ")[0]," خوش آمدی"),body.classList.add("logged-in");var n=new Date;labelDate.textContent=new Intl.DateTimeFormat(currentAccount.locale,{hour:"2-digit",minute:"2-digit",day:"numeric",month:"numeric",year:"numeric"}).format(n),inputLoginUsername.value=inputLoginPin.value="",inputLoginUsername.blur(),inputLoginPin.blur(),timer&&clearInterval(timer),timer=startLogOutTimer(),updateUI(currentAccount)}})),btnTransfer.addEventListener("click",(function(e){e.preventDefault();var n=+inputTransferAmount.value,t=accounts.find((function(e){return e.username===inputTransferTo.value}));console.log("requesting transfer",n,"to",t.owner),n>0&&t&&(null==currentAccount?void 0:currentAccount.balance)>=n&&(null==t?void 0:t.username)!==currentAccount.username&&(console.log("Transfer is valid!"),currentAccount.movements.push(-n),t.movements.push(n),currentAccount.movementsDates.push((new Date).toISOString()),t.movementsDates.push((new Date).toISOString()),inputTransferAmount.value=inputTransferTo.value="",inputTransferAmount.blur(),inputTransferTo.blur(),updateUI(currentAccount),clearInterval(timer),timer=startLogOutTimer())})),btnLoan.addEventListener("click",(function(e){e.preventDefault();var n=Math.floor(inputLoanAmount.value);n>0&&currentAccount.movements.some((function(e){return e>=.1*n}))&&(console.log("loan request accepted"),currentAccount.movements.push(n),currentAccount.movementsDates.push((new Date).toISOString()),inputLoanAmount.value="",inputLoanAmount.blur(),setTimeout((function(){updateUI(currentAccount)}),1500)),clearInterval(timer),timer=startLogOutTimer()})),btnClose.addEventListener("click",(function(e){if(e.preventDefault(),currentAccount.username===inputCloseUsername.value&&currentAccount.pin===+inputClosePin.value){console.log("deleted",currentAccount.owner);var n=accounts.findIndex((function(e){return e.username===currentAccount.username}));accounts.splice(n,1),body.classList.remove("logged-in"),inputCloseUsername.value=inputClosePin.value="",inputCloseUsername.blur(),inputClosePin.blur(),labelWelcome.textContent="برای دیدن اطلاعات حساب ابتدا وارد شوید"}}));var sorted=!1;btnSort.addEventListener("click",(function(){displayMovements(currentAccount,sorted=!sorted)})),logOutButton.addEventListener("click",(function(){body.classList.remove("logged-in"),inputCloseUsername.value=inputClosePin.value="",inputCloseUsername.blur(),inputClosePin.blur(),labelWelcome.textContent="برای دیدن اطلاعات حساب ابتدا وارد شوید"}));
//# sourceMappingURL=index.9f38120a.js.map
