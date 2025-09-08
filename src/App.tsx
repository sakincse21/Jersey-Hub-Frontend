import { Outlet } from "react-router";
import CommonLayout from "./components/layout/CommonLayout";

function App() {
  return (
    <div className="min-h-screen max-w-4xl px-6 lg:max-w-7xl mx-auto">
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </div>
  );
}

export default App;
