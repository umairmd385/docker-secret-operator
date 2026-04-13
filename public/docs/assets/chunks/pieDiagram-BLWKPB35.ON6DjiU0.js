import{p as V}from"./chunk-BAOP5US2.CwPOuHhV.js";import{X as y,O as z,aA as U,g as j,s as X,a as Z,b as q,n as H,o as J,_ as u,l as G,c as K,C as Q,G as Y,a4 as tt,e as et,v as at,D as rt}from"../app.D2DILibk.js";import{p as nt}from"./gitGraph-YCYPL57B.DaqwrpY5.js";import{d as P}from"./arc.Dx85QDoI.js";import{o as it}from"./ordinal.BYWQX77i.js";import"./framework.mrTIYZc5.js";import"./theme.LmeC6__k.js";import"./min.DATg4pBk.js";import"./baseUniq.CLSJS4Ju.js";import"./init.Gi6I4Gst.js";function st(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function ot(t){return t}function lt(){var t=ot,a=st,m=null,o=y(0),p=y(z),x=y(0);function i(e){var r,l=(e=U(e)).length,g,A,h=0,c=new Array(l),n=new Array(l),v=+o.apply(this,arguments),w=Math.min(z,Math.max(-z,p.apply(this,arguments)-v)),f,T=Math.min(Math.abs(w)/l,x.apply(this,arguments)),$=T*(w<0?-1:1),d;for(r=0;r<l;++r)(d=n[c[r]=r]=+t(e[r],r,e))>0&&(h+=d);for(a!=null?c.sort(function(S,C){return a(n[S],n[C])}):m!=null&&c.sort(function(S,C){return m(e[S],e[C])}),r=0,A=h?(w-l*$)/h:0;r<l;++r,v=f)g=c[r],d=n[g],f=v+(d>0?d*A:0)+$,n[g]={data:e[g],index:r,value:d,startAngle:v,endAngle:f,padAngle:T};return n}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:y(+e),i):t},i.sortValues=function(e){return arguments.length?(a=e,m=null,i):a},i.sort=function(e){return arguments.length?(m=e,a=null,i):m},i.startAngle=function(e){return arguments.length?(o=typeof e=="function"?e:y(+e),i):o},i.endAngle=function(e){return arguments.length?(p=typeof e=="function"?e:y(+e),i):p},i.padAngle=function(e){return arguments.length?(x=typeof e=="function"?e:y(+e),i):x},i}var ct=rt.pie,F={sections:new Map,showData:!1},b=F.sections,O=F.showData,ut=structuredClone(ct),pt=u(()=>structuredClone(ut),"getConfig"),gt=u(()=>{b=new Map,O=F.showData,at()},"clear"),dt=u(({label:t,value:a})=>{b.has(t)||(b.set(t,a),G.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),ft=u(()=>b,"getSections"),mt=u(t=>{O=t},"setShowData"),ht=u(()=>O,"getShowData"),R={getConfig:pt,clear:gt,setDiagramTitle:J,getDiagramTitle:H,setAccTitle:q,getAccTitle:Z,setAccDescription:X,getAccDescription:j,addSection:dt,getSections:ft,setShowData:mt,getShowData:ht},vt=u((t,a)=>{V(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),St={parse:u(async t=>{const a=await nt("pie",t);G.debug(a),vt(a,R)},"parse")},yt=u(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),xt=yt,At=u(t=>{const a=[...t.entries()].map(o=>({label:o[0],value:o[1]})).sort((o,p)=>p.value-o.value);return lt().value(o=>o.value)(a)},"createPieArcs"),wt=u((t,a,m,o)=>{G.debug(`rendering pie chart
`+t);const p=o.db,x=K(),i=Q(p.getConfig(),x.pie),e=40,r=18,l=4,g=450,A=g,h=Y(a),c=h.append("g");c.attr("transform","translate("+A/2+","+g/2+")");const{themeVariables:n}=x;let[v]=tt(n.pieOuterStrokeWidth);v??(v=2);const w=i.textPosition,f=Math.min(A,g)/2-e,T=P().innerRadius(0).outerRadius(f),$=P().innerRadius(f*w).outerRadius(f*w);c.append("circle").attr("cx",0).attr("cy",0).attr("r",f+v/2).attr("class","pieOuterCircle");const d=p.getSections(),S=At(d),C=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12],D=it(C);c.selectAll("mySlices").data(S).enter().append("path").attr("d",T).attr("fill",s=>D(s.data.label)).attr("class","pieCircle");let W=0;d.forEach(s=>{W+=s}),c.selectAll("mySlices").data(S).enter().append("text").text(s=>(s.data.value/W*100).toFixed(0)+"%").attr("transform",s=>"translate("+$.centroid(s)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(p.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const M=c.selectAll(".legend").data(D.domain()).enter().append("g").attr("class","legend").attr("transform",(s,k)=>{const E=r+l,L=E*D.domain().length/2,_=12*r,B=k*E-L;return"translate("+_+","+B+")"});M.append("rect").attr("width",r).attr("height",r).style("fill",D).style("stroke",D),M.data(S).append("text").attr("x",r+l).attr("y",r-l).text(s=>{const{label:k,value:E}=s.data;return p.getShowData()?`${k} [${E}]`:k});const I=Math.max(...M.selectAll("text").nodes().map(s=>(s==null?void 0:s.getBoundingClientRect().width)??0)),N=A+e+r+l+I;h.attr("viewBox",`0 0 ${N} ${g}`),et(h,g,N,i.useMaxWidth)},"draw"),Ct={draw:wt},Ot={parser:St,db:R,renderer:Ct,styles:xt};export{Ot as diagram};
