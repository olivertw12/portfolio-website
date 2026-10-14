/* Drift: shared behaviour for every page. Water column, particulate, glass, the anchor on its chain, the seabed, and the page controls. */
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
const CFG = { key: 'drift-motion', depth: () => '' };
const ICONS = { brushfactory: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"1748 1427 1471 1965\" role=\"img\" aria-label=\"Brushfactory\"> <g > <path d=\"M 3173.327626638995,1952.977976711998 C 3183.324317724997,1977.414528016001 3180.1718342289896,2005.270717739997 3164.9279173239993,2026.8236820519996 C 3064.4010258429917,2169.1545784519985 2682.7016425509937,2709.5313869400015 2564.5249914969972,2876.834886072 C 2559.6718261150017,2883.7111319760006 2550.9195364089974,2886.6501725639973 2542.913887531002,2884.0993071480007 C 2534.8874986299925,2881.5484417320004 2529.4328725809974,2874.1176598679995 2529.4328725809974,2865.6887132759985 C 2529.4328725809974,2714.0416127479984 2529.4328725809974,2320.3395656799985 2529.4328725809974,2166.899465548002 C 2529.4328725809974,2133.368524499998 2546.8337518779954,2102.240572611998 2575.3927635489963,2084.6617826799993 C 2619.776412768995,2058.746468816 2648.791704946001,2013.884509651998 2648.791704946001,1963.0520466519993 C 2648.791704946001,1881.8864666399968 2574.8742629739936,1815.9891100599962 2483.8048219810007,1815.9891100599962 C 2392.7353809880005,1815.9891100599962 2318.797198993001,1881.8864666399968 2318.797198993001,1963.0520466519993 C 2318.797198993001,2013.884509651998 2347.833231192999,2058.746468816 2391.905780068002,2085.1608650439994 C 2420.2781315320026,2102.628747783998 2437.575310713997,2133.571854351998 2437.575310713997,2166.899465548002 C 2438.1560313579976,2320.3395656799985 2438.1560313579976,2714.0416127479984 2438.1560313579976,2865.6887132759985 C 2438.1560313579976,2874.1176598679995 2432.7221453319944,2881.5484417320004 2424.6957564309923,2884.0993071480007 C 2416.6693675299975,2886.6501725639973 2407.9378178469924,2883.7111319760006 2403.084652464997,2876.834886072 C 2284.9080014110004,2709.5498714720015 1903.187878095996,2169.1730629839985 1802.6402465919964,2026.8421665839996 C 1787.417069709998,2005.270717739997 1784.2438461909987,1977.414528016001 1794.2612772999928,1952.977976711998 C 1833.0451203099947,1858.3186883399976 1931.6639296749927,1617.6315971679978 1973.8698764799992,1514.617300332 C 1985.7539096589971,1485.6150696240002 2014.0018209850023,1466.668424323998 2045.3399957380025,1466.668424323998 C 2215.014123900997,1466.668424323998 2752.616260083996,1466.649939791998 2922.290388246998,1466.649939791998 C 2953.649303023005,1466.649939791998 2981.8972143489955,1485.5965850919965 2993.7812475280007,1514.617300332 C 3035.9664543099934,1617.6315971679978 3134.5645236519995,1858.3186883399976 3173.327626638995,1952.977976711998\"/> <path d=\"M 2866.34699872,3207.2331630969984 C 2861.416259144,3205.8651468929984 2855.33431278,3204.4268558839976 2847.8593536360004,3203.016674796998 C 2839.40665722,3201.423779216999 2816.629584104,3196.8324919569986 2768.515448348,3193.937169990999 C 2759.537086732,3193.398396485998 2737.212085688,3191.679006256998 2692.157321396,3190.7748037659985 C 2682.0330096440002,3190.5733493249973 2639.228092408,3188.6384496939972 2542.7527582519997,3189.439582470999 C 2534.7731605159997,3189.5051722889984 2512.185326872,3189.4067875619985 2463.482446092,3189.851861326999 L 2386.4935209,3190.301620078999 C 2371.585655828,3190.4140597669975 2239.522787632,3190.5592943640004 2211.7098419,3190.1985503649976 C 2189.5162571560004,3189.912766157997 2124.296975792,3188.924233900998 2099.175435884,3187.603067566997 C 2056.7700242,3185.368328767998 2035.023254876,3180.1351982889973 2020.530665312,3172.5220944139983 C 1992.1289745560002,3157.6004108189973 1985.8735586760001,3128.675301080999 1997.979628232,3106.131143636998 C 2008.0566301160002,3087.363085715 2030.970376184,3069.9255641009986 2102.439816776,3043.282043031999 C 2153.108685404,3024.392175447998 2215.3211618240002,3005.8068320189977 2260.118350168,2993.0027625479997 C 2266.2318364440002,2991.2552623969987 2305.2204243280003,2980.404832504997 2354.922068988,2967.605448020997 C 2365.277673428,2964.9396904179976 2424.304618736,2949.7415925899986 2484.719320172,2935.658521667998 C 2485.118825724,2935.5648219279974 2489.5028734919997,2934.543494761998 2489.723652876,2934.501329878998 C 2490.985249356,2934.2811354899986 2492.225819228,2933.9297614649986 2493.503185664,2933.8313767379987 C 2499.154086564,2933.4050429209983 2503.4172313360004,2935.8178112259975 2504.179445876,2936.244145042998 C 2504.941660416,2936.679848833999 2509.204805188,2939.083247164999 2511.791077972,2944.1617730729977 C 2513.573083,2947.6614583619994 2513.799119036,2950.9362642749984 2513.8464289040003,2951.545312584998 C 2514.235421152,2957.1813519459974 2511.8278745360003,2961.444690115999 2511.3968290720004,2962.208342996999 C 2510.965783608,2962.971995877997 2508.5582369920003,2967.2353340479985 2503.517107724,2969.830816845999 C 2502.37641424,2970.4211252079986 2501.146357672,2970.8052941419974 2499.942584364,2971.2503679069996 C 2498.980617048,2971.601741931998 2393.09061916,3005.4648279679986 2281.0713650400003,3047.0487725799994 C 2272.387375936,3050.2720436359978 2196.355161408,3077.543352962999 2135.283378472,3104.9317869649985 C 2173.010369876,3103.704320370998 2208.45071766,3102.0692599079975 2222.7488111000002,3101.525801415997 C 2290.165373,3098.9631135269974 2362.7071706,3095.5196480819995 2384.3856034480004,3094.723200291999 C 2457.2322868640003,3092.0527577019984 2466.6574639,3091.8747281959986 2491.5319411640003,3091.2891048209985 C 2530.4942457879997,3090.366162381997 2541.711941156,3090.277147628998 2546.074962316,3090.2443527199976 C 2607.32547142,3089.771169032998 2653.55772576,3090.338052459998 2691.815639016,3091.556149079999 C 2694.065486072,3091.6311088719995 2733.2012602120003,3093.2146344779976 2773.3831081,3097.0047889609996 C 2774.161092596,3097.079748752998 2795.82901214,3099.173937941998 2819.6153624400004,3102.800117879997 C 2857.5999297920002,3108.590761811998 2877.039028888,3114.4985304189995 2885.449672088,3117.126808125997 C 2913.3046710360004,3125.8361989589994 2952.9135438559997,3142.3742030689973 2966.281209892,3179.071706239998 C 2969.146085232,3186.928429439 2983.717524576,3230.6580980969975 2934.536288464,3265.130232443 C 2918.7347925520003,3276.2055417109987 2896.1469589079998,3286.582787915997 2862.740935448,3296.4353155769986 C 2841.577654496,3302.6710332739985 2814.742446036,3308.1665230249982 2810.5318677840005,3309.028560632998 C 2798.4625947920003,3311.502233768997 2746.7634223719997,3322.0903043889994 2658.18357952,3331.516498232999 C 2636.431553544,3333.830881810998 2607.3097014639998,3336.2717600379983 2602.878343828,3336.6418740109984 C 2544.87644566,3341.504890516997 2492.7252011680002,3344.3627325869984 2464.129014288,3345.815078556998 C 2463.939774816,3345.824448530997 2421.597442956,3347.8905277979993 2362.0448324480003,3349.506848312998 C 2320.464715128,3350.631245192999 2237.903738816,3352.4396501749998 2141.465201224,3351.5260777099975 C 2141.249678492,3351.5213927229997 2098.9020899800003,3351.052894022998 2053.542439872,3349.4693684169997 C 2031.8692636760002,3348.7104005229976 2017.3503908520001,3347.9748575639987 2011.5260204360002,3347.6750183959975 C 2010.32750378,3347.609428578 2010.32750378,3347.623483538997 2010.2276273920002,3347.6047435909986 C 2009.5074660680002,3347.482933928999 2009.544262632,3347.3423843189976 2008.824101308,3347.220574656998 C 2049.3634015320004,3344.8499712350003 2085.592247116,3341.9687042299975 2157.019634492,3335.170788092999 C 2319.439667988,3319.719700967 2446.513973436,3300.4550344229992 2459.592523612,3298.590409596998 C 2561.203606772,3284.0950598189975 2622.5750188720003,3272.331057461999 2660.853958736,3264.877243144998 C 2771.448660164,3243.349727879997 2820.2198774199996,3225.9965360319984 2842.3871789040004,3217.5588744449997 C 2842.944384016,3217.3480500299993 2854.693001236,3213.0191220419983 2866.34699872,3207.2331630969984\"/> </g> </svg>", data: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><rect x=\"2\" y=\"12\" width=\"5\" height=\"10\" rx=\"1.6\"/><rect x=\"9.5\" y=\"7\" width=\"5\" height=\"15\" rx=\"1.6\"/><rect x=\"17\" y=\"2\" width=\"5\" height=\"20\" rx=\"1.6\"/></svg>", design: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill-rule=\"evenodd\" d=\"M12 1C5 1 1 6 1 12s5 11 11 11c4 0 5-3 3-5-2-2-1-4 2-4h2c5 0 5-6 1-10-2-2-5-3-8-3Zm-5 5a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 7 6Zm6-2a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 13 4Zm5 3a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 18 7ZM5 12a1.8 1.8 0 1 0 0 3.6A1.8 1.8 0 0 0 5 12Z\"/></svg>" };
/* ===== shared dive base: page behaviour, smooth scroll, water column, particulate, anchor ===== */
const root = document.documentElement, page = document.getElementById('page'), canvas = document.getElementById('gl');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false; try { userPaused = localStorage.getItem(CFG.key) === 'paused'; } catch {}
const still = () => reduce.matches || userPaused;
const toast = document.getElementById('toast'); let toastT;
function say(m){ toast.textContent = m; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), 2600); }
const isLocal = location.pathname.includes('/mockups/');
document.querySelectorAll('#copy, [data-copy]').forEach(btn => btn.addEventListener('click', () => {
  const t = 'oliver_tw@icloud.com';
  (navigator.clipboard?.writeText(t) ?? Promise.reject()).then(() => say('Email address copied'), () => { const r = document.createRange(); r.selectNodeContents(btn.querySelector('.mail')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); say('Address selected. Press Ctrl or Cmd + C to copy.'); });
}));
const motionBtn = document.getElementById('motion');
function syncMotion(){ motionBtn.textContent = userPaused ? 'Play motion' : 'Pause motion'; motionBtn.setAttribute('aria-pressed', String(userPaused)); root.classList.toggle('still', userPaused); }
motionBtn.addEventListener('click', () => { userPaused = !userPaused; try { localStorage.setItem(CFG.key, userPaused ? 'paused' : 'on'); } catch {} syncMotion(); });
syncMotion();

