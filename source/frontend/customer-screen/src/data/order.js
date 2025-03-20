export const allOrders = [
    {
        id: '#ORD-2024-001',
        date: '2024-03-15',
        status: 'Delivered',
        total: 299.99,
        items: 3,
        address: "123 Main St, New York, NY 10001",
        products: [
            {
                name: 'Laptop ASUS ROG',
                quantity: 1,
                price: 1200,
                weight: 2.5,
                image: 'https://source.unsplash.com/150x100/?laptop'
            },
            {
                name: 'Laptop ASUS ROG',
                quantity: 1,
                price: 1200,
                weight: 2.5,
                image: 'https://source.unsplash.com/150x100/?laptop'
            },
            {
                name: 'Wireless Mouse',
                quantity: 2,
                price: 40,
                weight: 0.2,
                image: 'https://source.unsplash.com/150x100/?mouse'
            }
        ]
    },
    {
        id: '#ORD-2024-002',
        date: '2024-03-12',
        status: 'In Transit',
        total: 149.50,
        items: 2,
        address: "123 Main St, New York, NY 10001",
        products: [
            {
                name: 'Mechanical Keyboard',
                quantity: 1,
                price: 99.99,
                weight: 1.5,
                image: 'https://source.unsplash.com/150x100/?keyboard'
            },
            {
                name: 'Headphones',
                quantity: 1,
                price: 50,
                weight: 0.8,
                image: 'https://source.unsplash.com/150x100/?headphones'
            }
        ]
    }
];
