// utils/formatPrice.js
export default function formatPrice(num, { short = false } = {}) {
  if (typeof num !== 'number') {
    num = Number(num) || 0;
  }

  if (short) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  } else {
    return num.toLocaleString(); // Example: 1,250,000
  }
}
