//sidebar navigation and routing live
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Expense from './pages/Expense.jsx';
import Category from './pages/Category.jsx';
import Setting from './pages/Setting.jsx';


function App() {
  return (
    <BrowserRouter> 
      <div style = {{ display : 'flex', height : '100vh'}}>
        {/* Sidebar*/}
        <aside style = {{
          width: '220px',
          backgroundColor: '#1e1e2e',
          color: 'white',
          padding:'24px 16px',
          display: 'flex',
          flexDirection:'column',
          gap: '8px'
        }}>
          <h2 style={{ marginBottom: '32px', fontSize: '20px' }}>VocalVault</h2>

          <NavLink to="/" end style={({ isActive }) => ({
            color: isActive ? '#a78bfa' : 'white',
            textDecoration: 'none',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: isActive ? '#2d2d3f' : 'transparent',
          })}>
            Dashboard
          </NavLink>

          <NavLink to="/expenses" style={({ isActive }) => ({
            color: isActive ? '#a78bfa' : 'white',
            textDecoration: 'none',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: isActive ? '#2d2d3f' : 'transparent',
          })}>
            Expenses
          </NavLink>

          <NavLink to="/categories" style={({ isActive }) => ({
            color: isActive ? 'a78bfa' : 'white',
            textDecoration: 'none',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: isActive ? '#2d2d3f' : 'transparent',
          })}>
            Category
          </NavLink>

          <NavLink to="/setting" style={({ isActive }) => ({
            color: isActive ? 'a78bfa' : 'white',
            textDecoration: 'none',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: isActive ? '#2d2d3f' : 'transparent',
          })}>
            Setting
          </NavLink>
      </aside>

      {/*Main Content*/}
      <main style = {{
        flex: 1,
        padding: '32px',
        overflowY: 'auto' 
      }}>
        <Routes>
          <Route path = "/" element={<Dashboard />} />
          <Route path = "/expenses" element={<Expense />} />
          <Route path = "/categories" element={<Category />} />
          <Route path = "/setting" element={<Setting />} />
        </Routes>
      </main>
      </div>
    </BrowserRouter>
    
  );
}

export default App; 