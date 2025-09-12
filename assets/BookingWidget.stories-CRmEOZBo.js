import{j as e}from"./jsx-runtime-Dmcnsbp0.js";import{u as F,r as l}from"./iframe-BYf7DOGw.js";import"./preload-helper-D9Z9MdNV.js";function r({listing:o}){const N=F(),[i,v]=l.useState({checkIn:"",checkOut:"",guests:1}),[B,w]=l.useState(!1),[S,P]=l.useState(!1),[a,L]=l.useState(null),[I,c]=l.useState(""),C=new Date().toISOString().split("T")[0],G=async()=>{c(""),L(null),P(!0);try{const s=await fetch("/api/bookings/check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({listingId:o.id,...i})}),n=await s.json();if(!s.ok){c(n.error||"Cannot check availability");return}L(n.pricing)}catch{c("Failed to check availability")}finally{P(!1)}},R=async()=>{c(""),w(!0);try{const s=await fetch("/api/bookings/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({listingId:o.id,...i})}),n=await s.json();if(!s.ok){if(s.status===401){N.push("/auth/sign-in");return}c(n.error||"Booking failed");return}N.push(`/bookings/${n.booking.id}`)}catch{c("Failed to create booking")}finally{w(!1)}};return e.jsxs("div",{className:"border rounded-xl p-6 shadow-lg bg-white sticky top-4",children:[e.jsxs("div",{className:"text-2xl font-bold mb-2",children:["$",o.monthlyPrice,"/month"]}),e.jsxs("div",{className:"text-sm text-gray-600 mb-4",children:["Minimum stay: ",o.minNights," nights"]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Check-in"}),e.jsx("input",{type:"date",min:C,value:i.checkIn,onChange:s=>v({...i,checkIn:s.target.value}),className:"w-full p-2 border rounded-lg"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Check-out"}),e.jsx("input",{type:"date",min:i.checkIn||C,value:i.checkOut,onChange:s=>v({...i,checkOut:s.target.value}),className:"w-full p-2 border rounded-lg"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium mb-1",children:"Guests"}),e.jsx("select",{value:i.guests,onChange:s=>v({...i,guests:parseInt(s.target.value)}),className:"w-full p-2 border rounded-lg",children:[...Array(o.maxGuests)].map((s,n)=>e.jsxs("option",{value:n+1,children:[n+1," guest",n>0?"s":""]},n+1))})]}),!a&&e.jsx("button",{onClick:G,disabled:S||!i.checkIn||!i.checkOut,className:"w-full py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50",children:S?"Checking...":"Check Availability"}),a&&e.jsxs("div",{className:"border-t pt-4 space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsxs("span",{children:["$",a.nightlyRate," x ",a.nights," nights"]}),e.jsxs("span",{children:["$",a.subtotal]})]}),e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{children:"Cleaning fee"}),e.jsxs("span",{children:["$",a.cleaningFee]})]}),e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{children:"Service fee"}),e.jsxs("span",{children:["$",a.serviceFee]})]}),e.jsxs("div",{className:"flex justify-between font-bold pt-2 border-t",children:[e.jsx("span",{children:"Total"}),e.jsxs("span",{children:["$",a.totalPrice]})]})]}),I&&e.jsx("div",{className:"bg-red-50 border border-red-200 rounded p-3",children:e.jsx("p",{className:"text-sm text-red-600",children:I})}),a&&e.jsx("button",{onClick:R,disabled:B,className:"w-full py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark disabled:opacity-50",children:B?"Processing...":"Reserve Now"})]})]})}r.__docgenInfo={description:"",methods:[],displayName:"BookingWidget"};const A={title:"Booking Components/BookingWidget",component:r,parameters:{layout:"padded",docs:{description:{component:"A booking widget that allows users to select dates, number of guests, check availability, and proceed with booking. Features real-time pricing calculation and availability checking."}}},tags:["autodocs"],argTypes:{listing:{description:"Listing object containing property information",control:{type:"object"}}},decorators:[o=>e.jsx("div",{style:{maxWidth:"400px",margin:"0 auto"},children:e.jsx(o,{})})]},t={id:"1",title:"Luxury Apartment in West Bay",pricePerNight:150,cleaningFee:25,serviceFee:15,maxGuests:4,minNights:1,location:"West Bay, Doha",host:{name:"Ahmed Al-Rashid",avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"},amenities:["WiFi","Kitchen","Air Conditioning","Parking"],isInstantBook:!0},W={...t,id:"2",title:"Premium Villa with Private Pool",pricePerNight:450,cleaningFee:75,serviceFee:45,maxGuests:8,minNights:2,location:"The Pearl, Doha",isInstantBook:!1},j={...t,id:"3",title:"Cozy Studio Near Souq",pricePerNight:65,cleaningFee:15,serviceFee:8,maxGuests:2,minNights:1,location:"Downtown Doha",isInstantBook:!0},d={args:{listing:t}},g={args:{listing:W}},m={args:{listing:j}},p={args:{listing:{...t,maxGuests:12,pricePerNight:320,title:"Large Family Villa"}}},u={args:{listing:{...t,minNights:7,title:"Weekly Rental Only",pricePerNight:120}}},h={args:{listing:{...t,isInstantBook:!0,title:"Instant Book Available"}}},x={args:{listing:{...t,isInstantBook:!1,title:"Request to Book Required"}}},b={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Instant Book"}),e.jsx(r,{listing:{...t,isInstantBook:!0,title:"Modern Apartment"}})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Request to Book"}),e.jsx(r,{listing:{...t,isInstantBook:!1,title:"Luxury Villa"}})]})]}),parameters:{docs:{description:{story:"Comparison of booking widgets with different booking types - instant book vs request to book."}}}},k={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Budget ($65/night)"}),e.jsx(r,{listing:j})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Standard ($150/night)"}),e.jsx(r,{listing:t})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Premium ($450/night)"}),e.jsx(r,{listing:W})]})]}),parameters:{docs:{description:{story:"Booking widgets showing different price ranges to demonstrate pricing display variations."}}}},f={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Studio (2 guests max)"}),e.jsx(r,{listing:{...j,maxGuests:2,title:"Cozy Studio"}})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Villa (12 guests max)"}),e.jsx(r,{listing:{...t,maxGuests:12,pricePerNight:380,title:"Large Villa"}})]})]}),parameters:{docs:{description:{story:"Booking widgets for properties with different guest capacities."}}}},y={args:{listing:t},decorators:[o=>e.jsx("div",{style:{maxWidth:"320px",margin:"0 auto"},children:e.jsx(o,{})})],parameters:{docs:{description:{story:"Mobile view of the booking widget optimized for smaller screens."}}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    listing: mockListing
  }
}`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    listing: expensiveListing
  }
}`,...g.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    listing: budgetListing
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    listing: {
      ...mockListing,
      maxGuests: 12,
      pricePerNight: 320,
      title: 'Large Family Villa'
    }
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    listing: {
      ...mockListing,
      minNights: 7,
      title: 'Weekly Rental Only',
      pricePerNight: 120
    }
  }
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    listing: {
      ...mockListing,
      isInstantBook: true,
      title: 'Instant Book Available'
    }
  }
}`,...h.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    listing: {
      ...mockListing,
      isInstantBook: false,
      title: 'Request to Book Required'
    }
  }
}`,...x.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Instant Book</h3>
        <BookingWidget listing={{
        ...mockListing,
        isInstantBook: true,
        title: 'Modern Apartment'
      }} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Request to Book</h3>
        <BookingWidget listing={{
        ...mockListing,
        isInstantBook: false,
        title: 'Luxury Villa'
      }} />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Comparison of booking widgets with different booking types - instant book vs request to book.'
      }
    }
  }
}`,...b.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Budget ($65/night)</h3>
        <BookingWidget listing={budgetListing} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Standard ($150/night)</h3>
        <BookingWidget listing={mockListing} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Premium ($450/night)</h3>
        <BookingWidget listing={expensiveListing} />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Booking widgets showing different price ranges to demonstrate pricing display variations.'
      }
    }
  }
}`,...k.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Studio (2 guests max)</h3>
        <BookingWidget listing={{
        ...budgetListing,
        maxGuests: 2,
        title: 'Cozy Studio'
      }} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Villa (12 guests max)</h3>
        <BookingWidget listing={{
        ...mockListing,
        maxGuests: 12,
        pricePerNight: 380,
        title: 'Large Villa'
      }} />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Booking widgets for properties with different guest capacities.'
      }
    }
  }
}`,...f.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    listing: mockListing
  },
  decorators: [Story => <div style={{
    maxWidth: '320px',
    margin: '0 auto'
  }}>
        <Story />
      </div>],
  parameters: {
    docs: {
      description: {
        story: 'Mobile view of the booking widget optimized for smaller screens.'
      }
    }
  }
}`,...y.parameters?.docs?.source}}};const T=["Default","PremiumProperty","BudgetProperty","LargeGroup","MinimumStay","InstantBook","RequestToBook","BookingOptions","PriceComparison","GuestCapacity","Mobile"];export{b as BookingOptions,m as BudgetProperty,d as Default,f as GuestCapacity,h as InstantBook,p as LargeGroup,u as MinimumStay,y as Mobile,g as PremiumProperty,k as PriceComparison,x as RequestToBook,T as __namedExportsOrder,A as default};
