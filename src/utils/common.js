const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(0, array.length);

  return array[randomIndex];
};

function shuffleArray(array) {
  let j;
  let temp;
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
}

function formatTime(duration) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return {hours, minutes};
}

export {getRandomNumber, getRandomArrayItem, shuffleArray, formatTime};
