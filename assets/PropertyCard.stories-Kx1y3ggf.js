import{j as e}from"./jsx-runtime-Dmcnsbp0.js";import{r as S}from"./iframe-BYf7DOGw.js";import{L}from"./link-DafOocEU.js";import"./preload-helper-D9Z9MdNV.js";import"./use-merged-ref-DPie8Noq.js";function o({property:r}){const[P,w]=S.useState(0),[v,k]=S.useState(!1),I=async t=>{t.preventDefault(),t.stopPropagation();try{(await fetch("/api/favorites/toggle",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({propertyId:r.id})})).ok&&k(!v)}catch(s){console.error("Error toggling favorite:",s)}},N=t=>{t.preventDefault(),t.stopPropagation(),r.images&&r.images.length>1&&w(s=>(s+1)%r.images.length)},A=t=>{t.preventDefault(),t.stopPropagation(),r.images&&r.images.length>1&&w(s=>s===0?r.images.length-1:s-1)},i=r.images||["/api/placeholder/400/300"],F=i[P]||"/api/placeholder/400/300";return e.jsx(L,{href:`/property/${r.id}`,style:{textDecoration:"none"},children:e.jsxs("div",{style:{borderRadius:"12px",overflow:"hidden",cursor:"pointer",transition:"transform 0.2s",position:"relative"},onMouseEnter:t=>{t.currentTarget.style.transform="scale(1.02)"},onMouseLeave:t=>{t.currentTarget.style.transform="scale(1)"},children:[e.jsxs("div",{style:{position:"relative",paddingBottom:"66.67%",backgroundColor:"#f0f0f0"},children:[e.jsx("img",{src:F,alt:r.title,style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}),e.jsx("button",{onClick:I,style:{position:"absolute",top:"12px",right:"12px",background:"rgba(0, 0, 0, 0.5)",border:"none",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s"},children:e.jsx("svg",{viewBox:"0 0 24 24",style:{width:"20px",height:"20px",fill:v?"#FF385C":"none",stroke:v?"#FF385C":"white",strokeWidth:2},children:e.jsx("path",{d:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"})})}),i.length>1&&e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:A,style:{position:"absolute",left:"8px",top:"50%",transform:"translateY(-50%)",background:"rgba(255, 255, 255, 0.9)",border:"none",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",opacity:0,transition:"opacity 0.2s"},onMouseEnter:t=>t.target.style.opacity=1,onMouseLeave:t=>t.target.style.opacity=0,children:"‹"}),e.jsx("button",{onClick:N,style:{position:"absolute",right:"8px",top:"50%",transform:"translateY(-50%)",background:"rgba(255, 255, 255, 0.9)",border:"none",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",opacity:0,transition:"opacity 0.2s"},onMouseEnter:t=>t.target.style.opacity=1,onMouseLeave:t=>t.target.style.opacity=0,children:"›"})]}),i.length>1&&e.jsx("div",{style:{position:"absolute",bottom:"8px",left:"50%",transform:"translateX(-50%)",display:"flex",gap:"4px"},children:i.map((t,s)=>e.jsx("div",{style:{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:s===P?"white":"rgba(255, 255, 255, 0.5)",transition:"background-color 0.2s"}},s))}),e.jsxs("div",{style:{position:"absolute",top:"12px",left:"12px",display:"flex",gap:"8px"},children:[r.instantBook&&e.jsx("span",{style:{backgroundColor:"white",padding:"4px 8px",borderRadius:"4px",fontSize:"12px",fontWeight:"600"},children:"⚡ Instant Book"}),r.host?.verified&&e.jsx("span",{style:{backgroundColor:"white",padding:"4px 8px",borderRadius:"4px",fontSize:"12px",fontWeight:"600"},children:"✓ Verified"})]})]}),e.jsxs("div",{style:{padding:"12px 0"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx("h3",{style:{fontSize:"16px",fontWeight:"600",color:"#222",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:r.title}),e.jsx("p",{style:{fontSize:"14px",color:"#717171",margin:"4px 0"},children:r.location}),e.jsxs("p",{style:{fontSize:"14px",color:"#717171",margin:"4px 0"},children:[r.bedrooms?`${r.bedrooms} bedroom${r.bedrooms>1?"s":""}`:"Studio"," ·"," ",r.bathrooms," bath ·"," ",r.guests," guest",r.guests>1?"s":""]})]}),r.rating&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px"},children:[e.jsx("span",{children:"⭐"}),e.jsx("span",{style:{fontSize:"14px",fontWeight:"500"},children:r.rating}),r.reviews>0&&e.jsxs("span",{style:{fontSize:"14px",color:"#717171"},children:["(",r.reviews,")"]})]})]}),e.jsxs("div",{style:{marginTop:"8px",fontSize:"16px"},children:[e.jsxs("span",{style:{fontWeight:"600"},children:["QAR ",r.price]}),e.jsx("span",{style:{color:"#717171",fontSize:"14px"},children:" / month"})]})]})]})})}o.__docgenInfo={description:"",methods:[],displayName:"PropertyCard"};const D={title:"Property Components/PropertyCard",component:o,parameters:{layout:"padded",docs:{description:{component:"A property card component that displays property information including images, price, location, and amenities. Features image carousel and favorite toggle functionality."}}},tags:["autodocs"],argTypes:{property:{description:"Property object containing all property information",control:{type:"object"}}},decorators:[r=>e.jsx("div",{style:{maxWidth:"400px"},children:e.jsx(r,{})})]},a={id:"1",title:"Luxury Apartment in West Bay",location:"West Bay, Doha, Qatar",price:150,rating:4.8,reviewCount:24,images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"],bedrooms:2,bathrooms:2,guests:4,amenities:["WiFi","Kitchen","Air Conditioning","Parking"],type:"apartment",isAvailable:!0},f={id:"2",title:"Modern Villa with Sea View",location:"The Pearl, Doha, Qatar",price:350,rating:4.9,reviewCount:18,images:["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=300&fit=crop","https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=400&h=300&fit=crop"],bedrooms:4,bathrooms:3,guests:8,amenities:["Private Pool","Sea View","WiFi","Kitchen","Parking"],type:"villa",isAvailable:!0},j={id:"3",title:"Cozy Studio Near Souq Waqif",location:"Downtown Doha, Qatar",price:85,rating:4.5,reviewCount:42,images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"],bedrooms:0,bathrooms:1,guests:2,amenities:["WiFi","Kitchen","Air Conditioning"],type:"studio",isAvailable:!0},C={...a,id:"4",title:"Unavailable Property",isAvailable:!1,images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"]},n={args:{property:a}},p={args:{property:f}},l={args:{property:j}},c={args:{property:{...a,images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"]}}},d={args:{property:{...a,images:[]}}},m={args:{property:{...a,rating:5,reviewCount:125,title:"Premium Penthouse Suite"}}},g={args:{property:{...a,rating:3.2,reviewCount:8,title:"Budget-Friendly Apartment",price:45}}},h={args:{property:{...f,price:800,title:"Ultra-Luxury Mansion",bedrooms:6,bathrooms:5,guests:12,amenities:["Private Pool","Private Beach","Butler Service","Chef","Spa","Gym"]}}},u={args:{property:C}},y={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsx(o,{property:a}),e.jsx(o,{property:f}),e.jsx(o,{property:j}),e.jsx(o,{property:{...a,id:"5",title:"Family Townhouse",location:"Al Rayyan, Qatar",price:220,bedrooms:3,bathrooms:2,guests:6,type:"townhouse"}})]}),parameters:{docs:{description:{story:"Example of multiple property cards in a grid layout as they would appear in search results."}}}},x={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Luxury Villa"}),e.jsx(o,{property:f})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Modern Apartment"}),e.jsx(o,{property:a})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Cozy Studio"}),e.jsx(o,{property:j})]})]}),parameters:{docs:{description:{story:"Different property types showcased with the PropertyCard component."}}}},b={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Available Property"}),e.jsx(o,{property:a})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Unavailable Property"}),e.jsx(o,{property:C})]})]}),parameters:{docs:{description:{story:"Property cards showing different availability states."}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    property: mockProperty
  }
}`,...n.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    property: mockVilla
  }
}`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    property: mockStudio
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    property: {
      ...mockProperty,
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop']
    }
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    property: {
      ...mockProperty,
      images: []
    }
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    property: {
      ...mockProperty,
      rating: 5.0,
      reviewCount: 125,
      title: 'Premium Penthouse Suite'
    }
  }
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    property: {
      ...mockProperty,
      rating: 3.2,
      reviewCount: 8,
      title: 'Budget-Friendly Apartment',
      price: 45
    }
  }
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    property: {
      ...mockVilla,
      price: 800,
      title: 'Ultra-Luxury Mansion',
      bedrooms: 6,
      bathrooms: 5,
      guests: 12,
      amenities: ['Private Pool', 'Private Beach', 'Butler Service', 'Chef', 'Spa', 'Gym']
    }
  }
}`,...h.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    property: unavailableProperty
  }
}`,...u.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PropertyCard property={mockProperty} />
      <PropertyCard property={mockVilla} />
      <PropertyCard property={mockStudio} />
      <PropertyCard property={{
      ...mockProperty,
      id: '5',
      title: 'Family Townhouse',
      location: 'Al Rayyan, Qatar',
      price: 220,
      bedrooms: 3,
      bathrooms: 2,
      guests: 6,
      type: 'townhouse'
    }} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple property cards in a grid layout as they would appear in search results.'
      }
    }
  }
}`,...y.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Luxury Villa</h3>
        <PropertyCard property={mockVilla} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Modern Apartment</h3>
        <PropertyCard property={mockProperty} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Cozy Studio</h3>
        <PropertyCard property={mockStudio} />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Different property types showcased with the PropertyCard component.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Property</h3>
        <PropertyCard property={mockProperty} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Unavailable Property</h3>
        <PropertyCard property={unavailableProperty} />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Property cards showing different availability states.'
      }
    }
  }
}`,...b.parameters?.docs?.source}}};const M=["Default","LuxuryVilla","Studio","SingleImage","NoImage","HighRating","LowRating","ExpensiveProperty","Unavailable","PropertyGrid","PropertyTypes","InteractiveStates"];export{n as Default,h as ExpensiveProperty,m as HighRating,b as InteractiveStates,g as LowRating,p as LuxuryVilla,d as NoImage,y as PropertyGrid,x as PropertyTypes,c as SingleImage,l as Studio,u as Unavailable,M as __namedExportsOrder,D as default};