const V = { vw: innerWidth, vh: innerHeight, docH: 0, maxScroll: 1, cur: scrollY, p: 0, sv: 0, time: +(new URLSearchParams(location.search).get('t') || 0), dt: 0, paused: false };
const measureFns = [];
const frameHooks = [];   /* things that must move on the same frame as the page: panels that follow the reader, the contents marker, the preview */
const boxOf = el => { const r = el.getBoundingClientRect(), p = page.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top - p.top + r.height / 2, w: r.width, h: r.height }; };
function measure(){ V.vw = innerWidth; V.vh = innerHeight; V.docH = page.offsetHeight; document.body.style.height = V.docH + 'px'; V.maxScroll = Math.max(1, V.docH - V.vh); measureFns.forEach(f => f()); }
const offsetOf = el => el.getBoundingClientRect().top - page.getBoundingClientRect().top;
const goHash = (hash, smooth) => { let t = null; try { t = hash.length > 1 ? document.querySelector(hash) : null; } catch {} if (!t) return false; scrollTo({ top: Math.max(0, offsetOf(t) - 24), behavior: smooth && !still() ? 'smooth' : 'auto' }); return true; };
document.addEventListener('click', e => { const a = e.target.closest('a[href*="#"]'); if (!a) return; const u = new URL(a.href, location.href); if (u.pathname !== location.pathname || u.origin !== location.origin) return; if (goHash(u.hash, true)) { e.preventDefault(); history.replaceState(null, '', u.hash); } });
addEventListener('load', () => { if (location.hash) setTimeout(() => { measure(); goHash(location.hash, false); }, 60); });
document.addEventListener('focusin', e => { const r = e.target.getBoundingClientRect(); if (r.top < 0 || r.bottom > V.vh) scrollTo(0, offsetOf(e.target) - V.vh / 3); });
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = THREE.MathUtils.lerp;
const ptr = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, vx: 0, vy: 0, seen: false };
addEventListener('pointermove', e => { ptr.vx = e.clientX - ptr.x; ptr.vy = e.clientY - ptr.y; ptr.x = e.clientX; ptr.y = e.clientY; ptr.nx = e.clientX / V.vw * 2 - 1; ptr.ny = e.clientY / V.vh * 2 - 1; ptr.seen = true; }, { passive: true });

const NOISE = `float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
  float caustic(vec2 uv,float t){vec2 p=mod(uv*6.2831853,6.2831853)-250.;vec2 i=p;float c=1.;float k=.005;
    for(int n=0;n<4;n++){float tt=t*(1.-(3.5/float(n+1)));i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));c+=1./length(vec2(p.x/(sin(i.x+tt)/k),p.y/(cos(i.y+tt)/k)));}
    c/=4.;c=1.17-pow(c,1.4);return pow(abs(c),8.);}`;

function initGL(antialias = true){
  try { const r = new THREE.WebGLRenderer({ canvas, antialias, alpha: false, powerPreference: 'high-performance' }); r.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75)); r.autoClear = false; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.1; return r; }
  catch { root.classList.add('no-gl', 'no-smooth'); return null; }
}

/* water column: gradient, the surface seen from below, light shafts, seabed. dark = how deep it looks, bed = seabed in frame */
function makeWater(DPR){
  const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const mat = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms: { uRes: { value: new THREE.Vector2() }, uDark: { value: 0 }, uBed: { value: 0 }, uTime: { value: 0 }, uPtr: { value: new THREE.Vector2() }, uTorch: { value: new THREE.Vector3(.5, .5, 0) }, uShadow: { value: new THREE.Vector3(.5, 0, 0) }, uCrater: { value: new THREE.Vector3(.5, .1, 0) } },
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader: `precision highp float;varying vec2 vUv;uniform vec2 uRes,uPtr;uniform vec3 uTorch,uShadow,uCrater;uniform float uDark,uBed,uTime;${NOISE}
    void main(){vec2 uv=vUv;float asp=uRes.x/uRes.y;vec2 p=(uv-.5)*vec2(asp,1.);float d=uDark,t=uTime;
      vec3 top=mix(vec3(.10,.50,.86),vec3(.006,.05,.16),smoothstep(0.,.5,d));
      vec3 bot=mix(vec3(.012,.14,.40),vec3(.003,.018,.07),smoothstep(0.,.75,d));
      top=mix(top,vec3(.002,.012,.04),smoothstep(1.,1.6,d));bot=mix(bot,vec3(.001,.005,.02),smoothstep(1.,1.6,d));
      vec3 col=mix(bot,top,pow(uv.y,1.25));
      float sy=uv.y+d*7.;float surf=smoothstep(.62,1.02,sy);
      float c=caustic(vec2(p.x*.55+t*.01,(1.-sy)*1.6+t*.015),t*.9);
      col+=vec3(.55,.9,1.)*surf*(.25+c*1.5)*(1.-smoothstep(0.,.14,d));
      vec2 src=vec2(-.25+uPtr.x*.12,1.25);vec2 dir=p-src;float a=atan(dir.x,-dir.y);
      float r=noise(vec2(a*7.+t*.07,1.))*.55+noise(vec2(a*19.-t*.1,7.))*.3+noise(vec2(a*43.+t*.16,3.))*.15;
      r=smoothstep(.42,.86,r);float fall=exp(-length(dir)*1.25)*2.4;
      col+=vec3(.25,.62,1.)*r*fall*mix(.9,.34,smoothstep(0.,.6,d))*(1.-smoothstep(1.,1.5,d));
      /* seabed: a sand floor in perspective. Ripples, grain and stones are laid out on the ground plane, so they shrink toward the far edge and fade into haze. */
      float bed=uBed;float dune=(.2+.035*sin(p.x*2.3+1.2)+.012*sin(p.x*7.1))*bed-.06*(1.-bed);
      float cd=(p.x-(uCrater.x-.5)*asp)/max(uCrater.y,1e-3);dune+=uCrater.z*uCrater.y*.11*exp(-cd*cd*1.6);   /* sand pushed up around whatever has sunk into it */
      float ridge2=dune+(.024+.014*sin(p.x*3.7+4.)+.006*sin(p.x*11.))*bed;
      col=mix(col,mix(col,vec3(.085,.12,.18),.55),smoothstep(ridge2+.004,ridge2-.004,uv.y)*bed);   /* a farther rise, half lost in the haze */
      float sand=smoothstep(dune+.003,dune-.003,uv.y);
      if(sand>0.){float dy=dune-uv.y;float z=.12/(dy+.012);vec2 g=vec2(p.x*z,z);float fog=exp(-z*.3);
        float m=noise(g*vec2(1.6,2.2)),m2=noise(g*vec2(5.,7.)+9.);
        vec3 s=vec3(.2,.255,.33)*(.76+.34*m+.12*m2);                                              /* pale sand under blue light */
        float ph=z*22.+sin(g.x*1.5+m*2.)*1.5+m*3.;s*=1.+cos(ph)*.3*fog;s+=vec3(.1,.13,.17)*smoothstep(.5,1.,sin(ph))*.7*fog;   /* wind-row ripples, lit on one side */
        s+=(hash(floor(uv*uRes/1.5))-.5)*.04*fog;                                                 /* grain */
        vec2 c=g*vec2(6.5,8.5);vec2 ci=floor(c),cf=fract(c)-.5;float rnd=hash(ci);vec2 o=(vec2(hash(ci+7.),hash(ci+13.))-.5)*.5;float r=.05+.11*hash(ci+3.);vec2 sd=cf-o;
        float isStone=step(.8,rnd);s*=1.-.38*isStone*smoothstep(r*1.7,r*.5,length(sd+vec2(-r*.35,r*.45)));          /* each stone's shadow */
        s=mix(s,vec3(.055,.075,.11)+vec3(.13,.16,.2)*smoothstep(-r*.4,r,sd.y+sd.x*-.4),isStone*smoothstep(r,r*.8,length(sd)));   /* scattered stones */
        float cs=caustic(g*vec2(.55,.8)+t*.008,t*.8);s+=vec3(.3,.58,.9)*cs*1.25*fog;              /* the light pattern from the surface, falling across the floor */
        s*=1.-.3*uCrater.z*exp(-cd*cd*.7)*smoothstep(.09,0.,dy);                                    /* freshly turned sand is darker */
        if(uShadow.z>0.){vec2 q=(uv-uShadow.xy)*vec2(asp,1.)/uShadow.z;s*=1.-.55*smoothstep(1.,.15,length(q*vec2(1.,3.2)));}
        s*=mix(1.,.35,smoothstep(1.,1.6,d));
        s=mix(col,s,clamp(fog*1.2+.1,0.,1.));
        col=mix(col,s,sand);}
      vec2 tq=(uv-uTorch.xy)*vec2(asp,1.);col+=vec3(.10,.42,.5)*exp(-dot(tq,tq)*9.)*uTorch.z;
      col*=mix(.82,1.,smoothstep(1.2,.3,length(p*vec2(.8,1.))));
      col+=(hash(uv*uRes+t)-.5)*.014;
      gl_FragColor=vec4(col,1.);}` });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
  return { scene, cam, mat, resize(){ mat.uniforms.uRes.value.set(V.vw * DPR, V.vh * DPR); }, set(dark, bed){ mat.uniforms.uDark.value = dark; mat.uniforms.uBed.value = bed; mat.uniforms.uTime.value = V.time; mat.uniforms.uPtr.value.set(ptr.nx, ptr.ny); } };
}

/* suspended particulate: small soft motes, the near ones large and out of focus */
function makeSnow(scene, DPR, n = 520){
  const g = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), seed = new Float32Array(n);
  for (let i = 0; i < n; i++) { pos[i * 3] = Math.random() * 2 - 1; pos[i * 3 + 1] = Math.random(); pos[i * 3 + 2] = Math.pow(Math.random(), 1.3); seed[i] = Math.random(); }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, uniforms: { uTime: { value: 0 }, uScroll: { value: 0 }, uView: { value: new THREE.Vector2() }, uDpr: { value: DPR }, uGain: { value: 1 } },
    vertexShader: `attribute float aSeed;uniform float uTime,uScroll,uDpr;uniform vec2 uView;varying float vA;varying float vBlur;
      void main(){float par=mix(.3,1.7,position.z);float H=uView.y*1.6;
        float y=mod(position.y*H+uScroll*par+uTime*(3.+aSeed*7.),H)-H*.5;
        float x=position.x*uView.x*.62+sin(uTime*(.2+aSeed*.3)+aSeed*40.)*(10.+30.*position.z);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(x,y,0.,1.);
        float s=mix(1.2,2.6,aSeed)+pow(position.z,9.)*34.;gl_PointSize=s*uDpr;vBlur=pow(position.z,9.);vA=mix(.5,.035,smoothstep(0.,.25,vBlur))*(.4+.6*aSeed);}`,
    fragmentShader: `precision highp float;uniform float uGain;varying float vA;varying float vBlur;void main(){float r=length(gl_PointCoord-.5)*2.;float a=mix(smoothstep(1.,0.,r),smoothstep(1.,.35,r),smoothstep(0.,.3,vBlur));gl_FragColor=vec4(vec3(.62,.84,1.)*a*vA*uGain,1.);}` });
  const pts = new THREE.Points(g, m); pts.frustumCulled = false; scene.add(pts);
  return { mat: m, update(){ m.uniforms.uTime.value = V.time; m.uniforms.uScroll.value = V.cur; m.uniforms.uView.value.set(V.vw, V.vh); } };
}

