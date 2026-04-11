const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Complaint = require('../src/models/complaint.model');
const Worker = require('../src/models/worker.model');
const Admin = require('../src/models/admin.model');

const MONGO_URI = 'mongodb://localhost:27017/civicfix';

const adminUser = {
  email: "admin@civicfix.com",
  password: "admin123",
  admin_id: "ADM_001"
};

const workers = [
  { name: "Sameer Khan", phone_number: "9876543211", department: "Sanitation", worker_id: "W_101" },
  { name: "Meera Reddy", phone_number: "9876543212", department: "Electricity", worker_id: "W_102" },
  { name: "Vikram Singh", phone_number: "9876543213", department: "Public Works (Roads)", worker_id: "W_103" },
  { name: "Suresh Babu", phone_number: "9876543214", department: "Water Sewage", worker_id: "W_104" },
  { name: "Priya Das", phone_number: "9876543215", department: "Public Safety", worker_id: "W_105" }
];

const complaints = [
  {
    name: "Rahul Sharma",
    phone_number: "9876500001",
    category: "CAT_001", // Garbage
    description: "Industrial waste dumped illegally behind the secondary school. Strong chemical odor.",
    address: "St. Jude's Lane, Industrial Estate Phase 1",
    image_url: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=80&w=800",
    latitude: 17.3850, longitude: 78.4867, status: "Reported", upvotes: 42,
    comments: [{ text: "This is a health hazard for students!", user_name: "Principal Rao" }]
  },
  {
    name: "Sneha Kapur",
    phone_number: "9876500002",
    category: "CAT_003", // Potholes
    description: "Deep crater formed after last night's rain. Right on the intersection of MG Road.",
    address: "MG Road & 5th Avenue Junction",
    image_url: "https://images.unsplash.com/photo-1597334701292-6eb58f4a13e2?auto=format&fit=crop&q=80&w=800",
    latitude: 17.4126, longitude: 78.4485, status: "In Progress", upvotes: 125,
    assigned_worker_id: "W_103"
  },
  {
    name: "Kiran Kumar",
    phone_number: "9876500003",
    category: "CAT_002", // Street Light
    description: "Entire residential line (units 45-60) has no functioning street lights for 48 hours.",
    address: "Palm Grove Residency, Block B",
    image_url: "https://images.unsplash.com/photo-1542640244-7e672d6cef21?auto=format&fit=crop&q=80&w=800",
    latitude: 17.4486, longitude: 78.3908, status: "Reported", upvotes: 21
  },
  {
    name: "Mohammed Ali",
    phone_number: "9876500004",
    category: "CAT_004", // Water Leakage
    description: "Huge water fountain shooting from the sidewalk. Looks like a main supply line burst.",
    address: "Near Metro Pillar 445, Hyderabad Metro",
    image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    latitude: 17.3616, longitude: 78.4747, status: "In Progress", upvotes: 89,
    assigned_worker_id: "W_104"
  },
  {
    name: "Geetha Rani",
    phone_number: "9876500005",
    category: "CAT_001", // Garbage
    description: "Community bin overflowing for 3 days. Trash spreading across the road due to wind.",
    address: "Vikas Enclave, Gate 2",
    image_url: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
    latitude: 17.4321, longitude: 78.3456, status: "Resolved", upvotes: 18,
    comments: [{ text: "Finally cleared, but please increase pickup frequency.", user_name: "Resident Assoc" }]
  },
  {
    name: "David Paul",
    phone_number: "9876500006",
    category: "CAT_002", // Street Light
    description: "Exposed wiring on a fallen light pole. Extremely dangerous for children playing nearby.",
    address: "Children's Park, Sector 5",
    image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
    latitude: 17.3987, longitude: 78.5123, status: "Reported", upvotes: 67
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for professional seeding...');
    
    // Clear existing
    await Complaint.deleteMany({});
    await Worker.deleteMany({});
    
    // Insert Workers
    await Worker.insertMany(workers);
    console.log('Inserted 5 Professional Workers.');

    // Insert Admin
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await Admin.deleteMany({});
    await Admin.create({
      email: adminUser.email,
      password_hash: hashedPassword,
      admin_id: adminUser.admin_id
    });
    console.log('Inserted Admin User (admin@civicfix.com / admin123)');
    
    // Insert Complaints
    for (const data of complaints) {
      const complaint_id = "CMP_" + Math.floor(100000 + Math.random() * 900000);
      const location = { type: 'Point', coordinates: [data.longitude, data.latitude] };
      await Complaint.create({ ...data, complaint_id, location });
    }
    
    console.log(`Successfully seeded database with ${complaints.length} professional reports!`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
