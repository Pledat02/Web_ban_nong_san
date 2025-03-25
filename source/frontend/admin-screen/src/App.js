import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./route/route-config";

function App() {
  return (
      <Router>
        <AppRoutes />
      </Router>
  );
}

export default App;
