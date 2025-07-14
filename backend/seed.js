const mongoose = require('mongoose');
require('dotenv').config();

const Customer = require('./models/Customer');
const Order = require('./models/Order');
const Product = require('./models/Product');
const Employee = require('./models/Employee');
const Alert = require('./models/Alert');

const seedData = async () => {
  try {
    // ✅ 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');

    // ✅ 2. Clear existing data
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Employee.deleteMany({});
    await Alert.deleteMany({});
    console.log('✅ Existing collections cleared');

    // ✅ 3. Seed customers
    const customers = [];
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Amy', 'Chris', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      customers.push({
        phoneNumber: `555${String(1000000 + i).padStart(7, '0')}`,
        name: `${firstName} ${lastName}`,
        password: 'password123',
        loyaltyPoints: Math.floor(Math.random() * 101),
        orderHistory: []
      });
    }
    await Customer.insertMany(customers);

    // ✅ 4. Seed products
    const productData = [
      { name: 'Whole Milk', category: 'Dairy', price: 3.49 },
      { name: 'Cheddar Cheese', category: 'Dairy', price: 4.99 },
      { name: 'Greek Yogurt', category: 'Dairy', price: 5.99 },
      { name: 'White Bread', category: 'Bakery', price: 2.49 },
      { name: 'Whole Wheat Bread', category: 'Bakery', price: 2.99 },
      { name: 'Croissants', category: 'Bakery', price: 3.99 },
      { name: 'Bananas', category: 'Produce', price: 1.29 },
      { name: 'Apples', category: 'Produce', price: 2.99 },
      { name: 'Carrots', category: 'Produce', price: 1.99 },
      { name: 'Spinach', category: 'Produce', price: 2.49 },
      { name: 'Basmati Rice', category: 'Grains', price: 5.99 },
      { name: 'Quinoa', category: 'Grains', price: 7.99 },
      { name: 'Pasta', category: 'Grains', price: 1.99 },
      { name: 'Sugar 1kg', category: 'Pantry', price: 2.99 },
      { name: 'Salt', category: 'Pantry', price: 1.49 },
      { name: 'Olive Oil', category: 'Pantry', price: 8.99 },
      { name: 'Potato Chips', category: 'Snacks', price: 3.49 },
      { name: 'Chocolate Bar', category: 'Snacks', price: 2.99 },
      { name: 'Cookies', category: 'Snacks', price: 4.49 },
      { name: 'Orange Juice', category: 'Beverages', price: 4.99 }
    ];

    const products = [];
    for (let i = 0; i < 100; i++) {
      const base = productData[i % productData.length];
      const variation = i >= productData.length ? ` ${Math.floor(i / productData.length) + 1}` : '';
      products.push({
        productId: `PROD${String(i + 1).padStart(3, '0')}`,
        name: base.name + variation,
        category: base.category,
        price: Math.round((base.price + (Math.random() * 2 - 1)) * 100) / 100,
        stockQuantity: Math.floor(Math.random() * 91) + 10,
        aisle: `A${Math.floor(Math.random() * 10) + 1}`,
        shelf: String.fromCharCode(65 + Math.floor(Math.random() * 5))
      });
    }
    await Product.insertMany(products);

    // ✅ 5. Seed employees
    // ✅ Updated employee seeding with password
const employees = [];
for (let i = 0; i < 10; i++) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  employees.push({
    employeeId: `EMP${String(i + 1).padStart(3, '0')}`,
    name: `${firstName} ${lastName}`,
    password: 'password123', // ✅ Required field added
    alerts: []
  });
}
await Employee.insertMany(employees); // ✅ This now works without error


    // ✅ 6. Seed orders
    const orders = [];
    for (let i = 0; i < 100; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const numItems = Math.floor(Math.random() * 5) + 1;
      const items = [];
      let totalAmount = 0;

      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = product.price * quantity;
        totalAmount += itemTotal;

        items.push({
          productId: product.productId,
          name: product.name,
          quantity: quantity,
          price: product.price
        });
      }

      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 365));

      orders.push({
        orderId: `ORD${String(i + 1).padStart(3, '0')}`,
        customerId: customer.phoneNumber,
        items,
        orderDate,
        totalAmount: Math.round(totalAmount * 100) / 100,
        status: Math.random() > 0.3 ? 'completed' : 'pending'
      });
    }
    await Order.insertMany(orders);

    for (const order of orders) {
      await Customer.findOneAndUpdate(
        { phoneNumber: order.customerId },
        { $push: { orderHistory: order.orderId } }
      );
    }

    // ✅ 7. Seed alerts
    const alerts = [];
    const alertMessages = [
      'Restock sugar in Aisle 3', 'Check expiry dates in dairy section',
      'Clean up spill in Aisle 5', 'Restock bread in bakery section',
      'Price check needed for produce', 'Customer complaint about product quality',
      'Inventory count needed for snacks', 'Restock milk in refrigerated section',
      'Check temperature of frozen foods', 'Organize shelves in Aisle 2'
    ];

    for (let i = 0; i < 20; i++) {
      const employee = employees[Math.floor(Math.random() * employees.length)];
      alerts.push({
        alertId: `ALT${String(i + 1).padStart(3, '0')}`,
        message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
        employeeId: employee.employeeId,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        status: Math.random() > 0.5 ? 'pending' : 'delivered'
      });
    }
    await Alert.insertMany(alerts);

    // ✅ 8. Done!
    console.log('🎉 Database seeded successfully!');
    console.log(`Customers: ${customers.length}`);
    console.log(`Products: ${products.length}`);
    console.log(`Employees: ${employees.length}`);
    console.log(`Orders: ${orders.length}`);
    console.log(`Alerts: ${alerts.length}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // ✅ Close connection safely
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
};

seedData();
