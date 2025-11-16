// utils/boxCalculator.js
// ⚠️ REPLACE YOUR ENTIRE boxCalculator.js FILE WITH THIS CODE

/**
 * Calculate box recommendation based on cart items and product data
 * Stacks items vertically and calculates exact dimensions needed
 * @param {Object} cartItems - Cart items object { productId: { size: quantity } }
 * @param {Array} products - Array of all products with dimensions
 * @returns {Object} Box recommendation with dimensions and item details
 */
export const calculateBoxRecommendation = (cartItems, products) => {
  console.log("🔍 Starting box calculation...");
  
  const itemsList = [];
  let maxLength = 0;
  let maxBreadth = 0;
  let totalHeight = 0;
  let totalWeight = 0;

  // Process each item in the cart
  for (const productId in cartItems) {
    const product = products.find(p => p._id === productId);
    
    if (!product) {
      console.warn("⚠️ Product not found for ID:", productId);
      continue;
    }

    console.log("📦 Found product:", product.name);

    for (const size in cartItems[productId]) {
      const quantity = cartItems[productId][size];
      if (quantity <= 0) continue;

      // Get product dimensions directly from database
      const itemLength = Number(product.length) || 20;
      const itemBreadth = Number(product.breadth) || 15;
      const itemHeight = Number(product.height) || 5;
      const itemWeight = Number(product.weight) || 0.5;

      console.log(`📏 Product dimensions: L=${itemLength}, B=${itemBreadth}, H=${itemHeight}, W=${itemWeight}kg, Qty=${quantity}`);

      // Calculate totals for this item
      const itemTotalWeight = itemWeight * quantity;
      const itemStackedHeight = itemHeight * quantity;

      // Track maximum footprint (length x breadth)
      maxLength = Math.max(maxLength, itemLength);
      maxBreadth = Math.max(maxBreadth, itemBreadth);

      // Stack items vertically
      totalHeight += itemStackedHeight;
      totalWeight += itemTotalWeight;

      console.log(`✅ After adding: maxL=${maxLength}, maxB=${maxBreadth}, stackedH=${totalHeight}`);

      // Add to items list for display
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

  console.log("\n📊 Raw calculations (before padding):");
  console.log(`  Max Length: ${maxLength} cm`);
  console.log(`  Max Breadth: ${maxBreadth} cm`);
  console.log(`  Total Height (stacked): ${totalHeight} cm`);
  console.log(`  Total Weight: ${totalWeight} kg`);

  // Add 10% padding for packing materials
  const paddingFactor = 1.1;
  const finalLength = Math.ceil(maxLength * paddingFactor);
  const finalBreadth = Math.ceil(maxBreadth * paddingFactor);
  const finalHeight = Math.ceil(totalHeight * paddingFactor);
  const finalWeight = parseFloat(totalWeight.toFixed(2));

  console.log("\n📦 FINAL BOX (with 10% padding):");
  console.log(`  Length: ${finalLength} cm`);
  console.log(`  Breadth: ${finalBreadth} cm`);
  console.log(`  Height: ${finalHeight} cm`);
  console.log(`  Weight: ${finalWeight} kg\n`);

  // Calculate volumes
  const itemsVolume = itemsList.reduce((sum, item) => {
    return sum + (item.dimensions.length * item.dimensions.breadth * item.dimensions.height * item.quantity);
  }, 0);
  const boxVolume = finalLength * finalBreadth * finalHeight;
  const packingEfficiency = boxVolume > 0 ? Math.round((itemsVolume / boxVolume) * 100) : 0;

  const result = {
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

  console.log("🎁 Returning box recommendation:", result);
  return result;
};

/**
 * Get shipping dimensions from box recommendation
 * Returns the exact values needed for Shiprocket API
 */
export const getShippingDimensions = (boxRecommendation) => {
  if (!boxRecommendation || !boxRecommendation.recommendedBox) {
    console.warn("⚠️ No box recommendation, using defaults");
    return {
      length: 20,
      breadth: 15,
      height: 10,
      weight: 1
    };
  }

  const dims = {
    length: boxRecommendation.recommendedBox.dimensions.length,
    breadth: boxRecommendation.recommendedBox.dimensions.breadth,
    height: boxRecommendation.recommendedBox.dimensions.height,
    weight: boxRecommendation.totalWeight
  };

  console.log("📮 Shipping API will receive:", dims);
  return dims;
};

// ❌ REMOVE ALL OTHER FUNCTIONS - Only export these two:
export default {
  calculateBoxRecommendation,
  getShippingDimensions
};