import { useAuthToken } from "@/hooks";
import { Collapsible } from "@components/ui";
import { NavigationItem } from "./navigation-item";
import { useQueryClient } from "@tanstack/react-query";
import { Banknote, Bike, Car, LogOut, Settings } from "lucide-react";


type NavigationProps = {
  handleIsDrawerOpen: (val: boolean) => void;
}

export const Navigation = ({ handleIsDrawerOpen }: NavigationProps) => {

  const queryClient = useQueryClient();
  const { authToken, removeAuthToken } = useAuthToken();
  
  if (!authToken) return;

  return (
    <ul className="space-y-2">
      <li>
        <Collapsible
          header={
            <NavigationItem to="/transactions" handleIsDrawerOpen={handleIsDrawerOpen}>
              Transactions
              <Banknote className="w-6 h-6" />
            </NavigationItem>
          }
        >
          <ul>
            <li>
              <NavigationItem to="/categories" handleIsDrawerOpen={handleIsDrawerOpen}>
                Categories
                <div className="w-6 h-6" />
              </NavigationItem>
            </li>
      
            <li>
              <NavigationItem to="/paymentMethods" handleIsDrawerOpen={handleIsDrawerOpen}>
                Payment Methods
                <div className="w-6 h-6" />
              </NavigationItem>
            </li>

            <li>
              <NavigationItem to="/accounts" handleIsDrawerOpen={handleIsDrawerOpen}>
                Accounts
                <div className="w-6 h-6" />
              </NavigationItem>
            </li>
          </ul>
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
        <NavigationItem
          to="/login"
          handleIsDrawerOpen={handleIsDrawerOpen}
          additionalAction={() => {
            removeAuthToken();
            queryClient.clear();
          }}  
        >
          Logout
          <LogOut className="w-6 h-6" />
        </NavigationItem>
      </li>
    </ul>
  )
}
