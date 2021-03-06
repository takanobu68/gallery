let motionStep = 0;
let isActive = false;
let isDisplayChanged = false;

const control = document.getElementById("control");
const rotationBtns = [
  document.getElementById("normal"),
  document.getElementById("reverse"),
];
const pageTransition = document.getElementById("page-transition");
const videos = document.querySelectorAll(".video");
const videoBox = document.querySelectorAll(".box");

// 初期設定
function init() {
  for (const rotationBtn of rotationBtns) {
    rotationBtn.addEventListener("click", (e) => {
      // 押したボタンのidを渡すことで方向を指示する
      // normalかreverseが渡される
      checkDirection(e.target.getAttribute("id"));
    });
  }

  for (const video of videos) {
    // 動画の終了時に正回転で配置を変える指示
    video.addEventListener("ended", () => {
      changeDisplay("normal");
    });
  }

  // START(再生ボタンのイベント)
  control.addEventListener("click", () => {
    // 再生用に拡大していなければ、拡大させる命令
    // 初期配置時のみ必要となる
    // 一度でもコントロールボタンを押した場合
    // isDisplayChanged === true
    // になるため実行されない
    if (!isDisplayChanged) {
      isDisplayChanged = true;
      videoBox[motionStep].classList.add("forward");
      enlargedDisplay();
    }

    // 動画の再生用 isActiveで管理、
    // isActive = !isActive; を毎回反転させる。
    isActive ? stopVideo() : startVideo();
    isActive = !isActive;
  });
}

// 初期設定関数の実行
init();

/* 動画操作の関数 // 後にファイル分けを行う予定// */

// 位置を変える前に動画の再生状態を初期に戻す。
function resetVideo() {
  videos[motionStep].currentTime = 0;
  videos[motionStep].pause();
}

// 動画再生
function startVideo() {
  videos[motionStep].play();
  control.textContent = "STOP";
}

// 動画の一時停止
function stopVideo() {
  videos[motionStep].pause();
  control.textContent = "START";
}

/* 動画操作の関数 END */

// 回転方法を決める関数
function checkDirection(direction) {
  resetVideo();
  // 画面が拡大されていたら
  isDisplayChanged
    ? // 画面を初期の大きさに戻す
      changeDisplay(direction)
    : // 画面が拡大されてない場合は
    // directionで渡された値を調べる
    direction === "normal"
    ? normalRotation() // directionがnormalの場合
    : reverseRotation(); // directionがreverse場合
}

// 画面を初期の配置と大きさに戻す関数
function changeDisplay(direction) {
  const tl = gsap.timeline({
    // 動作完了後にdirectionの値を確認
    // directionが"normal"であれば正回転
    // directionが"reverse"であれば逆回転
    // 二択なので、normalでなければreverseとなる
    onComplete: direction === "normal" ? normalRotation : reverseRotation,
  });
  tl.to(".forward", resize.base).to(".box", { scale: 1 }, 0.1);
  videoBox[motionStep].classList.remove("forward");
}

// 正回転(direction === "normal")時の移動関数
function normalRotation() {
  normal(motionStep);
  motionStep++;
  if (motionStep > movements.length - 1) motionStep = 0;
}

function normal(num) {
  let tl = gsap.timeline({
    onStart: btnControl("invalid"),
    onComplete: movedStatus,
    defaults: { duration: 3 },
  });
  tl.to(".box-1", movements[num])
    .to(".box-2", movements[(num + 3) % movements.length], "<")
    .to(".box-3", movements[(num + 2) % movements.length], "<")
    .to(".box-4", movements[(num + 1) % movements.length], "<");
}

// 逆回転(direction === "reverse")時の移動関数
function reverseRotation() {
  reverse(motionStep);
  motionStep--;
  if (motionStep < 0) motionStep = movements.length - 1;
}

function reverse(num) {
  let tl = gsap.timeline({
    onStart: btnControl("invalid"),
    onComplete: movedStatus,
    defaults: { duration: 3 },
  });
  tl.to(".box-1", movements[(num + 2) % movements.length])
    .to(".box-2", movements[(num + 1) % movements.length], "<")
    .to(".box-3", movements[num], "<")
    .to(".box-4", movements[(num + 3) % movements.length], "<");
}

/* 移動、大きさ変更のオブジェクト // 後にファイル分けを行う予定// */
const movements = [
  { x: -400, y: 0, z: -25, rotateY: "75deg", scale: 1 },
  {
    x: 0,
    y: -100,
    z: -200,
    scale: 1.5,
    rotateY: 0,
  },
  { x: 400, y: 0, z: -25, rotateY: "-75deg", scale: 1 },
  { x: 0, y: 25, z: 150, rotateY: 0 },
];

const resize = {
  base: {
    transform: "translate3d(0, 25px, 150px)",
    width: "300px",
    height: "200px",
  },
  expansion: {
    transform: "translate3d(0,0,0)",
    scale: 1,
    width: "100%",
    height: "100%",
  },
};
/* 移動、大きさ変更のオブジェクト END */

// 移動が完了した後の設定関数
function movedStatus() {
  isDisplayChanged = true;
  isActive = true;
  videoBox[motionStep].classList.add("forward");
  enlargedDisplay();
  btnControl("valid");
}

// 再生画面の拡大
function enlargedDisplay() {
  const tl = gsap.timeline({ onComplete: startVideo });
  tl.to(".box", { scale: 0 }).to(".box.forward", resize.expansion, "<");
}

// ボタンのコントロール関数
// 再生画面移動中にボタンを無効化する
function btnControl(status) {
  btnStatus = status === "invalid" ? true : false;
  normal.disabled = btnStatus;
  reverse.disabled = btnStatus;
  control.disabled = btnStatus;
}

pageTransition.addEventListener("click", () => {
  const pageMove = gsap.timeline();
  pageMove
    .to(".three-container", { filter: "blur(20px)", duration: 3 })
    .to(
      ".container-pos",
      {
        y: 80,
        z: -500,
        scale: 0.5,
        transformStyle: "preserve-3d",
        duration: 3,
      },
      "<"
    )
    .to(".section", { backgroundColor: "#000" }, "<")
    .to(".three-container", { display: "none" })
    .to(".door", { display: "block" })
    .to(".door", { opacity: 1 }, "<")
    .to(".door", { rotateX: 0, duration: 1 })
    .to(".container-pos", { scale: 1, z: 300, rotate: "360deg", duration: 2 });
});
