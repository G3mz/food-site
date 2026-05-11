// Run this script to create the 'categories' collection in PocketBase
// Usage: node create-categories-collection.js <admin_email> <admin_password>

const PB_URL = 'http://localhost:8090';

async function run() {
  const email = process.argv[2] || 'admin@pechborsh.ru';
  const password = process.argv[3] || 'adminadmin1';

  // Auth as superuser
  console.log('🔑 Authenticating...');
  const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password }),
  });

  if (!authRes.ok) {
    console.error('❌ Auth failed. Please provide correct admin credentials.');
    console.error('   Usage: node create-categories-collection.js <email> <password>');
    console.error('   Or create the collection manually in PocketBase admin: http://localhost:8090/_/');
    console.log('\n📋 Collection schema to create manually:');
    console.log('   Name: categories');
    console.log('   Fields: key (text, required), label (text, required), sort_order (number)');
    console.log('   API Rules: list/view = "" (public), create/update/delete = @request.auth.id != ""');
    return;
  }

  const { token } = await authRes.json();
  console.log('✅ Authenticated');

  // Create collection
  console.log('📦 Creating categories collection...');
  const schema = {
    name: 'categories',
    type: 'base',
    listRule: '',
    viewRule: '',
    createRule: '@request.auth.id != ""',
    updateRule: '@request.auth.id != ""',
    deleteRule: '@request.auth.id != ""',
    fields: [
      { name: 'key', type: 'text', required: true, options: { min: 1, max: 50 } },
      { name: 'label', type: 'text', required: true, options: { min: 1, max: 100 } },
      { name: 'sort_order', type: 'number', required: false },
    ],
  };

  const createRes = await fetch(`${PB_URL}/api/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(schema),
  });

  if (createRes.ok) {
    console.log('✅ Collection "categories" created successfully!');
    console.log('\n📝 Now add categories in the admin panel: http://localhost:8090/_/');
    console.log('   Example records:');
    console.log('   { key: "meat", label: "Мясное", sort_order: 1 }');
    console.log('   { key: "soups", label: "Супы", sort_order: 2 }');
    console.log('   { key: "desserts", label: "Десерты", sort_order: 3 }');
    console.log('   { key: "burgers", label: "Бургеры", sort_order: 4 }');
  } else {
    const err = await createRes.text();
    if (err.includes('already exists')) {
      console.log('ℹ️  Collection "categories" already exists.');
    } else {
      console.error('❌ Failed to create collection:', err);
    }
  }
}

run().catch(console.error);
