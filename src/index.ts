// @ts-ignore
import kronoFlow from 'krono-flow';

const H = kronoFlow.math.geom.H;

const animationList = [
  [
    {
      translateX: '-20%',
      translateY: '-20%',
      translateZ: 100,
      rotateZ: 10,
      visibility: 'visible',
    },
    {
      translateX: 0,
      translateY: 0,
      rotateZ: 0,
      offset: 0.5,
      visibility: 'hidden',
    },
    {
      translateX: 0,
      translateY: 0,
      rotateZ: 0,
      offset: 1,
      visibility: 'hidden',
    },
  ],
  [
    {
      translateX: '10%',
      translateY: '-40%',
      rotateZ: 20,
      visibility: 'visible',
    },
    {
      translateX: 0,
      translateY: 0,
      rotateZ: 0,
      offset: 0.5,
      visibility: 'hidden',
    },
    {
      translateX: 0,
      translateY: 0,
      rotateZ: 0,
      offset: 1,
      visibility: 'hidden',
    },
  ],
  [
    {
      translateX: '10%',
      translateY: '15%',
      rotateZ: -30,
      visibility: 'visible',
    },
    {
      translateX: 0,
      translateY: 0,
      rotateZ: 0,
      offset: 0.5,
      visibility: 'hidden',
    },
    {
      translateX: 0,
      translateY: 0,
      rotateZ: 0,
      offset: 1,
      visibility: 'hidden',
    },
  ],
  [
    {
      translateX: '-25%',
      translateY: '-5%',
      rotateZ: -25,
      visibility: 'visible',
    },
    {
      translateX: 0,
      translateY: 0,
      rotateZ: 0,
      offset: 0.5,
      visibility: 'hidden',
    },
    {
      translateX: 0,
      translateY: 0,
      rotateZ: 0,
      offset: 1,
      visibility: 'hidden',
    },
  ],
];

const pAnimation: kronoFlow.animation.JKeyFrame[] = [
  {
    rotateX: 10,
    rotateY: -30,
    rotateZ: -90,
    scaleX: 0.5,
    scaleY: 0.5,
    offset: 0,
  },
  {
    rotateX: 10,
    rotateY: -30,
    rotateZ: -90,
    scaleX: 0.5,
    scaleY: 0.5,
    offset: 0.3,
    easing: 'ease-in',
  },
  {
    rotateX: 2,
    rotateY: -24,
    rotateZ: -78,
    scaleX: 0.6,
    scaleY: 0.6,
    offset: 0.5,
    easing: 'ease-in',
  },
  {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scaleX: 1,
    scaleY: 1,
    offset: 1,
  },
];

export function puzzleAnimate(node: kronoFlow.node.Node, options: kronoFlow.animation.Options & {
  rp: number,
}) {
  if (!node.isMounted) {
    throw new Error('Target node muse be mounted.');
  }
  const { left, top, width, height, transformOrigin } = node.computedStyle;
  const r = Math.floor(Math.min(width, height) * Math.max(0.01, Math.min(0.5, options.rp || 0.1)));
  const container = new kronoFlow.node.Container({
    name: 'c',
    style: {
      left: 0,
      top: 0,
      width: node.parent!.computedStyle.width,
      height: node.parent!.computedStyle.height,
    },
  });
  node.insertAfter(container);
  const a = container.animate(pAnimation, options);
  const list = genMaskPoints(width, height, r);
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const mask = new kronoFlow.node.Polyline({
      name: 'm' + i,
      points: item.p,
      style: {
        left: left + item.x,
        top: top + item.y,
        width: item.w,
        height: item.h,
        fill: ['#FFF'],
        fillEnable: [true],
        fillOpacity: [1],
        maskMode: 'alpha',
        transformOrigin: [transformOrigin[0] - item.x, transformOrigin[1] - item.y],
      },
    });
    const subContainer = new kronoFlow.node.Container({
      name: 'subC' + i,
      style: {
        left: 0,
        top: 0,
        width: node.parent!.computedStyle.width,
        height: node.parent!.computedStyle.height,
      },
    });
    const clone = node.clone();
    clone.name += i;
    // 避免原始目标不可见
    clone.updateStyle({
      visibility: 'visible',
    });
    container.appendChild(subContainer);
    subContainer.appendChild(mask);
    subContainer.appendChild(clone);
    subContainer.animate(animationList[i], options);
  }
  a.on('beforeFrame', () => {
    const computedStyle = container.computedStyle;
    node.updateStyle({
      rotateX: computedStyle.rotateX,
      rotateY: computedStyle.rotateY,
      rotateZ: computedStyle.rotateZ,
      scaleX: computedStyle.scaleX,
      scaleY: computedStyle.scaleY,
      // visibility: subContainer.computedStyle.visibility === kronoFlow.style.define.VISIBILITY.HIDDEN ? 'visible' : 'hidden',
    });
  });
  node.animate([
    {
      visibility: 'hidden',
    },
    {
      visibility: 'visible',
      offset: 0.5,
    },
    {
      visibility: 'visible',
    },
  ], options);
}

