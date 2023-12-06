import { BrowserRouter, Routes,  Route } from 'react-router-dom';
import Items from './components/Items';
import Orders from './components/Orders';
import Stock from './components/Stock';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Orders />}></Route>
        <Route path="/items" element={<Items />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
        <Route path='/stock' element={<Stock />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
