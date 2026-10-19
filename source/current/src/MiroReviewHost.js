const stage=document.querySelector('#review-stage');
const frame=document.querySelector('#review-frame');
const notice=document.querySelector('#review-narrow');
const label=document.querySelector('#review-size');
const buttons=[...document.querySelectorAll('[data-width]')];
let width=360;
function render(){
  const style=getComputedStyle(stage);
  const available=stage.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
  frame.style.width=width+'px';
  frame.hidden=available<width;
  notice.hidden=!frame.hidden;
  label.textContent=width+' CSS px'+(frame.hidden?' · расширьте окно':'');
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.width)===width)));
}
buttons.forEach(b=>b.addEventListener('click',()=>{width=Number(b.dataset.width);render();}));
new ResizeObserver(render).observe(stage);
render();
