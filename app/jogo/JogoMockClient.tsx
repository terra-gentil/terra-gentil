'use client';

import { useState } from 'react';

const STAGES = ['🌱', '🪴', '🌿', '🌷', '🌻'] as const;

export default function JogoMockClient() {
  const [planted, setPlanted] = useState(0);

  return (
    <div className="jg-phone">
      <div className="jg-phone-frame">
        <div className="jg-phone-status">
          <span>9:41</span>
          <span>terra gentil · jogo</span>
          <span aria-hidden="true">🔋</span>
        </div>
        <div className="jg-phone-screen">
          <div className="jg-screen-soil">
            {[0, 1, 2, 3, 4].map((i) => (
              <button
                key={i}
                type="button"
                className="jg-tile"
                aria-label={`Tile ${i + 1}${i < planted ? ' plantado' : ' vazio'}`}
                onClick={() => {
                  if (planted < 5) setPlanted((p) => p + 1);
                }}
              >
                {i < planted ? (
                  <span className="jg-sprout">{STAGES[i]}</span>
                ) : (
                  <span className="jg-empty">·</span>
                )}
              </button>
            ))}
          </div>
          <div className="jg-tap">
            {planted < 5 ? `Toque pra plantar (${planted}/5)` : 'Volta amanhã pra ver crescer'}
          </div>
        </div>
        <div className="jg-phone-notch" />
      </div>
      <div className="jg-phone-shadow" aria-hidden="true" />
    </div>
  );
}
