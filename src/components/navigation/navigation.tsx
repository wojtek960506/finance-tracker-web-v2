import { useAuthToken } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { NavigationItem } from "./navigation-item";
import { Button, Collapsible } from "@components/ui";
import { useQueryClient } from "@tanstack/react-query";
import { Banknote, Bike, Car, LogOut, Settings } from "lucide-react";


type NavigationProps = {
  handleIsDrawerOpen: (val: boolean) => void;
}

export const Navigation = ({ handleIsDrawerOpen }: NavigationProps) => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authToken, removeAuthToken } = useAuthToken();
  const isAuthenticated = !!authToken;

  return (
    <ul className="space-y-2">
      {isAuthenticated
        ? <>
          <li>
            <Collapsible
              header={
                <NavigationItem to="/transactions" handleIsDrawerOpen={handleIsDrawerOpen}>
                  Transactions
                  <Banknote className="w-6 h-6" />
                </NavigationItem>
              }
            >
              <NavigationItem to="/categories" handleIsDrawerOpen={handleIsDrawerOpen}>
                Categories
                <div className="w-6 h-6" />
              </NavigationItem>
          
              <NavigationItem to="/paymentMethods" handleIsDrawerOpen={handleIsDrawerOpen}>
                Payment Methods
                <div className="w-6 h-6" />
              </NavigationItem>
          
              <NavigationItem to="/accounts" handleIsDrawerOpen={handleIsDrawerOpen}>
                Accounts
                <div className="w-6 h-6" />
              </NavigationItem>
            </Collapsible>
          </li>
          
          <li>
            <NavigationItem to="/vehicles" handleIsDrawerOpen={handleIsDrawerOpen}>
              Vehicles
              <Car className="w-6 h-6" />
            </NavigationItem>
          </li>

          <li>
            <NavigationItem to="/sports" handleIsDrawerOpen={handleIsDrawerOpen}>
              Sports
              <Bike className="w-6 h-6" />
            </NavigationItem>
          </li>
          
          <li>
            <NavigationItem to="/settings" handleIsDrawerOpen={handleIsDrawerOpen}>
              Settings
              <Settings className="w-6 h-6" />
            </NavigationItem>
          </li>

          <li>
            <Button
              className="p-1 w-full rounded-md flex justify-between"
              onClick={() => {
                removeAuthToken();
                queryClient.clear();
                handleIsDrawerOpen(false);
                navigate("/login");
              }}
              variant="ghost"
            >
              Logout
              <LogOut className="w-6 h-6" />
            </Button>
          </li>
        </>
        : <>
          <li>Language</li>
        </>
      }
    </ul>
  )
}
