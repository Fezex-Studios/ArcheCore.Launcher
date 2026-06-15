import "./App.css";
import {Button} from "@/components/ui/button.tsx";

function App() {


  return (
   <div className="bg-black h-screen ">
       <h1 className={"text-2xl text-orange-600 underline flex justify-center"}>Hello World!</h1>
       <Button className={"hover:text-orange-600 bg-white text-black"}>HELLO WORLD THIS IS MY BUTTON</Button>
   </div>
  );
}

export default App;
