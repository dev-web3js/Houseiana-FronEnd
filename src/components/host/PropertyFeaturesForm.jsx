export default function PropertyFeaturesForm({ data, updateData, nextStep, prevStep }) {
  const [features, setFeatures] = useState(data.features || {
    // In-Unit Features
    inUnit: {
      bedrooms: 2,
      bathrooms: 2,
      beds: 3,
      maxAdults: 4,
      maxChildren: 2,
      maxInfants: 1,
      floorNumber: '',
      totalFloors: '',
      unitSize: '',
      balconies: 0,
      
      // Kitchen
      kitchenType: 'full', // full, kitchenette, shared, none
      kitchenAppliances: {
        refrigerator: true,
        stove: true,
        oven: true,
        microwave: true,
        dishwasher: false,
        coffeeMaker: true,
        toaster: true,
        kettle: true,
        cookware: true,
        dinnerware: true
      },
      
      // Living Spaces
      spaces: {
        livingRoom: true,
        diningArea: true,
        workSpace: true,
        studyRoom: false,
        maidRoom: false,
        storageRoom: false,
        laundryRoom: true
      },
      
      // Bathroom Features
      bathroomFeatures: {
        bathtub: true,
        shower: true,
        bidet: true,
        hairDryer: true,
        towelsProvided: true,
        toiletries: true
      },
      
      // Climate Control
      climate: {
        centralAC: true,
        splitAC: false,
        ceiling_fans: true,
        heating: false // Not needed in Qatar
      },
      
      // Entertainment
      entertainment: {
        tv: true,
        cable: true,
        netflix: true,
        soundSystem: false,
        gamingConsole: false
      },
      
      // Connectivity
      connectivity: {
        wifi: true,
        wifiSpeed: '100+ Mbps',
        ethernet: false,
        dedicatedWorkspace: true,
        printer: false
      }
    },
    
    // Building Facilities
    building: {
      security: {
        gatedCommunity: true,
        security24_7: true,
        cctv: true,
        keyCardAccess: true,
        intercom: true,
        securityGuard: true
      },
      
      parking: {
        available: true,
        type: 'covered', // covered, underground, open, street
        spots: 2,
        free: true,
        evCharging: false
      },
      
      wellness: {
        gym: true,
        pool: true,
        kidsPool: true,
        sauna: false,
        spa: false,
        jacuzzi: true,
        yogaRoom: false
      },
      
      services: {
        concierge: true,
        doorman: true,
        valet: false,
        housekeeping: 'available', // included, available, none
        maintenance24_7: true,
        laundryService: true,
        groceryDelivery: true
      },
      
      commonAreas: {
        lobby: true,
        rooftopTerrace: true,
        garden: true,
        bbqArea: true,
        playground: true,
        partyHall: true,
        businessCenter: true,
        library: false
      },
      
      accessibility: {
        elevator: true,
        wheelchairAccessible: true,
        ramps: true,
        accessibleParking: true,
        brailleSignage: false
      }
    },
    
    // Compound/Community Amenities
    compound: {
      name: '', // e.g., "The Pearl Qatar"
      type: 'residential', // residential, mixed, gated
      
      retail: {
        groceryStore: true,
        pharmacy: true,
        restaurants: true,
        cafes: true,
        salon: true,
        dryCleaner: true,
        bank: false,
        atm: true
      },
      
      recreation: {
        beach: false,
        marina: false,
        walkingTrails: true,
        bikePaths: true,
        tennisCourtts: false,
        basketballCourt: true,
        soccerField: false,
        golfCourse: false
      },
      
      family: {
        nursery: true,
        schoolBus: true,
        kidsClub: true,
        tutoring: false,
        daycare: true,
        pediatricClinic: false
      },
      
      transport: {
        publicTransport: '5 min walk',
        metro: '10 min walk',
        busStop: '2 min walk',
        taxiStand: true,
        shuttleService: false
      }
    },
    
    // Nearby Services (within 1km)
    nearby: {
      education: {
        internationalSchool: '500m',
        publicSchool: '1km',
        university: '',
        languageCenter: ''
      },
      
      healthcare: {
        hospital: 'Hamad Hospital - 2km',
        clinic: '500m',
        pharmacy: '200m',
        dental: '1km'
      },
      
      shopping: {
        mall: 'City Center - 1.5km',
        supermarket: 'Carrefour - 300m',
        traditionalSouq: '',
        convenienceStore: '100m'
      },
      
      worship: {
        mosque: '200m',
        church: '',
        other: ''
      },
      
      dining: {
        restaurants: '10+ within 500m',
        cafes: '5+ within 200m',
        delivery: 'All major apps available'
      }
    },
    
    // Safety Features
    safety: {
      smokeDetector: true,
      fireExtinguisher: true,
      firstAidKit: true,
      emergencyExit: true,
      safe: false,
      securityAlarm: true,
      carbonMonoxideDetector: false
    },
    
    // Family & Child Features
    familyFeatures: {
      childProof: false,
      babyGates: false,
      crib: true,
      highChair: true,
      changingTable: false,
      babyMonitor: false,
      toys: true,
      books: true,
      boardGames: true,
      outdoorToys: false
    },
    
    // Special Features
    special: {
      petFriendly: false,
      smokingAllowed: false,
      eventsAllowed: false,
      photographyAllowed: true,
      wheelchairAccessible: true,
      seniorFriendly: true
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData({ features });
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h2 className="text-2xl font-bold">Property Features & Amenities</h2>

      {/* Occupancy Section */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Occupancy Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Maximum Adults <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={features.inUnit.maxAdults}
              onChange={(e) => setFeatures({
                ...features,
                inUnit: {...features.inUnit, maxAdults: parseInt(e.target.value)}
              })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Maximum Children (2-12 years)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={features.inUnit.maxChildren}
              onChange={(e) => setFeatures({
                ...features,
                inUnit: {...features.inUnit, maxChildren: parseInt(e.target.value)}
              })}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Maximum Infants (Under 2)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              value={features.inUnit.maxInfants}
              onChange={(e) => setFeatures({
                ...features,
                inUnit: {...features.inUnit, maxInfants: parseInt(e.target.value)}
              })}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Total capacity: {features.inUnit.maxAdults + features.inUnit.maxChildren} guests 
          (plus {features.inUnit.maxInfants} infant{features.inUnit.maxInfants !== 1 ? 's' : ''})
        </p>
      </div>

      {/* Building Facilities */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Building/Compound Facilities</h3>
        
        {/* Security */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Security</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(features.building.security).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setFeatures({
                    ...features,
                    building: {
                      ...features.building,
                      security: {...features.building.security, [key]: e.target.checked}
                    }
                  })}
                  className="rounded"
                />
                <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Wellness */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Wellness & Recreation</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(features.building.wellness).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setFeatures({
                    ...features,
                    building: {
                      ...features.building,
                      wellness: {...features.building.wellness, [key]: e.target.checked}
                    }
                  })}
                  className="rounded"
                />
                <span className="text-sm">{key.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 border rounded-lg"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-brand text-white rounded-lg"
        >
          Next: Description & Rules
        </button>
      </div>
    </form>
  );
}