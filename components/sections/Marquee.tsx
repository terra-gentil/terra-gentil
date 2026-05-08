export default function Marquee() {
  const items = (
    <span>
      Seja gentil com a terra <span className="star">✺</span>
      Quintais esquecidos viram jardins <span className="star">✺</span>
      Doutor das plantas grátis <span className="star">✺</span>
      Toda semana um vídeo novo <span className="star">✺</span>
      Jardinagem sem pressa <span className="star">✺</span>
    </span>
  );

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items}
        {items}
      </div>
    </div>
  );
}
