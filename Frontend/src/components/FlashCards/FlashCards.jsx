import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function FlashCards() {
    const [cards , setCards] = useState([]);
    const [flippedCard, setFlippedCard] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/flashcards").then((response) => {
            const userCards = response.data.filter(card => card.username === "user123");
            setCards(userCards);
        });
    }, []);

    const handleCardClick = (index) => {
        setFlippedCard(index === flippedCard ? null : index);
    };

    return (
        <div className="flex flex-wrap justify-center">
            {cards.map((card, index) => (
                <div key={index} className="relative w-64 h-40 bg-white shadow-md rounded-lg m-4 cursor-pointer" onClick={() => handleCardClick(index)}>
                    <div className={`absolute inset-0 flex items-center justify-center transform ${flippedCard === index ? 'rotate-y-180' : ''} transition-transform duration-500`}>
                        <div className="absolute inset-0 bg-white w-full h-full backface-hidden rounded-lg">
                            <h1 className="text-xl font-bold">{card.question}</h1>
                        </div>
                        <div className="absolute inset-0 bg-white w-full h-full backface-hidden rounded-lg">
                            <p className="text-lg">{card.answer}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
