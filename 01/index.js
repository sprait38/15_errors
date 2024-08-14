/* eslint-disable no-console */
export function calculateDiscount(price, percent) {
  if (typeof price !== 'number' || typeof percent !== 'number') {
    const error = new TypeError();
    throw error;
  }
  return (price / 100) * percent;
}

export function getMarketingPrice(product) {
  try {
    const productObject = JSON.parse(product);
    if (productObject.prices === undefined) {
      throw new SyntaxError('Данные верны');
    }
    return productObject.prices.marketingPrice;
  } catch (error) {
    return null;
  } finally {
    console.log('верны данные');
  }
}

// Функция имитирует неудачный запрос за картинкой
function fetchAvatarImage(userId) {
  return new Promise((resolve, reject) => {
    reject(new Error(`Error while fetching image for user with id ${userId}`));
  });
}

export async function getAvatarUrl(userId) {
  try {
    const image = await fetchAvatarImage(userId);
    return image.url;
  } catch (error) {
    return '/images/default.jpg';
  }
}