/* the anchor mark, extruded from the site's own SVG; lowered beside the page and set down on the seabed */
function makeAnchor(scene){
  const D = 'M13.3 6.95 C16.8 5.5 16 0.7 12 .7 C8 .7 7.2 5.5 10.7 6.95 L10.7 9.7 L9 9.7 C7.3 9.7 7.3 12.3 9 12.3 L10.7 12.3 L10.7 19.65 C7.3 19.2 5.1 16.8 4.5 14 C6.2 15 7.2 12.8 5.5 11.9 L3.7 10.9 C2.7 10.3 1.6 11 1.7 12.1 C2.1 17.8 6.1 21.8 10.7 22.2 C10.8 23.7 13.2 23.7 13.3 22.2 C17.9 21.8 21.9 17.8 22.3 12.1 C22.4 11 21.3 10.3 20.3 10.9 L18.5 11.9 C16.8 12.8 17.8 15 19.5 14 C18.9 16.8 16.7 19.2 13.3 19.65 L13.3 12.3 L15 12.3 C16.7 12.3 16.7 9.7 15 9.7 L13.3 9.7 L13.3 6.95 Z';
  const shape = new THREE.Shape(), tk = D.match(/[MCLZ]|-?\d*\.?\d+/g); const X = v => +v - 12, Y = v => 4 - +v;
  for (let i = 0; i < tk.length;) { const c = tk[i++]; if (c === 'M') { shape.moveTo(X(tk[i]), Y(tk[i + 1])); i += 2; } else if (c === 'L') { shape.lineTo(X(tk[i]), Y(tk[i + 1])); i += 2; } else if (c === 'C') { shape.bezierCurveTo(X(tk[i]), Y(tk[i + 1]), X(tk[i + 2]), Y(tk[i + 3]), X(tk[i + 4]), Y(tk[i + 5])); i += 6; } else shape.closePath(); }
  const hole = new THREE.Path(); hole.absarc(0, 0, 1.5, 0, Math.PI * 2, true); shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 3.4, bevelEnabled: true, bevelThickness: .9, bevelSize: .62, bevelSegments: 8, curveSegments: 28 }); geo.translate(0, 0, -1.7);
  const face = new THREE.MeshPhysicalMaterial({ color: 0xf2f9ff, roughness: .16, metalness: .15, clearcoat: 1, clearcoatRoughness: .08, iridescence: .7, iridescenceIOR: 1.4, emissive: 0x2a6fc0, emissiveIntensity: .32 });
  const side = new THREE.MeshPhysicalMaterial({ color: 0x6fb8ff, roughness: .22, metalness: .3, clearcoat: 1, emissive: 0x0e4a9a, emissiveIntensity: .5 });
  const rig = new THREE.Group(); rig.add(new THREE.Mesh(geo, [face, side])); scene.add(rig);
  const ropeGeo = new THREE.BufferGeometry(), rp = new Float32Array(24 * 3); ropeGeo.setAttribute('position', new THREE.BufferAttribute(rp, 3));
  const rope = new THREE.Line(ropeGeo, new THREE.LineBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: .5 })); rope.frustumCulled = false; scene.add(rope);
  /* silt kicked up on landing */
  const PN = 46, pp = new Float32Array(PN * 3), ps = new Float32Array(PN), pa = new Float32Array(PN), puffs = Array.from({ length: PN }, () => ({ life: 0 }));
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); pg.setAttribute('aSize', new THREE.BufferAttribute(ps, 1)); pg.setAttribute('aA', new THREE.BufferAttribute(pa, 1));
  const pm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, uniforms: { uDpr: { value: Math.min(devicePixelRatio || 1, 1.75) } },
    vertexShader: 'attribute float aSize,aA;uniform float uDpr;varying float vA;void main(){vA=aA;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=aSize*uDpr;}',
    fragmentShader: 'precision highp float;varying float vA;void main(){float r=length(gl_PointCoord-.5)*2.;float a=smoothstep(1.,0.,r);gl_FragColor=vec4(vec3(.32,.52,.78)*a*a*vA,1.);}' });
  const puffPts = new THREE.Points(pg, pm); puffPts.frustumCulled = false; scene.add(puffPts);
  let swing = 0, swingV = 0, landed = false, top, rest; const slotTop = document.getElementById('slot-top'), slotRest = document.getElementById('slot-rest');
  measureFns.push(() => { top = boxOf(slotTop); rest = boxOf(slotRest); });
  return { rig, face, side, update(glow = 0){
    if (!top) return; const { vw, vh, p, cur, time, dt, paused, sv } = V;
    const wide = vw > 760, land = ss(.9, 1, p), mid = ss(.02, .14, p) * (1 - ss(.86, .99, p));
    const size = Math.min(top.w, wide ? 340 : 104) / 24 * (1 - mid * (wide ? .58 : .5));
    const ax = lerp(lerp(top.x, rest.x, p), vw - (wide ? 74 : 26), mid);
    const y0 = top.y - top.h * .34, y1 = vh * .81 - size * 15.5;
    const ay = lerp(y0 - cur, y1, p) * (1 - mid) + mid * vh * (.22 + .3 * p) + (1 - land) * (paused ? 0 : Math.sin(time * .8) * 8);
    swingV += (-swing * 14 - Math.max(-2500, Math.min(2500, sv)) * .012 - ptr.vx * .012) * dt; swingV *= Math.pow(.12, dt); swing += swingV * dt; swing = Math.max(-.55, Math.min(.55, swing)); if (paused) swing = 0;
    rig.position.set(ax - vw / 2, vh / 2 - ay, -40); rig.scale.setScalar(size);
    rig.rotation.z = swing * (1 - land) + land * .42; rig.rotation.y = (paused ? .5 : Math.sin(time * .45) * .7 + ptr.nx * .35) * (1 - land) + land * -.5; rig.rotation.x = land * -.25 + ptr.ny * .12 * (1 - land);
    face.emissiveIntensity = .32 + glow * .5; side.emissiveIntensity = .5 + glow * .9;
    const x0 = rig.position.x - swing * 70 - land * 150, yTop = vh / 2 + 40, cx = (x0 + rig.position.x) / 2 + swing * 60 - land * 110, cy = (yTop + rig.position.y) / 2 - land * vh * .2;
    for (let i = 0; i < 24; i++) { const t = i / 23, u = 1 - t; rp[i * 3] = u * u * x0 + 2 * u * t * cx + t * t * rig.position.x; rp[i * 3 + 1] = u * u * yTop + 2 * u * t * cy + t * t * rig.position.y; rp[i * 3 + 2] = -40; }
    ropeGeo.attributes.position.needsUpdate = true;
    if (p > .985 && !landed) { landed = true; if (!paused) puffs.forEach(b => { b.x = rig.position.x + (Math.random() - .5) * size * 14; b.y = rig.position.y - size * 17 + Math.random() * 10; b.vx = (Math.random() - .5) * 150; b.vy = 10 + Math.random() * 46; b.s = 40 + Math.random() * 110; b.life = b.max = 1.6 + Math.random() * 1.8; }); }
    if (p < .9) landed = false;
    for (let i = 0; i < PN; i++) { const b = puffs[i]; if (b.life > 0) { b.life -= dt; b.vx *= .97; b.vy *= .98; b.x += b.vx * dt; b.y += b.vy * dt; pp[i * 3] = b.x; pp[i * 3 + 1] = b.y; pp[i * 3 + 2] = -30; const k = b.life / b.max; ps[i] = b.s * (1.6 - k); pa[i] = k * (1 - k) * 1.5; } else pa[i] = 0; }
    pg.attributes.position.needsUpdate = pg.attributes.aSize.needsUpdate = pg.attributes.aA.needsUpdate = true;
  } };
}

/* one clock for the page transform and the canvas */
function runLoop(tick){
  const depthEl = document.getElementById('depth'); let last = performance.now(), lastCur = V.cur, vis = true, lastLabel = '';
  document.addEventListener('visibilitychange', () => { vis = !document.hidden; last = performance.now(); });
  function frame(now){
    requestAnimationFrame(frame); if (!vis) return;
    const dt = V.dt = Math.min(.05, (now - last) / 1000); last = now; const paused = V.paused = still();
    V.cur += (scrollY - V.cur) * (paused ? 1 : 1 - Math.pow(.0009, dt)); if (Math.abs(scrollY - V.cur) < .05) V.cur = scrollY;
    page.style.transform = `translate3d(0,${-V.cur}px,0)`; for (const f of frameHooks) f();
    V.sv = (V.cur - lastCur) / Math.max(dt, .001); lastCur = V.cur; if (!paused) V.time += dt;
    V.short = V.maxScroll < V.vh * .35; V.p = V.short ? 1 : Math.min(1, Math.max(0, V.cur / V.maxScroll)); V.dark = V.short ? .42 : V.p;
    if (depthEl) { const label = CFG.depth(V.p); if (label !== lastLabel) { lastLabel = label; depthEl.textContent = label; } depthEl.parentElement.style.setProperty('--p', V.p.toFixed(3)); }
    tick(); ptr.vx *= .8; ptr.vy *= .8;
  }
  requestAnimationFrame(frame);
}
function pxCamera(cam, FOV){ cam.aspect = V.vw / V.vh; cam.position.set(0, 0, V.vh / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2))); cam.updateProjectionMatrix(); }
function watchLayout(resize){ let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(resize, 120); }); resize(); document.fonts?.ready.then(measure); new ResizeObserver(() => { if (Math.abs(page.offsetHeight - V.docH) > 2) measure(); }).observe(page); }

/* A chain with a heavy anchor on the end, simulated rather than animated.
   Verlet points in screen pixels (y down). Points 0..N are the chain (0 is the fixed top, N is the anchor's ring);
   point N+1 is the anchor's crown, joined to the ring by a rigid bar and carrying most of the mass. */
