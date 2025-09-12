// AWS RDS Connection Diagnostic Test
import net from 'net';

const DB_HOST = 'database-1houseiana.c9qywii4wmqh.eu-north-1.rds.amazonaws.com';
const DB_PORT = 5432;
const DB_USER = 'postgres';
const DB_NAME = 'houseiana';

async function testNetworkConnection() {
  console.log('🌐 Testing Network Connectivity to AWS RDS...\n');
  
  return new Promise((resolve, reject) => {
    console.log(`🔍 Attempting to connect to ${DB_HOST}:${DB_PORT}...`);
    
    const socket = new net.Socket();
    const timeout = 10000; // 10 seconds
    
    socket.setTimeout(timeout);
    
    socket.on('connect', () => {
      console.log('✅ Network connection successful!');
      console.log('🔌 TCP connection to AWS RDS established');
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.log('⏰ Connection timeout (10 seconds)');
      console.log('❌ Could not establish network connection');
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (error) => {
      console.log('❌ Network connection failed');
      console.log('Error:', error.message);
      console.log('Code:', error.code);
      resolve(false);
    });
    
    socket.connect(DB_PORT, DB_HOST);
  });
}

async function checkDNSResolution() {
  console.log('🔍 Testing DNS Resolution...\n');
  
  try {
    const { lookup } = await import('dns/promises');
    const result = await lookup(DB_HOST);
    
    console.log('✅ DNS Resolution successful!');
    console.log(`🌐 ${DB_HOST} resolves to: ${result.address}`);
    console.log(`📍 Address family: IPv${result.family}`);
    return true;
    
  } catch (error) {
    console.log('❌ DNS Resolution failed');
    console.log('Error:', error.message);
    return false;
  }
}

async function runDiagnostics() {
  console.log('🩺 AWS RDS Database Connectivity Diagnostics');
  console.log('=' .repeat(50));
  console.log(`Database Host: ${DB_HOST}`);
  console.log(`Database Port: ${DB_PORT}`);
  console.log(`Database User: ${DB_USER}`);
  console.log(`Database Name: ${DB_NAME}\n`);
  
  // Test 1: DNS Resolution
  const dnsWorking = await checkDNSResolution();
  
  // Test 2: Network Connection
  const networkWorking = await testNetworkConnection();
  
  // Summary
  console.log('\n📊 DIAGNOSTIC SUMMARY');
  console.log('=' .repeat(30));
  console.log(`DNS Resolution: ${dnsWorking ? '✅ Working' : '❌ Failed'}`);
  console.log(`Network Connection: ${networkWorking ? '✅ Working' : '❌ Failed'}`);
  
  if (dnsWorking && networkWorking) {
    console.log('\n🎉 Network connectivity is working!');
    console.log('💡 The issue might be:');
    console.log('   - Database authentication (username/password)');
    console.log('   - Database not running');
    console.log('   - Security group blocking your specific IP');
    console.log('   - Database is in a private subnet');
  } else if (dnsWorking && !networkWorking) {
    console.log('\n🔥 Network connection failed but DNS works');
    console.log('💡 Possible issues:');
    console.log('   - AWS RDS instance is stopped');
    console.log('   - Security groups are blocking the connection');
    console.log('   - Database is in a private subnet without public access');
    console.log('   - Network ACLs are blocking traffic');
  } else if (!dnsWorking) {
    console.log('\n🔥 DNS resolution failed');
    console.log('💡 Possible issues:');
    console.log('   - Database instance name is incorrect');
    console.log('   - Database instance has been deleted');
    console.log('   - Region mismatch in the endpoint');
  }
  
  console.log('\n🛠️  NEXT STEPS:');
  console.log('1. Check AWS Console → RDS → Database instances');
  console.log('2. Verify the database is in "Available" status');
  console.log('3. Check Security Groups allow inbound traffic on port 5432');
  console.log('4. Verify your current IP address is allowed');
  console.log('5. Check if the database has public accessibility enabled');
  
  return { dnsWorking, networkWorking };
}

// Run the diagnostics
runDiagnostics().catch(console.error);