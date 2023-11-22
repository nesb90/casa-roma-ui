import { BrowserRouter, Routes,  Route } from 'react-router-dom';
import Items from './components/Items';
import { Orders } from './components/Orders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/items" element={<Items />}></Route>
        <Route path="/orders" element={<Orders />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
