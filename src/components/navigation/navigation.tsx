import { useAuthToken } from "@/hooks";
import { Button, Collapsible } from "@components/ui";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router-dom";
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
                <NavLink
                  to="/transactions"
                  className={({ isActive }) => isActive
                    ? "text-blue-500 font-bold w-full hover:bg-fg/50 p-1 rounded-md hover:text-blue-200 flex justify-between"
                    : "w-full hover:bg-fg/50 p-1 rounded-md flex justify-between"}
                  onClick={() => { handleIsDrawerOpen(false)}}
                >
                  Transactions
                  <Banknote className="w-6 h-6" />
                </NavLink>
              }
              content={[
                <NavLink
                  to="/categories"
                  className={({ isActive }) => isActive
                    ? "text-blue-500 font-bold w-full inline-block hover:bg-fg/40 p-1 rounded-md hover:text-blue-200"
                    : "w-full inline-block hover:bg-fg/50 p-1 rounded-md"
                  }
                  onClick={() => { handleIsDrawerOpen(false)}}
                >
                  Categories
                </NavLink>,
                <p className="p-1">Payment Methods</p>,
                "Accounts",
              ]}
            />
          </li>
          
          <li>
            <Button
              className="p-1 w-full rounded-md flex justify-between"
              onClick={() => {
                handleIsDrawerOpen(false);
                navigate("/vehicles");
              }}
              variant="ghost"
            >
              Vehicles
              <Car className="w-6 h-6" />
            </Button>
          </li>

          <li>
            <Button
              className="p-1 w-full rounded-md flex justify-between"
              onClick={() => {
                handleIsDrawerOpen(false);
                navigate("/sports");
              }}
              variant="ghost"
            >
              Sports
              <Bike className="w-6 h-6" />
            </Button>
          </li>
          
          <li>
            <Button
              className="p-1 w-full rounded-md flex justify-between"
              onClick={() => {
                handleIsDrawerOpen(false);
                navigate("/settings");
              }}
              variant="ghost"
            >
              Settings
              <Settings className="w-6 h-6" />
            </Button>
            
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