function genMaskPoints(w: number, h: number, r: number) {
  const d = r * 2;
  const xm = Math.round(w * 0.5);
  const ym = Math.round(h * 0.5);
  const h1 = ym + r;
  const w2 = w - xm + r;
  const w3 = w - xm;
  const h3 = h - ym + r;
  const w4 = xm + r;
  const h4 = h - ym;
  // 分成4块
  const p1 = [
    {
      x: 0,
      y: 0,
    },
    {
      x: xm,
      y: 0,
    },
    {
      x: xm,
      y: (ym - d) * 0.5 + r * 0.5,
      hasCurveFrom: true,
      fx: xm - r * H,
      fy: (ym - d) * 0.5,
    },
    {
      x: xm - r,
      y: (ym - d) * 0.5 + r,
      hasCurveTo: true,
      tx: xm - r,
      ty: (ym - d) * 0.5 + r - H * r,
      hasCurveFrom: true,
      fx: xm - r,
      fy: (ym - d) * 0.5 + r + r * H,
    },
    {
      x: xm,
      y: (ym - d) * 0.5 + d - r * 0.5,
      hasCurveTo: true,
      tx: xm - r * H,
      ty: (ym - d) * 0.5 + d,
    },
    {
      x: xm,
      y: ym,
    },
    {
      x: (xm - d) * 0.5 + d - r * 0.5,
      y: ym,
      hasCurveFrom: true,
      fx: (xm - d) * 0.5 + d,
      fy: ym + r * H,
    },
    {
      x: (xm - d) * 0.5 + r,
      y: ym + r,
      hasCurveTo: true,
      tx: (xm - d) * 0.5 + r + r * H,
      ty: ym + r,
      hasCurveFrom: true,
      fx: (xm - d) * 0.5 + r - r * H,
      fy: ym + r,
    },
    {
      x: (xm - d) * 0.5 + r * 0.5,
      y: ym,
      hasCurveTo: true,
      tx: (xm - d) * 0.5,
      ty: ym + r * H,
    },
    {
      x: 0,
      y: ym,
    },
  ];
  const p2 = [
    {
      x: r,
      y: 0,
    },
    {
      x: w2,
      y: 0,
    },
    {
      x: w2,
      y: ym,
    },
    {
      x: (w2 - r - d) * 0.5 + r * 0.5 + d,
      y: ym,
      hasCurveFrom: true,
      fx: (w2 - r - d) * 0.5 + r + d,
      fy: ym - r * H,
    },
    {
      x: (w2 - r - d) * 0.5 + d,
      y: ym - r,
      hasCurveTo: true,
      tx: (w2 - r - d) * 0.5 + d + r * H,
      ty: ym - r,
      hasCurveFrom: true,
      fx: (w2 - r - d) * 0.5 + d - r * H,
      fy: ym - r,
    },
    {
      x: (w2 - r - d) * 0.5 + r * 1.5,
      y: ym,
      hasCurveTo: true,
      tx: (w2 - r - d) * 0.5 + r,
      ty: ym - r * H,
    },
    {
      x: r,
      y: ym,
    },
    {
      x: r,
      y: (ym - d) * 0.5 + d - r * 0.5,
      hasCurveFrom: true,
      fx: r - r * H,
      fy: (ym - d) * 0.5 + d,
    },
    {
      x: 0,
      y: (ym - d) * 0.5 + r,
      hasCurveFrom: true,
      fx: 0,
      fy: (ym - d) * 0.5 + r - r * H,
      hasCurveTo: true,
      tx: 0,
      ty: (ym - d) * 0.5 + r + r * H,
    },
    {
      x: r,
      y: (ym - d) * 0.5 + r * 0.5,
      hasCurveTo: true,
      tx: r - r * H,
      ty: (ym - d) * 0.5,
    },
  ];
  const p3 = [
    {
      x: 0,
      y: r,
    },
    {
      x: (w3 - d) * 0.5 + r * 0.5,
      y: r,
      hasCurveFrom: true,
      fx: (w3 - d) * 0.5,
      fy: r - r * H,
    },
    {
      x: (w3 - d) * 0.5 + r,
      y: 0,
      hasCurveTo: true,
      tx: (w3 - d) * 0.5 + r - r * H,
      ty: 0,
      hasCurveFrom: true,
      fx: (w3 - d) * 0.5 + r + r * H,
      fy: 0,
    },
    {
      x: (w3 - d) * 0.5 + d - r * 0.5,
      y: r,
      hasCurveTo: true,
      tx: (w3 - d) * 0.5 + d,
      ty: r - r * H,
    },
    {
      x: w3,
      y: r,
    },
    {
      x: w3,
      y: h3,
    },
    {
      x: 0,
      y: h3,
    },
    {
      x: 0,
      y: (h3 - r - d) * 0.5 + r + d - r * 0.5,
      hasCurveFrom: true,
      fx: r * H,
      fy: (h3 - r - d) * 0.5 + r + d,
    },
    {
      x: r,
      y: (h3 - r - d) * 0.5 + d,
      hasCurveTo: true,
      tx: r,
      ty: (h3 - r - d) * 0.5 + d + r * H,
      hasCurveFrom: true,
      fx: r,
      fy: (h3 - r - d) * 0.5 + d - r * H,
    },
    {
      x: 0,
      y: (h3 - r - d) * 0.5 + r * 1.5,
      hasCurveTo: true,
      tx: r * H,
      ty: (h3 - r - d) * 0.5 + r,
    },
  ];
  const p4 = [
    {
      x: 0,
      y: 0,
    },
    {
      x: (w4 - r - d) * 0.5 + r * 0.5,
      y: 0,
      hasCurveFrom: true,
      fx: (w4 - r - d) * 0.5,
      fy: r * H,
    },
    {
      x: (w4 - r - d) * 0.5 + r,
      y: r,
      hasCurveTo: true,
      tx: (w4 - r - d) * 0.5 + r - r * H,
      ty: r,
      hasCurveFrom: true,
      fx: (w4 - r - d) * 0.5 + r + r * H,
      fy: r,
    },
    {
      x: (w4 - r - d) * 0.5 + d - r * 0.5,
      y: 0,
      hasCurveTo: true,
      tx: (w4 - r - d) * 0.5 + d,
      ty: r * H,
    },
    {
      x: w4 - r,
      y: 0,
    },
    {
      x: w4 - r,
      y: (h4 - d) * 0.5 + r * 0.5,
      hasCurveFrom: true,
      fx: w4 - r + r * H,
      fy: (h4 - d) * 0.5,
    },
    {
      x: w4,
      y: (h4 - d) * 0.5 + r,
      hasCurveTo: true,
      tx: w4,
      ty: (h4 - d) * 0.5 + r - r * H,
      hasCurveFrom: true,
      fx: w4,
      fy: (h4 - d) * 0.5 + r + r * H,
    },
    {
      x: w4 - r,
      y: (h4 - d) * 0.5 + d - r * 0.5,
      hasCurveTo: true,
      tx: w4 - r + r * H,
      ty: (h4 - d) * 0.5 + d,
    },
    {
      x: w4 - r,
      y: h4,
    },
    {
      x: 0,
      y: h4,
    },
  ];
  return [
    {
      x: 0,
      y: 0,
      w: xm,
      h: h1,
      p: p1.map(item => {
        item.x = item.x / xm;
        item.y = item.y / h1;
        if (item.hasCurveTo) {
          item.tx = item.tx / xm;
          item.ty = item.ty / h1;
        }
        if (item.hasCurveFrom) {
          item.fx = item.fx / xm;
          item.fy = item.fy / h1;
        }
        return item;
      }),
    },
    {
      x: xm - r,
      y: 0,
      w: w2,
      h: ym,
      p: p2.map(item => {
        item.x = item.x / w2;
        item.y = item.y / ym;
        if (item.hasCurveTo) {
          item.tx = item.tx / w2;
          item.ty = item.ty / ym;
        }
        if (item.hasCurveFrom) {
          item.fx = item.fx / w2;
          item.fy = item.fy / ym;
        }
        return item;
      }),
    },
    {
      x: xm,
      y: ym - r,
      w: w3,
      h: h3,
      p: p3.map(item => {
        item.x = item.x / w3;
        item.y = item.y / h3;
        if (item.hasCurveTo) {
          item.tx = item.tx / w3;
          item.ty = item.ty / h3;
        }
        if (item.hasCurveFrom) {
          item.fx = item.fx / w3;
          item.fy = item.fy / h3;
        }
        return item;
      }),
    },
    {
      x: 0,
      y: ym,
      w: w4,
      h: h4,
      p: p4.map(item => {
        item.x = item.x / w4;
        item.y = item.y / h4;
        if (item.hasCurveTo) {
          item.tx = item.tx / w4;
          item.ty = item.ty / h4;
        }
        if (item.hasCurveFrom) {
          item.fx = item.fx / w4;
          item.fy = item.fy / h4;
        }
        return item;
      }),
    },
  ];
}
