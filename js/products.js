
let products = [];
const defaultProducts = [
    {
        id: 1,
        name: "Minimal Satin Dress",
        category: "Women",
        price: 29.99,
        oldPrice: 39.99,
        rating: 4.8,
        reviews: 128,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White"],
        image: "images/products/women/img1.jpg",
    },
    {
        id: 2,
        name: "Oversized Street Hoodie",
        category: "Women",
        price: 24.99,
        oldPrice: 34.99,
        rating: 4.7,
        reviews: 94,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Gray"],
        image: "images/products/women/img2.jpg"
    },
    {
        id: 3,
        name: "Classic Denim Jacket",
        category: "Women",
        price: 35.99,
        oldPrice: 49.99,
        rating: 4.9,
        reviews: 211,
        sizes: ["S", "M", "L"],
        colors: ["Blue"],
        image: "images/products/women/img3.jpg"
    },
    {
        id: 4,
        name: "Everyday Knit Top",
        category: "Women",
        price: 18.99,
        oldPrice: 25.99,
        rating: 4.6,
        reviews: 76,
        sizes: ["S", "M", "L"],
        colors: ["Cream", "Black"],
        image: "images/products/women/img4.jpg"
    },
    {
        id: 5,
        name: "Relaxed Cargo Pants",
        category: "Men",
        price: 31.99,
        oldPrice: 42.99,
        rating: 4.7,
        reviews: 63,
        sizes: ["M", "L", "XL"],
        colors: ["Black", "Khaki"],
        image: "images/products/men/img1.jpg"
    },
    {
        id: 6,
        name: "Premium Basic Tee",
        category: "Men",
        price: 15.99,
        oldPrice: 21.99,
        rating: 4.8,
        reviews: 154,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Black"],
        image: "images/products/men/img2.jpg"
    },
    {
        id: 7,
        name: "Canvas Shoulder Bag",
        category: "Accessories",
        price: 22.99,
        oldPrice: 29.99,
        rating: 4.9,
        reviews: 89,
        sizes: ["One Size"],
        colors: ["Black", "Brown"],
        image: "images/products/accessory/img1.jpg"
    },
    {
        id: 8,
        name: "Fashion Sneakers",
        category: "Shoes",
        price: 39.99,
        oldPrice: 55.99,
        rating: 4.8,
        reviews: 178,
        sizes: ["38", "39", "40", "41", "42"],
        colors: ["Red", "White"],
        image: "images/products/shoes/img1.jpg"
    }
];


// ==========================================
// Load Products
// ==========================================

// ==========================================
// Load Products
// ==========================================

const savedProducts = localStorage.getItem("vshopping_products");

if (savedProducts) {
    products = JSON.parse(savedProducts);
} else {
    products = [...defaultProducts];

    localStorage.setItem(
        "vshopping_products",
        JSON.stringify(products)
    );
}