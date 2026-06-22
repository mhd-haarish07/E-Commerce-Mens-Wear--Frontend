const tshirtImgs = ["f1.jpg","f3.jpg","f6.jpg","f8.jpg","n2.jpg","n6.jpg","n7.jpg","n8.jpg"];
const shirtImgs  = ["f2.jpg","f4.jpg","f5.jpg","f7.jpg"];
const pantImgs   = ["n1.jpg","n3.jpg","n4.jpg","n5.jpg"];
const jerseyImgs = ["f1.jpg","f3.jpg","f6.jpg","n2.jpg","n6.jpg","n7.jpg"];

const pick = (arr, i) => arr[i % arr.length];

const products = [
  // ===== T-SHIRTS =====
  { id: 1,  name: "Classic Polo T-Shirt",      brand: "TN91", price: 499,  img: pick(tshirtImgs,0), category: "featured", type: "tshirt" , stock: 8 },
  { id: 2,  name: "Round Neck Graphic Tee",    brand: "TN91", price: 399,  img: pick(tshirtImgs,1), category: "featured", type: "tshirt" , stock: 0 },
  { id: 3,  name: "Sports Dry-Fit T-Shirt",    brand: "TN91", price: 449,  img: pick(tshirtImgs,2), category: "featured", type: "tshirt" , stock: 40 },
  { id: 4,  name: "Half Sleeve Cotton Tee",    brand: "TN91", price: 349,  img: pick(tshirtImgs,3), category: "featured", type: "tshirt" , stock: 3 },
  { id: 9,  name: "V-Neck Slim Tee",           brand: "TN91", price: 429,  img: pick(tshirtImgs,4), category: "new", type: "tshirt" , stock: 30 },
  { id: 10, name: "Printed Casual Tee",        brand: "TN91", price: 379,  img: pick(tshirtImgs,5), category: "new", type: "tshirt" , stock: 12 },
  { id: 11, name: "Oversized Street Tee",      brand: "TN91", price: 549,  img: pick(tshirtImgs,6), category: "new", type: "tshirt" , stock: 50 },
  { id: 12, name: "Casual Hoodie Tee",         brand: "TN91", price: 899,  img: pick(tshirtImgs,7), category: "new", type: "tshirt" , stock: 25 },
  { id: 17, name: "Tie-Dye Summer Tee",        brand: "TN91", price: 459,  img: pick(tshirtImgs,0), category: "new", type: "tshirt" , stock: 15 },
  { id: 18, name: "Muscle Fit V-Neck Tee",     brand: "TN91", price: 389,  img: pick(tshirtImgs,1), category: "new", type: "tshirt" , stock: 60 },
  { id: 19, name: "Full Sleeve Henley Tee",    brand: "TN91", price: 529,  img: pick(tshirtImgs,2), category: "featured", type: "tshirt" , stock: 5 },
  { id: 20, name: "Printed Polo Tee",          brand: "TN91", price: 499,  img: pick(tshirtImgs,3), category: "featured", type: "tshirt" , stock: 0 },
  { id: 29, name: "Plain Crew Neck Tee",       brand: "TN91", price: 299,  img: pick(tshirtImgs,4), category: "new", type: "tshirt" , stock: 15 },
  { id: 30, name: "Athletic Performance Tee",  brand: "TN91", price: 479,  img: pick(tshirtImgs,5), category: "featured", type: "tshirt" , stock: 60 },
  { id: 31, name: "Camo Print Tee",            brand: "TN91", price: 459,  img: pick(tshirtImgs,6), category: "new", type: "tshirt" , stock: 5 },
  { id: 32, name: "Color Block Tee",           brand: "TN91", price: 419,  img: pick(tshirtImgs,7), category: "new", type: "tshirt" , stock: 0 },
  { id: 33, name: "Striped Cotton Tee",        brand: "TN91", price: 399,  img: pick(tshirtImgs,0), category: "featured", type: "tshirt" , stock: 30 },
  { id: 34, name: "Pocket Detail Tee",         brand: "TN91", price: 439,  img: pick(tshirtImgs,1), category: "new", type: "tshirt" , stock: 12 },

  // ===== SHIRTS =====
  { id: 5,  name: "Slim Fit Casual Shirt",     brand: "TN91", price: 599,  img: pick(shirtImgs,0), category: "featured", type: "shirt" , stock: 15 },
  { id: 6,  name: "Striped Cotton Shirt",      brand: "TN91", price: 649,  img: pick(shirtImgs,1), category: "featured", type: "shirt" , stock: 60 },
  { id: 7,  name: "Premium Linen Shirt",       brand: "TN91", price: 799,  img: pick(shirtImgs,2), category: "featured", type: "shirt" , stock: 5 },
  { id: 8,  name: "Formal Check Shirt",        brand: "TN91", price: 699,  img: pick(shirtImgs,3), category: "featured", type: "shirt" , stock: 0 },
  { id: 21, name: "Oxford Button-Down Shirt",  brand: "TN91", price: 849,  img: pick(shirtImgs,0), category: "featured", type: "shirt" , stock: 30 },
  { id: 22, name: "Mandarin Collar Shirt",     brand: "TN91", price: 749,  img: pick(shirtImgs,1), category: "new", type: "shirt" , stock: 12 },
  { id: 23, name: "Floral Print Shirt",        brand: "TN91", price: 699,  img: pick(shirtImgs,2), category: "new", type: "shirt" , stock: 50 },
  { id: 24, name: "Denim Casual Shirt",        brand: "TN91", price: 899,  img: pick(shirtImgs,3), category: "new", type: "shirt" , stock: 25 },
  { id: 35, name: "Plaid Flannel Shirt",       brand: "TN91", price: 749,  img: pick(shirtImgs,0), category: "new", type: "shirt" , stock: 50 },
  { id: 36, name: "White Formal Shirt",        brand: "TN91", price: 649,  img: pick(shirtImgs,1), category: "featured", type: "shirt" , stock: 25 },
  { id: 37, name: "Short Sleeve Resort Shirt", brand: "TN91", price: 599,  img: pick(shirtImgs,2), category: "new", type: "shirt" , stock: 8 },
  { id: 38, name: "Corduroy Overshirt",        brand: "TN91", price: 999,  img: pick(shirtImgs,3), category: "featured", type: "shirt" , stock: 0 },

  // ===== PANTS =====
  { id: 13, name: "Slim Fit Chino Pants",      brand: "TN91", price: 799,  img: pick(pantImgs,0), category: "new", type: "pant" , stock: 8 },
  { id: 14, name: "Cargo Jogger Pants",        brand: "TN91", price: 849,  img: pick(pantImgs,1), category: "new", type: "pant" , stock: 0 },
  { id: 15, name: "Formal Trousers",           brand: "TN91", price: 999,  img: pick(pantImgs,2), category: "new", type: "pant" , stock: 40 },
  { id: 16, name: "Casual Track Pants",        brand: "TN91", price: 699,  img: pick(pantImgs,3), category: "new", type: "pant" , stock: 3 },
  { id: 25, name: "Slim Fit Jeans",            brand: "TN91", price: 1099, img: pick(pantImgs,0), category: "featured", type: "pant" , stock: 8 },
  { id: 26, name: "Stretch Chino Pants",       brand: "TN91", price: 899,  img: pick(pantImgs,1), category: "featured", type: "pant" , stock: 0 },
  { id: 27, name: "Linen Summer Pants",        brand: "TN91", price: 799,  img: pick(pantImgs,2), category: "new", type: "pant" , stock: 40 },
  { id: 28, name: "Athletic Joggers",          brand: "TN91", price: 749,  img: pick(pantImgs,3), category: "new", type: "pant" , stock: 3 },
  { id: 39, name: "Straight Fit Denim Jeans",  brand: "TN91", price: 1199, img: pick(pantImgs,0), category: "featured", type: "pant" , stock: 40 },
  { id: 40, name: "Cotton Cargo Pants",        brand: "TN91", price: 899,  img: pick(pantImgs,1), category: "new", type: "pant" , stock: 3 },
  { id: 41, name: "Pleated Formal Trousers",   brand: "TN91", price: 949,  img: pick(pantImgs,2), category: "featured", type: "pant" , stock: 15 },
  { id: 42, name: "Slim Track Pants",          brand: "TN91", price: 649,  img: pick(pantImgs,3), category: "new", type: "pant" , stock: 60 },

  // ===== FOOTBALL JERSEYS =====
  { id: 43, name: "India National Team Jersey",     brand: "TN91 Sports", price: 1299, img: pick(jerseyImgs,0), category: "new",      type: "jersey" , stock: 5 },
  { id: 44, name: "Manchester Style Home Jersey",    brand: "TN91 Sports", price: 1499, img: pick(jerseyImgs,1), category: "featured", type: "jersey" , stock: 0 },
  { id: 45, name: "Barcelona Style Away Jersey",     brand: "TN91 Sports", price: 1499, img: pick(jerseyImgs,2), category: "new",      type: "jersey" , stock: 30 },
  { id: 46, name: "Classic Stripe Football Jersey",  brand: "TN91 Sports", price: 999,  img: pick(jerseyImgs,3), category: "new",      type: "jersey" , stock: 12 },
  { id: 47, name: "Training Practice Jersey",        brand: "TN91 Sports", price: 799,  img: pick(jerseyImgs,4), category: "featured", type: "jersey" , stock: 50 },
  { id: 48, name: "Retro Football Jersey",           brand: "TN91 Sports", price: 1199, img: pick(jerseyImgs,5), category: "new",      type: "jersey" , stock: 25 },
];

export default products;
