import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Map, 
  Thermometer, 
  Wind, 
  CloudRain, 
  Clock, 
  ChevronLeft, 
  Search, 
  Menu, 
  X, 
  Database, 
  ExternalLink,
  Download,
  Terminal,
  Activity,
  Layers,
  Satellite
} from 'lucide-react';

// --- MOCK DATA (模拟数据库) ---
const MOCK_IMAGES = [
  {
    id: 'img-001',
    title: '西北太平洋表层海温 (SST) 异常监测',
    type: 'SST',
    date: '2023-10-25',
    instrument: 'AVHRR / AMSR2',
    resolution: '0.25° x 0.25°',
    region: 'NW Pacific (10°N-50°N, 110°E-160°E)',
    description: '基于 OISST v2.1 数据的每日表层海温异常分析。图中显示黑潮延伸体区域存在显著的正异常，而赤道中东太平洋呈现典型的厄尔尼诺特征。持续监测该区域热力状态对后续台风生成潜力至关重要。',
    imageUrl: 'https://images.unsplash.com/photo-1582653291997-059f3f47993e?auto=format&fit=crop&q=80&w=1600',
    tags: ['SST', 'Anomaly', 'Kuroshio']
  },
  {
    id: 'img-002',
    title: '超强台风“布拉万”巅峰期红外云图',
    type: 'Weather',
    date: '2023-10-11',
    instrument: 'Himawari-9 AHI',
    resolution: '2 km',
    region: 'Mariana Islands, NW Pacific',
    description: 'Himawari-9 卫星的红外增强云图（Band 13）展示了超强台风“布拉万”在关岛附近海域达到巅峰强度时的形态。清晰的风眼和对称的核心对流区清晰可见，云顶温度低至 -80°C。',
    imageUrl: 'https://images.unsplash.com/photo-1464802686167-b93149ec13e5?auto=format&fit=crop&q=80&w=1600',
    tags: ['Typhoon', 'Satellite', 'Infrared']
  },
  {
    id: 'img-003',
    title: '500hPa 位势高度与 850hPa 风场每日演变',
    type: 'Atmosphere',
    date: '2023-10-24',
    instrument: 'NCEP GFS',
    resolution: '0.25° x 0.25°',
    region: 'East Asia & NW Pacific',
    description: 'GFS 模式初始场日常分析。西风带短波槽东移，副热带高压脊线维持在 20°N 附近，低层季风槽内有多个热带扰动活动。此图表每日更新以追踪大尺度环流演变。',
    imageUrl: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=1600',
    tags: ['Geopotential', 'Wind', 'GFS']
  },
  {
    id: 'img-004',
    title: '西北太平洋热带气旋路径密度历史归档',
    type: 'Archive',
    date: '2022-12-31',
    instrument: 'JTWC / JMA Best Track',
    resolution: 'Basin-wide',
    region: 'NW Pacific Basin',
    description: '年度归档资料：2022年度西北太平洋所有编号热带气旋的路径汇总与密度热力图。反映了该年度台风活动的整体空间分布特征及主要转向路径，为长序列气候态研究提供基础。',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600',
    tags: ['Climatology', 'Typhoon', 'Annual']
  },
  {
    id: 'img-005',
    title: '海表温度梯度与锋面系统叠加图',
    type: 'SST',
    date: '2023-10-20',
    instrument: 'OISST + ERA5',
    resolution: '0.25° x 0.25°',
    region: 'Sea of Japan & Kuroshio',
    description: '高分辨率 SST 梯度计算，叠加 ECMWF 海平面气压场，揭示了海洋锋面对大气边界层和温带气旋发展的潜在调制作用。',
    imageUrl: 'https://images.unsplash.com/photo-1614605175955-442e3fb1f736?auto=format&fit=crop&q=80&w=1600',
    tags: ['Front', 'SST Gradient', 'Interaction']
  },
  {
    id: 'img-006',
    title: '850hPa 相对涡度与水汽通量散度',
    type: 'Atmosphere',
    date: '2023-10-18',
    instrument: 'ECMWF HRES',
    resolution: '0.1° x 0.1°',
    region: 'South China Sea',
    description: '日常强对流环境监测：分析热带扰动生成区域的低层动力与热力条件。强烈的辐合带配合高涡度区域，指示了对流系统的进一步发展可能。',
    imageUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&q=80&w=1600',
    tags: ['Vorticity', 'Moisture', 'Convection']
  }
];