function makeChainSim(N = 40){
  const n = N + 2, x = new Float32Array(n), y = new Float32Array(n), px = new Float32Array(n), py = new Float32Array(n), w = new Float32Array(n).fill(1);
  w[0] = 0; w[N] = .3; w[N + 1] = .04;
  const TILT = .7; /* how far it can lean once the crown is down: the arms prop it up */
  const S = { x, y, N, ready: false, grounded: false, hit: 0, tip: 0, exit: 0, tg: 0, propped: false,
    reset(tx, ty, L, H){ for (let i = 0; i <= N; i++) { x[i] = px[i] = tx; y[i] = py[i] = ty + L * i / N; } x[N + 1] = px[N + 1] = tx; y[N + 1] = py[N + 1] = ty + L + H; S.ready = true; S.grounded = false; S.propped = false; S.tg = 0; S.L = L; S.H = H; },
    step(dt, o){
      if (!S.ready) S.reset(o.tx, o.ty, o.L, o.H);
      const sub = Math.max(1, Math.min(6, Math.ceil(dt / .008))), h = dt / sub, seg = o.L / N, C = N + 1, cy0 = y[N + 1]; S.hit = S.tip = S.exit = 0;
      /* Sand is not a hard floor. It gives way, resists more the deeper something goes, and keeps settling for a few seconds after. */
      S.tg = S.grounded ? S.tg + dt : 0; const sink = o.sink * (.5 + .5 * (1 - Math.exp(-S.tg / 2.2)));
      /* letting chain out, or the anchor changing size, moves the points without throwing them: shift position and history together */
      if (S.L !== undefined && !S.grounded) { const dL = o.L - S.L, dH = o.H - S.H; for (let i = 1; i <= N; i++) { const d = dL * i / N; y[i] += d; py[i] += d; }
        const bx = x[C] - x[N], by = y[C] - y[N], bl = Math.hypot(bx, by) || 1, ux = bx / bl, uy = by / bl; x[C] += ux * dH; px[C] += ux * dH; y[C] += dL + uy * dH; py[C] += dL + uy * dH; }
      S.L = o.L; S.H = o.H;
      for (let s = 0; s < sub; s++) {
        for (let i = 1; i < n; i++) {
          const drag = (i === C ? .9 : i === N ? 1.2 : 2.6) * (o.calm ? 6 : 1), k = Math.max(0, 1 - drag * h);
          let vx = (x[i] - px[i]) * k, vy = (y[i] - py[i]) * k;
          const sp = Math.hypot(vx, vy), cap = 2400 * h; if (sp > cap) { vx *= cap / sp; vy *= cap / sp; }
          let ax = o.calm ? 0 : o.flow(y[i], i), ay = i === C ? 1900 : 1500;
          if (i < N && !o.calm) ay -= o.lift;                               /* light links lag behind when the chain is let out fast */
          if (S.grounded && i === N) ax = -520;                             /* nothing balances on its crown: once down it tips over, always inward, and the current no longer moves it */
          if (S.grounded && i === C) ax = 0;
          if (i === C) { const pen = y[C] - o.ground(x[C]); if (pen > 0) { vx *= Math.max(0, 1 - 30 * h); vy *= Math.max(0, 1 - (vy > 0 ? 13 : 24) * h); ay -= Math.min(3, pen / sink) * 1900; } }   /* the crown ploughs in and is held */
          if (i === N && S.grounded) { const pen = y[N] - (o.ground(x[N]) - o.H * Math.cos(TILT)); if (pen > 0) { vx *= Math.max(0, 1 - 16 * h); vy *= Math.max(0, 1 - 16 * h); ay -= Math.min(3, pen / (sink * .55)) * 1500; if (!S.propped) { S.propped = true; S.tip = Math.hypot(vx, vy) / h; } } }   /* then an arm digs in as it tips */
          if (o.push && !o.calm) { const dx = x[i] - o.push.x, dy = y[i] - o.push.y, d2 = dx * dx + dy * dy, R = o.push.r; if (d2 < R * R) { const f = (1 - Math.sqrt(d2) / R) * (i === C ? .025 : i === N ? .05 : .1) / sub; vx += o.push.vx * f; vy += o.push.vy * f; } }
          px[i] = x[i]; py[i] = y[i]; x[i] += vx + ax * h * h; y[i] += vy + ay * h * h;
        }
        const wasGrounded = S.grounded;
        for (let it = 0; it < 26; it++) {
          x[0] = o.tx; y[0] = o.ty;
          for (let i = 0; i <= N; i++) { const b = i + 1, rest = i === N ? o.H : seg; let dx = x[b] - x[i], dy = y[b] - y[i], d = Math.hypot(dx, dy) || 1e-4;
            if (i < N && d <= rest) continue;                               /* chain can go slack, the anchor's bar cannot */
            const df = (d - rest) / d, ws = w[i] + w[b]; if (!ws) continue; const a = df * w[i] / ws, c = df * w[b] / ws; x[i] += dx * a; y[i] += dy * a; x[b] -= dx * c; y[b] -= dy * c; }
          for (let i = 1; i < N; i++) { const gy = o.ground(x[i]) - o.link; if (y[i] > gy) { y[i] = gy; px[i] = x[i] - (x[i] - px[i]) * .4; } }
          const gc = o.ground(x[C]) + o.sink * 2.2; if (y[C] > gc) { y[C] = gc; py[C] = gc; }                           /* firm ground further down */
        }
        const now = y[C] > o.ground(x[C]);
        if (now && !wasGrounded) S.hit = Math.max(1, (y[C] - cy0) / dt);   /* how fast it was coming down, chain speed included */
        if (!now && wasGrounded) { S.exit = Math.max(1, (py[C] - y[C]) / h); S.propped = false; }
        S.grounded = now;
      }
    } };
  return S;
}


/* optical alignment: pull each display line left by its first glyph's side bearing, so the ink sits exactly on the text edge */
const mctx = document.createElement('canvas').getContext('2d');
function alignInk(){ document.querySelectorAll('.glow .ln').forEach(el => { const cs = getComputedStyle(el); mctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; const m = mctx.measureText(el.textContent.toLowerCase()); el.style.marginLeft = (m.actualBoundingBoxLeft || 0).toFixed(2) + 'px'; }); }
measureFns.push(alignInk);

