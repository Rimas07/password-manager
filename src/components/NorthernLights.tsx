import { useEffect, useRef } from "react";

export default function NorthernLightsCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const W = window.innerWidth,
      H = window.innerHeight;
    let running = true;
    let mouseX = 0.5,
      mouseY = 0.5;

    const CP = 10,
      CPX = 1.5,
      CPY = 3.5,
      CPFX = 270,
      CPFY = 80,
      CPMIN = 15;
    const CPTMAX = 9000,
      CPTMIN = 3000,
      BC = 1000,
      BW = 30,
      BH = 450;
    const BMSY = 0.02,
      BMSYV = 0.5,
      BMAV = 0.7;
    const BMAX = 7000,
      BMIN = 1500,
      BZMAX = 80000,
      BZMIN = 58000;
    const BAD = 0.07,
      MXO = 50,
      MYO = 25;

    function dc(
      p0x: number,
      p0y: number,
      c0x: number,
      c0y: number,
      c1x: number,
      c1y: number,
      p1x: number,
      p1y: number,
      t: number
    ) {
      const Ax = p0x + t * (c0x - p0x),
        Ay = p0y + t * (c0y - p0y);
      const Bx = c0x + t * (c1x - c0x),
        By = c0y + t * (c1y - c0y);
      const Cx = c1x + t * (p1x - c1x),
        Cy = c1y + t * (p1y - c1y);
      const Dx = Ax + t * (Bx - Ax),
        Dy = Ay + t * (By - Ay);
      const Ex = Bx + t * (Cx - Bx),
        Ey = By + t * (Cy - By);
      return { x: Dx + t * (Ex - Dx), y: Dy + t * (Ey - Dy) };
    }

    class CurvePoint {
      x: number;
      y: number;
      z: number;
      cpLength: number;
      cpYOffset: number;
      xAnimTime: number;
      xVariance: number;
      xMin: number;
      xAnimOffset: number;
      yAnimTime: number;
      yVariance: number;
      yMin: number;
      yAnimOffset: number;
      startTime = 0;
      constructor(x: number, y: number, z: number, cpLength: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.cpLength = cpLength;
        this.cpYOffset = Math.random() * cpLength - cpLength;
        this.xAnimTime = Math.random() * (CPTMAX - CPTMIN) + CPTMIN;
        this.xVariance = Math.max(Math.random() * z * CPFX, CPMIN);
        this.xMin = x - this.xVariance / 2;
        this.xAnimOffset = Math.random() * Math.PI;
        this.yAnimTime = Math.random() * (CPTMAX - CPTMIN) + CPTMIN;
        this.yVariance = Math.max(Math.random() * z * CPFY, CPMIN);
        this.yMin = y - this.yVariance / 2;
        this.yAnimOffset = Math.random() * Math.PI;
      }
      getCps() {
        return [
          { x: this.x - this.cpLength, y: this.y - this.cpYOffset },
          { x: this.x + this.cpLength, y: this.y + this.cpYOffset },
        ];
      }
      updatePosition() {
        if (!this.startTime) this.startTime = Date.now();
        const d = Date.now() - this.startTime;
        this.x =
          this.xMin +
          (Math.sin((d / this.xAnimTime) * Math.PI + this.xAnimOffset) * 0.5 +
            0.5) *
            this.xVariance;
        this.x += this.z * (1 - mouseX * 2) * MXO;
        this.y =
          this.yMin +
          (Math.sin((d / this.yAnimTime) * Math.PI + this.yAnimOffset) * 0.5 +
            0.5) *
            this.yVariance;
        this.y += this.z * (1 - mouseY * 2) * MYO;
      }
    }

    class Brush {
      curve: Curve;
      z: number;
      alpha: number;
      scaleYMod: number;
      scaleXMod: number;
      noScale: boolean;
      color1: string | CanvasGradient;
      alphaAnimTime: number;
      alphaVariance: number;
      alphaMin: number;
      alphaAnimOffset: number;
      scaleYAnimTime: number;
      scaleYVariance: number;
      scaleY = 0;
      scaleYMin: number;
      scaleYAnimOffset: number;
      zAnimOffset: number;
      zAnimTime: number;
      startTime = 0;

      constructor(
        curve: Curve,
        z: number,
        color: string | CanvasGradient | null,
        noScale: boolean
      ) {
        this.curve = curve;
        this.z = z;
        this.noScale = noScale;
        this.alpha = z * Math.random() * 0.55 + 0.15;
        this.scaleYMod = (1 - BMSY) * Math.random();
        this.scaleXMod = 0.5 * Math.random() * (2 - this.scaleYMod * 2);
        this.color1 = color || "rgb(50,170,82)";
        this.alphaAnimTime = Math.random() * (BMAX - BMIN) + BMIN;
        this.alphaVariance = Math.max(Math.random() * BMAV, this.alpha);
        this.alphaMin = Math.max(this.alpha - this.alphaVariance / 2, 0);
        this.alphaAnimOffset = Math.random() * Math.PI;
        this.scaleYAnimTime = Math.random() * (BMAX - BMIN) + BMIN;
        this.scaleYVariance = Math.random() * BMSYV;
        this.scaleYMin = this.scaleY - this.scaleYVariance / 2;
        this.scaleYAnimOffset = Math.random() * Math.PI;
        this.zAnimOffset = this.curve.vp.z - (z - this.curve.vp.z);
        this.zAnimTime = Math.random() * (BZMAX - BZMIN) + BZMIN;
        if (noScale) {
          this.alphaMin = 0;
          this.alphaVariance = 1;
        }
      }
      draw(ctx: CanvasRenderingContext2D) {
        if (this.z < this.curve.vp.z || this.z > this.curve.ep.z) return;
        const point = this.curve.getPointAtZ(this.z);
        let alpha =
          (0.5 + 0.5 * Math.min(this.z, 1)) * this.alpha * this.curve.maxAlpha;
        if (this.z - this.curve.vp.z < BAD)
          alpha *= (this.z - this.curve.vp.z) / BAD;
        else if (this.curve.ep.z - this.z < BAD)
          alpha *= (this.curve.ep.z - this.z) / BAD;
        const scaleY = this.noScale
          ? this.scaleYMod + BMSY
          : this.z * this.scaleYMod + BMSY;
        const scaleX = this.noScale
          ? this.scaleXMod + 0.5
          : this.z * this.scaleXMod + 0.5;
        ctx.fillStyle = this.color1;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y - scaleY * BH);
        ctx.quadraticCurveTo(
          point.x + (scaleX * BW) / 2,
          point.y - scaleY * BH,
          point.x + (scaleX * BW) / 2,
          point.y
        );
        ctx.quadraticCurveTo(
          point.x + (scaleX * BW) / 2,
          point.y + scaleY * BW,
          point.x,
          point.y + (scaleX * BW) / 2
        );
        ctx.quadraticCurveTo(
          point.x - (scaleX * BW) / 2,
          point.y + scaleY * BW,
          point.x - (scaleX * BW) / 2,
          point.y
        );
        ctx.quadraticCurveTo(
          point.x - (scaleX * BW) / 2,
          point.y - scaleY * BH,
          point.x,
          point.y - scaleY * BH
        );
        ctx.fill();
      }
      updatePosition() {
        if (!this.startTime) this.startTime = Date.now() - 20000;
        const d = Date.now() - this.startTime;
        this.alpha = Math.min(
          this.alphaMin +
            (Math.sin(
              (d / this.alphaAnimTime) * Math.PI + this.alphaAnimOffset
            ) *
              0.5 +
              0.5) *
              this.alphaVariance,
          1
        );
        this.scaleY =
          this.scaleYMin +
          (Math.sin(
            (d / this.scaleYAnimTime) * Math.PI + this.scaleYAnimOffset
          ) *
            0.5 +
            0.5) *
            this.scaleYVariance;
        this.z = (d / this.zAnimTime + this.zAnimOffset) * this.curve.ep.z;
        if (this.z > this.curve.vp.z) this.z *= this.z;
        if (this.z > this.curve.ep.z) {
          this.z = this.z - this.curve.ep.z + this.curve.vp.z;
          this.startTime = Date.now();
        }
      }
    }

    class Curve {
      vp: { x: number; y: number; z: number };
      ep: { x: number; y: number; z: number };
      points: CurvePoint[];
      brushes: Brush[];
      maxAlpha: number;

      constructor(
        vpX: number,
        vpY: number,
        vpZ: number,
        epX: number,
        epY: number,
        epZ: number,
        brushCount = BC,
        maxAlpha = 1,
        fill: string | CanvasGradient | null = null
      ) {
        this.vp = { x: vpX, y: vpY, z: vpZ };
        this.ep = { x: epX, y: epY, z: epZ };
        this.maxAlpha = maxAlpha;
        this.points = [new CurvePoint(vpX, vpY, vpZ, 0)];
        for (let i = 0; i < CP - 1; i++) {
          const mod = ((i + 1) / CP) ** 2;
          const xJ = Math.random() * CPX - CPX / 2;
          const x =
            vpX +
            mod * (epX - vpX) +
            xJ * (vpX + mod * (epX - vpX) - this.points[i].x);
          const yJ = (1.2 - mod) * (Math.random() * CPY - CPY / 2);
          const y =
            vpY +
            mod * (epY - vpY) +
            yJ * (vpY + mod * (epY - vpY) - this.points[i].y);
          const z = mod * (epZ - vpZ) + vpZ;
          this.points.push(
            new CurvePoint(
              x,
              y,
              z,
              (0.33 + Math.random() * 0.33) * (x - this.points[i].x) * 0.33
            )
          );
        }
        this.points.push(new CurvePoint(epX, epY, epZ, 0));
        this.brushes = [];
        for (let i = 0; i < brushCount; i++) {
          const noScale = Math.random() < 0.01;
          this.brushes.push(
            new Brush(
              this,
              (i / brushCount) * (epZ - vpZ) + vpZ,
              noScale ? "rgb(200,200,220)" : fill,
              noScale
            )
          );
        }
      }
      getPointAtZ(p: number) {
        if (p <= this.points[0].z) return this.points[0];
        if (p >= this.points[this.points.length - 1].z)
          return this.points[this.points.length - 1];
        let i = 0;
        for (; i < this.points.length; i++) {
          if (p <= this.points[i].z) break;
        }
        const lp = this.points[i - 1],
          lc = lp.getCps();
        const np = this.points[i],
          nc = np.getCps();
        const t = (p - lp.z) / (np.z - lp.z);
        return dc(
          lp.x,
          lp.y,
          lc[1].x,
          lc[1].y,
          nc[0].x,
          nc[0].y,
          np.x,
          np.y,
          t
        );
      }
      update() {
        this.points.forEach((p) => p.updatePosition());
        this.brushes.forEach((b) => b.updatePosition());
      }
      draw(ctx: CanvasRenderingContext2D) {
        this.brushes.forEach((b) => b.draw(ctx));
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    canvas.style.cssText = `position:absolute;display:block;filter:blur(6px) drop-shadow(0 0 30px rgba(51,180,172,1));transform-origin:0 100%;transform:skewX(-20deg);`;
    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = "color-dodge";

    const gradCanvas = document.createElement("canvas");
    const gradCtx = gradCanvas.getContext("2d")!;
    const grad = gradCtx.createLinearGradient(W * 0.5, H, W * 0.35, 0);
    grad.addColorStop(0.4, "rgb(50,130,80)");
    grad.addColorStop(0.6, "rgba(100,100,120,.5)");
    const grad2 = gradCtx.createLinearGradient(W * 0.5, H * 0.5, W * 0.3, 0);
    grad2.addColorStop(0.35, "rgb(50,130,140)");
    grad2.addColorStop(0.7, "rgba(50,70,100,.7)");

    const curves = [
      new Curve(W * 0.17, H * 0.94, 0.01, W * 0.8, H * 0.8, 0.8, BC * 0.3, 0.4, "rgb(60,150,120)"),
      new Curve(W * 0.1, H * 0.9, 0.05, W * 0.8, H * 0.4, 1, BC, 0.8, grad),
      new Curve(W * 0.25, H * 0.65, 0.33, W * 0.55, 0, 1.1, BC * 0.6, 1, grad2),
    ];

    container.appendChild(canvas);

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      curves.forEach((c) => {
        c.update();
        c.draw(ctx);
      });
      if (running) requestAnimationFrame(animate);
    };
    animate();

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / W;
      mouseY = e.clientY / H;
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      running = false;
      window.removeEventListener("mousemove", onMouseMove);
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{
        background: "#0d1b2a url('/aurora.jpg') bottom center no-repeat",
        backgroundSize: "cover",
      }}
    />
  );
}