const CATEGORIES = [
  { id: 'SST', name: 'OCEAN: SST', icon: Thermometer, desc: 'Sea Surface Temp & Anomalies' },
  { id: 'Weather', name: 'OBS: SATELLITE', icon: Satellite, desc: 'Himawari-9 Imagery & Radar' },
  { id: 'Atmosphere', name: 'ATMOS: DYNAMICS', icon: Wind, desc: 'Geopotential, Wind & Vorticity' },
  { id: 'Archive', name: 'CLIMATE ARCHIVE', icon: Database, desc: 'Historical Records & Climatology' },
];

// --- UTILITY COMPONENTS ---
// 模拟光学仪器/地图边缘的十字定位标
const Crosshair = ({ className }) => (
  <div className={`absolute w-3 h-3 pointer-events-none opacity-50 ${className}`}>
    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/50"></div>
    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-500/50"></div>
  </div>
);

// --- CORE COMPONENTS ---

// 1. Navigation Bar
const Navbar = ({ currentRoute, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'MISSION DASHBOARD' },
    { id: 'gallery', label: 'DATA CENTER' },
    { id: 'about', label: 'ABOUT PROTOCOL' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group"
            onClick={() => navigate('home')}
          >
            <div className="w-6 h-6 border-2 border-cyan-500 rounded-sm flex items-center justify-center mr-3 relative shadow-[0_0_10px_rgba(34,211,238,0.2)]">
               <div className="w-1.5 h-1.5 bg-cyan-400 rounded-sm animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-100 font-bold text-sm tracking-widest leading-none shadow-cyan-500/50">NWP-ARCHIVE</span>
              <span className="text-cyan-600/80 text-[0.6rem] tracking-widest mt-1">OCEAN-ATMOSPHERE</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-baseline space-x-2 border border-slate-800/50 rounded-full px-4 py-1 bg-slate-900/30">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`px-3 py-1.5 text-[10px] tracking-widest transition-all rounded-full ${
                    currentRoute === item.id 
                      ? 'text-cyan-400 bg-cyan-950/40 shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Webmaster Tag (站长小脐橙) */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center border border-orange-500/30 bg-orange-950/20 px-3 py-1 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
              <span className="text-xs text-orange-400/90 tracking-widest uppercase">站长小脐橙</span>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { navigate(item.id); setIsOpen(false); }}
                className={`block w-full text-left px-3 py-3 text-xs tracking-widest ${
                  currentRoute === item.id 
                    ? 'bg-slate-900 text-cyan-400' 
                    : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="px-3 py-3 border-t border-slate-900 mt-2">
              <span className="text-xs text-orange-400/90 tracking-widest uppercase flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>
                站长小脐橙
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// 2. Footer
const Footer = () => (
  <footer className="bg-slate-950 border-t border-slate-900/50 py-6 text-slate-500 text-xs font-mono mt-auto relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900 to-transparent"></div>
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
      <div className="flex items-center">
        <Terminal className="w-4 h-4 mr-2 text-slate-600" />
        <span>SYS_DIR: /ROOT/NWP_ARCHIVE/PUBLIC</span>
      </div>
      <div className="flex space-x-6 tracking-widest">
        <span>10°N-50°N / 110°E-160°E</span>
        <span className="text-slate-800">|</span>
        <span>© {new Date().getFullYear()} ARCHIVE_MAINTAINER</span>
      </div>
    </div>
  </footer>
);

// 3. Page: Home
const Home = ({ navigate, navigateToImage }) => {
  return (
    <div className="w-full bg-slate-950 min-h-screen">
      {/* Hero Section (Observation Mission Portal) */}
      <div className="relative pt-28 pb-20 border-b border-slate-900/50 overflow-hidden">
        {/* Subtle Lat/Lon Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', 
               backgroundSize: '60px 60px',
               backgroundPosition: 'center center'
             }}>
        </div>
        {/* Deep Ocean Glow Mask */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,#082f49,transparent_70%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <div className="flex items-center mb-6 space-x-3">
                <span className="inline-flex items-center px-2.5 py-1 border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-[10px] font-mono tracking-widest rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                  <Activity className="w-3 h-3 mr-1.5 animate-pulse" />
                  SYSTEM ACTIVE
                </span>
                <span className="text-slate-500 font-mono text-[10px] tracking-widest uppercase">
                  Continuous Monitoring Protocol
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 tracking-tight mb-4 font-sans drop-shadow-lg">
                Northwest Pacific<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-slate-400">
                  Environment Archive
                </span>
              </h1>
              
              <div className="max-w-2xl text-slate-400 text-sm leading-relaxed border-l-2 border-cyan-800/50 pl-4 bg-slate-900/20 py-2">
                西北太平洋大气与海洋环境高分辨率影像档案馆。<br/>
                A personal professional repository dedicated to the continuous monitoring, daily updates, and historical records of atmosphere-ocean interactions.
              </div>
            </div>

            {/* Mission Stats Board */}
            <div className="flex md:flex-col gap-4 md:gap-2 font-mono text-xs">
              <div className="bg-slate-900/50 border border-slate-800 px-4 py-3 backdrop-blur-sm">
                <div className="text-slate-500 text-[9px] uppercase tracking-widest mb-1">Days Monitored</div>
                <div className="text-xl text-slate-200">1,240<span className="text-cyan-500 text-xs ml-1">+</span></div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 px-4 py-3 backdrop-blur-sm">
                <div className="text-slate-500 text-[9px] uppercase tracking-widest mb-1">Visual Assets</div>
                <div className="text-xl text-slate-200">842</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 font-mono text-xs mt-8">
            <button 
              onClick={() => navigate('gallery')}
              className="px-6 py-3 bg-cyan-950/40 border border-cyan-500/50 text-cyan-100 hover:bg-cyan-900/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all uppercase tracking-widest backdrop-blur-sm"
            >
              Access Data Center
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section (Scientific Product Lines) */}
      <div className="py-12 border-b border-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6 font-mono text-[10px] text-cyan-600/80 tracking-widest uppercase">
            <Layers className="w-4 h-4 mr-2" />
            Scientific Product Catalog
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={cat.id} 
                  onClick={() => navigate('gallery', { filter: cat.id })}
                  className="relative p-5 bg-slate-900/30 border border-slate-800/60 backdrop-blur-sm hover:border-cyan-700/50 cursor-pointer transition-all duration-300 group hover:bg-slate-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]"
                >
                  <div className="flex justify-between items-start mb-5">
                    <Icon className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-[9px] font-mono text-slate-600 bg-slate-950 px-1.5 border border-slate-800">DIR/{cat.id.toUpperCase()}</span>
                  </div>
                  <h3 className="text-sm font-medium text-slate-200 mb-1 tracking-wide uppercase group-hover:text-white">{cat.name}</h3>
                  <p className="text-[11px] text-slate-500 font-sans">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Latest Updates (Daily Acquisition Feed) */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div className="flex items-center font-mono text-[10px] text-slate-300 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 shadow-[0_0_5px_#22d3ee] animate-pulse"></span>
              Daily Update Feed
            </div>
            <button 
              onClick={() => navigate('gallery')}
              className="text-[10px] text-cyan-500/70 hover:text-cyan-400 font-mono tracking-widest uppercase transition-colors"
            >
              [ View Entire Archive ]
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_IMAGES.slice(0, 3).map((img) => (
              <div 
                key={img.id} 
                onClick={() => navigateToImage(img.id)}
                className="group relative cursor-pointer flex flex-col h-full bg-slate-900/20 border border-slate-800/50 hover:border-cyan-800/50 transition-all hover:bg-slate-900/40"
              >
                {/* Image Wrapper */}
                <div className="aspect-[4/3] bg-slate-950 overflow-hidden relative m-1">
                  <Crosshair className="top-2 left-2" />
                  <Crosshair className="bottom-2 right-2" />
                  <img 
                    src={img.imageUrl} 
                    alt={img.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500 filter grayscale-[15%] group-hover:grayscale-0"
                    loading="lazy"
                  />
                  {/* Subtle bottom gradient for readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none"></div>
                  
                  {/* Overlay Data */}
                  <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-1 text-[9px] font-mono text-cyan-400/80 border border-slate-800/50 rounded-sm">
                    {img.date}
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-300 bg-slate-950/60 backdrop-blur-sm px-1.5 py-0.5 border border-slate-800/50">
                    {img.type}
                  </div>
                </div>
                
                {/* Meta Text */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{img.instrument}</span>
                    <span className="text-[9px] font-mono text-slate-600">ID:{img.id.split('-')[1]}</span>
                  </div>
                  <h3 className="text-sm text-slate-200 font-medium leading-relaxed group-hover:text-cyan-100 transition-colors line-clamp-2">
                    {img.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Page: Gallery & Archive (Data Center)
const Gallery = ({ navigateToImage, initialFilter }) => {
  const [activeFilter, setActiveFilter] = useState(initialFilter || 'All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', ...CATEGORIES.map(c => c.id)];

  const filteredImages = MOCK_IMAGES.filter(img => {
    const matchFilter = activeFilter === 'All' || img.type === activeFilter;
    const matchSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        img.instrument.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-950 relative">
       {/* Background subtle noise/grid */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Controls */}
        <div className="mb-10 pb-6 border-b border-slate-800/50">
          <h1 className="text-2xl font-bold text-slate-100 mb-6 tracking-widest uppercase font-sans">
            Data Center Archive
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 font-mono text-[10px]">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 border backdrop-blur-sm transition-all uppercase tracking-widest rounded-sm ${
                    activeFilter === filter 
                      ? 'border-cyan-500/50 text-cyan-200 bg-cyan-950/40 shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
                      : 'border-slate-800/60 text-slate-500 bg-slate-900/20 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {filter === 'All' ? '* ALL_RECORDS' : filter}
                </button>
              ))}
            </div>
            
            {/* Search Box */}
            <div className="relative w-full md:w-64 font-mono">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600">
                <Search className="w-3 h-3" />
              </div>
              <input
                type="text"
                className="block w-full pl-8 pr-3 py-1.5 border border-slate-800/60 bg-slate-900/30 text-slate-300 text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-700/50 focus:bg-slate-900/60 transition-all uppercase tracking-wider backdrop-blur-sm rounded-sm"
                placeholder="QUERY ARCHIVE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Grid (Image Matrix) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {filteredImages.map((img) => (
            <div 
              key={img.id} 
              onClick={() => navigateToImage(img.id)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative border border-slate-800/50 bg-slate-900/20 mb-3 overflow-hidden p-1 rounded-sm hover:border-cyan-800/50 transition-colors">
                 <div className="aspect-[4/3] relative">
                    <img 
                      src={img.imageUrl} 
                      alt={img.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300 filter grayscale-[10%] group-hover:grayscale-0 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                 </div>
                 {/* Badges */}
                 <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur px-1.5 py-0.5 text-[9px] font-mono text-slate-400 border border-slate-800/50 rounded-sm uppercase">
                    {img.type}
                 </div>
              </div>
              
              <div className="flex flex-col flex-grow px-1">
                <div className="flex justify-between text-[9px] font-mono text-slate-500 uppercase mb-1.5">
                  <span className="text-cyan-600/80">{img.date}</span>
                  <span>{img.instrument}</span>
                </div>
                <h3 className="text-[13px] font-medium text-slate-300 group-hover:text-cyan-100 transition-colors leading-relaxed line-clamp-2">
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
          
          {filteredImages.length === 0 && (
            <div className="col-span-full py-24 text-center border border-dashed border-slate-800/50 rounded-sm bg-slate-900/10 backdrop-blur-sm">
              <Activity className="mx-auto h-6 w-6 text-slate-600 mb-3" />
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">0 RECORDS FOUND</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 5. Page: Image Detail (Observation Results Report)
const ImageDetail = ({ imageId, navigate }) => {
  const image = MOCK_IMAGES.find(img => img.id === imageId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [imageId]);

  if (!image) {
    return <div className="pt-32 text-center text-slate-500 font-mono text-sm uppercase tracking-widest min-h-screen bg-slate-950">Error: Asset not located.</div>;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Control Bar */}
        <div className="mb-6 flex justify-between items-center border-b border-slate-800/50 pb-4">
          <button 
            onClick={() => navigate('gallery')}
            className="flex items-center text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-widest bg-slate-900/30 px-3 py-1.5 border border-slate-800/50 rounded-sm"
          >
            <ChevronLeft className="h-3 w-3 mr-1" />
            Return to Center
          </button>
          
          <div className="font-mono text-[10px] text-slate-500 flex items-center gap-4 uppercase bg-slate-900/20 px-2 py-1 border border-slate-800/30">
            <span>LOC: /ARCHIVE/{image.type}/{image.id}</span>
          </div>
        </div>

        {/* Main Workstation Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left: Main Image Display */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            <div className="bg-slate-950 border border-slate-800/60 p-1.5 relative group shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <Crosshair className="top-4 left-4" />
              <Crosshair className="bottom-4 right-4" />
              
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-slate-950/80 backdrop-blur-sm text-slate-400 p-2 border border-slate-700/50 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors rounded-sm">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              <div className="relative overflow-hidden bg-black">
                <img 
                  src={image.imageUrl} 
                  alt={image.title}
                  className="w-full h-auto object-contain max-h-[75vh]"
                />
              </div>
              {/* Image Footer Data Strip */}
              <div className="flex justify-between items-center bg-slate-900/40 px-3 py-1.5 mt-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-widest border border-slate-800/30">
                 <span className="text-cyan-600/80">OBS_TIME: {image.date} 00:00Z</span>
                 <span>DOMAIN: NWP</span>
              </div>
            </div>
          </div>

          {/* Right: Observation Report Panel */}
          <div className="lg:w-1/3">
            <div className="border border-slate-800/60 bg-slate-900/30 backdrop-blur-md p-6 sticky top-24 shadow-lg rounded-sm">
              
              <div className="mb-6 border-b border-slate-800/60 pb-5">
                <div className="text-[9px] text-cyan-500/80 mb-3 tracking-widest uppercase flex items-center border border-cyan-900/30 bg-cyan-950/20 w-max px-2 py-0.5">
                  <span className="w-1.5 h-1.5 bg-cyan-500/80 rounded-full mr-1.5 shadow-[0_0_5px_#06b6d4]"></span>
                  Observation Report
                </div>
                <h1 className="text-lg font-medium text-slate-100 mb-3 leading-snug font-sans tracking-wide">
                  {image.title}
                </h1>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-4 flex flex-wrap gap-2 font-mono">
                  {image.tags.map(tag => (
                    <span key={tag} className="border border-slate-700/50 bg-slate-950/50 px-1.5 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-4 text-[11px] font-mono">
                <div className="grid grid-cols-3 border-b border-slate-800/40 pb-2">
                  <div className="text-slate-500 uppercase">Instrument</div>
                  <div className="col-span-2 text-slate-300">{image.instrument}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-800/40 pb-2">
                  <div className="text-slate-500 uppercase">Resolution</div>
                  <div className="col-span-2 text-slate-300">{image.resolution}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-800/40 pb-2">
                  <div className="text-slate-500 uppercase">Region</div>
                  <div className="col-span-2 text-slate-300">{image.region}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-slate-800/40 pb-2">
                  <div className="text-slate-500 uppercase">Var Type</div>
                  <div className="col-span-2 text-slate-300">{image.type}</div>
                </div>
                
                <div className="pt-3">
                  <div className="text-slate-500 uppercase mb-2">Analysis Notes / 备注说明</div>
                  <div className="text-slate-300 leading-relaxed font-sans text-[13px] text-justify bg-slate-950/30 p-3 border border-slate-800/30 rounded-sm">
                    {image.description}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-5 border-t border-slate-800/60">
                <button className="w-full flex items-center justify-center py-2.5 bg-slate-800/30 border border-slate-700 hover:bg-cyan-950/40 hover:border-cyan-600/50 hover:text-cyan-200 text-slate-300 transition-all uppercase tracking-widest text-[10px] font-mono rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                  <Download className="h-3 w-3 mr-2" />
                  Fetch High-Res Asset
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

// 6. Page: About (Mission Protocol)
const About = () => (
  <div className="pt-24 pb-16 min-h-screen bg-slate-950 relative">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="border-b border-slate-800/60 pb-4 mb-10">
        <h1 className="text-2xl font-bold text-slate-100 tracking-widest uppercase font-sans">
          Mission Protocol
        </h1>
        <div className="text-[10px] font-mono text-slate-500 mt-2 uppercase tracking-widest">
          Document Ref: NWP-MO-01 | Webmaster: 站长小脐橙
        </div>
      </div>
      
      <div className="bg-slate-900/30 border border-slate-800/50 p-8 text-slate-300 font-sans backdrop-blur-sm rounded-sm shadow-xl">
        <h3 className="text-xs font-mono text-cyan-600/80 uppercase tracking-widest mb-4 border-l-2 border-cyan-600/50 pl-3">
          1.0 Archive Objective
        </h3>
        <p className="leading-relaxed mb-8 text-[13px] md:text-sm bg-slate-950/40 p-4 border border-slate-800/30 rounded-sm">
          如果你不承认小脐橙最帅那么请离开本站。
          西北太平洋海气环境图像档案馆”是一个长期存续的个人专业资料站。本站致力于将多源地球观测数据 (NetCDF/GRIB/HDF) 转化为具有科学洞察力与视觉美感的图像。通过建立每日更新的处理流程和连续的时间序列记录，为西北太平洋区域的气候变化、极端天气事件 (如热带气旋) 提供直观、可靠的历史影像档案。
        </p>

        <h3 className="text-xs font-mono text-cyan-600/80 uppercase tracking-widest mb-4 mt-10 border-l-2 border-cyan-600/50 pl-3">
          2.0 Operational Domain
        </h3>
        <div className="bg-slate-950/60 border border-slate-800/60 p-6 font-mono text-[11px] text-slate-400 mb-6 relative rounded-sm shadow-inner">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
             <div>
               <span className="text-slate-600 block mb-1">BASIN / 海区</span>
               <span className="text-slate-200">Northwest Pacific Ocean</span>
             </div>
             <div>
               <span className="text-slate-600 block mb-1">FOCUS / 观测重点</span>
               <span className="text-slate-200">Tropical Cyclones, Kuroshio</span>
             </div>
             <div>
               <span className="text-slate-600 block mb-1">LATITUDE / 纬度</span>
               <span className="text-slate-200">10°N to 50°N</span>
             </div>
             <div>
               <span className="text-slate-600 block mb-1">LONGITUDE / 经度</span>
               <span className="text-slate-200">110°E to 160°E</span>
             </div>
          </div>
        </div>
        
        <p className="leading-relaxed text-[13px] md:text-sm text-slate-400">
          西北太平洋是全球海气相互作用最为剧烈的区域。该域内的海面温度梯度、热带气旋生成频率及季风环流系统，不仅直接主导东亚地区的天气演变，更是全球气候系统中不可或缺的遥相关强迫源。本站的持续监测即基于此科学背景展开。
        </p>
      </div>
    </div>
  </div>
);


// --- MAIN APP (State & Routing) ---
export default function App() {
  const [route, setRoute] = useState('home');
  const [routeParams, setRouteParams] = useState({});

  const navigate = (newRoute, params = {}) => {
    setRoute(newRoute);
    setRouteParams(params);
    window.scrollTo(0, 0);
  };

  const navigateToImage = (id) => {
    navigate('detail', { id });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-300 selection:bg-cyan-900/50 selection:text-cyan-100">
      <Navbar currentRoute={route} navigate={navigate} />
      
      <main className="flex-grow">
        {route === 'home' && <Home navigate={navigate} navigateToImage={navigateToImage} />}
        {route === 'gallery' && <Gallery navigateToImage={navigateToImage} initialFilter={routeParams.filter} />}
        {route === 'detail' && <ImageDetail imageId={routeParams.id} navigate={navigate} />}
        {route === 'about' && <About />}
      </main>

      <Footer />
    </div>
  );
}