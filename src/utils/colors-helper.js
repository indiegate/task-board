export default function intToRGB(index, alpha) {
  const colors = {
    0: '219, 40, 40', // red
    1: '242, 113, 28', // orange
    2: '251, 189, 8', // yellow
    3: '181, 204, 24', // olive
    4: '33, 186, 69', // green
    5: '0, 181, 173', // teal
    6: '33, 133, 208', // blue
    7: '163, 51, 200', // purple
    8: '224, 57, 151', // pink
    9: '165, 103, 63', // brown
  };

  if (index < Object.keys(colors).length) {
    return alpha ? `${colors[index]}, ${alpha}` : `${colors[index]}`;
  }

  return '255, 255, 255';
}
