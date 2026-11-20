/* Offline runtime for the Casa Pasinetti page: renders the x-dc template with {{holes}}, sc-for and sc-if,
   patches the live DOM in place (so the WebGL canvas, focus and animations survive re-renders)
   and maps the image ids to the files in assets/img. */
(function () {
  'use strict';
  // ---- embedded images -> data: URIs (blob: URLs are blocked by some previewers and sandboxed viewers)
  var BL = {};
  try {
    var data = JSON.parse(document.getElementById('dc-assets').textContent);
    Object.keys(data).forEach(function (id) { BL[id] = data[id]; });
  } catch (e) { console.error(e); }
  var fixUrls = function (s) {
    return s.indexOf('/_blob/') < 0 ? s : s.replace(/\/_blob\/([0-9a-f]{32})/g, function (m, id) { return BL[id] || m; });
  };

  // ---- template evaluation
  function get(path, sc) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var v = sc, ks = path.split('.');
    for (var i = 0; i < ks.length; i++) { if (v == null) return undefined; v = v[ks[i]]; }
    return v;
  }
  function interp(str, sc) {
    var m = str.match(/^\{\{([^}]+)\}\}$/);
    if (m) return get(m[1], sc);
    return str.replace(/\{\{([^}]+)\}\}/g, function (_, p) { var v = get(p, sc); return v == null ? '' : String(v); });
  }
  var FORM = { input: 1, select: 1, textarea: 1 };
  function build(node, sc, out) {
    if (node.nodeType === 3) { var t = interp(node.data, sc); out.appendChild(document.createTextNode(t == null ? '' : String(t))); return; }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    if (tag === 'sc-for') {
      var list = interp(node.getAttribute('list') || '', sc) || [], as = node.getAttribute('as') || 'item';
      for (var i = 0; i < list.length; i++) {
        var s2 = Object.create(sc); s2[as] = list[i]; s2.$index = i;
        for (var c = node.firstChild; c; c = c.nextSibling) build(c, s2, out);
      }
      return;
    }
    if (tag === 'sc-if') {
      if (interp(node.getAttribute('value') || '', sc)) for (var c2 = node.firstChild; c2; c2 = c2.nextSibling) build(c2, sc, out);
      return;
    }
    var el = document.createElementNS(node.namespaceURI, tag);
    var A = {}, H = null, lz = null;
    for (var k = 0; k < node.attributes.length; k++) {
      var a = node.attributes[k], n = a.name, v = interp(a.value, sc);
      if (n === 'ref') { el.__refKey = a.value; el.__ref = v; continue; }
      if (n === 'loading') { lz = v; continue; } // native lazy loading; set before src so it takes effect
      if (n.indexOf('on') === 0 && n.length > 2) { if (typeof v === 'function') (H || (H = {}))[n.slice(2)] = v; continue; }
      if (n === 'checked') { el.__checked = !!v; continue; }
      if (n === 'value' && FORM[tag]) { el.__value = v; continue; }
      if (v === false || v == null) continue;
      A[n] = v === true ? '' : fixUrls(String(v));
    }
    if (lz) { var A2 = { loading: lz }; for (var q in A) A2[q] = A[q]; A = A2; }
    el.__a = A; el.__h = H;
    for (var c3 = node.firstChild; c3; c3 = c3.nextSibling) build(c3, sc, el);
    out.appendChild(el);
  }

  // ---- in-place patching
  var LIVE = {}, mounted = [];
  function setA(el, k, v) {
    if (k.indexOf('xlink:') === 0) el.setAttributeNS('http://www.w3.org/1999/xlink', k, v); else el.setAttribute(k, v);
  }
  function applyProps(live, nn) {
    var oh = live.__hl || {}, nh = nn.__h || {}, ev;
    for (ev in oh) if (!nh[ev]) live['on' + ev] = null;
    for (ev in nh) if (live['on' + ev] !== nh[ev]) live['on' + ev] = nh[ev];
    live.__hl = nh;
    if (nn.__checked !== undefined && live.checked !== nn.__checked) live.checked = nn.__checked;
    if (nn.__value !== undefined && live.localName !== 'select') {
      var v = nn.__value == null ? '' : String(nn.__value);
      var typing = document.activeElement === live && (live.localName === 'textarea' || /^(text|search|email|tel|number)$/.test(live.type));
      if (live.value !== v && !typing) live.value = v;
    }
  }
  function adopt(el) {
    if (el.nodeType !== 1) return;
    var A = el.__a || {};
    for (var k in A) setA(el, k, A[k]);
    el.__av = A;
    for (var c = el.firstChild; c; c = c.nextSibling) adopt(c);
    applyProps(el, el);
    if (el.localName === 'select' && el.__value !== undefined) el.value = String(el.__value);
    if (el.__refKey) { LIVE[el.__refKey] = el; if (typeof el.__ref === 'function') mounted.push([el.__ref, el]); }
  }
  function same(a, b) {
    return a.nodeType === b.nodeType && (a.nodeType !== 1 || (a.localName === b.localName && a.namespaceURI === b.namespaceURI && (a.__refKey || '') === (b.__refKey || '')));
  }
  function isRef(n) { return n && n.nodeType === 1 && !!n.__refKey; }
  function morphNode(live, nn) {
    if (live.nodeType === 3) { if (live.data !== nn.data) live.data = nn.data; return; }
    if (live.nodeType !== 1) return;
    // only touch attributes this runtime set: code such as three.js may add its own (canvas width/height)
    var A = nn.__a || {}, prev = live.__av || {};
    for (var n in prev) if (!(n in A)) live.removeAttribute(n);
    for (var k in A) if (prev[k] !== A[k]) setA(live, k, A[k]);
    live.__av = A;
    if (nn.__refKey) live.__ref = nn.__ref;
    if (live.localName !== 'canvas') morphChildren(live, nn);
    applyProps(live, nn);
    if (live.localName === 'select' && nn.__value !== undefined) { var sv = String(nn.__value); if (live.value !== sv) live.value = sv; }
  }
  function morphChildren(lp, np) {
    var o = lp.firstChild, n = np.firstChild;
    while (n) {
      var nNext = n.nextSibling;
      if (o && same(o, n)) { morphNode(o, n); o = o.nextSibling; }
      else if (isRef(n) && LIVE[n.__refKey]) {
        var live = LIVE[n.__refKey];
        if (live !== o) lp.insertBefore(live, o || null);
        morphNode(live, n); o = live.nextSibling;
      } else if (o && !isRef(o) && o.nextSibling && same(o.nextSibling, n)) {
        var dead = o; o = o.nextSibling; lp.removeChild(dead); morphNode(o, n); o = o.nextSibling;
      } else { lp.insertBefore(n, o || null); adopt(n); }
      n = nNext;
    }
    while (o) { var nx = o.nextSibling; lp.removeChild(o); o = nx; }
  }

  // ---- component plumbing
  var comp = null, TPL = null, ROOT = null, first = true, queued = false, afters = [];
  function render() {
    queued = false;
    var vals = comp.renderVals();
    var box = document.createElement('div');
    for (var c = TPL.firstChild; c; c = c.nextSibling) build(c, vals, box);
    mounted = [];
    morphChildren(ROOT, box);
    var m = mounted; mounted = [];
    m.forEach(function (p) { try { p[0](p[1]); } catch (e) { console.error(e); } });
    try {
      if (first) { first = false; if (comp.componentDidMount) comp.componentDidMount(); }
      else if (comp.componentDidUpdate) comp.componentDidUpdate();
    } catch (e) { console.error(e); }
    var cbs = afters; afters = [];
    cbs.forEach(function (f) { try { f(); } catch (e) { console.error(e); } });
  }
  function schedule() {
    if (queued) return;
    queued = true;
    (window.requestAnimationFrame || setTimeout)(function () { if (queued) render(); });
    setTimeout(function () { if (queued) render(); }, 120); // background tabs: rAF is paused
  }
  function DCLogic(props) { this.props = props || {}; this.state = null; }
  DCLogic.prototype.setState = function (o, cb) {
    var patch = typeof o === 'function' ? o(this.state || {}, this.props) : o;
    this.state = Object.assign({}, this.state || {}, patch || {});
    if (typeof cb === 'function') afters.push(cb);
    if (comp) schedule();
  };
  DCLogic.prototype.forceUpdate = function (cb) { if (typeof cb === 'function') afters.push(cb); schedule(); };
  window.DCLogic = DCLogic;
  window.__dcStart = function (Component) {
    var props = {};
    try { props = window.DC_PROPS || JSON.parse(document.getElementById('dc-props').textContent); } catch (e) { /* defaults */ }
    TPL = document.getElementById('dc-tpl').content;
    ROOT = document.getElementById('dc-root');
    comp = new Component(props);
    window.__dc = comp;
    render();
  };
})();
