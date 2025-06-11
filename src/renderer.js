window.addEventListener('DOMContentLoaded', () => {
  const homeButton = document.getElementById('homeButton');
  const contentFrame = document.getElementById('contentFrame');
  const initialUrl = 'https://utopiancreations.github.io/luminarynexustoken/#';

  if (homeButton && contentFrame) {
    homeButton.addEventListener('click', () => {
      console.log('Home button clicked. Navigating to:', initialUrl);
      contentFrame.src = initialUrl;
    });
  } else {
    console.error('Home button or content frame not found.');
  }
});
