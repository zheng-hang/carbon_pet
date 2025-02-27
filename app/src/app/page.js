"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handleChoosePokemon = (pokemon) => {
    setSelectedPokemon(pokemon);

    // Simulate a delay before navigating (e.g., fade-out effect)
    setTimeout(() => {
      router.push(`/begin?starter=${pokemon}`);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Choose Your Starter Pokémon</h1>

      <div className="flex gap-8">
        {/* Squirtle */}
        <button onClick={() => handleChoosePokemon("squirtle")} className="pokemon-button">
          <Image src="/sprites/squirtle.gif" alt="Squirtle" width={100} height={100} />
          <span>Squirtle</span>
        </button>

        {/* Bulbasaur */}
        <button onClick={() => handleChoosePokemon("bulbasaur")} className="pokemon-button">
          <Image src="/sprites/bulbasaur.gif" alt="Bulbasaur" width={100} height={100} />
          <span>Bulbasaur</span>
        </button>

        {/* Charmander */}
        <button onClick={() => handleChoosePokemon("charmander")} className="pokemon-button">
          <Image src="/sprites/charmander.gif" alt="Charmander" width={100} height={100} />
          <span>Charmander</span>
        </button>
      </div>

      {selectedPokemon && (
        <p className="mt-6 text-lg animate-pulse">You chose {selectedPokemon}! Redirecting...</p>
      )}

      <style jsx>{`
        .pokemon-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid white;
          border-radius: 10px;
          transition: transform 0.2s ease-in-out, background 0.3s;
        }
        
        .pokemon-button:hover {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}