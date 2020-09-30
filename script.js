const td = document.getElementsByTagName("td");
const socket = io("https://tictactoe-server1.herokuapp.com");

const homepage = document.querySelector(".homepage");
const playing_page = document.querySelector(".playing_mode");
const waiting_page = document.querySelector(".waiting_page");
const join_page = document.querySelector(".join_page");
const join_form = document.querySelector(".join_form");
const confirm_prompt = document.querySelector(".confirm_prompt");
const reject_btn = document.querySelector(".reject_btn");
const allow_btn = document.querySelector(".allow_btn");
const alert_p = document.querySelector(".alert_p");
const request_result_view = document.querySelector(".request_result_view");
const playing_table = document.querySelector(".playing_table");
const confirm_replay_page = document.querySelector(".confirm_replay");
const quit_game_btn = document.querySelector(".quit_game_btn");
const game_result_p = document.querySelector(".game_result_p");
let myTurn = true;
//hosting code
const code = (Math.random() * new Date()).toFixed(0);
let join_code = "";

//btn
const joinBtn = document.querySelector(".join_btn");
const hostBtn = document.querySelector(".host_btn");

// event listeners
quit_game_btn.addEventListener("click", () => {
  quitGame();
});

allow_btn.addEventListener("click", () => {
  confirm_prompt.style.display = "none";
  playing_page.style.display = "block";
  socket.emit("let_user_in", code);
  statView();
  init();
});

reject_btn.addEventListener("click", () => {
  confirm_prompt.style.display = "none";
  waiting_page.style.display = "block";

  socket.emit("rejected", code);
});

hostBtn.addEventListener("click", () => {
  const p = document.createElement("p");
  p.innerText = `Join code is ${code}`;
  waiting_page.appendChild(p);
  waiting_page.style.display = "block";
  homepage.style.display = "none";

  //listening for user to join
  socket.on("user_joined", (data) => {
    if (data.code === code) {
      waiting_page.style.display = "none";
      confirm_prompt.style.display = "block";
      alert_p.innerText = `${data.username} wants to join your game.`;
      alert_p.style.color = "green";
    }
  });
});

joinBtn.addEventListener("click", () => {
  homepage.style.display = "none";
  join_page.style.display = "block";
});

join_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.querySelector(".join_code_input").value;
  const username = document.querySelector(".username_input").value;
  join_code = code;
  request_result_view.innerText = "Waiting for user to approve your request...";
  socket.emit("join_game", { code: code, username: username });

  socket.on("join_request_accepted", (data) => {
    if (data === code) {
      statView();
      join_page.style.display = "none";
      playing_page.style.display = "block";
      const alertP = document.createElement("p");
      alertP.innerText = "Your request has been accepted.";
      playing_page.appendChild(alertP);
      myTurn = false;
      init();

      setTimeout(() => {
        playing_page.removeChild(alertP);
      }, 1500);
    }
  });

  socket.on("join_request_rejected", (data) => {
    if (data === code) {
      request_result_view.innerText = "Oops, your request has been rejected.";
      request_result_view.style.color = "red";
    }
  });
});

//

let currentPlayer = "X";

function run(item) {
  toggleStat();
  item.innerText = currentPlayer;
}

