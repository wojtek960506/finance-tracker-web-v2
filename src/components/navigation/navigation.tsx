import { useAuthToken } from "@/hooks";
import { Collapsible } from "@components/ui";
import { NavigationItem } from "./navigation-item";
import { useQueryClient } from "@tanstack/react-query";
import { Banknote, Bike, Car, LogOut, Settings } from "lucide-react";


export const Navigation = () => {

  const queryClient = useQueryClient();
  const { authToken, removeAuthToken } = useAuthToken();
  
  if (!authToken) return;

  return (
    <ul className="space-y-2">
      <li>
        <Collapsible
          header={
            <NavigationItem
              to="/transactions"
              title="Transactions"
              Icon={Banknote}
            />
          }
        >
          <ul>
            <li>
              <NavigationItem
                to="/categories"
                title="Categories"
              />
            </li>
      
            <li>
              <NavigationItem
                to="/paymentMethods"
                title="Payment Methods"
              />
            </li>

            <li>
              <NavigationItem
                to="/accounts"
                title="Accounts"
              />
            </li>
          </ul>
        </Collapsible>
      </li>
      
      <li>
        <NavigationItem
          to="/vehicles"
          title="Vehicles"
          Icon={Car}
        />
      </li>

      <li>
        <NavigationItem
          to="/sports"
          title="Sports"
          Icon={Bike}
        />
      </li>
      
      <li>
        <NavigationItem
          to="/settings"
          title="Settings"
          Icon={Settings}
        />
      </li>

      <li>
        <NavigationItem
          to="/login"
          additionalAction={() => {
            removeAuthToken();
            queryClient.clear();
          }}
          title="Logout"
          Icon={LogOut}
        /> 
      </li>
    </ul>
  )
}