const renderer = initGL(true);
if (!renderer) { alignInk(); document.fonts?.ready.then(alignInk); }
if (renderer) {
  const DPR = renderer.getPixelRatio(), FOV = 30;
  const water = makeWater(DPR), back = new THREE.Scene(), scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(FOV, 1, 10, 20000);
  const snow = makeSnow(back, DPR);
  /* One glass for every 3D object. The water column is drawn to a texture first; the glass bends that texture by its surface
     normal (split slightly per colour), keeps a faint cool body so it reads in dark water, and lights its cut edges the way the plates' rims are lit. */
  let sceneRT; const G = { tScene: { value: null }, uRes: { value: new THREE.Vector2() }, uTime: { value: 0 }, uSun: { value: 1 }, uBed: { value: 0 }, uCrater: { value: new THREE.Vector3(.5, .1, 0) } };
  const blit = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms: { tScene: G.tScene }, vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}', fragmentShader: 'precision highp float;uniform sampler2D tScene;varying vec2 vUv;void main(){gl_FragColor=texture2D(tScene,vUv);}' }));
  const blitScene = new THREE.Scene(), oCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); blitScene.add(blit);
  const GLASS_FS = `uniform sampler2D tScene;uniform vec2 uRes;uniform float uTime,uSun,uBody,uBend,uClip,uBed;uniform vec3 uCrater;${NOISE}
      vec3 S(vec2 uv){return texture2D(tScene,clamp(uv,.002,.998)).rgb;}
      vec3 glassAt(vec3 n,vec3 vW){vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.y/uRes.x;
        /* whatever is below the sand line is buried: the same curve the seabed is drawn with */
        float gx=(uv.x-.5)/asp,cd=(gx-(uCrater.x-.5)/asp)/max(uCrater.y,1e-3);float dune=(.2+.035*sin(gx*2.3+1.2)+.012*sin(gx*7.1))*uBed-.06*(1.-uBed)+uCrater.z*uCrater.y*.11*exp(-cd*cd*1.6);
        if(uClip>.5&&uv.y<dune)discard;
        float f=1.-abs(n.z);vec2 off=n.xy*vec2(asp,1.)*(.05+.05*f)*uBend;
        vec3 c=vec3(S(uv-off*1.12).r,S(uv-off).g,S(uv-off*.88).b)*vec3(.9,.97,1.)*1.06;
        c=mix(c,vec3(.62,.84,1.)*(.86+.14*smoothstep(-1.,1.,n.y)),uBody*(.62+.38*smoothstep(0.,.3,f)));  /* pale body, clearer on the faces */
        float sheen=smoothstep(.75,1.,sin((vW.x*.9+vW.y)*.011+1.2+n.x*3.));c+=vec3(.5,.75,1.)*sheen*.16*(1.-f);  /* a soft diagonal reflection across flat faces */
        c+=vec3(.03,.07,.13);
        c+=vec3(.14,.24,.36)*uBody*max(n.y,0.);                            /* lit from above */
        c=mix(c,vec3(.84,.96,1.),smoothstep(.05,.45,f)*.86);               /* bright cut edges, same tone as the plate rims */
        vec3 L=normalize(vec3(-.5,.62,.6)),R=reflect(vec3(0.,0.,-1.),n);
        c+=pow(max(dot(R,L),0.),34.)*.95+pow(max(dot(n,normalize(vec3(.55,.5,.67))),0.),90.)*.6;
        float cs=caustic(vW.xy*.0011+vec2(uTime*.012,0.),uTime*.8);c+=vec3(.4,.72,1.)*cs*.22*uSun;
        if(uClip>.5)c*=mix(.45,1.,smoothstep(0.,.035,uv.y-dune));          /* darker where it meets the sand */
        return c;}`;
  const glass = (body, bend = 1, clip = 0) => new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms: { ...G, uBody: { value: body }, uBend: { value: bend }, uClip: { value: clip } },
    vertexShader: `varying vec3 vN;varying vec3 vW;varying float vY;
      void main(){mat4 m=modelMatrix;
        #ifdef USE_INSTANCING
        m=m*instanceMatrix;
        #endif
        vec4 w=m*vec4(position,1.);vW=w.xyz;vY=position.y;vN=normalize(mat3(viewMatrix*m)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `precision highp float;varying vec3 vN;varying vec3 vW;varying float vY;${GLASS_FS}
      void main(){vec3 n=normalize(vN);if(!gl_FrontFacing)n=-n;gl_FragColor=vec4(glassAt(n,vW),1.);}` });
  const gAnchor = glass(.46, 1, 1), gIcon = glass(.5, .8), gChain = glass(.5, .7, 1), gEdge = glass(.3, .6);

  /* ---- anchor on a chain, riding the rail ---- */
  const D = 'M13.3 6.95 C16.8 5.5 16 0.7 12 .7 C8 .7 7.2 5.5 10.7 6.95 L10.7 9.7 L9 9.7 C7.3 9.7 7.3 12.3 9 12.3 L10.7 12.3 L10.7 19.65 C7.3 19.2 5.1 16.8 4.5 14 C6.2 15 7.2 12.8 5.5 11.9 L3.7 10.9 C2.7 10.3 1.6 11 1.7 12.1 C2.1 17.8 6.1 21.8 10.7 22.2 C10.8 23.7 13.2 23.7 13.3 22.2 C17.9 21.8 21.9 17.8 22.3 12.1 C22.4 11 21.3 10.3 20.3 10.9 L18.5 11.9 C16.8 12.8 17.8 15 19.5 14 C18.9 16.8 16.7 19.2 13.3 19.65 L13.3 12.3 L15 12.3 C16.7 12.3 16.7 9.7 15 9.7 L13.3 9.7 L13.3 6.95 Z';
  const shape = new THREE.Shape(), tk = D.match(/[MCLZ]|-?\d*\.?\d+/g); const X = v => +v - 12, Y = v => 4 - +v;
  for (let i = 0; i < tk.length;) { const c = tk[i++]; if (c === 'M') { shape.moveTo(X(tk[i]), Y(tk[i + 1])); i += 2; } else if (c === 'L') { shape.lineTo(X(tk[i]), Y(tk[i + 1])); i += 2; } else if (c === 'C') { shape.bezierCurveTo(X(tk[i]), Y(tk[i + 1]), X(tk[i + 2]), Y(tk[i + 3]), X(tk[i + 4]), Y(tk[i + 5])); i += 6; } else shape.closePath(); }
  const hole = new THREE.Path(); hole.absarc(0, 0, 1.5, 0, Math.PI * 2, true); shape.holes.push(hole);
  /* ---- the pendant: one piece of glass that can be the anchor or any of the three section marks ----
     Every outline is kept as a distance field (how far each point is from the edge), once sharp and at three stages of softening.
     Mixing fields mixes shapes whatever their holes or separate pieces, and mixing the softened ones is what makes it behave like
     hot glass: it relaxes into a bead, crosses over, and firms up into the new outline. The ring is drawn apart from the fields, so the
     shackle keeps its eye throughout. The form is found per pixel by marching a ray through the field, then lit by the same glass as everything else. */
  const FN = 256, FX = -13, FY = -21.6, FS = 26, SIGS = [0, .5, 1, 2], SOFT = 1.5, KEYS = ['anchor', 'brushfactory', 'data', 'design'];
  const ring = (cx, cy, r, n = 40) => Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * 6.2832) * r, cy + Math.sin(i / n * 6.2832) * r]);
  const rrect = (x0, y0, x1, y1, r, n = 8) => { const pts = []; [[x1 - r, y1 - r], [x0 + r, y1 - r], [x0 + r, y0 + r], [x1 - r, y0 + r]].forEach(([cx, cy], k) => { for (let i = 0; i <= n; i++) { const a = (k + i / n) * Math.PI / 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } }); return pts; };
  /* a section mark hung as a pendant: fitted under the ring on a short neck. The three bars also get a foot, so they are one piece of glass. */
  function pendantOf(key){ const o = key === 'data' ? { neck: -9.5, bottom: -19.2, extra: [rrect(-7.75, -19.9, 7.75, -18.3, .8)] } : {}, top = -4.6, bottom = o.bottom ?? -19.9, cs = [];
    for (const p of new SVGLoader().parse(ICONS[key]).paths) for (const sh of SVGLoader.createShapes(p)) { const e = sh.extractPoints(8); cs.push(e.shape, ...e.holes); }
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const c of cs) for (const v of c) { x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); }
    const s = Math.min((top - bottom) / (y1 - y0), 19.5 / (x1 - x0)), mx = (x0 + x1) / 2;
    return [cs.map(c => c.map(v => [(v.x - mx) * s, top - (v.y - y0) * s])), [rrect(-1.3, o.neck ?? -5.2, 1.3, -1.6, .4)], ...(o.extra || []).map(e => [e])]; }
  const outlineOf = key => key === 'anchor' ? [[shape.extractPoints(20).shape.map(v => [v.x, v.y]), ring(0, 0, 1.5)]] : pendantOf(key);
  /* Signed distance to a set of outlines. Exact, but quick: a coarse grid first finds which edges could possibly be nearest inside each cell,
     so a pixel only tests a handful; inside or outside comes from counting crossings along each row. Groups are merged. */
  function fieldOf(groups){ const N = FN, out = new Float32Array(N * N).fill(1e9), GR = 32, cell = FS / GR, r2 = cell * Math.SQRT2, per = N / GR;
    for (const cs of groups) { const A = [];
      for (const c0 of cs) { const c = c0.filter((p, i) => { const q = c0[(i + 1) % c0.length]; return Math.hypot(p[0] - q[0], p[1] - q[1]) > .012; }); for (let i = 0; i < c.length; i++) { const a = c[i], b = c[(i + 1) % c.length]; A.push(a[0], a[1], b[0] - a[0], b[1] - a[1]); } }
      const n = A.length / 4, ax = new Float32Array(n), ay = new Float32Array(n), ex = new Float32Array(n), ey = new Float32Array(n), il = new Float32Array(n);
      for (let k = 0; k < n; k++) { ax[k] = A[k * 4]; ay[k] = A[k * 4 + 1]; ex[k] = A[k * 4 + 2]; ey[k] = A[k * 4 + 3]; const l = ex[k] * ex[k] + ey[k] * ey[k]; il[k] = l > 0 ? 1 / l : 0; }
      const dist2 = (s, x, y) => { const px = x - ax[s], py = y - ay[s]; let t = (px * ex[s] + py * ey[s]) * il[s]; t = t < 0 ? 0 : t > 1 ? 1 : t; const qx = px - ex[s] * t, qy = py - ey[s] * t; return qx * qx + qy * qy; };
      const sign = new Int8Array(N * N), xs = [];
      for (let j = 0; j < N; j++) { const y = FY + (j + .5) / N * FS; xs.length = 0; for (let s = 0; s < n; s++) { const y1 = ay[s] + ey[s]; if ((ay[s] > y) !== (y1 > y)) xs.push(ax[s] + ex[s] * (y - ay[s]) / ey[s]); } xs.sort((a, b) => a - b);
        let k = 0, inside = 0; for (let i = 0; i < N; i++) { const x = FX + (i + .5) / N * FS; while (k < xs.length && xs[k] < x) { k++; inside ^= 1; } sign[j * N + i] = inside ? -1 : 1; } }
      const dc = new Float32Array(n), cand = new Int32Array(n);
      for (let gj = 0; gj < GR; gj++) for (let gi = 0; gi < GR; gi++) { const cx = FX + (gi + .5) * cell, cy = FY + (gj + .5) * cell; let best = 1e18;
        for (let s = 0; s < n; s++) { const d = dist2(s, cx, cy); dc[s] = d; if (d < best) best = d; }
        const lim = (Math.sqrt(best) + r2) ** 2; let m = 0; for (let s = 0; s < n; s++) if (dc[s] <= lim) cand[m++] = s;
        for (let j = gj * per; j < (gj + 1) * per; j++) { const y = FY + (j + .5) / N * FS; for (let i = gi * per; i < (gi + 1) * per; i++) { const x = FX + (i + .5) / N * FS; let b = 1e18;
          for (let q = 0; q < m; q++) { const d = dist2(cand[q], x, y); if (d < b) b = d; } const o = j * N + i, d = Math.sqrt(b) * sign[o]; if (d < out[o]) out[o] = d; } } } }
    return out; }
  /* the same field softened by a gaussian of the given width, worked at quarter size. Blurring a distance field rounds its edge the way heat rounds glass. */
  function soften(f, sigma){ const N = FN, n = N / 4, a = new Float32Array(n * n), b = new Float32Array(n * n);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let s = 0; for (let v = 0; v < 4; v++) for (let u = 0; u < 4; u++) s += f[(j * 4 + v) * N + i * 4 + u]; a[j * n + i] = s / 16; }
    const st = sigma / (FS / n), R = Math.ceil(st * 2.6), k = new Float32Array(R * 2 + 1); let ks = 0; for (let i = -R; i <= R; i++) ks += k[i + R] = Math.exp(-i * i / (2 * st * st)); for (let i = 0; i < k.length; i++) k[i] /= ks;
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let s = 0; for (let t = -R; t <= R; t++) s += a[j * n + Math.min(n - 1, Math.max(0, i + t))] * k[t + R]; b[j * n + i] = s; }
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let s = 0; for (let t = -R; t <= R; t++) s += b[Math.min(n - 1, Math.max(0, j + t)) * n + i] * k[t + R]; a[j * n + i] = s; }
    const out = new Float32Array(N * N);
    for (let j = 0; j < N; j++) { const v = Math.min(n - 1.001, Math.max(0, (j + .5) / 4 - .5)), j0 = Math.floor(v), fv = v - j0; for (let i = 0; i < N; i++) { const u = Math.min(n - 1.001, Math.max(0, (i + .5) / 4 - .5)), i0 = Math.floor(u), fu = u - i0;
      out[j * N + i] = (a[j0 * n + i0] * (1 - fu) + a[j0 * n + i0 + 1] * fu) * (1 - fv) + (a[(j0 + 1) * n + i0] * (1 - fu) + a[(j0 + 1) * n + i0 + 1] * fu) * fv; } }
    return out; }
  /* one texture holds everything: a layer per softness, a channel per shape */
  const fieldData = new Uint16Array(FN * FN * 4 * SIGS.length), fieldTex = new THREE.Data3DTexture(fieldData, FN, FN, SIGS.length);
  fieldTex.format = THREE.RGBAFormat; fieldTex.type = THREE.HalfFloatType; fieldTex.minFilter = fieldTex.magFilter = THREE.LinearFilter; fieldTex.unpackAlignment = 1;
  const morph = { w: [1, 0, 0, 0], m: 0, mv: 0, key: 'anchor', ready: {}, kick: 0, flip: 1, lock: false };
  function bake(key){ const ch = KEYS.indexOf(key), sharp = fieldOf(outlineOf(key)), cl = sharp.map(v => Math.max(-6, Math.min(6, v))), half = THREE.DataUtils.toHalfFloat, swell = key === 'anchor' ? .3 : .42;
    SIGS.forEach((sg, l) => { const f = sg ? soften(cl, sg) : sharp, o = l * FN * FN * 4 + ch; for (let i = 0; i < FN * FN; i++) fieldData[o + i * 4] = half(Math.max(-60, Math.min(60, f[i] - swell * sg))); });   /* softened glass also swells a little, so thin parts gather instead of vanishing */
    fieldTex.needsUpdate = true; morph.ready[key] = true; }
  bake('anchor'); KEYS.slice(1).forEach((k, i) => setTimeout(() => bake(k), 120 + i * 60));
  const PU = { ...G, uBody: { value: .46 }, uBend: { value: 1 }, uClip: { value: 1 }, tField: { value: fieldTex }, uW: { value: new THREE.Vector4(1, 0, 0, 0) }, uLz: { value: .125 }, uMelt: { value: 0 }, uPx: { value: .05 }, uCam: { value: new THREE.Vector3() }, uMW: { value: new THREE.Matrix4() }, uVP: { value: new THREE.Matrix4() } };
  const pendantMat = new THREE.ShaderMaterial({ uniforms: PU, transparent: true,
    vertexShader: 'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `precision highp float;precision highp sampler3D;varying vec3 vP;uniform sampler3D tField;uniform vec4 uW;uniform float uLz,uMelt,uPx;uniform vec3 uCam;uniform mat4 uMW,uVP;${GLASS_FS}
      float outline(vec2 p){vec2 uv=(p-vec2(${FX.toFixed(1)},${FY.toFixed(1)}))/${FS.toFixed(1)};float d=dot(texture(tField,vec3(uv,uLz)),uW)+length(max(abs(uv-.5)-.5,0.))*${FS.toFixed(1)};
        float r=length(p);return min(max(d,1.5-r),abs(r-2.4)-.9)-.5;}                                   /* the body, never closing the eye; then the ring itself */
      float map(vec3 p){float rr=.55+uMelt*.7,hz=1.65+uMelt*.25;vec2 q=vec2(outline(p.xy),abs(p.z)-hz)+rr;return min(max(q.x,q.y),0.)+length(max(q,0.))-rr;}   /* given thickness, with edges that round further as it softens */
      vec3 nrm(vec3 p){const vec2 e=vec2(.07,-.07);return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}
      void main(){vec3 rd=normalize(vP-uCam);float t=length(vP-uCam),tEnd=t+30.,best=1e3,tb=t;bool hit=false;
        for(int i=0;i<56;i++){float d=map(uCam+rd*t);if(d<best){best=d;tb=t;}if(d<.006){hit=true;break;}t+=d*.92;if(t>tEnd)break;}
        float a=1.;if(!hit){a=1.-best/uPx;if(a<=0.)discard;t=tb;}                                         /* a ray that just misses still shades a soft edge */
        vec3 p=uCam+rd*t,n=nrm(p);vec4 w=uMW*vec4(p,1.);
        vec3 c=glassAt(normalize(mat3(viewMatrix)*mat3(uMW)*n),w.xyz);c+=vec3(.4,.7,1.)*uMelt*.07;
        vec4 cp=uVP*w;gl_FragDepth=cp.z/cp.w*.5+.5;gl_FragColor=vec4(c,a);}` });
  const rig = new THREE.Group(), pendant = new THREE.Mesh(new THREE.BoxGeometry(FS, FS, 5.8).translate(0, FY + FS / 2, 0), pendantMat); pendant.frustumCulled = false; rig.add(pendant); scene.add(rig);
  pendant.onBeforeRender = () => { PU.uMW.value.copy(pendant.matrixWorld); PU.uCam.value.copy(cam.position).applyMatrix4(M.copy(pendant.matrixWorld).invert()); PU.uVP.value.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); };
  /* which shape it should be: the last marked part of the page whose top has passed the middle of the screen. It is always the anchor that goes to the seabed. */
  const zones = [...document.querySelectorAll('[data-morph]')].map(el => ({ el, top: 0 }));
  measureFns.push(() => zones.forEach(z => { const b = boxOf(z.el); z.top = b.y - b.h / 2; }));
  function wanted(){ let key = 'anchor'; const probe = V.cur + V.vh * .5; for (const z of zones) if (z.top <= probe) key = z.el.dataset.morph || 'anchor';
    if (V.short || V.p > .78 || V.time < .9 || !morph.ready[key]) key = 'anchor'; return key; }
  /* soften first, cross over while soft, then firm up. Every stage eases, and a change of mind part-way simply bends the path. */
  function stepMorph(dt, size){ const m = morph; if (!m.lock) { const key = wanted(), ti = KEYS.indexOf(key);
      if (key !== m.key) { m.key = key; m.flip = -m.flip; m.kick = m.flip * 1.5; }                         /* it turns a little in the water as it re-forms */
      if (V.paused) { m.w = m.w.map((_, i) => +(i === ti)); m.m = m.mv = 0; }
      else { let off = 0; for (let i = 0; i < 4; i++) off = Math.max(off, Math.abs(m.w[i] - +(i === ti))); const going = off > .15, W = 11;
        m.mv += (W * W * ((going ? 1 : 0) - m.m) - 2 * W * m.mv) * dt; m.m = Math.max(0, Math.min(1.05, m.m + m.mv * dt));
        const k = 1 - Math.exp(-dt * 11 * (going ? ss(.4, .9, m.m) : 1)); for (let i = 0; i < 4; i++) m.w[i] += (+(i === ti) - m.w[i]) * k; } }
    const sg = SOFT * Math.min(1, m.m), idx = Math.min(sg * 2, 1 + sg); PU.uW.value.fromArray(m.w); PU.uLz.value = (idx + .5) / SIGS.length; PU.uMelt.value = Math.min(1, m.m); PU.uPx.value = 1 / (size * DPR); }
  if (new URLSearchParams(location.search).has('lab')) window.__lab = { morph, V, rig };
  const LINKS = 150, linkGeo = new THREE.TorusGeometry(1, .24, 6, 20); linkGeo.scale(.6, 1, 1);
  /* a shackle joins chain to anchor: an oval loop that passes through the ring's eye front to back, wide enough to clear the anchor's thickness, and free to pivot toward the pull */
  const shGeo = new THREE.TorusGeometry(1, .125, 8, 30); shGeo.scale(2.45, 2.75, 1); shGeo.rotateY(Math.PI / 2); shGeo.translate(0, 1.72, 0);
  const shackle = new THREE.Mesh(shGeo, gChain); shackle.frustumCulled = false; scene.add(shackle); const QZ = new THREE.Quaternion(), AZ = new THREE.Vector3(0, 0, 1);
  const chain = new THREE.InstancedMesh(linkGeo, gChain, LINKS); chain.frustumCulled = false; scene.add(chain);
  const cPts = new Float32Array(41 * 2), cLen = new Float32Array(41), UP = new THREE.Vector3(0, 1, 0), tan = new THREE.Vector3(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion(), M = new THREE.Matrix4(), P3 = new THREE.Vector3(), S3 = new THREE.Vector3();
  let railX = 0, shade = 0, Lnow = 0, yaw = .3, yawV = 0, lean = 0, lastCx = 0, simW = 0, simH = 0; const sim = makeChainSim(40), TOP = -80;
  /* the seabed line, the same curve the water shader draws */
  const groundY = xs => { const bed = ss(.84, 1, V.p), q = (xs / V.vw - .5) * V.vw / V.vh; return V.vh * (1 - ((.2 + .035 * Math.sin(q * 2.3 + 1.2) + .012 * Math.sin(q * 7.1)) * bed - .06 * (1 - bed))); };
  measureFns.push(() => { const r = document.getElementById('rail').getBoundingClientRect(); railX = r.left + r.width / 2; });
  /* silt lifted when it sets down */
  /* sand clouds: kicked out along the floor and up on impact, then they billow, drift with the current and sink back */
  const PN = 170, pp = new Float32Array(PN * 3), ps = new Float32Array(PN), pa = new Float32Array(PN), puffs = Array.from({ length: PN }, () => ({ life: 0 })); let pNext = 0, wisp = 0, crater = 0, puffK = 1;
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); pg.setAttribute('aSize', new THREE.BufferAttribute(ps, 1)); pg.setAttribute('aA', new THREE.BufferAttribute(pa, 1));
  const puffPts = new THREE.Points(pg, new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, uniforms: { uDpr: { value: DPR } },
    vertexShader: 'attribute float aSize,aA;uniform float uDpr;varying float vA;void main(){vA=aA;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=aSize*uDpr;}',
    fragmentShader: 'precision highp float;varying float vA;void main(){vec2 q=gl_PointCoord-.5;float r=length(q)*2.;float a=smoothstep(1.,.1,r);gl_FragColor=vec4(mix(vec3(.2,.25,.33),vec3(.42,.5,.6),.5-q.y),a*a*vA);}' })); puffPts.frustumCulled = false; puffPts.renderOrder = 9; scene.add(puffPts);
  /* x, y in canvas pixels; power 0..1.5; along = share thrown sideways along the floor */
  function kick(xs, ys, n, power, along, spread){ for (let k = 0; k < n; k++) { const b = puffs[pNext = (pNext + 1) % PN], side = Math.random() < along, dir = Math.random() < .5 ? -1 : 1;
    b.x = xs - V.vw / 2 + (Math.random() - .5) * spread; b.h = Math.random() * 8;   /* height above the sand, so the cloud belongs to the floor and moves with it */
    b.vx = side ? dir * (140 + Math.random() * 420) * power : (Math.random() - .5) * 190 * power; b.vy = side ? 14 + Math.random() * 70 * power : (70 + Math.random() * 260) * power;
    b.s = (26 + Math.random() * 46) * (.7 + power * .5) * puffK; b.vx *= puffK; b.vy *= puffK; b.life = b.max = 2.6 + Math.random() * 3.2; b.a = .2 + Math.random() * .2; } }

  /* one ocean current for the page: a slow swell that reverses, a longer drift under it, and a faster ripple that travels down the chain */
  const current = y => Math.sin(V.time * .8 + y * .005) * 150 + Math.sin(V.time * .33 + 1.7) * 95 + Math.sin(V.time * 1.9 + y * .011) * 35;
  /* Water moving past it as the page scrolls sets it turning. Each scroll gesture picks its own direction and strength, and a slow wander
     keeps even a steady scroll from turning it evenly, so no two passes look the same. */
  let twDir = 1, twAmt = 0, twRest = 1;
  function twirl(sv, time){ const sp = Math.min(1, Math.abs(sv) / 1800);
    if (sp < .04) twRest = Math.min(1, twRest + .05); else if (twRest > .5) { twRest = 0; twDir = Math.random() < .5 ? -1 : 1; twAmt = .35 + Math.random() * .9; }
    return twDir * twAmt * sp * (.75 + .45 * Math.sin(time * 1.3 + twAmt * 9)) * 16; }
  function updateAnchor(){
    const { vw, vh, p, cur, time, dt, paused, sv } = V, wide = vw > 760, N = sim.N;
    const mid = ss(.02, .14, p) * (1 - ss(.86, .99, p)), end = ss(.86, .99, p);
    const full = Math.min(280, 2 * (vw - railX - 4)), size = full / 21.6 * (1 - mid * (wide ? .4 : .2)), H = size * 17.9;
    /* Scrolling only decides how much chain is let out. Where the anchor actually is comes out of the simulation. */
    const ringY = lerp(Math.max(vh * (wide ? .3 : .24) - cur, vh * (.2 + .3 * p)), groundY(railX) - H * .2, end); let want = Math.max(60, ringY - TOP);
    /* once it is down, spare chain is taken up so it runs from the ring with a slight bow instead of piling in a loop over the anchor */
    if (sim.ready && sim.grounded) want = Math.min(want, Math.hypot(sim.x[N] - sim.x[0], sim.y[N] - sim.y[0]) * 1.03 + 3);
    /* a winch has a top speed: the chain cannot change length instantly, however fast the page moves */
    if (!sim.ready || !Lnow) Lnow = want; else Lnow += Math.max(-1500 * dt, Math.min(1500 * dt, want - Lnow)); const L = Lnow;
    if (simW !== vw || simH !== vh) { simW = vw; simH = vh; sim.ready = false; }
    const gust = Math.min(60, Math.abs(sv) * .03), swayK = Math.max(.35, Math.min(1, (vw - railX) / 136)) * (1 - mid * .38) * (1 - end * .8);   /* and it steadies as it nears the floor, so it sets down under the chain */   /* less room on a phone, so a gentler push */
    sim.step(Math.max(dt, .001), { tx: railX - end * size * 4, ty: TOP, L, H, sink: H * .17, ground: groundY, link: size * .55, calm: paused, lift: Math.max(-700, Math.min(700, sv * .5)),
      flow: (y, i) => current(y) * swayK * (i > N ? .55 : i === N ? .8 : 1.7) + Math.sin(time * 2.6 + i * .4) * gust,   /* the current pushes light links hardest and the heavy anchor least; rougher while moving */
      push: ptr.seen ? { x: ptr.x, y: ptr.y, vx: ptr.vx, vy: ptr.vy, r: 150 } : null });                                             /* moving the pointer past it pushes the water */
    const rx = sim.x[N], ry = sim.y[N], cx = sim.x[N + 1], cy = sim.y[N + 1];
    /* it turns like a vane: sideways motion through the water twists it, drag settles it */
    const vxc = (cx - lastCx) / Math.max(dt, .001); lastCx = cx;
    yawV += (sim.grounded ? (.3 - yaw) * 14 : -yaw * 2.7 + Math.max(-900, Math.min(900, vxc)) * .0045 + (paused ? 0 : Math.sin(time * .31) * .22 + twirl(sv, time))) * dt; if (morph.kick) { if (!sim.grounded && !paused) yawV += morph.kick; morph.kick = 0; } yawV *= Math.pow(sim.grounded ? .02 : .3, dt);   /* once it is in the sand it cannot spin, it just comes to rest face-on */ yawV = Math.max(-7, Math.min(7, yawV)); yaw += yawV * dt; yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw)); if (sim.grounded) yaw = Math.max(-1.2, Math.min(1.2, yaw));   /* free to turn right round while it hangs */ if (paused) { yaw = .35; yawV = 0; }
    lean += ((sim.grounded ? -.12 : 0) - lean) * Math.min(1, dt * 3);
    shade += ((sim.grounded ? 1 : 0) - shade) * Math.min(1, dt * 4); water.mat.uniforms.uShadow.value.set((rx * .35 + cx * .65) / vw, 1 - groundY(cx) / vh + .004, shade * size * 11 / vh);   /* its shadow on the sand */
    stepMorph(dt, size);
    rig.position.set(rx - vw / 2, vh / 2 - ry, -40); rig.scale.setScalar(size); rig.rotation.set(lean, yaw, Math.atan2(cx - rx, cy - ry));
    let total = 0; for (let i = 0; i <= 40; i++) { const j = N - i, x = sim.x[j] - vw / 2, y = vh / 2 - sim.y[j]; if (i) total += Math.hypot(x - cPts[i * 2 - 2], y - cPts[i * 2 - 1]); cPts[i * 2] = x; cPts[i * 2 + 1] = y; cLen[i] = total; }
    const s = size * 1.55, pitch = s * 1.5; let seg = 1, n = 0;
    /* the shackle swings to face the first stretch of chain */
    { const dx = sim.x[N - 3] - rx, dy = -(sim.y[N - 3] - ry); let rel = Math.atan2(-dx, dy) - rig.rotation.z; rel = Math.atan2(Math.sin(rel), Math.cos(rel)); rel = Math.max(-1.3, Math.min(1.3, rel));
      shackle.position.copy(rig.position); shackle.scale.setScalar(size); shackle.quaternion.copy(rig.quaternion).multiply(QZ.setFromAxisAngle(AZ, rel)); }
    /* links start above the shackle, the first one lying flat to the anchor so it threads the shackle; once the anchor is down the chain drapes in front of it instead of passing through */
    for (let d = size * 5.25; d < total && n < LINKS; d += pitch, n++) { while (seg < 40 && cLen[seg] < d) seg++; const a = seg - 1, f = (d - cLen[a]) / Math.max(1e-3, cLen[seg] - cLen[a]);
      P3.set(lerp(cPts[a * 2], cPts[seg * 2], f), lerp(cPts[a * 2 + 1], cPts[seg * 2 + 1], f), -40 + crater * size * 3.1 * Math.sin(Math.PI * Math.min(1, (n + .6) / 13))); tan.set(cPts[seg * 2] - cPts[a * 2], cPts[seg * 2 + 1] - cPts[a * 2 + 1], 1e-5).normalize();
      q.setFromUnitVectors(UP, tan); q2.setFromAxisAngle(UP, (n % 2 ? Math.PI / 2 : 0) + Math.sin(yaw) * Math.exp(-n / 7)); q.multiply(q2); S3.setScalar(s); M.compose(P3, q, S3); chain.setMatrixAt(n, M); }
    chain.count = n; chain.instanceMatrix.needsUpdate = true;
    if (!paused) {
      const gcx = groundY(cx), reach = size * 9; puffK = Math.max(.3, Math.min(1, size / 11));   /* a small anchor raises a small cloud */
      if (sim.hit) kick(cx, gcx, Math.round(30 + 50 * Math.min(1.4, sim.hit / 450)), Math.max(.35, Math.min(1.4, sim.hit / 450)), .55, reach);      /* the crown goes in */
      if (sim.tip) kick(cx + (rx - cx) * .6, groundY(cx + (rx - cx) * .6), 26, Math.max(.3, Math.min(1, sim.tip / 380)), .4, reach * .7);           /* an arm comes down */
      if (sim.exit) kick(cx, gcx, 34, Math.max(.4, Math.min(1.1, sim.exit / 420)), .2, reach);                                                    /* pulled back out */
      if (sim.grounded && sim.tg < 3.2) { wisp += dt; if (wisp > .11) { wisp = 0; kick(cx + (rx - cx) * Math.random() * .6, gcx, 1, .28, .3, reach); } }   /* still settling */
    }
    crater += ((sim.grounded ? 1 : 0) - crater) * Math.min(1, dt * (sim.grounded ? 4 : .7)); G.uBed.value = ss(.84, 1, p); G.uCrater.value.set((cx * .8 + rx * .2) / vw, size * 10 / vh, crater); water.mat.uniforms.uCrater.value.copy(G.uCrater.value);
    for (let i = 0; i < PN; i++) { const b = puffs[i]; if (b.life > 0) { b.life -= dt; const age = b.max - b.life, k = b.life / b.max, dr = Math.exp(-1.9 * dt);
      const gy = groundY(b.x + V.vw / 2); b.vx = b.vx * dr + current(gy - b.h) * .05 * dt; b.vy = b.vy * dr + (16 - age * 9) * dt; b.x += b.vx * dt; b.h = Math.max(-6, b.h + b.vy * dt);
      pp[i * 3] = b.x; pp[i * 3 + 1] = V.vh / 2 - gy + b.h; pp[i * 3 + 2] = -20; ps[i] = b.s * (1 + age * 1.5); pa[i] = b.a * Math.min(1, age * 7) * Math.pow(k, 1.25) * ss(0, .4, G.uBed.value); }   /* and it is gone once the floor has left the frame */ else pa[i] = 0; }
    pg.attributes.position.needsUpdate = pg.attributes.aSize.needsUpdate = pg.attributes.aA.needsUpdate = true;
  }

  /* ---- section icons, extruded from the site's own SVGs ---- */
  const loader = new SVGLoader();
  const icons = [...document.querySelectorAll('.ico')].map((el, i) => {
    const shapes = loader.parse(ICONS[el.dataset.icon]).paths.flatMap(pth => SVGLoader.createShapes(pth));
    const probe = new THREE.ShapeGeometry(shapes); probe.computeBoundingBox(); const bb = probe.boundingBox, hgt = bb.max.y - bb.min.y, wid = bb.max.x - bb.min.x; probe.dispose();
    const g = new THREE.ExtrudeGeometry(shapes, { depth: hgt * .1, bevelEnabled: true, bevelThickness: hgt * .03, bevelSize: hgt * .026, bevelSegments: 2, curveSegments: 20 });
    g.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -hgt * .05); g.rotateX(Math.PI); g.scale(1 / hgt, 1 / hgt, 1 / hgt);
    el.style.width = (wid / hgt).toFixed(3) + 'em';
    const mesh = new THREE.Mesh(g, gIcon); scene.add(mesh);
    return { el, mesh, box: null, ph: i * 2.1, spin: 0, sv: 0 };
  });

  /* ---- glass plates: any proportion. data-ar is the plate's width / height, data-iar the picture's; a picture wider or taller than its plate is cropped to cover it ---- */
  const slabs = new Map();
  function slabFor(ar){ const key = ar.toFixed(3); if (slabs.has(key)) return slabs.get(key);
    const sh = new THREE.Shape(), w = .5, h = .5 / ar, r = Math.min(.045, h * .5);
    sh.moveTo(-w + r, -h); sh.lineTo(w - r, -h); sh.quadraticCurveTo(w, -h, w, -h + r); sh.lineTo(w, h - r); sh.quadraticCurveTo(w, h, w - r, h); sh.lineTo(-w + r, h); sh.quadraticCurveTo(-w, h, -w, h - r); sh.lineTo(-w, -h + r); sh.quadraticCurveTo(-w, -h, -w + r, -h);
    const g = new THREE.ExtrudeGeometry(sh, { depth: .03, bevelEnabled: true, bevelThickness: .012, bevelSize: .01, bevelSegments: 5, curveSegments: 12 }); g.translate(0, 0, -.042); /* front face sits on z = 0 so it matches its layout box exactly */
    slabs.set(key, g); return g; }
  const fog = new THREE.Color();
  const plates = [...document.querySelectorAll('[data-plate]')].map((el, i) => {
    const ar = +el.dataset.ar || 4 / 3, iar = +el.dataset.iar || ar, turn = el.dataset.turn === undefined ? 1 : +el.dataset.turn, slab = slabFor(ar);
    const img = el.querySelector('img'), tex = new THREE.Texture(img); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const ready = () => { tex.needsUpdate = true; }; img.complete ? ready() : img.addEventListener('load', ready);
    const mat = new THREE.ShaderMaterial({ uniforms: { tImg: { value: tex }, uTime: { value: 0 }, uSun: { value: 1 }, uHover: { value: 0 }, uFog: { value: fog }, uFogAmt: { value: 0 }, uHalf: { value: .5 / ar }, uFit: { value: new THREE.Vector2(Math.min(1, ar / iar), Math.min(1, iar / ar)) } },
      vertexShader: 'varying vec2 vP;varying vec3 vW;varying vec3 vN;void main(){vP=position.xy;vN=normalize(normalMatrix*normal);vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
      fragmentShader: `precision highp float;uniform sampler2D tImg;uniform float uTime,uSun,uHover,uFogAmt,uHalf;uniform vec2 uFit;uniform vec3 uFog;varying vec2 vP;varying vec3 vW;varying vec3 vN;${NOISE}
        void main(){vec2 uv=vec2(vP.x,vP.y/(2.*uHalf))*uFit+.5;vec3 c=texture2D(tImg,uv).rgb;
          float cs=caustic(vW.xy*.0011+vec2(uTime*.012,0.),uTime*.8);float lum=dot(c,vec3(.3,.6,.1));
          c+=c*cs*1.6*uSun+vec3(.3,.62,1.)*cs*.2*uSun; /* sunlight dappling across the glass, at the strength it first had */
          float rr=min(.045,uHalf*.5);vec2 q=abs(vP)-vec2(.5,uHalf)+rr;float d=length(max(q,0.))+min(max(q.x,q.y),0.)-rr;
          c=mix(c,vec3(.72,.9,1.),smoothstep(-.014,-.002,d)*(.7+.3*uHover));
          float sweep=smoothstep(.12,0.,abs(vP.x+vP.y*.4-(uHover*1.8-.9)));c+=vec3(.5,.8,1.)*sweep*uHover*(1.-uHover)*1.6;
          c*=.82+.18*abs(vN.z);c=mix(c,uFog,uFogAmt);
          gl_FragColor=vec4(pow(c,vec3(1./2.2)),1.);}` });
    const mesh = new THREE.Mesh(slab, [mat, gEdge]); scene.add(mesh);
    const o = { el, mesh, mat, turn, hover: 0, want: 0, ph: i * 1.9, side: 1, box: null };
    const host = el.closest('a,button') || el; host.addEventListener('pointerenter', () => o.want = 1); host.addEventListener('pointerleave', () => o.want = 0); host.addEventListener('focus', () => o.want = 1); host.addEventListener('blur', () => o.want = 0);
    return o;
  });
  measureFns.push(() => { plates.forEach(o => { o.box = boxOf(o.el); o.side = o.box.x < V.vw * .46 ? -1 : 1; }); icons.forEach(o => { o.box = boxOf(o.el); }); });
  watchLayout(() => { measure(); renderer.setSize(V.vw, V.vh, false); pxCamera(cam, FOV); water.resize(); sceneRT?.dispose(); const bw = Math.round(V.vw * DPR), bh = Math.round(V.vh * DPR); sceneRT = new THREE.WebGLRenderTarget(bw, bh, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }); G.tScene.value = sceneRT.texture; G.uRes.value.set(bw, bh); });
  document.fonts?.load('800 80px Syne').then(measure, () => {});

  const mix3 = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  runLoop(() => {
    const { p, paused, vw, vh, cur, time, dt, sv } = V;
    water.set(V.dark, ss(.84, 1, p)); snow.update(); updateAnchor();
    const dk = V.dark, top = mix3([.10, .50, .86], [.006, .05, .16], ss(0, .5, dk)), bot = mix3([.012, .14, .40], [.003, .018, .07], ss(0, .75, dk)); fog.setRGB(...mix3(bot, top, .45)).convertSRGBToLinear();
    for (const o of plates) {
      const b = o.box; if (!b) continue; const sy = b.y - cur, t = (sy - vh / 2) / vh; o.mesh.visible = b.w > 2 && Math.abs(t) < .75 + b.h / vh; if (!o.mesh.visible) continue;
      o.hover += (o.want - o.hover) * Math.min(1, dt * 6);
      /* flat and exactly on its layout box through the middle of the screen; turning only near the edges */
      const e = Math.max(0, Math.abs(t) - .2 - Math.max(0, b.h / vh - .55) * .5), f = paused ? 0 : Math.sign(t) * Math.pow(Math.min(1.1, e), 1.3) * 1.25 * o.turn, af = Math.abs(f);
      const hx = Math.max(-.6, Math.min(.6, (ptr.x - b.x) / b.w)), hy = Math.max(-.6, Math.min(.6, (ptr.y - sy) / b.h));
      o.mesh.position.set(b.x - vw / 2 + o.side * af * 70, vh / 2 - sy + (paused ? 0 : Math.sin(time * .6 + o.ph) * 5 * Math.min(1, af * 4)), -af * 380 + o.hover * 40);
      o.mesh.rotation.set(f * .34 + hy * .2 * o.hover, o.side * f * -1.2 + hx * .3 * o.hover, o.side * f * .1);
      o.mesh.scale.setScalar(b.w / 1.02);
      const u = o.mat.uniforms; u.uTime.value = time; u.uSun.value = 1 - ss(.15, .8, dk); u.uHover.value = o.hover; u.uFogAmt.value = ss(.3, 1.05, Math.abs(t)) * .8 * Math.min(1, o.turn + .25);
    }
    for (const o of icons) {
      const b = o.box; if (!b) continue; const sy = b.y - cur; o.mesh.visible = sy > -b.h * 2 && sy < vh + b.h * 2; if (!o.mesh.visible) continue;
      o.sv += (-o.spin * 9 + Math.max(-3000, Math.min(3000, sv)) * .0022) * dt; o.sv *= Math.pow(.2, dt); o.spin += o.sv * dt; if (paused) o.spin = 0;
      o.mesh.position.set(b.x - vw / 2, vh / 2 - sy + (paused ? 0 : Math.sin(time * .8 + o.ph) * b.h * .03), 0); o.mesh.scale.setScalar(b.h * .96);
      o.mesh.rotation.set(paused ? 0 : Math.sin(time * .5 + o.ph) * .08 + ptr.ny * .08, (paused ? -.35 : -.35 + Math.sin(time * .42 + o.ph) * .22 + ptr.nx * .12) + o.spin, paused ? 0 : -current(sy) * .0005);   /* the icons lean with the same current */
    }
    G.uTime.value = time; G.uSun.value = 1 - ss(.15, .8, dk);
    renderer.setRenderTarget(sceneRT); renderer.clear(); renderer.render(water.scene, water.cam); renderer.render(back, cam);
    renderer.setRenderTarget(null); renderer.clear(); renderer.render(blitScene, oCam); renderer.clearDepth(); renderer.render(scene, cam);
  });
}

/* ===== page behaviours: archive filter, picture viewer, document controls ===== */
/* the work index: the tabs show one theme at a time, and the pendant takes that theme's shape */
const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => { const theme = button.dataset.filter; let count = 0;
  filters.forEach(b => b.setAttribute('aria-pressed', String(b === button))); const zone = document.querySelector('main[data-morph]'); if (zone) zone.dataset.morph = theme === 'all' ? '' : theme;
  document.querySelectorAll('.coll[data-theme], .feat[data-theme]').forEach(el => { el.hidden = theme !== 'all' && el.dataset.theme !== theme; if (!el.hidden && el.matches('.coll')) count += el.querySelectorAll('.row').length; });
  const counter = document.querySelector('.count'); if (counter) counter.textContent = `${count} ${count === 1 ? 'project' : 'projects'}`; measure(); }));

/* panels that follow the reader down a long page (the page itself is moved by script, so CSS sticky cannot be used) */
const pageTop = el => { let y = 0; for (let e = el; e && e !== page; e = e.offsetParent) y += e.offsetTop; return y; };
const sticks = [...document.querySelectorAll('[data-stick]')].map(el => ({ el, top: 0, max: 0, on: false }));
measureFns.push(() => sticks.forEach(s => { s.on = getComputedStyle(s.el).getPropertyValue('--stick').trim() === '1'; s.top = pageTop(s.el); const par = s.el.parentElement; s.max = Math.max(0, pageTop(par) + par.offsetHeight - s.top - s.el.offsetHeight); if (!s.on) s.el.style.transform = ''; }));
frameHooks.push(() => { for (const s of sticks) if (s.on) { const y = Math.max(0, Math.min(s.max, V.cur + (+s.el.dataset.stick || 100) - s.top)); s.el.style.transform = y > .5 ? `translate3d(0,${y.toFixed(1)}px,0)` : ''; } });

/* contents: marks the chapter being read */
const tocLinks = [...document.querySelectorAll('[data-toc]')].map(a => ({ a, el: document.getElementById(a.dataset.toc), top: 0 }));
if (tocLinks.length) { let current = null; measureFns.push(() => tocLinks.forEach(t => t.top = pageTop(t.el)));
  frameHooks.push(() => { let pick = tocLinks[0]; for (const t of tocLinks) if (t.top <= V.cur + V.vh * .35) pick = t; if (pick !== current) { current?.a.removeAttribute('aria-current'); pick.a.setAttribute('aria-current', 'true'); current = pick; } }); }

/* the work index: a picture of each project follows the pointer over its row */
const rows = [...document.querySelectorAll('[data-peek]')];
if (rows.length && matchMedia('(hover: hover)').matches) {
  const peek = document.createElement('div'), img = new Image(); peek.className = 'peek'; peek.setAttribute('aria-hidden', 'true'); img.alt = ''; peek.append(img); document.body.append(peek);
  const at = { x: 0, y: 0, tx: 0, ty: 0, on: false };
  rows.forEach(r => { r.addEventListener('pointerenter', e => { img.src = r.dataset.peek; at.on = true; peek.classList.add('on'); if (!peek.dataset.seen) { at.x = at.tx = e.clientX; at.y = at.ty = e.clientY; peek.dataset.seen = 1; } });
    r.addEventListener('pointerleave', () => { at.on = false; peek.classList.remove('on'); }); });
  addEventListener('pointermove', e => { at.tx = e.clientX; at.ty = e.clientY; }, { passive: true });
  frameHooks.push(() => { const k = V.paused ? 1 : .18; at.x += (at.tx - at.x) * k; at.y += (at.ty - at.y) * k; const w = peek.offsetWidth, h = peek.offsetHeight, x = Math.min(at.x + 28, innerWidth - w - 16), y = Math.max(16, Math.min(at.y - h / 2, innerHeight - h - 16)); peek.style.left = x + 'px'; peek.style.top = y + 'px'; });
}

const dialog = document.querySelector('.viewer');
if (dialog) { const images = [...document.querySelectorAll('[data-image]')]; let selected = 0, trigger;
  const show = index => { selected = (index + images.length) % images.length; const item = images[selected], img = dialog.querySelector('img'); img.src = item.dataset.image; img.alt = item.dataset.caption; dialog.querySelector('.viewer-caption').textContent = item.dataset.caption; dialog.querySelector('.viewer-count').textContent = `${selected + 1} / ${images.length}`; };
  images.forEach((button, index) => button.addEventListener('click', () => { trigger = button; show(index); dialog.showModal(); }));
  dialog.querySelector('.viewer-prev').addEventListener('click', () => show(selected - 1)); dialog.querySelector('.viewer-next').addEventListener('click', () => show(selected + 1)); dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); }); dialog.addEventListener('close', () => trigger?.focus());
  dialog.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { e.preventDefault(); show(selected - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); show(selected + 1); } }); }
document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));
document.querySelectorAll('[name="resume-focus"]').forEach(input => input.addEventListener('change', () => { window.setMode?.(input.value); measure(); }));
document.querySelector('[data-resume-save]')?.addEventListener('click', () => window.downloadResume?.(document.querySelector('[name="resume-format"]:checked')?.value || 'styled'));