function gameOverChecker() {
  for (let e in td) {
    if (td[0].innerText === td[1].innerText && td[0].innerText !== "") {
      if (td[1].innerText === td[2].innerText) {
        confirm_replay_page.style.display = "block";
        game_result_p.innerText = `You Win`;
        playing_page.style.display = "none";
        sendGameOverMessage();
        clearBoard();
      }
    }
    if (td[3].innerText === td[4].innerText && td[3].innerText !== "") {
      if (td[4].innerText === td[5].innerText) {
        confirm_replay_page.style.display = "block";
        game_result_p.innerText = `You Win`;
        playing_page.style.display = "none";
        sendGameOverMessage();
        clearBoard();
      }
    }
    if (td[6].innerText === td[7].innerText && td[6].innerText !== "") {
      if (td[7].innerText === td[8].innerText) {
        confirm_replay_page.style.display = "block";
        game_result_p.innerText = `You Win`;
        playing_page.style.display = "none";
        sendGameOverMessage();
        clearBoard();
      }
    }
    if (td[0].innerText === td[3].innerText && td[0].innerText !== "") {
      if (td[3].innerText === td[6].innerText) {
        confirm_replay_page.style.display = "block";
        game_result_p.innerText = `You Win`;
        playing_page.style.display = "none";
        sendGameOverMessage();
        clearBoard();
      }
    }
    if (td[1].innerText === td[4].innerText && td[1].innerText !== "") {
      if (td[4].innerText === td[7].innerText) {
        confirm_replay_page.style.display = "block";
        playing_page.style.display = "none";
        game_result_p.innerText = `You Win`;
        sendGameOverMessage();
        clearBoard();
      }
    }
    if (td[2].innerText === td[5].innerText && td[2].innerText !== "") {
      if (td[5].innerText === td[8].innerText) {
        confirm_replay_page.style.display = "block";
        playing_page.style.display = "none";
        game_result_p.innerText = `You Win`;
        sendGameOverMessage();
        clearBoard();
      }
    }
    if (td[0].innerText === td[4].innerText && td[0].innerText !== "") {
      if (td[4].innerText === td[8].innerText) {
        confirm_replay_page.style.display = "block";
        playing_page.style.display = "none";
        game_result_p.innerText = `You Win`;
        sendGameOverMessage();
        clearBoard();
      }
    }
    if (td[2].innerText === td[4].innerText && td[2].innerText !== "") {
      if (td[4].innerText === td[6].innerText) {
        confirm_replay_page.style.display = "block";
        playing_page.style.display = "none";
        game_result_p.innerText = `You Win`;
        sendGameOverMessage();
        clearBoard();
      }
    } else {
      return false;
    }
  }
}

function game(item) {
  if (myTurn) {
    run(item);
    gameOverChecker();
    const itemIndex = item.getAttribute("index");
    socket.emit("my_strike", { code, join_code, itemIndex });
    myTurn = false;
  }
  if (item.innerText === "O") {
    item.style.color = "red";
  }
  if (item.innerText === "X") {
    item.style.color = "green";
  }
}

function init() {
  for (let e in td) {
    const item = td[e];
    item.addEventListener("click", (e) => {
      game(item);
    });
  }
}

socket.on("opponent_striked", (data) => {
  if (data.join_code === "") {
    if (data.code === join_code) {
      const playPos = parseInt(data.itemIndex);
      td[playPos - 1].innerText = "O";
      myTurn = true;
      td[playPos - 1].style.color = "red";
      toggleStat();
    }
  } else {
    if (data.join_code === code) {
      const playPos = parseInt(data.itemIndex);
      td[playPos - 1].innerText = "O";
      myTurn = true;
      td[playPos - 1].style.color = "red";
      toggleStat();
    }
  }
});

socket.on("you_lose", (data) => {
  console.log(data);
  if (data.code === code || data.code === join_code) {
    confirm_replay_page.style.display = "block";
    playing_page.style.display = "none";
    game_result_p.innerText = "You lose!";
    clearBoard();
  }
});

function statView() {
  const turnStatusP = document.querySelector(".turn_status");

  if (join_code === "") {
    turnStatusP.innerText = "Your Turn";
    turnStatusP.style.color = "green";
  } else {
    turnStatusP.innerText = "Opponent Turn";
    turnStatusP.style.color = "red";
  }
}

function toggleStat() {
  const turnStatusP = document.querySelector(".turn_status");

  if (turnStatusP.innerText === "Your Turn") {
    turnStatusP.innerText = "Opponent Turn";
    turnStatusP.style.color = "red";
  } else {
    turnStatusP.innerText = "Your Turn";
    turnStatusP.style.color = "green";
  }
}

function toggleGame() {
  playing_page.style.display = "none";
  waiting_page.style.display = "none";
  join_page.style.display = "none";
  confirm_prompt.style.display = "none";
  confirm_replay_page.style.display = "none";
}

function clearBoard() {
  for (let e in td) {
    const item = td[e];
    item.innerText = "";
  }
}

function quitGame() {
  window.location.reload();
}

function sendGameOverMessage() {
  const CODE = join_code === "" ? code : join_code;
  socket.emit("game_over", { msg: "", code: CODE });
}

toggleGame();
