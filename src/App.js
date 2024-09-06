import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home'
import MainNavbar from './components/navbar/Navbar';
import PageContainer from './containers/PageContainer';
import NewProducts from './pages/NewProducts'
import DiscountedPage from './pages/DiscountProducts';
// import LogInSignIn from './pages/LogInSignIn';

import Admin from './pages/Admin';
import Search from './pages/Search';

import Item from './pages/Item';
import Cart from './pages/Cart';


function App() {
  return (
    <div className="App">
    <PageContainer>
      <Router>
      <MainNavbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/yeni-gelenler" element={<NewProducts />}/>
          <Route path="/indirim" element={<DiscountedPage/>}/>
          <Route path="/admin" element={<Admin />}/>
          <Route path="/sonuclar" element={<Search />}/>
          <Route path="/item/:id" element={<Item />}/>
          <Route path="/sepet" element={<Cart/>}/>
          {/* <Route path="/fiyat-guncelleme" element={<UpdatePrice/>}/>
          <Route path="/urun-ekle-cikar" element={<ProductActions/>}/> */}
          {/* <Route path="/giris-kayit" element={<LogInSignIn />}/>   */}
        </Routes>
      </Router>
    </PageContainer>
      
    </div>
  );
}

export default App;
