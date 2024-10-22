"use client";
import {useEffect} from "react";
import Link from "next/link";

export default function Home() {
  // useEffect(() => {
  //   createClown(); // Genera un payaso al cargar la página
  // }, []);

  // const createClown = () => {
  //   const clownContainer = document.querySelector(".clown-container");

  //   // Función que alterna entre diferentes bordes y muestra un payaso
  //   const generateClown = () => {
  //     clownContainer.innerHTML = "";

  //     const clown = document.createElement("div");

  //     const side = ["left", "right", "bottom"][Math.floor(Math.random() * 3)];

  //     clown.classList.add(`clown-${side}`);

  //     if (side === "left" || side === "right") {
  //       clown.style.top = `${Math.random() * 90}vh`;
  //     } else {
  //       clown.style.left = `${Math.random() * 90}vw`;
  //     }

  //     clownContainer.appendChild(clown);

  //     setTimeout(() => {
  //       clown.remove();
  //     }, 6000);
  //   };

  //   setInterval(() => {
  //     generateClown();
  //   }, 5000);
  // };

  // // Usamos useEffect para añadir las arañas cuando la página cargue
  // useEffect(() => {
  //   createSpiders();
  // }, []);

  // // Función para generar arañas y posicionarlas al azar
  // const createSpiders = () => {
  //   const spiderContainer = document.querySelector(".spider-container");
  //   for (let i = 0; i < 10; i++) {
  //     const spider = document.createElement("div");
  //     spider.classList.add("spider");
  //     spider.style.left = `${Math.random() * 100}vw`; // Posición horizontal aleatoria
  //     spider.style.top = `${Math.random() * 100}vh`; // Posición vertical aleatoria
  //     spiderContainer.appendChild(spider);
  //   }
  // };

  useEffect(() => {
    createRain(); // Start generating raindrops
  }, []);

  // Function to generate raindrops and position them randomly
  const createRain = () => {
    const rainContainer = document.querySelector(".rain-container");

    for (let i = 0; i < 100; i++) {
      const raindrop = document.createElement("div");
      raindrop.classList.add("raindrop");
      raindrop.style.left = `${Math.random() * 100}vw`; // Random horizontal position
      raindrop.style.animationDelay = `${Math.random() * 3}s`; // Random delay to stagger drops
      rainContainer.appendChild(raindrop);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-around bg-[url(/fondoManicomioCasa.webp)] bg-cover bg-no-repeat relative">
      <div className="z-10 flex flex-col items-center justify-center">
        <h1 className="text-red-800 drop-shadow-2xl shadow-black text-8xl font-bold z-10 font-spooky2 bg-none animate-fadeInTitle ">
          Phobia verse
        </h1>
        <p className="text-[#D8D8D8] drop-shadow-2xl shadow-black text-4xl font-bold z-10 bg-none animate-fadeInTitle font-sans ">
          ¡Discover and experiment with your fears!
        </p>
      </div>

      <Link
        href="/upload"
        className=" bg-zinc-800 hover:bg-zinc-600 text-white p-4 rounded-lg text-4xl z-10 shadow-2xl animate-fadeInTitle"
      >
        Enter the assylum
      </Link>

      {/* <div className="spider-container absolute inset-0"></div>
      <div className="blood-drip absolute top-0 left-0 w-full h-10"></div>
      <div className="clown-container absolute inset-0"></div> */}
      <div className="absolute inset-0 h-full w-full bg-black animate-fadeIn"></div>
      <div className="rain-container absolute inset-0 pointer-events-none"></div>
    </div>
  );
}
