import logo from './logo.svg';
import './App.css';
import Login from "./components/login";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  return (
    < div className="App">
        <Header/>
        <Login/>
        <Footer/>
    </div>
  );
}

export default App;
