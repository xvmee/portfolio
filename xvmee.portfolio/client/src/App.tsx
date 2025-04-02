import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminLogin from "@/pages/AdminLogin";
import Loading from "@/components/layout/Loading";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/admin" component={AdminLogin}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Loading />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
