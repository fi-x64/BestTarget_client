import React, { useEffect, useState } from 'react';

const BackToTopButton = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 100) { // Hiển thị nút khi kích thước trang dài hơn 100px
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {showScrollButton && (
        <button
          className="fixed bottom-4 right-4 z-100 p-4 rounded-full bg-gray-500 text-white"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}

      {/* Nội dung trang */}
    </>
  );
};

export default BackToTopButton;