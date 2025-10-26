const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let uploadedImg = null;
let currentStyle = null;

let hairX=0, hairY=0, hairScale=0.6;
let isDragging=false, dragOffsetX=0, dragOffsetY=0;

document.getElementById("imageUpload").addEventListener("change", function(){
  const file = this.files[0];
  if(!file) return alert("Select an image");
  const reader = new FileReader();
  reader.onload = function(e){
    const img = new Image();
    img.onload = function(){
      canvas.width = Math.min(img.width, 500);
      canvas.height = Math.min(img.height,500);
      uploadedImg = img;
      hairX = canvas.width/2; hairY = 0;
      draw();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

function applyStyle(path){
  if(!uploadedImg) return alert("Upload image first!");
  currentStyle = new Image();
  currentStyle.onload = draw;
  currentStyle.src = path;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(uploadedImg) ctx.drawImage(uploadedImg,0,0,canvas.width,canvas.height);
  if(currentStyle){
    const w = canvas.width*hairScale;
    const h = w*0.8;
    ctx.drawImage(currentStyle, hairX - w/2, hairY, w, h);
  }
}

// Drag & resize
canvas.addEventListener("mousedown", e=>{
  if(!currentStyle) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const w = canvas.width*hairScale;
  const h = w*0.8;
  if(mx >= hairX - w/2 && mx <= hairX + w/2 && my>=hairY && my<=hairY+h){
    isDragging=true; dragOffsetX=mx-hairX; dragOffsetY=my-hairY;
    canvas.style.cursor="grabbing";
  }
});

canvas.addEventListener("mousemove", e=>{
  if(!isDragging) return;
  const rect = canvas.getBoundingClientRect();
  hairX = e.clientX - rect.left - dragOffsetX;
  hairY = e.clientY - rect.top - dragOffsetY;
  draw();
});

canvas.addEventListener("mouseup", ()=>{ isDragging=false; canvas.style.cursor="grab"; });
canvas.addEventListener("mouseleave", ()=>{ isDragging=false; canvas.style.cursor="grab"; });
canvas.addEventListener("wheel", e=>{
  if(!currentStyle) return;
  hairScale += (e.deltaY<0?0.05:-0.05);
  if(hairScale<0.1) hairScale=0.1;
  draw();
});
