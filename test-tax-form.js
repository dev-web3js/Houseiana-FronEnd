// Test script to verify the tax information API with phone number

const testTaxInformation = async () => {
  try {
    console.log('Testing Tax Information API with phone number...');

    // Test data with phone number
    const testData = {
      userId: "test-user-id-" + Date.now(),
      taxIdType: "qid",
      taxId: "12345678901",
      legalName: "Test User",
      phoneNumber: "+97412345678", // Phone number is now mandatory
      businessType: "individual",
      taxCountry: "QA",
      taxAddress: "123 Test Street",
      taxCity: "Doha",
      taxState: "",
      taxPostalCode: "",
      subjectToBackupWith: false,
      exemptFromBackupWith: false,
      taxWithholdingRate: null,
      fatcaStatus: "exempt",
      crsStatus: "",
      requiresReporting: true
    };

    // Test POST (Create)
    console.log('\n1. Testing POST - Create tax information');
    const createResponse = await fetch('http://localhost:3000/api/tax-information', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const createResult = await createResponse.json();
    console.log('Create Response:', createResult);

    if (createResponse.ok) {
      console.log('✅ POST successful - tax information created');
    } else {
      console.log('❌ POST failed:', createResult.error);
      return;
    }

    // Test GET
    console.log('\n2. Testing GET - Fetch tax information');
    const getResponse = await fetch(`http://localhost:3000/api/tax-information?userId=${testData.userId}`);
    const getResult = await getResponse.json();
    console.log('GET Response:', getResult);

    if (getResponse.ok && getResult.taxInformation) {
      console.log('✅ GET successful - tax information retrieved');
      console.log('Phone Number:', getResult.taxInformation.phoneNumber);
    } else {
      console.log('❌ GET failed');
    }

    // Test POST (Update) - without phone number to test validation
    console.log('\n3. Testing POST - Update without phone number (should fail)');
    const updateDataWithoutPhone = { ...testData, phoneNumber: '' };
    const updateResponse = await fetch('http://localhost:3000/api/tax-information', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateDataWithoutPhone)
    });

    const updateResult = await updateResponse.json();
    console.log('Update Response:', updateResult);

    if (!updateResponse.ok && updateResult.error.includes('phoneNumber')) {
      console.log('✅ Validation working - phone number is required');
    } else {
      console.log('❌ Validation failed - should require phone number');
    }

    // Test DELETE
    console.log('\n4. Testing DELETE - Remove tax information');
    const deleteResponse = await fetch(`http://localhost:3000/api/tax-information?userId=${testData.userId}`, {
      method: 'DELETE'
    });

    const deleteResult = await deleteResponse.json();
    console.log('DELETE Response:', deleteResult);

    if (deleteResponse.ok) {
      console.log('✅ DELETE successful - tax information removed');
    } else {
      console.log('❌ DELETE failed');
    }

    console.log('\n🎉 Tax Information API test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Run the test
testTaxInformation();