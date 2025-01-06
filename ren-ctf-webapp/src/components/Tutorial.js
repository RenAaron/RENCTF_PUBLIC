import React, { useState, useEffect } from 'react';

const Tutorial = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      src: "/icons/Updates.gif",
      caption: "This is the Updates Tab!  "
    },
    {
      src: "/icons/RenCTF.gif",
      caption: "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow,"
    },
    {
      src: "/icons/R.gif",
      caption: "Caption Three"
    }
  ];

  const showSlides = (n) => {
    let newIndex = slideIndex + n;
    if (newIndex >= slides.length) newIndex = 0;
    if (newIndex < 0) newIndex = slides.length - 1;
    setSlideIndex(newIndex);
  };

  return (
    <main style={{ width: '100%', height: '100%', display: "flex", alignItems: "center", flexDirection: 'column', overflow: 'hidden'}}>
      <div style={{height: '10%', justifyContent: "center", width: '100%', alignItems: "center", display: "flex", marginTop: '10px'}}>
        <h1 style ={{fontSize: 50}}>Updates</h1>
      </div>
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="slides fade"
            style={{ display: slideIndex === index ? 'block' : 'none' }}
          >
            <img src={slide.src} alt={`Image ${index + 1}`} class="pixel-art" />
            <div className="text">{slide.caption}</div>
          </div>
        ))}

        <a className="prev" onClick={() => showSlides(-1)}>&#10094;</a>
        <a className="next" onClick={() => showSlides(1)}>&#10095;</a>
      </div>
    </main>
  );
};

export default Tutorial;
