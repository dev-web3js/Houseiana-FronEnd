import{j as e}from"./jsx-runtime-Dmcnsbp0.js";import{_ as U}from"./style-CUi_vSyB.js";import{r as l,u as C}from"./iframe-BYf7DOGw.js";import{L as O}from"./link-DafOocEU.js";import"./preload-helper-D9Z9MdNV.js";import"./use-merged-ref-DPie8Noq.js";const q="http://localhost:5000";class T{constructor(){this.baseURL=q}getAuthToken(){return null}async apiRequest(s,r={}){const S=this.getAuthToken(),P=`${this.baseURL}${s}`,h={method:"GET",headers:{"Content-Type":"application/json",...S&&{Authorization:`Bearer ${S}`},...r.headers},...r};try{const n=await fetch(P,h);if(!n.ok){const N=await n.json().catch(()=>null);throw new Error(N?.message||`HTTP ${n.status}: ${n.statusText}`)}return await n.json()}catch(n){throw console.error(`API request failed for ${s}:`,n),n}}async login(s){return this.apiRequest("/auth/login",{method:"POST",body:JSON.stringify(s)})}async register(s){return this.apiRequest("/auth/register",{method:"POST",body:JSON.stringify(s)})}async logout(){return this.apiRequest("/auth/logout",{method:"POST"})}async getProfile(){return this.apiRequest("/user/profile")}async updateProfile(s){return this.apiRequest("/user/profile",{method:"PUT",body:JSON.stringify(s)})}async becomeHost(s){return this.apiRequest("/user/become-host",{method:"POST",body:JSON.stringify(s)})}async getProperties(s={}){const r=new URLSearchParams(s);return this.apiRequest(`/properties${r.toString()?"?"+r.toString():""}`)}async getProperty(s){return this.apiRequest(`/properties/${s}`)}async createProperty(s){return this.apiRequest("/properties",{method:"POST",body:JSON.stringify(s)})}async updateProperty(s,r){return this.apiRequest(`/properties/${s}`,{method:"PUT",body:JSON.stringify(r)})}async deleteProperty(s){return this.apiRequest(`/properties/${s}`,{method:"DELETE"})}async getHostProperties(){return this.apiRequest("/properties/host")}async toggleFavorite(s){return this.apiRequest(`/properties/${s}/favorite`,{method:"POST"})}async searchProperties(s){const r=new URLSearchParams(s);return this.apiRequest(`/properties/search?${r.toString()}`)}async createBooking(s){return this.apiRequest("/bookings",{method:"POST",body:JSON.stringify(s)})}async getBookings(){return this.apiRequest("/bookings")}async getBooking(s){return this.apiRequest(`/bookings/${s}`)}async updateBookingStatus(s,r){return this.apiRequest(`/bookings/${s}/status`,{method:"PUT",body:JSON.stringify({status:r})})}async cancelBooking(s){return this.apiRequest(`/bookings/${s}/cancel`,{method:"POST"})}async getHostBookings(){return this.apiRequest("/bookings/host")}async submitKYC(s){return this.apiRequest("/kyc/submit",{method:"POST",body:JSON.stringify(s)})}async getKYCStatus(){return this.apiRequest("/kyc/status")}async verifyKYC(s){return this.apiRequest("/kyc/verify",{method:"POST",body:JSON.stringify(s)})}async sendVerificationEmail(s){return this.apiRequest("/email-verification/send",{method:"POST",body:JSON.stringify({email:s})})}async verifyEmail(s){return this.apiRequest("/email-verification/verify",{method:"POST",body:JSON.stringify({token:s})})}async sendPhoneVerification(s){return this.apiRequest("/phone-verification/send",{method:"POST",body:JSON.stringify({phoneNumber:s})})}async verifyPhone(s,r){return this.apiRequest("/phone-verification/verify",{method:"POST",body:JSON.stringify({phoneNumber:s,code:r})})}async getMessages(s=null){const r=s?`/messages/${s}`:"/messages";return this.apiRequest(r)}async sendMessage(s){return this.apiRequest("/messages",{method:"POST",body:JSON.stringify(s)})}async getNotifications(){return this.apiRequest("/notifications")}async markNotificationRead(s){return this.apiRequest(`/notifications/${s}/read`,{method:"PUT"})}async inviteCoHost(s){return this.apiRequest("/co-host/invite",{method:"POST",body:JSON.stringify(s)})}async acceptCoHostInvitation(s){return this.apiRequest("/co-host/accept",{method:"POST",body:JSON.stringify({token:s})})}async getCoHosts(){return this.apiRequest("/co-host")}async processPayment(s){return this.apiRequest("/payments/process",{method:"POST",body:JSON.stringify(s)})}async getPaymentMethods(){return this.apiRequest("/payments/methods")}async addPaymentMethod(s){return this.apiRequest("/payments/methods",{method:"POST",body:JSON.stringify(s)})}async getPropertyReviews(s){return this.apiRequest(`/reviews/property/${s}`)}async submitReview(s){return this.apiRequest("/reviews",{method:"POST",body:JSON.stringify(s)})}async healthCheck(){return this.apiRequest("/health")}}const H=new T,{login:z,register:_,logout:G,getProfile:Y,updateProfile:K,becomeHost:V,getProperties:Z,getProperty:X,createProperty:Q,updateProperty:ee,deleteProperty:se,getHostProperties:te,toggleFavorite:re,searchProperties:oe,createBooking:ae,getBookings:ie,getBooking:ne,updateBookingStatus:ce,cancelBooking:de,getHostBookings:le,submitKYC:he,getKYCStatus:ue,verifyKYC:pe,sendVerificationEmail:me,verifyEmail:ge,sendPhoneVerification:xe,verifyPhone:fe,getMessages:be,sendMessage:ye,getNotifications:ve,markNotificationRead:je,inviteCoHost:ke,acceptCoHostInvitation:Se,getCoHosts:Pe,processPayment:Ne,getPaymentMethods:Re,addPaymentMethod:we,getPropertyReviews:Ae,submitReview:Me,healthCheck:Ue}=H,L=l.createContext({}),E=()=>{const t=l.useContext(L);if(!t)throw new Error("useAuth must be used within AuthProvider");return t};function d({user:t}){const[s,r]=l.useState(!1),[S,P]=l.useState(!1),h=l.useRef(null);C();const{logout:n}=E();l.useEffect(()=>{const o=u=>{h.current&&!h.current.contains(u.target)&&(r(!1),P(!1))};return document.addEventListener("mousedown",o),()=>document.removeEventListener("mousedown",o)},[]);const N=()=>{n(),r(!1)},R=[{section:"main",items:[{label:"Wishlists",href:"/wishlists",icon:"❤️",description:"Save your favorite properties"},{label:"Trips",href:"/trips",icon:"✈️",description:"Upcoming and past bookings"},{label:"Messages",href:"/messages",icon:"💬",badge:3,description:"Chat with hosts"}]},{section:"account",title:"Account",items:[{label:"Profile",href:"/profile",icon:"👤",description:"View and edit profile"},{label:"Account settings",href:"/account-settings",icon:"⚙️",description:"Manage your account"},{label:"Languages & currency",href:"/preferences",icon:"🌐",description:"Choose your preferences"}]},{section:"hosting",title:"Hosting",items:[{label:"Become a host",href:"/become-a-host",icon:"🏠",highlight:!0,description:"Start earning today"},{label:"Host dashboard",href:"/dashboard",icon:"📊",description:"Manage your listings",requiresHost:!0},{label:"Find a co-host",href:"/find-cohost",icon:"🤝",description:"Get help managing"},{label:"Refer a Host",href:"/refer-host",icon:"🎁",description:"Earn rewards"}]},{section:"support",title:"Support & More",items:[{label:"Help Center",href:"/help",icon:"❓",description:"Get assistance"},{label:"Gift cards",href:"/gift-cards",icon:"🎴",description:"Buy or redeem"}]}];return e.jsxs("div",{ref:h,style:{position:"relative"},className:"jsx-8ab98315ba029cdc",children:[e.jsxs("button",{onClick:()=>r(!s),style:{display:"flex",alignItems:"center",gap:"8px",padding:"8px",backgroundColor:"white",border:"1px solid #e0e0e0",borderRadius:"40px",cursor:"pointer",transition:"all 0.2s",minWidth:"77px"},onMouseEnter:o=>{o.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.15)"},onMouseLeave:o=>{o.currentTarget.style.boxShadow="none"},className:"jsx-8ab98315ba029cdc",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"3px",marginLeft:"8px"},className:"jsx-8ab98315ba029cdc",children:[e.jsx("span",{style:{width:"16px",height:"2px",backgroundColor:"#222",borderRadius:"1px"},className:"jsx-8ab98315ba029cdc"}),e.jsx("span",{style:{width:"16px",height:"2px",backgroundColor:"#222",borderRadius:"1px"},className:"jsx-8ab98315ba029cdc"}),e.jsx("span",{style:{width:"16px",height:"2px",backgroundColor:"#222",borderRadius:"1px"},className:"jsx-8ab98315ba029cdc"})]}),e.jsx("div",{style:{width:"32px",height:"32px",borderRadius:"50%",backgroundColor:t?.profileImage?"transparent":"#717171",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"14px",fontWeight:"600",overflow:"hidden",marginRight:"4px"},className:"jsx-8ab98315ba029cdc",children:t?.profileImage?e.jsx("img",{src:t.profileImage,alt:t.name||"User",style:{width:"100%",height:"100%",objectFit:"cover"},className:"jsx-8ab98315ba029cdc"}):e.jsx("span",{className:"jsx-8ab98315ba029cdc",children:t?.name?.[0]?.toUpperCase()||"U"})}),R.some(o=>o.items.some(u=>u.badge>0))&&e.jsx("div",{style:{position:"absolute",top:"6px",right:"6px",width:"8px",height:"8px",backgroundColor:"#FF385C",borderRadius:"50%",border:"2px solid white"},className:"jsx-8ab98315ba029cdc"})]}),s&&e.jsxs("div",{style:{position:"absolute",top:"52px",right:0,width:"280px",backgroundColor:"white",border:"1px solid #e0e0e0",borderRadius:"12px",boxShadow:"0 4px 20px rgba(0,0,0,0.15)",zIndex:1e3,overflow:"hidden",animation:"slideDown 0.2s ease-out"},className:"jsx-8ab98315ba029cdc",children:[t&&e.jsxs("div",{style:{padding:"16px",borderBottom:"1px solid #e0e0e0",backgroundColor:"#f7f7f7"},className:"jsx-8ab98315ba029cdc",children:[e.jsx("div",{style:{fontSize:"16px",fontWeight:"600",marginBottom:"4px"},className:"jsx-8ab98315ba029cdc",children:t.name||"Guest User"}),e.jsx("div",{style:{fontSize:"14px",color:"#717171"},className:"jsx-8ab98315ba029cdc",children:t.email})]}),e.jsxs("div",{style:{maxHeight:"600px",overflowY:"auto"},className:"jsx-8ab98315ba029cdc",children:[R.map((o,u)=>e.jsxs("div",{className:"jsx-8ab98315ba029cdc",children:[o.title&&e.jsx("div",{style:{padding:"12px 16px 8px",fontSize:"12px",color:"#717171",fontWeight:"600",textTransform:"uppercase",letterSpacing:"0.5px"},className:"jsx-8ab98315ba029cdc",children:o.title}),o.items.map((a,J)=>a.requiresHost&&!t?.isHost?null:e.jsxs(O,{href:a.href,onClick:()=>r(!1),style:{display:"flex",alignItems:"center",padding:"12px 16px",textDecoration:"none",color:"#222",transition:"background 0.2s",cursor:"pointer",backgroundColor:a.highlight?"#fff8f1":"transparent"},onMouseEnter:w=>{w.currentTarget.style.backgroundColor=a.highlight?"#ffede1":"#f7f7f7"},onMouseLeave:w=>{w.currentTarget.style.backgroundColor=a.highlight?"#fff8f1":"transparent"},children:[e.jsx("span",{style:{fontSize:"20px",marginRight:"12px",width:"24px",textAlign:"center"},className:"jsx-8ab98315ba029cdc",children:a.icon}),e.jsxs("div",{style:{flex:1},className:"jsx-8ab98315ba029cdc",children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:a.highlight?"600":"400",color:a.highlight?"#FF385C":"#222",marginBottom:a.description?"2px":0},className:"jsx-8ab98315ba029cdc",children:a.label}),a.description&&e.jsx("div",{style:{fontSize:"12px",color:"#717171"},className:"jsx-8ab98315ba029cdc",children:a.description})]}),a.badge&&e.jsx("div",{style:{backgroundColor:"#FF385C",color:"white",borderRadius:"10px",padding:"2px 8px",fontSize:"12px",fontWeight:"600",minWidth:"20px",textAlign:"center"},className:"jsx-8ab98315ba029cdc",children:a.badge})]},a.href)),u<R.length-1&&e.jsx("div",{style:{height:"1px",backgroundColor:"#e0e0e0",margin:"8px 0"},className:"jsx-8ab98315ba029cdc"})]},o.section)),e.jsx("div",{style:{borderTop:"1px solid #e0e0e0",padding:"8px 0"},className:"jsx-8ab98315ba029cdc",children:e.jsxs("button",{onClick:N,style:{display:"flex",alignItems:"center",width:"100%",padding:"12px 16px",backgroundColor:"transparent",border:"none",textAlign:"left",cursor:"pointer",transition:"background 0.2s",color:"#222"},onMouseEnter:o=>{o.currentTarget.style.backgroundColor="#f7f7f7"},onMouseLeave:o=>{o.currentTarget.style.backgroundColor="transparent"},className:"jsx-8ab98315ba029cdc",children:[e.jsx("span",{style:{fontSize:"20px",marginRight:"12px",width:"24px",textAlign:"center"},className:"jsx-8ab98315ba029cdc",children:"🚪"}),e.jsx("span",{style:{fontSize:"14px",fontWeight:"500"},className:"jsx-8ab98315ba029cdc",children:"Log out"})]})})]})]}),e.jsx(U,{id:"8ab98315ba029cdc",children:"@keyframes slideDown{from{opacity:0;transform:translatey(-10px)}to{opacity:1;transform:translatey(0)}}"})]})}d.__docgenInfo={description:"",methods:[],displayName:"UserNavbar"};const Ce={title:"Navigation Components/UserNavbar",component:d,parameters:{layout:"fullscreen",docs:{description:{component:"The main navigation bar for authenticated users. Features user menu, notifications, messaging, and host mode toggle. Responsive design with mobile hamburger menu."}}},tags:["autodocs"]},c={id:"1",name:"Ahmed Al-Rashid",firstName:"Ahmed",lastName:"Al-Rashid",email:"ahmed@example.com",avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",role:"user",isHost:!1,verified:!0},A={...c,id:"2",name:"Fatima Al-Zahra",firstName:"Fatima",lastName:"Al-Zahra",email:"fatima@example.com",avatar:"https://images.unsplash.com/photo-1494790108755-2616b332365d?w=100&h=100&fit=crop&crop=face",role:"host",isHost:!0},M={...c,id:"3",name:"Omar Hassan",firstName:"Omar",lastName:"Hassan",email:"omar@example.com",avatar:null,verified:!1},i=({children:t,user:s=null})=>{const r={user:s,login:()=>Promise.resolve(!0),logout:()=>{},isAuthenticated:()=>!!s,loading:!1};return e.jsx("div",{"data-mock-auth":JSON.stringify(r),children:t})},p={decorators:[t=>e.jsx(i,{user:null,children:e.jsx(t,{})})]},m={decorators:[t=>e.jsx(i,{user:c,children:e.jsx(t,{})})]},g={decorators:[t=>e.jsx(i,{user:A,children:e.jsx(t,{})})]},x={decorators:[t=>e.jsx(i,{user:M,children:e.jsx(t,{})})]},f={decorators:[t=>e.jsx(i,{user:{...c,avatar:null},children:e.jsx(t,{})})]},b={decorators:[t=>e.jsx(i,{user:c,children:e.jsx("div",{style:{minWidth:"1024px"},children:e.jsx(t,{})})})],parameters:{docs:{description:{story:"Desktop view of the navigation bar with full menu options visible."}}}},y={decorators:[t=>e.jsx(i,{user:c,children:e.jsx("div",{style:{width:"768px"},children:e.jsx(t,{})})})],parameters:{docs:{description:{story:"Tablet view showing responsive navigation layout."}}}},v={decorators:[t=>e.jsx(i,{user:c,children:e.jsx("div",{style:{width:"375px"},children:e.jsx(t,{})})})],parameters:{docs:{description:{story:"Mobile view with hamburger menu and collapsed navigation."}}}},j={render:()=>e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Guest (Not Logged In)"}),e.jsx(i,{user:null,children:e.jsx(d,{})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Regular User"}),e.jsx(i,{user:c,children:e.jsx(d,{})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Host User"}),e.jsx(i,{user:A,children:e.jsx(d,{})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Unverified User"}),e.jsx(i,{user:M,children:e.jsx(d,{})})]})]}),parameters:{docs:{description:{story:"Comparison of navigation bar for different user states and authentication levels."}}}},k={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"User with Notifications"}),e.jsx(i,{user:{...c,notifications:3,messages:2},children:e.jsx(d,{})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Host Mode Active"}),e.jsx(i,{user:{...A,hostMode:!0},children:e.jsx(d,{})})]})]}),parameters:{docs:{description:{story:"Navigation bar showing interactive features like notifications, messages, and host mode."}}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockAuthProvider user={null}>
        <Story />
      </MockAuthProvider>]
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockAuthProvider user={mockUser}>
        <Story />
      </MockAuthProvider>]
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockAuthProvider user={mockHost}>
        <Story />
      </MockAuthProvider>]
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockAuthProvider user={unverifiedUser}>
        <Story />
      </MockAuthProvider>]
}`,...x.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockAuthProvider user={{
    ...mockUser,
    avatar: null
  }}>
        <Story />
      </MockAuthProvider>]
}`,...f.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockAuthProvider user={mockUser}>
        <div style={{
      minWidth: '1024px'
    }}>
          <Story />
        </div>
      </MockAuthProvider>],
  parameters: {
    docs: {
      description: {
        story: 'Desktop view of the navigation bar with full menu options visible.'
      }
    }
  }
}`,...b.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockAuthProvider user={mockUser}>
        <div style={{
      width: '768px'
    }}>
          <Story />
        </div>
      </MockAuthProvider>],
  parameters: {
    docs: {
      description: {
        story: 'Tablet view showing responsive navigation layout.'
      }
    }
  }
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <MockAuthProvider user={mockUser}>
        <div style={{
      width: '375px'
    }}>
          <Story />
        </div>
      </MockAuthProvider>],
  parameters: {
    docs: {
      description: {
        story: 'Mobile view with hamburger menu and collapsed navigation.'
      }
    }
  }
}`,...v.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Guest (Not Logged In)</h3>
        <MockAuthProvider user={null}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Regular User</h3>
        <MockAuthProvider user={mockUser}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Host User</h3>
        <MockAuthProvider user={mockHost}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Unverified User</h3>
        <MockAuthProvider user={unverifiedUser}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Comparison of navigation bar for different user states and authentication levels.'
      }
    }
  }
}`,...j.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">User with Notifications</h3>
        <MockAuthProvider user={{
        ...mockUser,
        notifications: 3,
        messages: 2
      }}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Host Mode Active</h3>
        <MockAuthProvider user={{
        ...mockHost,
        hostMode: true
      }}>
          <UserNavbar />
        </MockAuthProvider>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Navigation bar showing interactive features like notifications, messages, and host mode.'
      }
    }
  }
}`,...k.parameters?.docs?.source}}};const Oe=["LoggedOutUser","LoggedInUser","HostUser","UnverifiedUser","UserWithoutAvatar","Desktop","Tablet","Mobile","NavigationStates","InteractiveFeatures"];export{b as Desktop,g as HostUser,k as InteractiveFeatures,m as LoggedInUser,p as LoggedOutUser,v as Mobile,j as NavigationStates,y as Tablet,x as UnverifiedUser,f as UserWithoutAvatar,Oe as __namedExportsOrder,Ce as default};
