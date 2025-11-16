// utils/boxCalculator.js
// ⚠️ THIS IS THE ONLY boxCalculator.js FILE YOU SHOULD HAVE

/**
 * Calculate box recommendation based on cart items and product data
 * Stacks items vertically and calculates exact dimensions needed
 */
export const calculateBoxRecommendation = (cartItems, products) => {
  console.log("🔍 Box calculation starting...");
  console.log("Cart:", cartItems);
  
  const itemsList = [];
  let maxLength = 0;
  let maxBreadth = 0;
  let totalHeight = 0;
  let totalWeight = 0;

  // Process each item in the cart
  for (const productId in cartItems) {
    const product = products.find(p => p._id === productId);
    
    if (!product) {
      console.warn("⚠️ Product not found:", productId);
      continue;
    }

    console.log("📦 Product:", product.name);

    for (const size in cartItems[productId]) {
      const quantity = cartItems[productId][size];
      if (quantity <= 0) continue;

      // Get dimensions from product
      const itemLength = Number(product.length) || 20;
      const itemBreadth = Number(product.breadth) || 15;
      const itemHeight = Number(product.height) || 5;
      const itemWeight = Number(product.weight) || 0.5;

      console.log(`  Dimensions: ${itemLength}×${itemBreadth}×${itemHeight} cm, ${itemWeight}kg × ${quantity}`);

      // Calculate totals
      const itemTotalWeight = itemWeight * quantity;
      const itemStackedHeight = itemHeight * quantity;

      // Track maximum footprint
      maxLength = Math.max(maxLength, itemLength);
      maxBreadth = Math.max(maxBreadth, itemBreadth);

      // Stack vertically
      totalHeight += itemStackedHeight;
      totalWeight += itemTotalWeight;

      console.log(`  Running totals: L=${maxLength}, B=${maxBreadth}, H=${totalHeight}, W=${totalWeight}`);

      itemsList.push({
        name: product.name,
        size: size,
        quantity: quantity,
        dimensions: {
          length: itemLength,
          breadth: itemBreadth,
          height: itemHeight
        },
        weight: itemWeight,
        totalWeight: parseFloat(itemTotalWeight.toFixed(2)),
        stackedHeight: itemStackedHeight
      });
    }
  }

  // Add 10% padding
const PADDING = 1.03; // only 3% extra
  
  const finalLength = Math.ceil(maxLength * PADDING);
  const finalBreadth = Math.ceil(maxBreadth * PADDING);
  const finalHeight = Math.ceil(totalHeight * PADDING);
  const finalWeight = parseFloat(totalWeight.toFixed(2));

  console.log("📦 FINAL BOX:");
  console.log(`  ${finalLength}×${finalBreadth}×${finalHeight} cm, ${finalWeight}kg`);

  // Calculate volumes
  const itemsVolume = itemsList.reduce((sum, item) => {
    return sum + (item.dimensions.length * item.dimensions.breadth * item.dimensions.height * item.quantity);
  }, 0);
  const boxVolume = finalLength * finalBreadth * finalHeight;
  const packingEfficiency = boxVolume > 0 ? Math.round((itemsVolume / boxVolume) * 100) : 0;

  return {
    recommendedBox: {
      name: "Custom Box",
      dimensions: {
        length: finalLength,
        breadth: finalBreadth,
        height: finalHeight
      }
    },
    totalWeight: finalWeight,
    itemsList: itemsList,
    packingEfficiency: packingEfficiency,
    itemsVolume: Math.round(itemsVolume),
    boxVolume: Math.round(boxVolume)
  };
};

/**
 * Get shipping dimensions for API
 */
export const getShippingDimensions = (boxRecommendation) => {
  if (!boxRecommendation?.recommendedBox) {
    console.warn("⚠️ No box recommendation, using defaults");
    return { length: 20, breadth: 15, height: 10, weight: 1 };
  }

  const dims = {
    length: boxRecommendation.recommendedBox.dimensions.length,
    breadth: boxRecommendation.recommendedBox.dimensions.breadth,
    height: boxRecommendation.recommendedBox.dimensions.height,
    weight: boxRecommendation.totalWeight
  };

  console.log("📮 API will receive:", dims);
  return dims;
};

export default {
  calculateBoxRecommendation,
  getShippingDimensions
};