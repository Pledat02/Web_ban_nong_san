import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./route/route-config";
import {ToastContainer} from "react-toastify";

function App() {
  return (
      <Router>
        <AppRoutes />
          <ToastContainer/>
      </Router>
  );
}

export default App;
