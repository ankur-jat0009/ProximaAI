import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

export const ChromaGrid = ({
  className = "",
  radius = 300,
  columns = 1,
  rows = 1,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const data = [
    {
      image: "/ankur.jpg", // Put your image in public folder
      title: "Ankur Jat",
      subtitle: "AI Engineer",
      handle: "@ankurjat",
      borderColor: "#4F46E5",
      gradient: "linear-gradient(145deg, #4F46E5, #000)",
      url: "https://github.com/ankur-jat0009",
    },
  ];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");

    const { width, height } = el.getBoundingClientRect();

    pos.current = {
      x: width / 2,
      y: height / 2,
    };

    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      overwrite: true,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
    });
  };

  const handleMove = (e) => {
    const rect = rootRef.current.getBoundingClientRect();

    moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    gsap.to(fadeRef.current, {
      opacity: 0,
      duration: 0.25,
      overwrite: true,
    });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    card.style.setProperty(
      "--mouse-x",
      `${e.clientX - rect.left}px`
    );

    card.style.setProperty(
      "--mouse-y",
      `${e.clientY - rect.top}px`
    );
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        "--r": `${radius}px`,
        "--cols": columns,
        "--rows": rows,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((card, index) => (
        <article
          key={index}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(card.url)}
          style={{
            "--card-border": card.borderColor,
            "--card-gradient": card.gradient,
            cursor: card.url ? "pointer" : "default",
          }}
        >
          <div className="chroma-img-wrapper">
            <img
              src={card.image}
              alt={card.title}
              loading="lazy"
            />
          </div>

          <footer className="chroma-info">
            <h3 className="name">{card.title}</h3>

            <span className="handle">
              {card.handle}
            </span>

            <p className="role">
              {card.subtitle}
            </p>
          </footer>
        </article>
      ))}

      <div className="chroma-overlay" />
      <div
        ref={fadeRef}
        className="chroma-fade"
      />
    </div>
  );
};

export default ChromaGrid;