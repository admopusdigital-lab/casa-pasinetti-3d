(function(){var el=document.getElementById('pz-splash');if(!el)return;document.documentElement.classList.add('pz-lock');
var fill=el.querySelector('.pz-fill'),pct=el.querySelector('.pz-pct'),lab=el.querySelector('.pz-lab'),cur=0,out=false,shown=-1;
if(window.__pzP){el.classList.add('pz-cont');cur=window.__pzP;fill.style.transition='none';fill.style.transform='scaleX('+cur+')';void fill.offsetWidth;fill.style.transition='';}
var PZ=window.PZ={set:function(p,label,slow){if(out)return;p=Math.min(1,Math.max(cur,p));cur=p;fill.style.transitionDuration=(slow||.35)+'s';fill.style.transitionTimingFunction=slow?'cubic-bezier(.12,.6,.25,1)':'';fill.style.transform='scaleX('+p.toFixed(4)+')';if(label&&lab.textContent!==label)lab.textContent=label;},
value:function(){return cur;},
done:function(label){if(out)return;PZ.set(1,label||'Pronto');out=true;setTimeout(function(){el.classList.add('pz-out');document.documentElement.classList.remove('pz-lock');setTimeout(function(){el.remove();},700);},380);}};
(function tick(){var m=getComputedStyle(fill).transform,v=0;if(m&&m!=='none')v=parseFloat(m.slice(m.indexOf('(')+1));var n=Math.min(100,Math.round(v*100));if(n!==shown){shown=n;pct.textContent=n+'%';}if(el.isConnected)requestAnimationFrame(tick);})();})();
