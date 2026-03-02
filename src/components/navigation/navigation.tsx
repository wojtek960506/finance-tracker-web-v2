import { useAuthToken } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Banknote, Bike, Car, ChevronRight, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui";

type NavigationProps = {
  handleIsDrawerOpen: (val: boolean) => void;
}

export const Navigation = ({ handleIsDrawerOpen }: NavigationProps) => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authToken, removeAuthToken } = useAuthToken();
  const isAuthenticated = !!authToken;

  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);

  return (
    <ul className="space-y-2">
      {isAuthenticated
        ? <>
          
          <li>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={isTransactionsOpen
                    ? "Collapse transactions menu"
                    : "Expand transactions menu"
                  }
                  aria-expanded={isTransactionsOpen}
                  aria-controls="transactions-submenu"
                  onClick={() => setIsTransactionsOpen(prev => !prev)}
                  
                  className="px-1 py-2"
                >
                  <ChevronRight
                    className={clsx(
                      "h-4 w-4 transition-transform cursor-pointer",
                      isTransactionsOpen && "rotate-90"
                    )}
                  />
                </button>
                <NavLink
                  to="/transactions"
                  className={({ isActive }) => isActive
                    ? "text-blue-500 font-bold w-full hover:bg-fg/50 p-1 rounded-md hover:text-blue-200 "
                    : "w-full hover:bg-fg/50 p-1 rounded-md "}
                  onClick={() => { handleIsDrawerOpen(false)}}
                >
                  <div className="flex justify-between w-full">
                    Transactions
                    <Banknote className="w-6 h-6" />
                  </div>
                  
                </NavLink>
              </div>
              <ul className={clsx("pl-9 space-y-1", !isTransactionsOpen && "hidden")}>
                <li>
                  <NavLink
                  to="/categories"
                  className={({ isActive }) => isActive
                    ? "text-blue-500 font-bold w-full inline-block hover:bg-fg/40 p-1 rounded-md hover:text-blue-200"
                    : "w-full inline-block hover:bg-fg/50 p-1 rounded-md"
                  }
                  onClick={() => { handleIsDrawerOpen(false)}}
                >
                  Categories
                </NavLink>
                </li>
                <li className="cursor-not-allowed p-1">Payment Methods</li>
                <li className="cursor-not-allowed p-1">Accounts</li>
              </ul>
            </div>
          </li>
          {/* <li className="cursor-not-allowed">Vehicles</li>
          <li className="cursor-not-allowed">Sports</li> */}
          
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
