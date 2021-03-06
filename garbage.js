let motionStep = 0;
let isActive = true;
let isDisplayChanged = false;

const control = document.getElementById("control");
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const pageTransition = document.getElementById("page-transition");
const videos = document.querySelectorAll(".video");
const videoBox = document.querySelectorAll(".box");

next.addEventListener("click", () => {
  videos[motionStep].currentTime = 0;
  videos[motionStep].pause();
  isDisplayChanged ? basicDisplay() : moveNextVideo();
  isDisplayChanged = true;
});

prev.addEventListener("click", () => {
  videos[motionStep].currentTime = 0;
  videos[motionStep].pause();
  isDisplayChanged ? reverseBasicDisplay() : movePrevVideo(motionStep);
  isDisplayChanged = true;
});

function clockwiseRotation(num) {
  let tl = gsap.timeline({
    onStart: controlStop,
    onComplete: movedStatus,
    defaults: { duration: 3 },
  });
  tl.to(".box-1", movements[num])
    .to(".box-2", movements[(num + 3) % movements.length], "<")
    .to(".box-3", movements[(num + 2) % movements.length], "<")
    .to(".box-4", movements[(num + 1) % movements.length], "<");
}

function anticlockwiseRotation(num) {
  let tl = gsap.timeline({
    onStart: controlStop,
    onComplete: movedStatus,
    defaults: { duration: 3 },
  });
  tl.to(".box-1", movements[(num + 2) % movements.length])
    .to(".box-2", movements[(num + 1) % movements.length], "<")
    .to(".box-3", movements[num], "<")
    .to(".box-4", movements[(num + 3) % movements.length], "<");
}
//------------------------------------------------------------//

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

function controlStop() {
  next.disabled = true;
  prev.disabled = true;
  control.disabled = true;
}

function controlActive() {
  next.disabled = false;
  prev.disabled = false;
  control.disabled = false;
}

control.addEventListener("click", () => {
  if (!isDisplayChanged) {
    isDisplayChanged = !isDisplayChanged;
    videoBox[motionStep].classList.add("forward");
    enlargedDisplay();
  }

  if (isActive) {
    videos[motionStep].pause();
    control.textContent = "START";
  } else {
    videos[motionStep].play();
    control.textContent = "STOP";
  }
  isActive = !isActive;
});

function videoInit() {
  videos.forEach((video) => {
    video.addEventListener("ended", () => {
      basicDisplay();
    });
  });
}

videoInit();

function moveNextVideo() {
  clockwiseRotation(motionStep);
  motionStep++;
  if (motionStep > movements.length - 1) motionStep = 0;
}

function movePrevVideo() {
  anticlockwiseRotation(motionStep);
  motionStep--;
  if (motionStep < 0) motionStep = movements.length - 1;
}

function movedStatus() {
  videoBox[motionStep].classList.add("forward");
  controlActive();
  enlargedDisplay();
}

function enlargedDisplay() {
  const tl = gsap.timeline({ onComplete: start });
  tl.to(".box", { scale: 0 }).to(".forward", {
    transform: "translate3d(0,0,0)",
    scale: 1,
    width: "100%",
    height: "100%",
  });
}

function basicDisplay() {
  const tl = gsap.timeline({
    onComplete: moveNextVideo,
  });
  tl.to(".forward", {
    transform: "translate3d(0, 25px, 150px)",
    width: "300px",
    height: "200px",
  }).to(".box", { scale: 1 });
  videoBox[motionStep].classList.remove("forward");
}

function reverseBasicDisplay() {
  const tl = gsap.timeline({
    onComplete: movePrevVideo,
  });
  tl.to(".forward", {
    transform: "translate3d(0, 25px, 150px)",
    width: "300px",
    height: "200px",
  }).to(".box", { scale: 1 });
  videoBox[motionStep].classList.remove("forward");
}

function start() {
  videos[motionStep].play();
  control.textContent = "STOP";
  isActive = true;
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
    // .to(".container-pos", { transformOrigin: "center", scale: 0.01 })
    .to(".container-pos", { scale: 1, z: 300, rotate: "360deg", duration: 2 });
});
